import { HttpService } from '@nestjs/axios';

import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import configuration from 'src/config/configuration';

import { ConfigType } from '@nestjs/config';
import { SendEmailReqDto, SendEmailRespDto } from '../dtos';

@Injectable()
export class EmailClientService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
  ) {}

  async sendEmail(body: SendEmailReqDto): Promise<SendEmailRespDto> {
    try {
      const response = await this.httpService.axiosRef.post(
        'https://api.brevo.com/v3/smtp/email',
        body,
        {
          headers: {
            'api-key': this.config.brevo.apiKey,
          },
        },
      );
      console.log(response);
      return { message: 'Correo enviado correctamente' };
    } catch (error) {
      throw new BadRequestException('Ocurrio un error al enviar el correo');
    }
  }
}
