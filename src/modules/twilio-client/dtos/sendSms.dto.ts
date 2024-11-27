import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class SendSmsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  to: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  from: string;
}
