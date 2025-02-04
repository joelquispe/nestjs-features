import { Body, Controller, Post } from '@nestjs/common';
import { EmailClientService } from '../services/email-client.service';
import { SendEmailReqDto, SendEmailRespDto } from '../dtos';




@Controller('email-client')
export class EmailClientController {
  constructor(private readonly emailClientService: EmailClientService) {}

  @Post()
  sendEmail(@Body() body: SendEmailReqDto): Promise<SendEmailRespDto> {
    return this.emailClientService.sendEmail(body);
  }
}
