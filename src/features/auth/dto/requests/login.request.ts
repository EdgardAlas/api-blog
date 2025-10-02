import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginRequest {
  @IsNotEmpty({
    message: i18nValidationMessage('auth.validation.email_required'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('auth.validation.email_valid'),
    },
  )
  @Length(1, 255, {
    message: i18nValidationMessage('auth.validation.email_length'),
  })
  email: string;

  @IsNotEmpty({
    message: i18nValidationMessage('auth.validation.password_required'),
  })
  @IsString({
    message: i18nValidationMessage('auth.validation.password_string'),
  })
  @Length(8, 100, {
    message: i18nValidationMessage('auth.validation.password_length'),
  })
  password: string;
}
