import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RefreshTokenRequest {
  @IsNotEmpty({
    message: i18nValidationMessage('auth.validation.refresh_token_required'),
  })
  @IsString({
    message: i18nValidationMessage('auth.validation.refresh_token_string'),
  })
  refreshToken: string;
}
