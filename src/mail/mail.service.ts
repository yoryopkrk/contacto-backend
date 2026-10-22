import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

import { CreateTransportDto } from './dto/create-transport.dto';

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

  async createTransport(data: CreateTransportDto) {
    const { cualNotificacion, nombre, email, mensaje } = data;

    // cualNotificacion 0: avisa a Jorge que llegó un mensaje nuevo.
    if (cualNotificacion === 0) {
      const { error } = await this.resend.emails.send({
        from: this.fromAddress,
        to: this.notifyTo,
        replyTo: email,
        subject: `Nuevo mensaje desde el portafolio de ${nombre}`,
        text: `${nombre} (${email}) escribió:\n\n${mensaje ?? ''}`,
        html: `<p><strong>${nombre}</strong> (${email}) escribió:</p><p>${mensaje ?? ''}</p>`,
      });

      if (error) {
        this.logger.error(`Falló el envío de notificación: ${error.message}`);
        throw new InternalServerErrorException('No se pudo enviar el correo de notificación');
      }

      this.logger.log(`Notificación enviada por mensaje de ${email}`);
      return { enviado: true };
    }

    // cualNotificacion 1: confirma a quien escribió que el mensaje fue recibido.
    const { error } = await this.resend.emails.send({
      from: this.fromAddress,
      to: email,
      subject: 'Recibí tu mensaje',
      text: `Hola ${nombre}, gracias por escribir. Recibí tu mensaje y te responderé a la brevedad.`,
      html: `<p>Hola ${nombre}, gracias por escribir. Recibí tu mensaje y te responderé a la brevedad.</p>`,
    });

    if (error) {
      this.logger.error(`Falló el envío de respuesta automática: ${error.message}`);
      throw new InternalServerErrorException('No se pudo enviar la respuesta automática');
    }

    this.logger.log(`Respuesta automática enviada a ${email}`);
    return { enviado: true };
  }
}
