import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Contacto } from './contacto.entity';
import { ContactoController } from './contacto.controller';
import { ContactoService } from './contacto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto])],
  controllers: [ContactoController],
  providers: [ContactoService],
})
export class ContactoModule {}
