import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import config from '../config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>): TypeOrmModuleOptions => ({
        type: 'postgres',
        url: configService.postgres.url,
        ssl: configService.postgres.ssl ? { rejectUnauthorized: false } : false,
        schema: configService.postgres.schema,
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
