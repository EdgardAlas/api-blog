import {
  IsArray,
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateTagTranslationRequest {
  @IsNotEmpty({
    message: i18nValidationMessage('tags.validation.languageId_required'),
  })
  @IsUUID('4', {
    message: i18nValidationMessage('tags.validation.languageId_uuid'),
  })
  languageId: string;

  @IsNotEmpty({
    message: i18nValidationMessage('tags.validation.name_required'),
  })
  @IsString({
    message: i18nValidationMessage('tags.validation.name_string'),
  })
  @Length(1, 255, {
    message: i18nValidationMessage('tags.validation.name_length'),
  })
  name: string;

  @IsNotEmpty({
    message: i18nValidationMessage('tags.validation.slug_required'),
  })
  @IsString({
    message: i18nValidationMessage('tags.validation.slug_string'),
  })
  @Length(1, 255, {
    message: i18nValidationMessage('tags.validation.slug_length'),
  })
  slug: string;
}

export class CreateTagRequest {
  @IsOptional()
  @IsHexColor({
    message: i18nValidationMessage('tags.validation.color_hex'),
  })
  color?: string;

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('tags.validation.isActive_boolean'),
  })
  isActive?: boolean;

  @IsArray({
    message: i18nValidationMessage('tags.validation.translations_array'),
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTagTranslationRequest)
  translations: CreateTagTranslationRequest[];
}
