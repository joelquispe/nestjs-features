import { Module } from '@nestjs/common';
import { PaymentCardService } from './services/payment-card.service';
import { PaymentCardController } from './controllers/payment-card.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PaymentCardService],
  controllers: [PaymentCardController],
})
export class PaymentCardModule {}
