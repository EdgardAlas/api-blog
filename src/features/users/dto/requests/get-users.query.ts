import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';

export class GetUsersQuery {
  @IsOptional()
  @IsString({
    message: 'Search must be a string',
  })
  search?: string;

  @IsOptional()
  @IsEnum(['admin', 'editor'], {
    message: 'Role must be either admin or editor',
  })
  role?: 'admin' | 'editor';

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @Type(() => Number)
  @IsInt({
    message: 'Page must be an integer',
  })
  @Min(1, {
    message: 'Page must be at least 1',
  })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @Type(() => Number)
  @IsInt({
    message: 'Limit must be an integer',
  })
  @Min(1, {
    message: 'Limit must be at least 1',
  })
  limit?: number;
}
