import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCharacterDto {
  @ApiProperty({
    description: 'Character name',
    example: 'Luke Skywalker',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({
    description: 'Character height in cm',
    example: '172',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  height?: string;

  @ApiPropertyOptional({
    description: 'Character mass in kg',
    example: '77',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  mass?: string;
}