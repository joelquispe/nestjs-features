import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StripeWebhookReqDto {
  @ApiProperty({
    description: 'Stripe webhook signature header',
    example: 't=1234567890,v1=abcdef...',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({
    description: 'Raw webhook payload',
    example: '{"id": "evt_1234567890abcdef", "object": "event", ...}',
  })
  @IsString()
  @IsNotEmpty()
  payload: string;
} 