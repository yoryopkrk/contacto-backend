import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { CreateTransportDto } from './dto/create-transport.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter;
  private readonly fromUser: string;
  private readonly notifyTo: string;

  constructor(private readonly configService: ConfigService) {
    this.fromUser = this.configService.get<string>('config.mail.user');
    this.notifyTo = this.configService.get<string>('config.mail.to');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.fromUser,
        pass: this.configService.get<string>('config.mail.pass'),
      },
    });
  }

  async createTransport(data: CreateTransportDto) {
    const { cualNotificacion, nombre, email, mensaje } = data;

    // cualNotificacion 0: avisa a Jorge que llego un mensaje nuevo.
    if (cualNotificacion === 0) {
      await this.transporter.sendMail({
        from: this.fromUser,
        to: this.notifyTo,
        replyTo: email,
        subject: `Nuevo mensaje desde el portafolio de ${nombre}`,
        text: `${nombre} (${email}) escribio:\n\n${mensaje ?? ''}`,
        html: `<p><strong>${nombre}</strong> (${email}) escribio:</p><p>${mensaje ?? ''}</p>`,
      });

      this.logger.log(`Notificacion enviada por mensaje de ${email}`);
      return { enviado: true };
    }

    // cualNotificacion 1: confirma a quien escribio que el mensaje fue recibido.
    await this.transporter.sendMail({
      from: this.fromUser,
      to: email,
      subject: 'Recibi tu mensaje',
      text: `Hola ${nombre}, gracias por escribir. Recibi tu mensaje y te respondere a la brevedad.`,
      html: `<p>Hola ${nombre}, gracias por escribir. Recibi tu mensaje y te respondere a la brevedad.</p>`,
    });

    this.logger.log(`Respuesta automatica enviada a ${email}`);
    return { enviado: true };
  }
}
