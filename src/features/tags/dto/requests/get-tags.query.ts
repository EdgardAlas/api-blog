import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';

export class GetTagsQuery {
  @IsOptional()
  @IsString({
    message: 'Search must be a string',
  })
  search?: string;

  @IsOptional()
  @IsUUID('4', {
    message: 'Language ID must be a valid UUID',
  })
  lang?: string;

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
