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

    // cualNotificacion 0: avisa a Jorge que llego un mensaje nuevo.
    if (cualNotificacion === 0) {
      const { error } = await this.resend.emails.send({
        from: this.fromAddress,
        to: this.notifyTo,
        replyTo: email,
        subject: `Nuevo mensaje desde el portafolio de ${nombre}`,
        text: `${nombre} (${email}) escribio:\n\n${mensaje ?? ''}`,
        html: `<p><strong>${nombre}</strong> (${email}) escribio:</p><p>${mensaje ?? ''}</p>`,
      });

      if (error) {
        this.logger.error(`Fallo el envio de notificacion: ${error.message}`);
        throw new InternalServerErrorException('No se pudo enviar el correo de notificacion');
      }

      this.logger.log(`Notificacion enviada por mensaje de ${email}`);
      return { enviado: true };
    }

    // cualNotificacion 1: confirma a quien escribio que el mensaje fue recibido.
    const { error } = await this.resend.emails.send({
      from: this.fromAddress,
      to: email,
      subject: 'Recibi tu mensaje',
      text: `Hola ${nombre}, gracias por escribir. Recibi tu mensaje y te respondere a la brevedad.`,
      html: `<p>Hola ${nombre}, gracias por escribir. Recibi tu mensaje y te respondere a la brevedad.</p>`,
    });

    if (error) {
      this.logger.error(`Fallo el envio de respuesta automatica: ${error.message}`);
      throw new InternalServerErrorException('No se pudo enviar la respuesta automatica');
    }

    this.logger.log(`Respuesta automatica enviada a ${email}`);
    return { enviado: true };
  }
}
