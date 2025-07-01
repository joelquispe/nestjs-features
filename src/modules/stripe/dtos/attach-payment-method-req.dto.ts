import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AttachPaymentMethodReqDto {
  @ApiProperty({
    description: 'Payment method ID to attach',
    example: 'pm_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @ApiProperty({
    description: 'Customer email to attach the payment method to',
    example: 'customer@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;
} 