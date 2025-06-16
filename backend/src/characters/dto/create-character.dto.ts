import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsArray,
  IsNumber,
  ArrayUnique,
  Matches,
  IsPositive,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateCharacterDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @Matches(/^[a-zA-Z0-9\s\-'\.]+$/, { 
    message: 'Name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods' 
  })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString({ message: 'Height must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Height must not exceed 20 characters' })
  @Matches(/^(unknown|\d+)$/, { 
    message: 'Height must be "unknown" or a number' 
  })
  @Transform(({ value }) => value?.trim())
  height?: string;

  @IsString({ message: 'Mass must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Mass must not exceed 20 characters' })
  @Matches(/^(unknown|\d+)$/, { 
    message: 'Mass must be "unknown" or a number' 
  })
  @Transform(({ value }) => value?.trim())
  mass?: string;

  @IsOptional()
  @IsArray({ message: 'Movie IDs must be an array' })
  @ArrayUnique({ message: 'Movie IDs must be unique' })
  @ArrayMinSize(1, { message: 'Movie IDs array must contain at least 1 element when provided' })
  @ArrayMaxSize(20, { message: 'Movie IDs array must not exceed 20 elements' })
  @IsNumber({}, { each: true, message: 'Each movie ID must be a number' })
  @IsPositive({ each: true, message: 'Each movie ID must be a positive number' })
  @Type(() => Number)
  movieIds?: number[];
}