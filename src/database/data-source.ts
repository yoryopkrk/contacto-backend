import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const options: DataSourceOptions = {
  type: 'postgres',
  url,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
  schema: process.env.POSTGRES_SCHEMA || 'public',
  synchronize: false,
  logging: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
};

export const AppDataSource = new DataSource(options);
