import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieResponseDto, CharacterBasicDto } from './dto/movie-response.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    const movie = await this.moviesService.create(createMovieDto);
    return plainToInstance(MovieResponseDto, movie, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll(): Promise<MovieResponseDto[]> {
    const movies = await this.moviesService.findAll();
    return plainToInstance(MovieResponseDto, movies, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MovieResponseDto> {
    const movie = await this.moviesService.findOne(id);
    return plainToInstance(MovieResponseDto, movie, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<MovieResponseDto> {
    const movie = await this.moviesService.update(id, updateMovieDto);
    return plainToInstance(MovieResponseDto, movie, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.moviesService.remove(id);
  }

  // New endpoint for Phase 4
  @Get(':id/characters')
  async getMovieCharacters(@Param('id', ParseIntPipe) id: number): Promise<CharacterBasicDto[]> {
    const characters = await this.moviesService.getMovieCharacters(id);
    return plainToInstance(CharacterBasicDto, characters, {
      excludeExtraneousValues: true,
    });
  }

  // Additional endpoints for managing relationships
  @Post(':movieId/characters/:characterId')
  async addCharacterToMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('characterId', ParseIntPipe) characterId: number,
  ): Promise<MovieResponseDto> {
    const movie = await this.moviesService.addCharacterToMovie(movieId, characterId);
    return plainToInstance(MovieResponseDto, movie, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':movieId/characters/:characterId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCharacterFromMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('characterId', ParseIntPipe) characterId: number,
  ): Promise<void> {
    await this.moviesService.removeCharacterFromMovie(movieId, characterId);
  }
}