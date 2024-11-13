import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    console.log(user);
    console.log(err);
    if (user === null || user === false) {
      return user;
    }
    console.log(status);
    return super.handleRequest(err, user, info, context, status);
  }
}
