import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { IAuth } from '../interfaces/auth.interface';
import { GoogleAuthGuard } from 'src/modules/authentications/guards/google-auth.guard';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: IAuth) {
    return this.authService.login(loginDto);
  }
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    // console.log(req);
    console.log(req.user);
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + 5);
    if (req.user == false) {
      response.cookie('user', 'access_canceled', {
        expires: expirationDate,
      });

      return response.redirect('http://localhost:4200');
    }

    response.cookie('user', req.user.email, {
      // sameSite: 'strict',
      // secure: true,
      // httpOnly: true,
      // maxAge: 20,

      expires: expirationDate,
    });
    response.redirect('http://localhost:4200');

    // console.log(response);
  }
}
