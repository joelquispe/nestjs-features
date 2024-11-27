import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import IGenerateTokenYapeBodyDto from '../dtos/generateTokenBodyYape.dto';
import { HttpService } from '@nestjs/axios';
import configuration from 'src/config/configuration';
import { ConfigType } from '@nestjs/config';
import { HandleErrorUtil } from 'src/common/utils/handleError.util';
import ICreatePaymentBodyDto from '../dtos/createPaymentBody.dto';

@Injectable()
export class YapeService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
  ) {}

  // Generar token para procesar un pago
  async generateTokenYape(otp: string, phoneNumber: string) {
    try {
      const body: IGenerateTokenYapeBodyDto = {
        otp: otp, // código de aprobación de yape
        phoneNumber: phoneNumber,
        requestId: randomUUID(),
      };

      const response = await this.httpService.axiosRef.post(
        `https://api.mercadopago.com/platforms/pci/yape/v1/payment?public_key=${this.config.paymentMarket.publicKey}`,
        body,
      );

      return response.data['id'];
    } catch (error) {
      throw HandleErrorUtil.createSignatureError(error);
    }
  }

  // procesar un pago
  async createPayment(
    amount: number,
    description: string,
    email: string,
    token: string,
  ) {
    const body: ICreatePaymentBodyDto = {
      transaction_amount: amount, // costo final
      description: description,
      token: token, // token generado por el generate token yape
      installments: 1,
      payment_method_id: 'yape',
      payer: {
        email: email,
      },
    };
    // key para evitar pagos por error o dobles pagos
    const xIdempotencyKey = randomUUID();

    // access token
    const bearerToken = this.config.paymentMarket.accessToken;

    try {
      const response = await this.httpService.axiosRef.post(
        'https://api.mercadopago.com/v1/payments',
        body,
        {
          headers: {
            'x-idempotency-key': xIdempotencyKey,
            Authorization: 'Bearer ' + bearerToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw HandleErrorUtil.createSignatureError(error);
    }
  }
}
