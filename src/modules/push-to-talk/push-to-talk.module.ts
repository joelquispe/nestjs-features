import { Module } from '@nestjs/common';
import { PushToTalkService } from './services/push-to-talk.service';
import { PushToTalkController } from './controllers/push-to-talk.controller';
import { PushToTalkGateway } from './push-to-talk.gateway';

@Module({
  providers: [PushToTalkService, PushToTalkGateway],
  controllers: [PushToTalkController]
})
export class PushToTalkModule {}
