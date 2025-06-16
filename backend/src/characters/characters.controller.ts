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
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { CharacterResponseDto, MovieBasicDto } from './dto/character-response.dto';

@ApiTags('Characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new character' })
  @ApiResponse({
    status: 201,
    description: 'Character created successfully',
    type: CharacterResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or movie IDs not found' })
  @ApiConflictResponse({ description: 'Character with this name already exists' })
  async create(@Body() createCharacterDto: CreateCharacterDto): Promise<CharacterResponseDto> {
    const character = await this.charactersService.create(createCharacterDto);
    return plainToInstance(CharacterResponseDto, character, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all characters' })
  @ApiResponse({
    status: 200,
    description: 'List of all characters with their movies',
    type: [CharacterResponseDto],
  })
  async findAll(): Promise<CharacterResponseDto[]> {
    const characters = await this.charactersService.findAll();
    return plainToInstance(CharacterResponseDto, characters, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a character by ID' })
  @ApiParam({ name: 'id', description: 'Character ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Character found with movies',
    type: CharacterResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Character not found' })
  @ApiBadRequestResponse({ description: 'Invalid character ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CharacterResponseDto> {
    const character = await this.charactersService.findOne(id);
    return plainToInstance(CharacterResponseDto, character, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a character' })
  @ApiParam({ name: 'id', description: 'Character ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Character updated successfully',
    type: CharacterResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Character not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data or movie IDs not found' })
  @ApiConflictResponse({ description: 'Character with this name already exists' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ): Promise<CharacterResponseDto> {
    const character = await this.charactersService.update(id, updateCharacterDto);
    return plainToInstance(CharacterResponseDto, character, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a character' })
  @ApiParam({ name: 'id', description: 'Character ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'Character deleted successfully' })
  @ApiNotFoundResponse({ description: 'Character not found' })
  @ApiForbiddenResponse({ description: 'Cannot delete character with movie associations' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.charactersService.remove(id);
  }

  @Get(':id/movies')
  @ApiOperation({ summary: 'Get all movies for a character' })
  @ApiParam({ name: 'id', description: 'Character ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'List of movies for the character',
    type: [MovieBasicDto],
  })
  @ApiNotFoundResponse({ description: 'Character not found' })
  @ApiBadRequestResponse({ description: 'Invalid character ID' })
  async getCharacterMovies(@Param('id', ParseIntPipe) id: number): Promise<MovieBasicDto[]> {
    const movies = await this.charactersService.getCharacterMovies(id);
    return plainToInstance(MovieBasicDto, movies, {
      excludeExtraneousValues: true,
    });
  }

  @Post(':characterId/movies/:movieId')
  @ApiOperation({ summary: 'Add a movie to a character' })
  @ApiParam({ name: 'characterId', description: 'Character ID', type: 'number' })
  @ApiParam({ name: 'movieId', description: 'Movie ID', type: 'number' })
  @ApiResponse({
    status: 201,
    description: 'Movie added to character successfully',
    type: CharacterResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Character or movie not found' })
  @ApiBadRequestResponse({ description: 'Invalid IDs or relationship already exists' })
  async addMovieToCharacter(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<CharacterResponseDto> {
    const character = await this.charactersService.addMovieToCharacter(characterId, movieId);
    return plainToInstance(CharacterResponseDto, character, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':characterId/movies/:movieId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a movie from a character' })
  @ApiParam({ name: 'characterId', description: 'Character ID', type: 'number' })
  @ApiParam({ name: 'movieId', description: 'Movie ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'Movie removed from character successfully' })
  @ApiNotFoundResponse({ description: 'Character not found or association does not exist' })
  @ApiBadRequestResponse({ description: 'Invalid character or movie ID' })
  async removeMovieFromCharacter(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<void> {
    await this.charactersService.removeMovieFromCharacter(characterId, movieId);
  }
}