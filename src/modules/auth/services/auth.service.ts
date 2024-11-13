import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuth } from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async login(auth: IAuth) {
    const payload = {
      sub: '123123',
      username: auth.username,
      roles: ['admin'],
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
