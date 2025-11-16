import './modules/common/infrastructure/tracing/tracing';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  const documentFactory = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Evently')
      .setDescription('The Evently API description')
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(documentFactory));

  await app.listen(3000);
}
bootstrap();
