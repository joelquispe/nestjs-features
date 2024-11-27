import { Module } from '@nestjs/common';
import { TwilioClientService } from './services/twilio-client/twilio-client.service';
import { TwilioClientController } from './controllers/twilio-client/twilio-client.controller';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
  providers: [TwilioClientService],
  controllers: [TwilioClientController],
})
export class TwilioClientModule {}
