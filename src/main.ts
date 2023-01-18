import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  app.useGlobalPipes(new ValidationPipe({
    forbidUnknownValues: false
  }));

  const config = new DocumentBuilder()
  .setTitle('Sonar Rotas API')
  .setDescription('Descrições dos endpoints da API')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT_BACKEND, () =>
    console.log(`🤖 server running on port ${process.env.PORT_BACKEND}...`),
  );
}

bootstrap();
