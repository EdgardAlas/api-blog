import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserRequest {
  @IsNotEmpty({
    message: i18nValidationMessage('users.validation.email_required'),
  })
  @IsEmail(
    {},
    { message: i18nValidationMessage('users.validation.email_valid') },
  )
  @Length(1, 255, {
    message: i18nValidationMessage('users.validation.email_length'),
  })
  email: string;

  @IsNotEmpty({
    message: i18nValidationMessage('users.validation.username_required'),
  })
  @IsString({
    message: i18nValidationMessage('users.validation.username_string'),
  })
  @Length(1, 100, {
    message: i18nValidationMessage('users.validation.username_length'),
  })
  username: string;

  @IsNotEmpty({
    message: i18nValidationMessage('users.validation.password_required'),
  })
  @IsString({
    message: i18nValidationMessage('users.validation.password_string'),
  })
  @MinLength(8, {
    message: i18nValidationMessage('users.validation.password_min_length'),
  })
  password: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('users.validation.firstName_string'),
  })
  @Length(1, 100, {
    message: i18nValidationMessage('users.validation.firstName_length'),
  })
  firstName?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('users.validation.lastName_string'),
  })
  @Length(1, 100, {
    message: i18nValidationMessage('users.validation.lastName_length'),
  })
  lastName?: string;

  @IsOptional()
  @IsUrl(
    {},
    { message: i18nValidationMessage('users.validation.avatarUrl_valid') },
  )
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(['admin', 'editor'], {
    message: i18nValidationMessage('users.validation.role_enum'),
  })
  role?: 'admin' | 'editor';

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('users.validation.isActive_boolean'),
  })
  isActive?: boolean;
}
