import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';

@Injectable()
export class AppService {
  public constructor(private readonly twilioService: TwilioService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async sendSMS() {
    return this.twilioService.client.messages.create({
      body: 'SMS Body, sent to the phone!',
      from: '+18643362987',
      to: '+51902309486',
    });
  }
}
