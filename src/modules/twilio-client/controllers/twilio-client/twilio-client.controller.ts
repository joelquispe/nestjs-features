import { Body, Controller, Post } from '@nestjs/common';
import { TwilioClientService } from '../../services/twilio-client/twilio-client.service';
import SendSmsDto from '../../dtos/sendSms.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Twilio Client')
@Controller('twilio-client')
export class TwilioClientController {
  constructor(private readonly twilioClientService: TwilioClientService) {}
  @Post('/sendSms')
  sendSms(@Body() body: SendSmsDto) {
    return this.twilioClientService.sendSMS(body);
  }
}
