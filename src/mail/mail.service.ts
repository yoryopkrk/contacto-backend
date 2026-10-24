import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

import { Contacto } from '../contacto/contacto.entity';
import { buildAutoReply, buildOwnerNotification, MailContent } from './mail-templates';

// Los correos los dispara el servidor al guardar un contacto. Los destinatarios no los elige el
// visitante: el aviso va siempre a MAIL_TO y la respuesta automatica, al correo del contacto guardado.
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly fromAddress: string;
  private readonly notifyTo: string;

  constructor(private readonly configService: ConfigService) {
    this.fromAddress = this.configService.get<string>('config.mail.from');
    this.notifyTo = this.configService.get<string>('config.mail.to');
    this.resend = new Resend(this.configService.get<string>('config.mail.resendApiKey'));
  }

  // Avisa a Jorge que llego un mensaje nuevo.
  async notifyOwner(contacto: Contacto) {
    await this.send({
      to: this.notifyTo,
      replyTo: contacto.correo,
      content: buildOwnerNotification(contacto),
    });
    this.logger.log(`Notificacion enviada por el contacto #${contacto.id}`);
  }

  // Confirma a quien escribio que el mensaje fue recibido.
  async sendAutoReply(contacto: Contacto) {
    await this.send({ to: contacto.correo, content: buildAutoReply(contacto.nombre) });
    this.logger.log(`Respuesta automatica enviada por el contacto #${contacto.id}`);
  }

  private async send(params: { to: string; replyTo?: string; content: MailContent }) {
    const { to, replyTo, content } = params;
    const { error } = await this.resend.emails.send({
      from: this.fromAddress,
      to,
      replyTo,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    if (error) throw new Error(error.message);
  }
}
