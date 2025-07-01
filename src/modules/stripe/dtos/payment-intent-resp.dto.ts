import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaymentIntentRespDto {
  @ApiProperty({
    description: 'Stripe Payment Intent ID',
    example: 'pi_1234567890abcdef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Client secret for confirming the payment on the frontend',
    example: 'pi_1234567890abcdef_secret_abcdef',
  })
  @Expose({ name: 'client_secret' })
  clientSecret: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'requires_payment_method',
    enum: ['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'requires_capture', 'canceled', 'succeeded'],
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'Payment amount in smallest currency unit',
    example: 2000,
  })
  @Expose()
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'usd',
  })
  @Expose()
  currency: string;

  @ApiProperty({
    description: 'Payment description',
    example: 'Payment for order #123',
  })
  @Expose()
  description: string;
} 