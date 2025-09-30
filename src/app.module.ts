import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envs } from 'src/env/envs';
import { DatabaseModule } from './db/database.module';
import { EnvModule } from './env/env.module';
import { AuthorsModule } from './features/authors/authors.module';
import { HealthController } from './features/health/health.controller';
import { CheckService } from './features/health/services/check/check.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envs],
    }),
    EnvModule,
    DatabaseModule,
    AuthorsModule,
  ],
  controllers: [HealthController],
  providers: [CheckService],
})
export class AppModule {}
