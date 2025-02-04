import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
class SendEmailUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

class SendEmailParamsDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class SendEmailReqDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  htmlContent: string;

  @IsNotEmpty()
  sender: SendEmailUserDto;

  @IsNotEmpty()
  to: SendEmailUserDto[];

  @IsNumber()
  @IsNotEmpty()
  templateId: number;

  @IsNotEmpty()
  params: SendEmailParamsDto;
}
