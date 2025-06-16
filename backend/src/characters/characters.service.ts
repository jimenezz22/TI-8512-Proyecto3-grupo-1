import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ForbiddenException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Character } from './entities/character.entity';
import { Movie } from '../movies/entities/movie.entity';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const { movieIds, ...characterData } = createCharacterDto;
    
    // Check if character name already exists
    const existingCharacter = await this.characterRepository.findOne({
      where: { name: characterData.name },
    });
    
    if (existingCharacter) {
      throw new ConflictException(`Character with name "${characterData.name}" already exists`);
    }
    
    // Create character
    const character = this.characterRepository.create(characterData);
    
    // Handle movie relationships if provided
    if (movieIds && movieIds.length > 0) {
      const movies = await this.validateMoviesExist(movieIds);
      character.movies = movies;
    }
    
    try {
      return await this.characterRepository.save(character);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique constraint error
        throw new ConflictException(`Character with name "${characterData.name}" already exists`);
      }
      throw error;
    }
  }

  async findAll(): Promise<Character[]> {
    return await this.characterRepository.find({
      relations: ['movies'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Character> {
    if (!id || id < 1) {
      throw new BadRequestException('Invalid character ID provided');
    }

    const character = await this.characterRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return character;
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const { movieIds, ...characterData } = updateCharacterDto;
    
    const character = await this.findOne(id);
    
    // Check if new name conflicts with existing character
    if (characterData.name && characterData.name !== character.name) {
      const existingCharacter = await this.characterRepository.findOne({
        where: { name: characterData.name },
      });
      
      if (existingCharacter) {
        throw new ConflictException(`Character with name "${characterData.name}" already exists`);
      }
    }
    
    // Update basic character data
    Object.assign(character, characterData);
    
    // Handle movie relationships if provided
    if (movieIds !== undefined) {
      if (movieIds.length === 0) {
        character.movies = [];
      } else {
        const movies = await this.validateMoviesExist(movieIds);
        character.movies = movies;
      }
    }
    
    try {
      return await this.characterRepository.save(character);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Character with name "${characterData.name}" already exists`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const character = await this.findOne(id);
    
    // Check if character has movie relationships
    if (character.movies && character.movies.length > 0) {
      throw new ForbiddenException(
        `Cannot delete character "${character.name}" because it is associated with ${character.movies.length} movie(s). Remove the associations first.`
      );
    }
    
    await this.characterRepository.remove(character);
  }

  async getCharacterMovies(id: number): Promise<Movie[]> {
    const character = await this.findOne(id);
    return character.movies || [];
  }

  async addMovieToCharacter(characterId: number, movieId: number): Promise<Character> {
    if (!characterId || characterId < 1) {
      throw new BadRequestException('Invalid character ID provided');
    }
    
    if (!movieId || movieId < 1) {
      throw new BadRequestException('Invalid movie ID provided');
    }

    const character = await this.findOne(characterId);
    const movie = await this.validateMoviesExist([movieId]);
    
    // Check if relationship already exists
    const existingMovie = character.movies.find(m => m.id === movieId);
    if (existingMovie) {
      throw new BadRequestException(`Character "${character.name}" is already associated with movie "${movie[0].title}"`);
    }
    
    character.movies.push(movie[0]);
    return await this.characterRepository.save(character);
  }

  async removeMovieFromCharacter(characterId: number, movieId: number): Promise<Character> {
    if (!characterId || characterId < 1) {
      throw new BadRequestException('Invalid character ID provided');
    }
    
    if (!movieId || movieId < 1) {
      throw new BadRequestException('Invalid movie ID provided');
    }

    const character = await this.findOne(characterId);
    
    const movieIndex = character.movies.findIndex(m => m.id === movieId);
    if (movieIndex === -1) {
      throw new NotFoundException(`Character "${character.name}" is not associated with movie ID ${movieId}`);
    }
    
    character.movies.splice(movieIndex, 1);
    return await this.characterRepository.save(character);
  }

  private async validateMoviesExist(movieIds: number[]): Promise<Movie[]> {
    if (!movieIds || movieIds.length === 0) {
      return [];
    }

    // Check for invalid IDs
    const invalidIds = movieIds.filter(id => !id || id < 1);
    if (invalidIds.length > 0) {
      throw new BadRequestException(`Invalid movie IDs provided: ${invalidIds.join(', ')}`);
    }

    const movies = await this.movieRepository.find({
      where: { id: In(movieIds) },
    });

    if (movies.length !== movieIds.length) {
      const foundIds = movies.map(movie => movie.id);
      const missingIds = movieIds.filter(id => !foundIds.includes(id));
      throw new BadRequestException(
        `Movies not found with IDs: ${missingIds.join(', ')}`
      );
    }

    return movies;
  }
}