import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MovieResponseDto {
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