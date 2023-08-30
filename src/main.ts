import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import { sessionConfig } from './config/session';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Generate the OpenAPI documentation
  const configSwagg = new DocumentBuilder()
    .setTitle('Booking Hotels API')
    .setDescription('API for booking hotels')
    .setVersion('1.0')
    .addTag('hotels')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagg);
  SwaggerModule.setup('api', app, document);

  app.use(sessionConfig);
  app.use(passport.initialize());
  app.use(passport.session());
  // Set the global prefix
  app.setGlobalPrefix(config.app.prefix);
  await app.listen(config.port);
}
bootstrap();
