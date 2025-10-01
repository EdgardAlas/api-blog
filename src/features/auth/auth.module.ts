import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { EnvModule } from 'src/env/env.module';
import { AuthJwtStrategy } from 'src/features/auth/strategies/auth-jwt.strategy';

@Module({
  imports: [EnvModule, DatabaseModule],
  providers: [AuthJwtStrategy],
})
export class AuthModule {}
