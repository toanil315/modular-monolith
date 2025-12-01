import './modules/common/infrastructure/tracing/tracing';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { Logger } from 'nestjs-pino';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { getLetterBoxConsumerConfig } from './modules/test-rabbit/consumer.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>(getLetterBoxConsumerConfig(configService));

  const documentFactory = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Evently')
      .setDescription('The Evently API description')
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(documentFactory));

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
