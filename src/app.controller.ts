import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigType } from '@nestjs/config';

import configuration from './config/configuration';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
// @UseGuards(AuthenticationGuard, RolesGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
  ) {}

  @Get()
  // @Roles(Role.Admin)
  getHello(): string {
    console.log(this.config.port);
    // throw new UnauthorizedException('asdsad');
    return this.appService.getHello();
  }

  @Post('send-log')
  sendLog(@Body() body: any){
    console.log(body);
  }
}
