import { ApiProperty } from '@nestjs/swagger';

class ICreatePaymentReqDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  amount: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  email: string;
}

export default ICreatePaymentReqDto;
