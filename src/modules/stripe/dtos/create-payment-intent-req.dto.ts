import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentIntentReqDto {
  @ApiProperty({
    description: 'Payment amount in smallest currency unit (e.g., cents for USD)',
    example: 2000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Three-letter ISO currency code',
    example: 'usd',
    default: 'usd',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'customer@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({
    description: 'Payment description',
    example: 'Payment for order #123',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({
    description: 'Additional metadata for the payment',
    example: { orderId: '123', productId: '456' },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
} 