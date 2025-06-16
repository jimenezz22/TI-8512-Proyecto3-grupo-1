import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    
    // Create character
    const character = this.characterRepository.create(characterData);
    
    // Handle movie relationships if provided
    if (movieIds && movieIds.length > 0) {
      const movies = await this.validateMoviesExist(movieIds);
      character.movies = movies;
    }
    
    return await this.characterRepository.save(character);
  }

  async findAll(): Promise<Character[]> {
    return await this.characterRepository.find({
      relations: ['movies'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Character> {
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
    
    return await this.characterRepository.save(character);
  }

  async remove(id: number): Promise<void> {
    const character = await this.findOne(id);
    await this.characterRepository.remove(character);
  }

  async getCharacterMovies(id: number): Promise<Movie[]> {
    const character = await this.findOne(id);
    return character.movies || [];
  }

  async addMovieToCharacter(characterId: number, movieId: number): Promise<Character> {
    const character = await this.findOne(characterId);
    const movie = await this.validateMoviesExist([movieId]);
    
    // Check if relationship already exists
    const existingMovie = character.movies.find(m => m.id === movieId);
    if (existingMovie) {
      throw new BadRequestException(`Character is already in movie with ID ${movieId}`);
    }
    
    character.movies.push(movie[0]);
    return await this.characterRepository.save(character);
  }

  async removeMovieFromCharacter(characterId: number, movieId: number): Promise<Character> {
    const character = await this.findOne(characterId);
    
    const movieIndex = character.movies.findIndex(m => m.id === movieId);
    if (movieIndex === -1) {
      throw new NotFoundException(`Character is not associated with movie ID ${movieId}`);
    }
    
    character.movies.splice(movieIndex, 1);
    return await this.characterRepository.save(character);
  }

  private async validateMoviesExist(movieIds: number[]): Promise<Movie[]> {
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