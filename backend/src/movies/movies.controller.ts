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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieResponseDto } from './dto/movie-response.dto';

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
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
    description: 'List of all movies',
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
    description: 'Movie found',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
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
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.moviesService.remove(id);
  }
}