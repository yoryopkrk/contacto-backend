import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MailService } from '../mail/mail.service';
import { Contacto } from './contacto.entity';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';

const DAY_MS = 24 * 60 * 60 * 1000;
// Tope de respuestas automaticas por dia: protege la cuota de Resend y limita el dano si alguien
// intenta usar el formulario para escribirle a terceros.
export const AUTO_REPLY_DAILY_LIMIT = 40;

@Injectable()
export class ContactoService {
  private readonly logger = new Logger(ContactoService.name);

  constructor(
    @InjectRepository(Contacto)
    private readonly contactoRepo: Repository<Contacto>,
    private readonly mail: MailService,
  ) {}

  async create(data: CreateContactoDto) {
    const contacto = await this.contactoRepo.save(this.contactoRepo.create(data));
    // Los correos no demoran ni hacen fallar el formulario: el mensaje ya quedo guardado.
    void this.sendEmails(contacto);
    return contacto;
  }

  private async sendEmails(contacto: Contacto) {
    try {
      await this.mail.notifyOwner(contacto);
    } catch (e) {
      this.logger.error(`Fallo el aviso del contacto #${contacto.id}: ${e?.message ?? e}`);
    }

    try {
      if (!(await this.canAutoReply(contacto.correo))) {
        this.logger.warn(`Sin respuesta automatica para el contacto #${contacto.id} (tope o repetido)`);
        return;
      }
      await this.mail.sendAutoReply(contacto);
      await this.contactoRepo.update(contacto.id, { respuestaEnviadaAt: new Date() });
    } catch (e) {
      this.logger.error(`Fallo la respuesta automatica del contacto #${contacto.id}: ${e?.message ?? e}`);
    }
  }

  // Una respuesta por direccion cada 24 h y un tope diario general.
  private async canAutoReply(correo: string) {
    const since = new Date(Date.now() - DAY_MS);
    const recent = this.contactoRepo
      .createQueryBuilder('c')
      .where('c."respuestaEnviadaAt" > :since', { since });

    const [sameAddress, total] = await Promise.all([
      recent.clone().andWhere('LOWER(c.correo) = LOWER(:correo)', { correo }).getCount(),
      recent.clone().getCount(),
    ]);

    return sameAddress === 0 && total < AUTO_REPLY_DAILY_LIMIT;
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
