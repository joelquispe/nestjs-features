import {
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Roles } from './modules/auth/roles.decorartor';
import { Role } from './modules/auth/roles.enum';
import { AuthenticationGuard } from './modules/auth/guards/authentication.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

@Controller()
// @UseGuards(AuthenticationGuard, RolesGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  // @Roles(Role.Admin)
  getHello(): string {
    console.log(this.configService.get('database.port'));
    // throw new UnauthorizedException('asdsad');
    return this.appService.getHello();
  }

  @Post('/sendSms')
  sendSms() {
    return this.appService.sendSMS();
  }
}
