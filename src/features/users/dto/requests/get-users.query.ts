import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetUsersQuery {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('users.validation.search_string'),
  })
  search?: string;

  @IsOptional()
  @IsEnum(['admin', 'editor'], {
    message: i18nValidationMessage('users.validation.role_enum'),
  })
  role?: 'admin' | 'editor';

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @Type(() => Number)
  @IsInt({
    message: i18nValidationMessage('users.validation.page_integer'),
  })
  @Min(1, {
    message: i18nValidationMessage('users.validation.page_min'),
  })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @Type(() => Number)
  @IsInt({
    message: i18nValidationMessage('users.validation.limit_integer'),
  })
  @Min(1, {
    message: i18nValidationMessage('users.validation.limit_min'),
  })
  limit?: number;
}
