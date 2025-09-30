import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  const corsOrigins = process.env.CORS_ORIGINS?.split(',') ?? '*';

  logger.log(`CORS Origins: ${corsOrigins.toString()}`);

  app.enableCors({
    origin: corsOrigins,
  });

  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
