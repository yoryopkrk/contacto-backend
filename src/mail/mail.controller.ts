import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { MailService } from './mail.service';
import { CreateTransportDto } from './dto/create-transport.dto';

@Controller('correos')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('createTransport')
  createTransport(@Body() data: CreateTransportDto) {
    return this.mailService.createTransport(data);
  }
}
