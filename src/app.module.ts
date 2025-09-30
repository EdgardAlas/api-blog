import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';
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
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../src/i18n/'),
        watch: true,
      },
      typesOutputPath: path.join(__dirname, '../src/i18n/i18n.generated.ts'),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    EnvModule,
    DatabaseModule,
    AuthorsModule,
  ],
  controllers: [HealthController],
  providers: [CheckService],
})
export class AppModule {}
