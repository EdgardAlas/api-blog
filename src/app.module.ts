import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/db/database.module';
import { EnvModule } from 'src/env/env.module';
import { envs } from 'src/env/envs';
import { AuthModule } from 'src/features/auth/auth.module';
import { AuthorsModule } from 'src/features/authors/authors.module';
import { HealthController } from 'src/features/health/health.controller';
import { CheckService } from 'src/features/health/services/check/check.service';
import { LanguagesModule } from 'src/features/languages/languages.module';
import { TagsModule } from 'src/features/tags/tags.module';
import { UsersModule } from 'src/features/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envs],
    }),
    JwtModule.register({ global: true }),
    // I18nModule.forRoot({
    //   fallbackLanguage: 'en',
    //   loaderOptions: {
    //     path: path.join(__dirname, '../src/i18n/'),
    //     watch: true,
    //   },
    //   typesOutputPath: path.join(__dirname, '../src/i18n/i18n.generated.ts'),
    //   resolvers: [
    //     { use: QueryResolver, options: ['lang'] },
    //     AcceptLanguageResolver,
    //     new HeaderResolver(['x-lang']),
    //   ],
    // }),
    EnvModule,
    DatabaseModule,
    AuthorsModule,
    AuthModule,
    LanguagesModule,
    TagsModule,
    UsersModule,
  ],
  controllers: [HealthController],
  providers: [CheckService],
})
export class AppModule {}
