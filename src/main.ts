import { NestFactory } from '@nestjs/core';
import * as passport from 'passport';
import { sessionConfig } from './config/session';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(sessionConfig);
  app.use(passport.initialize());
  app.use(passport.session());
  // Set the global prefix
  app.setGlobalPrefix(config.app.prefix);
  await app.listen(config.port);
}
bootstrap();
