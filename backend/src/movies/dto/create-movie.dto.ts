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
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  episode_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  director?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  characterIds?: number[];
}