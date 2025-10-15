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

export class CreateTagTranslationRequest {
  @IsNotEmpty({
    message: 'Language ID is required',
  })
  @IsUUID('4', {
    message: 'Language ID must be a valid UUID',
  })
  languageId: string;

  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsString({
    message: 'Name must be a string',
  })
  @Length(1, 255, {
    message: 'Name must be between 1 and 255 characters',
  })
  name: string;

  @IsNotEmpty({
    message: 'Slug is required',
  })
  @IsString({
    message: 'Slug must be a string',
  })
  @Length(1, 255, {
    message: 'Slug must be between 1 and 255 characters',
  })
  slug: string;
}

export class CreateTagRequest {
  @IsOptional()
  @IsHexColor({
    message: 'Color must be a valid hexadecimal color',
  })
  color?: string;

  @IsOptional()
  @IsBoolean({
    message: 'isActive must be a boolean value',
  })
  isActive?: boolean;

  @IsArray({
    message: 'Translations must be an array',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTagTranslationRequest)
  translations: CreateTagTranslationRequest[];
}
