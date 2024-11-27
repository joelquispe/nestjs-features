import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import SendSmsDto from '../../dtos/sendSms.dto';

@Injectable()
export class TwilioClientService {
  public constructor(private readonly twilioService: TwilioService) {}
  async sendSMS(body: SendSmsDto) {
    return this.twilioService.client.messages.create({
      body: body.body,
      from: body.from,
      to: body.to,
    });
  }
}
