import { ApiProperty } from '@nestjs/swagger';

class IGenerateTokenYapeReqDto {
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  otp: string;
}

export default IGenerateTokenYapeReqDto;
