import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  const corsOrigins = process.env.CORS_ORIGINS?.split(',') ?? '*';

  logger.log(`CORS Origins: ${corsOrigins.toString()}`);

  app.enableCors({
    origin: corsOrigins,
  });

  app.useGlobalPipes(new ValidationPipe({}));

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
