import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsNumber,
  IsPositive,
  IsArray,
  ArrayUnique,
  Matches,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateMovieDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(2, { message: 'Title must be at least 2 characters long' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  @Matches(/^[a-zA-Z0-9\s\-'\.:\(\)]+$/, { 
    message: 'Title can only contain letters, numbers, spaces, and common punctuation' 
  })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsOptional()
  @IsNumber({}, { message: 'Episode ID must be a number' })
  @IsPositive({ message: 'Episode ID must be a positive number' })
  @Min(1, { message: 'Episode ID must be at least 1' })
  @Max(100, { message: 'Episode ID must not exceed 100' })
  @Type(() => Number)
  episode_id?: number;

  @IsOptional()
  @IsString({ message: 'Director must be a string' })
  @MaxLength(100, { message: 'Director name must not exceed 100 characters' })
  @Matches(/^[a-zA-Z\s\-'\.]+$/, { 
    message: 'Director name can only contain letters, spaces, hyphens, apostrophes, and periods' 
  })
  @Transform(({ value }) => value?.trim())
  director?: string;

  @IsOptional()
  @IsArray({ message: 'Character IDs must be an array' })
  @ArrayUnique({ message: 'Character IDs must be unique' })
  @ArrayMinSize(1, { message: 'Character IDs array must contain at least 1 element when provided' })
  @ArrayMaxSize(50, { message: 'Character IDs array must not exceed 50 elements' })
  @IsNumber({}, { each: true, message: 'Each character ID must be a number' })
  @IsPositive({ each: true, message: 'Each character ID must be a positive number' })
  @Type(() => Number)
  characterIds?: number[];
}