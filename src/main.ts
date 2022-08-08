import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationException } from './shared/exceptions/validation.exeption';
import { HttpErrorFilter } from './shared/http-error.filter';
import { ValidationFilter } from './shared/validation.filter';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
    cors: true,
  });

  // HttpError Filter
  app.useGlobalFilters(new HttpErrorFilter());

  // Validation Filter
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      exceptionFactory: (errors: any) => {
        const exceptions = errors.map((error) => {
          return Object.values(error.constraints).join('');
        });
        return new ValidationException(exceptions);
      },
    }),
  );

  await app.listen(process.env.BACKEND_PORT, () => {
    logger.debug(`Server running on port ${process.env.BACKEND_PORT}`);
  });
}

bootstrap();
