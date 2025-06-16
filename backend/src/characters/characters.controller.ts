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
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { CharacterResponseDto } from './dto/character-response.dto';

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
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
    description: 'List of all characters',
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
    description: 'Character found',
    type: CharacterResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Character not found' })
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
  @ApiResponse({ status: 404, description: 'Character not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @ApiResponse({ status: 404, description: 'Character not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.charactersService.remove(id);
  }
}