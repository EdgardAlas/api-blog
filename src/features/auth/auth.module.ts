import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { EnvModule } from 'src/env/env.module';
import { AuthJwtStrategy } from 'src/features/auth/strategies/auth-jwt.strategy';
import { AuthJwtService } from './services/auth-jwt.service';
import { LoginService } from './services/login.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthJwtStrategy,
    AuthJwtService,
    LoginService,
    RefreshTokenService,
  ],
  exports: [AuthJwtService],
})
export class AuthModule {}
