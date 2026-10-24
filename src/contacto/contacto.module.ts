import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';
import { Contacto } from './contacto.entity';
import { ContactoController } from './contacto.controller';
import { ContactoService } from './contacto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto]), MailModule],
  controllers: [ContactoController],
  providers: [ContactoService],
})
export class ContactoModule {}
