import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginRequest } from './dto/requests/login.request';
import { RefreshTokenRequest } from './dto/requests/refresh-token.request';
import { LoginService } from './services/login.service';
import { RefreshTokenService } from './services/refresh-token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginRequest: LoginRequest) {
    return await this.loginService.execute(loginRequest);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenRequest: RefreshTokenRequest) {
    return await this.refreshTokenService.execute(refreshTokenRequest);
  }
}
