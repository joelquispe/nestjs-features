import { Body, Controller, Post } from '@nestjs/common';
import { PaymentCardService } from '../services/payment-card.service';
import { CreatePaymentReqDto } from '../dtos/create-payment-req.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment Card')
@Controller('payment-card')
export class PaymentCardController {
  constructor(private readonly paymentCardService: PaymentCardService) {}

  @Post()
  createPayment(@Body() body: CreatePaymentReqDto) {
    return this.paymentCardService.createPayment(body);
  }
}
