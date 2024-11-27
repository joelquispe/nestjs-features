import { Body, Controller, Post } from '@nestjs/common';
import { YapeService } from '../services/yape.service';
import IGenerateTokenYapeReqDto from '../dtos/generateTokenYapeReq.dto';
import { ApiTags } from '@nestjs/swagger';
import ICreatePaymentReqDto from '../dtos/createPaymentReq.dto';

@ApiTags('Yape')
@Controller('yape')
export class YapeController {
  constructor(private readonly yapeService: YapeService) {}

  @Post('/generateToken')
  async generateTokenYape(@Body() body: IGenerateTokenYapeReqDto) {
    return await this.yapeService.generateTokenYape(body.otp, body.phoneNumber);
  }
  @Post('/createPayment')
  async createPayment(@Body() body: ICreatePaymentReqDto) {
    return await this.yapeService.createPayment(
      body.amount,
      body.description,
      body.email,
      body.token,
    );
  }
}
