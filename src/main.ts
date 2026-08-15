import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string[]>('config.corsOrigins');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (corsOrigins?.length) {
    app.enableCors({ origin: corsOrigins });
  } else {
    Logger.warn('CORS_ORIGINS no esta definido: se acepta cualquier origen.');
    app.enableCors();
  }

  const port = configService.get<number>('config.port');
  await app.listen(port);
  Logger.log(`Servidor escuchando en el puerto ${port}`);
}
bootstrap();
