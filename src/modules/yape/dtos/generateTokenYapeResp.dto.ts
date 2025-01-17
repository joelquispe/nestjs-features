import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class GenerateTokenYapeRespDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}

export default GenerateTokenYapeRespDto;
