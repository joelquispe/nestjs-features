import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckoutSessionRespDto {
  @ApiProperty({
    description: 'Stripe Checkout Session ID',
    example: 'cs_1234567890abcdef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'URL to redirect the customer to complete the payment',
    example: 'https://checkout.stripe.com/pay/cs_1234567890abcdef#fidkdWxOYHwnPyd1blpxYHZxWjA0S0J9T3I1TEFgS09cPUh2Sn0tUmRHPWt%2FaVJGS29%2FdHxgbFZRQFZ9dlZSdk1GQGl1Yk5vbUNjZHFzYE1xaTVJbTBCS3Zkb3Y2NWJ9d2pwfDBGRHxPdXVqYVVqNXZhPEFOJTMxNGI1',
  })
  @Expose()
  url: string;

  @ApiProperty({
    description: 'Checkout session status',
    example: 'open',
    enum: ['open', 'complete', 'expired'],
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'unpaid',
    enum: ['paid', 'unpaid', 'no_payment_required'],
  })
  @Expose({ name: 'payment_status' })
  paymentStatus: string;

  @ApiProperty({
    description: 'Total amount in smallest currency unit',
    example: 2000,
  })
  @Expose({ name: 'amount_total' })
  amountTotal: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'usd',
  })
  @Expose()
  currency: string;
} 