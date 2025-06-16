import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    
    // Create movie
    const movie = this.movieRepository.create(movieData);
    
    // Handle character relationships if provided
    if (characterIds && characterIds.length > 0) {
      const characters = await this.validateCharactersExist(characterIds);
      movie.characters = characters;
    }
    
    return await this.movieRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find({
      relations: ['characters'],
      order: { episode_id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Movie> {
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
    
    return await this.movieRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
  }

  async getMovieCharacters(id: number): Promise<Character[]> {
    const movie = await this.findOne(id);
    return movie.characters || [];
  }

  async addCharacterToMovie(movieId: number, characterId: number): Promise<Movie> {
    const movie = await this.findOne(movieId);
    const character = await this.validateCharactersExist([characterId]);
    
    // Check if relationship already exists
    const existingCharacter = movie.characters.find(c => c.id === characterId);
    if (existingCharacter) {
      throw new BadRequestException(`Movie already has character with ID ${characterId}`);
    }
    
    movie.characters.push(character[0]);
    return await this.movieRepository.save(movie);
  }

  async removeCharacterFromMovie(movieId: number, characterId: number): Promise<Movie> {
    const movie = await this.findOne(movieId);
    
    const characterIndex = movie.characters.findIndex(c => c.id === characterId);
    if (characterIndex === -1) {
      throw new NotFoundException(`Movie is not associated with character ID ${characterId}`);
    }
    
    movie.characters.splice(characterIndex, 1);
    return await this.movieRepository.save(movie);
  }

  private async validateCharactersExist(characterIds: number[]): Promise<Character[]> {
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