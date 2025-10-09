import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  CreateTagRequest,
  CreateTagTranslationRequest,
} from './create-tag.request';

export class UpdateTagTranslationRequest extends CreateTagTranslationRequest {
  @IsOptional()
  @IsUUID('4', {
    message: i18nValidationMessage('tags.validation.id_uuid'),
  })
  id?: string;
}

export class UpdateTagRequest extends PartialType(CreateTagRequest) {
  @IsArray({
    message: i18nValidationMessage('tags.validation.translations_array'),
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateTagTranslationRequest)
  translations: UpdateTagTranslationRequest[];
}
