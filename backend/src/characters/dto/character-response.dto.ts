import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class MovieBasicDto {
  @ApiProperty({
    description: 'Movie unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Movie title',
    example: 'A New Hope',
  })
  @Expose()
  title: string;

  @ApiPropertyOptional({
    description: 'Episode number in the saga',
    example: 4,
  })
  @Expose()
  episode_id?: number;

  @ApiPropertyOptional({
    description: 'Movie director',
    example: 'George Lucas',
  })
  @Expose()
  director?: string;
}

export class CharacterResponseDto {
  @ApiProperty({
    description: 'Character unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Character name',
    example: 'Luke Skywalker',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'Character height in cm',
    example: '172',
  })
  @Expose()
  height?: string;

  @ApiPropertyOptional({
    description: 'Character mass in kg',
    example: '77',
  })
  @Expose()
  mass?: string;

  @ApiPropertyOptional({
    description: 'Movies where this character appears',
    type: [MovieBasicDto],
  })
  @Expose()
  @Type(() => MovieBasicDto)
  movies?: MovieBasicDto[];

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  updatedAt: Date;
}