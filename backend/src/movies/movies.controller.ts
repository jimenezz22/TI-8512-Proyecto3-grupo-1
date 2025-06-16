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
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieResponseDto, CharacterBasicDto } from './dto/movie-response.dto';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    type: MovieResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or character IDs not found' })
  @ApiConflictResponse({ description: 'Movie with this title or episode ID already exists' })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    const movie = await this.moviesService.create(createMovieDto);
    return plainToInstance(MovieResponseDto, movie, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({
    status: 200,
    description: 'List of all movies with their characters',
    type: [MovieResponseDto],
  })
  async findAll(): Promise<MovieResponseDto[]> {
    const movies = await this.moviesService.findAll();
    return plainToInstance(MovieResponseDto, movies, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Movie found with characters',
    type: MovieResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  @ApiBadRequestResponse({ description: 'Invalid movie ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MovieResponseDto> {
    const movie = await this.moviesService.findOne(id);
    return plainToInstance(MovieResponseDto, movie, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
    type: MovieResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data or character IDs not found' })
  @ApiConflictResponse({ description: 'Movie with this title or episode ID already exists' })
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
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'Movie deleted successfully' })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  @ApiForbiddenResponse({ description: 'Cannot delete movie with character associations' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.moviesService.remove(id);
  }

  @Get(':id/characters')
  @ApiOperation({ summary: 'Get all characters for a movie' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'List of characters for the movie',
    type: [CharacterBasicDto],
  })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  @ApiBadRequestResponse({ description: 'Invalid movie ID' })
  async getMovieCharacters(@Param('id', ParseIntPipe) id: number): Promise<CharacterBasicDto[]> {
    const characters = await this.moviesService.getMovieCharacters(id);
    return plainToInstance(CharacterBasicDto, characters, {
      excludeExtraneousValues: true,
    });
  }

  @Post(':movieId/characters/:characterId')
  @ApiOperation({ summary: 'Add a character to a movie' })
  @ApiParam({ name: 'movieId', description: 'Movie ID', type: 'number' })
  @ApiParam({ name: 'characterId', description: 'Character ID', type: 'number' })
  @ApiResponse({
    status: 201,
    description: 'Character added to movie successfully',
    type: MovieResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Movie or character not found' })
  @ApiBadRequestResponse({ description: 'Invalid IDs or relationship already exists' })
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
  @ApiOperation({ summary: 'Remove a character from a movie' })
  @ApiParam({ name: 'movieId', description: 'Movie ID', type: 'number' })
  @ApiParam({ name: 'characterId', description: 'Character ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'Character removed from movie successfully' })
  @ApiNotFoundResponse({ description: 'Movie not found or association does not exist' })
  @ApiBadRequestResponse({ description: 'Invalid movie or character ID' })
  async removeCharacterFromMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('characterId', ParseIntPipe) characterId: number,
  ): Promise<void> {
    await this.moviesService.removeCharacterFromMovie(movieId, characterId);
  }
}