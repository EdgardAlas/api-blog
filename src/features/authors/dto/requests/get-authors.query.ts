import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAuthorsQuery {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'Search cannot be empty if provided' })
  @IsString({ message: 'Search must be a string' })
  search?: string;
}
