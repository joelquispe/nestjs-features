import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutLineItemDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Subscription',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Monthly premium subscription',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Price in smallest currency unit (e.g., cents for USD)',
    example: 1999,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty({
    description: 'Quantity of items',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Product images URLs',
    example: ['https://example.com/image.jpg'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];
}

export class CreateCheckoutSessionReqDto {
  @ApiProperty({
    description: 'Line items for the checkout session',
    type: [CheckoutLineItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutLineItemDto)
  lineItems: CheckoutLineItemDto[];

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
    description: 'Success URL after payment completion',
    example: 'https://yourdomain.com/success',
  })
  @IsUrl()
  @IsNotEmpty()
  successUrl: string;

  @ApiProperty({
    description: 'Cancel URL if payment is cancelled',
    example: 'https://yourdomain.com/cancel',
  })
  @IsUrl()
  @IsNotEmpty()
  cancelUrl: string;

  @ApiProperty({
    description: 'Additional metadata for the checkout session',
    example: { orderId: '123', customerId: '456' },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
} 