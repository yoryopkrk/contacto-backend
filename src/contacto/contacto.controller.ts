import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminKeyGuard } from '../common/admin-key.guard';
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';

@ApiTags('contactos')
@Controller('contactos')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  // Única ruta pública: la llama el formulario de contacto del portafolio sin autenticación.
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('postContacto')
  create(@Body() data: CreateContactoDto) {
    return this.contactoService.create(data);
  }

  @ApiSecurity('x-api-key')
  @UseGuards(AdminKeyGuard)
  @Get('getContactos')
  getContactos() {
    return this.contactoService.findAll();
  }

  @ApiSecurity('x-api-key')
  @UseGuards(AdminKeyGuard)
  @Get('allContactos')
  allContactos() {
    return this.contactoService.findAll();
  }

  @ApiSecurity('x-api-key')
  @UseGuards(AdminKeyGuard)
  @Get('getContacto/:id')
  getContacto(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.findOne(id);
  }

  @ApiSecurity('x-api-key')
  @UseGuards(AdminKeyGuard)
  @Put('putContacto/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() changes: UpdateContactoDto) {
    return this.contactoService.update(id, changes);
  }

  @ApiSecurity('x-api-key')
  @UseGuards(AdminKeyGuard)
  @Delete('deleteContacto/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.remove(id);
  }
}
