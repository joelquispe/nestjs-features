import { Expose } from 'class-transformer';

export class CreatePaymentRespDto {
  @Expose()
  status: string;
}
