import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateTagRequest,
  CreateTagTranslationRequest,
} from './create-tag.request';

export class UpdateTagTranslationRequest extends CreateTagTranslationRequest {
  @IsOptional()
  @IsUUID('4', {
    message: 'ID must be a valid UUID',
  })
  id?: string;
}

export class UpdateTagRequest extends PartialType(CreateTagRequest) {
  @IsArray({
    message: 'Translations must be an array',
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateTagTranslationRequest)
  translations: UpdateTagTranslationRequest[];
}
