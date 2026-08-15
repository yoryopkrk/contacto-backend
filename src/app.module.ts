import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';

import config from './config';
import { DatabaseModule } from './database/database.module';
import { ContactoModule } from './contacto/contacto.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        PORT: Joi.number(),
        CORS_ORIGINS: Joi.string().allow(''),
        POSTGRES_URL: Joi.string(),
        DATABASE_URL: Joi.string(),
        POSTGRES_SSL: Joi.string(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASS: Joi.string().required(),
        MAIL_TO: Joi.string(),
        ADMIN_API_KEY: Joi.string().required(),
      })
        .or('POSTGRES_URL', 'DATABASE_URL')
        .unknown(true),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    DatabaseModule,
    ContactoModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
