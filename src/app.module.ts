import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthController } from './features/health/health.controller';
import { CheckService } from './features/health/services/check/check.service';
import { ConfigModule } from '@nestjs/config';
import { envs } from 'src/env/envs';
import { EnvModule } from './env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envs],
    }),
    EnvModule,
  ],
  controllers: [HealthController],
  providers: [AppService, CheckService],
})
export class AppModule {}
