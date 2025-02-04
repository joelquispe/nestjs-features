import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { EmailClientService } from './services/email-client.service';
import { EmailClientController } from './controllers/email-client.controller';

@Module({
  imports: [HttpModule],
  providers: [EmailClientService],
  controllers: [EmailClientController],
})
export class EmailClientModule {}
