import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConfirmPaymentReqDto {
  @ApiProperty({
    description: 'Payment Intent ID to confirm',
    example: 'pi_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;

  @ApiProperty({
    description: 'Payment method ID to use for confirmation',
    example: 'pm_1234567890abcdef',
    required: false,
  })
  @IsString()
  @IsOptional()
  paymentMethodId?: string;

  @ApiProperty({
    description: 'Return URL for 3D Secure authentication',
    example: 'https://yourdomain.com/return',
    required: false,
  })
  @IsString()
  @IsOptional()
  returnUrl?: string;
} 