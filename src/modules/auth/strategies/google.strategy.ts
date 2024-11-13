import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import configuration from 'src/config/configuration';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(configuration.KEY)
    configService: ConfigType<typeof configuration>,
  ) {
    super({
      clientID: configService.google.clientID,
      clientSecret: configService.google.clientSecret,
      callbackURL: configService.google.callbackURL,

      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    if (!profile) {
      done(null, '');
    }
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
