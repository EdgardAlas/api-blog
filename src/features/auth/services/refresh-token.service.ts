import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import { RefreshTokenRequest } from '../dto/requests/refresh-token.request';
import { RefreshTokenResponse } from '../dto/responses/refresh-token.response';
import { AuthJwtService } from './auth-jwt.service';

@Injectable()
export class RefreshTokenService
  implements BaseService<RefreshTokenRequest, RefreshTokenResponse>
{
  constructor(private readonly authJwtService: AuthJwtService) {}

  async execute(refreshTokenRequest: RefreshTokenRequest) {
    const { refreshToken } = refreshTokenRequest;

    const { session } =
      await this.authJwtService.verifyRefreshToken(refreshToken);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.authJwtService.rotateSessionTokens(session.id);

    return new RefreshTokenResponse({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }
}
