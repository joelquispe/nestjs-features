import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePaymentMethodAddressDto {
  @ApiProperty({
    description: 'Address line 1',
    example: '123 Main St',
    required: false,
  })
  @IsString()
  @IsOptional()
  line1?: string;

  @ApiProperty({
    description: 'Address line 2',
    example: 'Apt 4B',
    required: false,
  })
  @IsString()
  @IsOptional()
  line2?: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'State',
    example: 'NY',
    required: false,
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '10001',
    required: false,
  })
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiProperty({
    description: 'Country code',
    example: 'US',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;
}

export class UpdatePaymentMethodBillingDetailsDto {
  @ApiProperty({
    description: 'Billing name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Billing email',
    example: 'customer@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Billing phone',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Billing address',
    type: UpdatePaymentMethodAddressDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => UpdatePaymentMethodAddressDto)
  @IsOptional()
  address?: UpdatePaymentMethodAddressDto;
}

export class UpdatePaymentMethodReqDto {
  @ApiProperty({
    description: 'Billing details to update',
    type: UpdatePaymentMethodBillingDetailsDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => UpdatePaymentMethodBillingDetailsDto)
  @IsOptional()
  billing_details?: UpdatePaymentMethodBillingDetailsDto;

  @ApiProperty({
    description: 'Metadata to update',
    example: { updated_by: 'user', source: 'mobile_app' },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
} 