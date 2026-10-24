import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string[]>('config.corsOrigins');

  // Detras del proxy del hosting, req.ip seria la IP del proxy y el limite de peticiones contaria a
  // todos los visitantes juntos. TRUST_PROXY = cuantos proxies hay delante (Render: 1).
  const trustProxy = configService.get<number>('config.trustProxy');
  if (trustProxy > 0) app.set('trust proxy', trustProxy);

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
