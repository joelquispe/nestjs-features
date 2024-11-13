import { Module } from '@nestjs/common';
import { AuthenticationsController } from './controllers/authentications.controller';
import { AuthenticationsService } from './services/authentications.service';

@Module({
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService],
})
export class AuthenticationsModule {}
