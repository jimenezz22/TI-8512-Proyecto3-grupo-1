import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { BaseEntity } from '@/shared/entities/base.entity';
import { Movie } from '@/movies/entities/movie.entity';

@Entity('characters')
@Index(['name'], { unique: true })
export class Character extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Height in cm or "unknown"',
  })
  height?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Mass in kg or "unknown"',
  })
  mass?: string;

  @ManyToMany(() => Movie, (movie) => movie.characters, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'character_movies',
    joinColumn: {
      name: 'character_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'movie_id',
      referencedColumnName: 'id',
    },
  })
  movies: Movie[];
}