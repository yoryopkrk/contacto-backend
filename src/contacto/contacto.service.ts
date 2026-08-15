import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Contacto } from './contacto.entity';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';

@Injectable()
export class ContactoService {
  constructor(
    @InjectRepository(Contacto)
    private readonly contactoRepo: Repository<Contacto>,
  ) {}

  create(data: CreateContactoDto) {
    const contacto = this.contactoRepo.create(data);
    return this.contactoRepo.save(contacto);
  }

  findAll() {
    return this.contactoRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const contacto = await this.contactoRepo.findOneBy({ id });

    if (!contacto) {
      throw new NotFoundException(`Contacto #${id} no encontrado`);
    }

    return contacto;
  }

  async update(id: number, changes: UpdateContactoDto) {
    const contacto = await this.findOne(id);
    this.contactoRepo.merge(contacto, changes);
    return this.contactoRepo.save(contacto);
  }

  async remove(id: number) {
    const contacto = await this.findOne(id);
    return this.contactoRepo.remove(contacto);
  }
}
