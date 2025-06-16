import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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