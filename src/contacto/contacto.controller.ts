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

import { AdminKeyGuard } from '../common/admin-key.guard';
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';

@Controller('contactos')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  // Unica ruta publica: la llama el formulario de contacto del portafolio sin autenticacion.
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('postContacto')
  create(@Body() data: CreateContactoDto) {
    return this.contactoService.create(data);
  }

  @UseGuards(AdminKeyGuard)
  @Get('getContactos')
  getContactos() {
    return this.contactoService.findAll();
  }

  @UseGuards(AdminKeyGuard)
  @Get('allContactos')
  allContactos() {
    return this.contactoService.findAll();
  }

  @UseGuards(AdminKeyGuard)
  @Get('getContacto/:id')
  getContacto(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.findOne(id);
  }

  @UseGuards(AdminKeyGuard)
  @Put('putContacto/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() changes: UpdateContactoDto) {
    return this.contactoService.update(id, changes);
  }

  @UseGuards(AdminKeyGuard)
  @Delete('deleteContacto/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.remove(id);
  }
}
