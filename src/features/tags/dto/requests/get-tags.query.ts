import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetTagsQuery {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('tags.validation.search_string'),
  })
  search?: string;

  @IsOptional()
  @IsUUID('4', {
    message: i18nValidationMessage('tags.validation.languageId_uuid'),
  })
  lang?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @Type(() => Number)
  @IsInt({
    message: i18nValidationMessage('tags.validation.page_integer'),
  })
  @Min(1, {
    message: i18nValidationMessage('tags.validation.page_min'),
  })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @Type(() => Number)
  @IsInt({
    message: i18nValidationMessage('tags.validation.limit_integer'),
  })
  @Min(1, {
    message: i18nValidationMessage('tags.validation.limit_min'),
  })
  limit?: number;
}
