import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodReqDto {
  @ApiProperty({
    description: 'Payment method type',
    example: 'card',
    enum: ['card', 'us_bank_account', 'sepa_debit'],
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Customer email to attach the payment method to',
    example: 'customer@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({
    description: 'Card details for card payment methods',
    example: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123'
    },
    required: false,
  })
  @IsOptional()
  card?: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };

  @ApiProperty({
    description: 'Billing details',
    example: {
      name: 'John Doe',
      email: 'customer@example.com',
      phone: '+1234567890',
      address: {
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US'
      }
    },
    required: false,
  })
  @IsOptional()
  billing_details?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };

  @ApiProperty({
    description: 'Additional metadata for the payment method',
    example: { source: 'mobile_app', user_id: '123' },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
} 