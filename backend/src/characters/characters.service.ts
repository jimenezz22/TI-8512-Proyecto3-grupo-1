import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = this.characterRepository.create(createCharacterDto);
    return await this.characterRepository.save(character);
  }

  async findAll(): Promise<Character[]> {
    return await this.characterRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Character> {
    const character = await this.characterRepository.findOne({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return character;
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.findOne(id);
    
    Object.assign(character, updateCharacterDto);
    return await this.characterRepository.save(character);
  }

  async remove(id: number): Promise<void> {
    const character = await this.findOne(id);
    await this.characterRepository.remove(character);
  }
}