import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  // Lo llama un cron externo cada pocos minutos: mantiene despierto Render y
  // la consulta evita que Supabase pause el proyecto por inactividad.
  @SkipThrottle()
  @Get()
  async check() {
    await this.dataSource.query('SELECT 1');
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
