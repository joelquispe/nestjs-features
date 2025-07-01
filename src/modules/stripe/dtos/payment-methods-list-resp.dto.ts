import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaymentMethodRespDto } from './payment-method-resp.dto';

export class PaymentMethodsListRespDto {
  @ApiProperty({
    description: 'List of payment methods',
    type: [PaymentMethodRespDto],
  })
  @Expose()
  @Type(() => PaymentMethodRespDto)
  data: PaymentMethodRespDto[];

  @ApiProperty({
    description: 'Whether there are more results available',
    example: false,
  })
  @Expose({ name: 'has_more' })
  hasMore: boolean;

  @ApiProperty({
    description: 'Total count of payment methods',
    example: 5,
  })
  @Expose()
  total_count?: number;
} 