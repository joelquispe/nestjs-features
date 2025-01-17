import { ApiProperty } from '@nestjs/swagger';

class GenerateTokenYapeReqDto {
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  otp: string;
}

export default GenerateTokenYapeReqDto;
