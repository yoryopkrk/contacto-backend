import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

// Evita el 404 al entrar a la raíz o a /api/v1: lleva a la documentación.
// Ambas rutas están excluidas del prefijo global en main.ts.
@ApiExcludeController()
@Controller()
export class RootController {
  @Get(['/', 'api/v1', 'api', 'docs'])
  @Redirect('/api/v1/docs')
  redirectToDocs() {}
}
