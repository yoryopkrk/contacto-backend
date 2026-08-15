import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  corsOrigins: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
  postgres: {
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: process.env.POSTGRES_SSL === 'true',
    schema: process.env.POSTGRES_SCHEMA || 'public',
  },
  mail: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    to: process.env.MAIL_TO || process.env.MAIL_USER,
  },
}));
