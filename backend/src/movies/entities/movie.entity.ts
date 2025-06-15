import {
  Entity,
  Column,
  ManyToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { Character } from '../../characters/entities/character.entity';

@Entity('movies')
@Index(['title'], { unique: true })
@Index(['episode_id'], { unique: true })
export class Movie extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'integer',
    nullable: true,
    comment: 'Episode number in the saga',
  })
  episode_id?: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  director?: string;

  @ManyToMany(() => Character, (character) => character.movies)
  characters: Character[];
}