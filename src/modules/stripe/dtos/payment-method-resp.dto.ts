import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PaymentMethodCardDto {
  @ApiProperty({
    description: 'Card brand',
    example: 'visa',
  })
  @Expose()
  brand: string;

  @ApiProperty({
    description: 'Two-letter ISO code representing the country of the card',
    example: 'US',
  })
  @Expose()
  country: string;

  @ApiProperty({
    description: 'Card expiration month',
    example: 12,
  })
  @Expose({ name: 'exp_month' })
  expMonth: number;

  @ApiProperty({
    description: 'Card expiration year',
    example: 2025,
  })
  @Expose({ name: 'exp_year' })
  expYear: number;

  @ApiProperty({
    description: 'The last four digits of the card',
    example: '4242',
  })
  @Expose()
  last4: string;

  @ApiProperty({
    description: 'Card funding type',
    example: 'credit',
    enum: ['credit', 'debit', 'prepaid', 'unknown'],
  })
  @Expose()
  funding: string;
}

export class PaymentMethodBillingDetailsDto {
  @ApiProperty({
    description: 'Billing name',
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Billing email',
    example: 'customer@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Billing phone',
    example: '+1234567890',
  })
  @Expose()
  phone: string;
}

export class PaymentMethodRespDto {
  @ApiProperty({
    description: 'Payment method ID',
    example: 'pm_1234567890abcdef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Payment method type',
    example: 'card',
  })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'Customer ID this payment method is attached to',
    example: 'cus_1234567890abcdef',
  })
  @Expose()
  customer: string;

  @ApiProperty({
    description: 'Card details (if payment method is a card)',
    type: PaymentMethodCardDto,
  })
  @Expose()
  @Type(() => PaymentMethodCardDto)
  card?: PaymentMethodCardDto;

  @ApiProperty({
    description: 'Billing details',
    type: PaymentMethodBillingDetailsDto,
  })
  @Expose({ name: 'billing_details' })
  @Type(() => PaymentMethodBillingDetailsDto)
  billingDetails: PaymentMethodBillingDetailsDto;

  @ApiProperty({
    description: 'Time at which the object was created',
    example: 1640995200,
  })
  @Expose()
  created: number;

  @ApiProperty({
    description: 'Whether this payment method can be shown to the customer',
    example: true,
  })
  @Expose()
  livemode: boolean;
} 