import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateAuthorRequest {
  @IsNotEmpty({
    message: i18nValidationMessage('authors.validation.slug_required'),
  })
  @IsString({
    message: i18nValidationMessage('authors.validation.slug_string'),
  })
  @Length(1, 255, {
    message: i18nValidationMessage('authors.validation.slug_length'),
  })
  slug: string;

  @IsNotEmpty({
    message: i18nValidationMessage('authors.validation.firstName_required'),
  })
  @IsString({
    message: i18nValidationMessage('authors.validation.firstName_string'),
  })
  @Length(1, 100, {
    message: i18nValidationMessage('authors.validation.firstName_length'),
  })
  firstName: string;

  @IsNotEmpty({
    message: i18nValidationMessage('authors.validation.lastName_required'),
  })
  @IsString({
    message: i18nValidationMessage('authors.validation.lastName_string'),
  })
  @Length(1, 100, {
    message: i18nValidationMessage('authors.validation.lastName_length'),
  })
  lastName: string;

  @IsNotEmpty({
    message: i18nValidationMessage('authors.validation.email_required'),
  })
  @IsEmail(
    {},
    { message: i18nValidationMessage('authors.validation.email_valid') },
  )
  @Length(1, 255, {
    message: i18nValidationMessage('authors.validation.email_length'),
  })
  email: string;

  @IsOptional()
  @IsUrl(
    {},
    { message: i18nValidationMessage('authors.validation.avatarUrl_valid') },
  )
  avatarUrl?: string;
}
