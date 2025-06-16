import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ForbiddenException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Character } from '../characters/entities/character.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { characterIds, ...movieData } = createMovieDto;
    
    // Check if movie title already exists
    const existingMovie = await this.movieRepository.findOne({
      where: { title: movieData.title },
    });
    
    if (existingMovie) {
      throw new ConflictException(`Movie with title "${movieData.title}" already exists`);
    }
    
    // Check if episode_id already exists (if provided)
    if (movieData.episode_id) {
      const existingEpisode = await this.movieRepository.findOne({
        where: { episode_id: movieData.episode_id },
      });
      
      if (existingEpisode) {
        throw new ConflictException(`Movie with episode ID ${movieData.episode_id} already exists`);
      }
    }
    
    // Create movie
    const movie = this.movieRepository.create(movieData);
    
    // Handle character relationships if provided
    if (characterIds && characterIds.length > 0) {
      const characters = await this.validateCharactersExist(characterIds);
      movie.characters = characters;
    }
    
    try {
      return await this.movieRepository.save(movie);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique constraint error
        if (error.constraint?.includes('title')) {
          throw new ConflictException(`Movie with title "${movieData.title}" already exists`);
        } else if (error.constraint?.includes('episode_id')) {
          throw new ConflictException(`Movie with episode ID ${movieData.episode_id} already exists`);
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find({
      relations: ['characters'],
      order: { episode_id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Movie> {
    if (!id || id < 1) {
      throw new BadRequestException('Invalid movie ID provided');
    }

    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['characters'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const { characterIds, ...movieData } = updateMovieDto;
    
    const movie = await this.findOne(id);
    
    // Check if new title conflicts with existing movie
    if (movieData.title && movieData.title !== movie.title) {
      const existingMovie = await this.movieRepository.findOne({
        where: { title: movieData.title },
      });
      
      if (existingMovie) {
        throw new ConflictException(`Movie with title "${movieData.title}" already exists`);
      }
    }
    
    // Check if new episode_id conflicts with existing movie
    if (movieData.episode_id && movieData.episode_id !== movie.episode_id) {
      const existingEpisode = await this.movieRepository.findOne({
        where: { episode_id: movieData.episode_id },
      });
      
      if (existingEpisode) {
        throw new ConflictException(`Movie with episode ID ${movieData.episode_id} already exists`);
      }
    }
    
    // Update basic movie data
    Object.assign(movie, movieData);
    
    // Handle character relationships if provided
    if (characterIds !== undefined) {
      if (characterIds.length === 0) {
        movie.characters = [];
      } else {
        const characters = await this.validateCharactersExist(characterIds);
        movie.characters = characters;
      }
    }
    
    try {
      return await this.movieRepository.save(movie);
    } catch (error) {
      if (error.code === '23505') {
        if (error.constraint?.includes('title')) {
          throw new ConflictException(`Movie with title "${movieData.title}" already exists`);
        } else if (error.constraint?.includes('episode_id')) {
          throw new ConflictException(`Movie with episode ID ${movieData.episode_id} already exists`);
        }
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    
    // Check if movie has character relationships
    if (movie.characters && movie.characters.length > 0) {
      throw new ForbiddenException(
        `Cannot delete movie "${movie.title}" because it is associated with ${movie.characters.length} character(s). Remove the associations first.`
      );
    }
    
    await this.movieRepository.remove(movie);
  }

  async getMovieCharacters(id: number): Promise<Character[]> {
    const movie = await this.findOne(id);
    return movie.characters || [];
  }

  async addCharacterToMovie(movieId: number, characterId: number): Promise<Movie> {
    if (!movieId || movieId < 1) {
      throw new BadRequestException('Invalid movie ID provided');
    }
    
    if (!characterId || characterId < 1) {
      throw new BadRequestException('Invalid character ID provided');
    }

    const movie = await this.findOne(movieId);
    const character = await this.validateCharactersExist([characterId]);
    
    // Check if relationship already exists
    const existingCharacter = movie.characters.find(c => c.id === characterId);
    if (existingCharacter) {
      throw new BadRequestException(`Movie "${movie.title}" already has character "${character[0].name}"`);
    }
    
    movie.characters.push(character[0]);
    return await this.movieRepository.save(movie);
  }

  async removeCharacterFromMovie(movieId: number, characterId: number): Promise<Movie> {
    if (!movieId || movieId < 1) {
      throw new BadRequestException('Invalid movie ID provided');
    }
    
    if (!characterId || characterId < 1) {
      throw new BadRequestException('Invalid character ID provided');
    }

    const movie = await this.findOne(movieId);
    
    const characterIndex = movie.characters.findIndex(c => c.id === characterId);
    if (characterIndex === -1) {
      throw new NotFoundException(`Movie "${movie.title}" is not associated with character ID ${characterId}`);
    }
    
    movie.characters.splice(characterIndex, 1);
    return await this.movieRepository.save(movie);
  }

  private async validateCharactersExist(characterIds: number[]): Promise<Character[]> {
    if (!characterIds || characterIds.length === 0) {
      return [];
    }

    // Check for invalid IDs
    const invalidIds = characterIds.filter(id => !id || id < 1);
    if (invalidIds.length > 0) {
      throw new BadRequestException(`Invalid character IDs provided: ${invalidIds.join(', ')}`);
    }

    const characters = await this.characterRepository.find({
      where: { id: In(characterIds) },
    });

    if (characters.length !== characterIds.length) {
      const foundIds = characters.map(character => character.id);
      const missingIds = characterIds.filter(id => !foundIds.includes(id));
      throw new BadRequestException(
        `Characters not found with IDs: ${missingIds.join(', ')}`
      );
    }

    return characters;
  }
}