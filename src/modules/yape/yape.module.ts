import { Module } from '@nestjs/common';
import { YapeService } from './services/yape.service';
import { YapeController } from './controllers/yape.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [YapeService],
  controllers: [YapeController],
})
export class YapeModule {}
