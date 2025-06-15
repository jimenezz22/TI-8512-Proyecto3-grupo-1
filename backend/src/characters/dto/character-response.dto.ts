import { Expose, Type } from 'class-transformer';

export class MovieBasicDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  episode_id?: number;
}

export class CharacterResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  height?: string;

  @Expose()
  mass?: string;

  @Expose()
  @Type(() => MovieBasicDto)
  movies?: MovieBasicDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}