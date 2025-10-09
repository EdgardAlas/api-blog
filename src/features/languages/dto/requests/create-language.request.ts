import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateLanguageRequest {
  @IsNotEmpty({
    message: i18nValidationMessage('languages.validation.code_required'),
  })
  @IsString({
    message: i18nValidationMessage('languages.validation.code_string'),
  })
  @Length(2, 5, {
    message: i18nValidationMessage('languages.validation.code_length'),
  })
  code: string;

  @IsNotEmpty({
    message: i18nValidationMessage('languages.validation.name_required'),
  })
  @IsString({
    message: i18nValidationMessage('languages.validation.name_string'),
  })
  @Length(1, 100, {
    message: i18nValidationMessage('languages.validation.name_length'),
  })
  name: string;

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('languages.validation.is_default_boolean'),
  })
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('languages.validation.is_active_boolean'),
  })
  isActive?: boolean;
}
