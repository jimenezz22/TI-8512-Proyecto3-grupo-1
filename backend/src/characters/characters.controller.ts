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
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { CharacterResponseDto, MovieBasicDto } from './dto/character-response.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  async create(@Body() createCharacterDto: CreateCharacterDto): Promise<CharacterResponseDto> {
    const character = await this.charactersService.create(createCharacterDto);
    return plainToInstance(CharacterResponseDto, character, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll(): Promise<CharacterResponseDto[]> {
    const characters = await this.charactersService.findAll();
    return plainToInstance(CharacterResponseDto, characters, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CharacterResponseDto> {
    const character = await this.charactersService.findOne(id);
    return plainToInstance(CharacterResponseDto, character, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
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
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.charactersService.remove(id);
  }

  // New endpoint for Phase 4
  @Get(':id/movies')
  async getCharacterMovies(@Param('id', ParseIntPipe) id: number): Promise<MovieBasicDto[]> {
    const movies = await this.charactersService.getCharacterMovies(id);
    return plainToInstance(MovieBasicDto, movies, {
      excludeExtraneousValues: true,
    });
  }

  // Additional endpoints for managing relationships
  @Post(':characterId/movies/:movieId')
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
  async removeMovieFromCharacter(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<void> {
    await this.charactersService.removeMovieFromCharacter(characterId, movieId);
  }
}