import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

require('dotenv');

async function bootstrap() {
  const prefixGlobal = 'api';

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // *  Config
  const port = configService.get<number>('PORT');

  // * Enable core
  app.enableCors({ origin: '*' });

  // * set global prefix
  app.setGlobalPrefix(prefixGlobal);

  // * Class Validator and Class transform
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(port || 3000);
}
bootstrap();
