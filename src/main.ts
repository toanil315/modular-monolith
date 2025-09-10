import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
