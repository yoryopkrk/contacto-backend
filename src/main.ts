import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string[]>('config.corsOrigins');

  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: 'docs', method: RequestMethod.GET },
      { path: 'api', method: RequestMethod.GET },
      { path: 'api/v1', method: RequestMethod.GET },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Contacto Backend')
    .setDescription(
      'API REST que respalda el formulario de contacto de yoryopkrk.cl: registra mensajes en PostgreSQL y envía notificaciones por correo con Resend. Las rutas administrativas requieren el header "x-api-key".',
    )
    .setVersion('1.0.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, swaggerDocument);

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
