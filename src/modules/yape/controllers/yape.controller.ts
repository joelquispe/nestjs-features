import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { YapeService } from '../services/yape.service';
import GenerateTokenYapeReqDto from '../dtos/generateTokenYapeReq.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import ICreatePaymentReqDto from '../dtos/createPaymentReq.dto';
import GenerateTokenYapeRespDto from '../dtos/generateTokenYapeResp.dto';

import { AuthenticationGuard } from 'src/modules/auth/guards/authentication.guard';

@ApiTags('Yape')
@UseGuards(AuthenticationGuard)
@Controller('yape')
export class YapeController {
  constructor(private readonly yapeService: YapeService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: GenerateTokenYapeRespDto })
  @Post('/generateToken')
  async generateTokenYape(@Body() body: GenerateTokenYapeReqDto) {
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
