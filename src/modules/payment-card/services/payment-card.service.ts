import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';
import configuration from 'src/config/configuration';
import { CreatePaymentBodyReqDto } from '../dtos/create-payment-body-req.dto';
import { CreatePaymentReqDto } from '../dtos/create-payment-req.dto';
import { HttpService } from '@nestjs/axios';
import { CreatePaymentRespDto } from '../dtos/create-payment-resp.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaymentCardService {
  constructor(
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
    private readonly httpService: HttpService,
  ) {}

  async createPayment(
    body: CreatePaymentReqDto,
  ): Promise<CreatePaymentRespDto> {
    const xIdempotencyKey = randomUUID();
    const bearerToken = this.config.paymentMarket.accessToken;
    const paymentBodyReq: CreatePaymentBodyReqDto = {
      description: body.description,
      installments: 1,
      token: body.token,
      transaction_amount: body.transactionAmount,
      payment_method_id: body.paymentMethod,
      payer: {
        email: body.email,
        identification: {
          type: body.identificationType,
          number: body.identificationNumber,
        },
      },
    };
    try {
      const response = await this.httpService.axiosRef.post(
        'https://api.mercadopago.com/v1/payments',
        paymentBodyReq,
        {
          headers: {
            'x-idempotency-key': xIdempotencyKey,
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );
      return plainToInstance(CreatePaymentRespDto, response.data, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new BadRequestException('Error al realizar el pago');
    }
  }
}
