import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListPaymentMethodsReqDto {
  @ApiProperty({
    description: 'Customer email to list payment methods for',
    example: 'customer@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({
    description: 'Payment method type to filter by',
    example: 'card',
    enum: ['card', 'us_bank_account', 'sepa_debit'],
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Number of payment methods to return (1-100)',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number;
} 