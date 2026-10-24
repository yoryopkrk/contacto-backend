import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateTransportDto } from './dto/create-transport.dto';

@ApiTags('correos')
@Controller('correos')
export class MailController {
  // Antes esta ruta publica enviaba un correo a la direccion que le pasaran: cualquiera podia usar el
  // dominio para mandar mensajes a terceros. Ahora no envia nada; los correos salen desde
  // POST /contactos/postContacto. Se mantiene para el front antiguo y se puede borrar cuando no se use.
  @ApiOperation({
    deprecated: true,
    summary: 'Obsoleta: no envia correos. Los correos salen al guardar el contacto (postContacto).',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(200)
  @Post('createTransport')
  createTransport(@Body() _data: CreateTransportDto) {
    return { enviado: false, obsoleto: true };
  }
}
