import { Expose, Type } from 'class-transformer';

export class CharacterBasicDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  height?: string;

  @Expose()
  mass?: string;
}

export class MovieResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  episode_id?: number;

  @Expose()
  director?: string;

  @Expose()
  @Type(() => CharacterBasicDto)
  characters?: CharacterBasicDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}