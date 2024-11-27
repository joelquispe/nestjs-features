import { Test, TestingModule } from '@nestjs/testing';
import { TwilioClientController } from './twilio-client.controller';

describe('TwilioClientController', () => {
  let controller: TwilioClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwilioClientController],
    }).compile();

    controller = module.get<TwilioClientController>(TwilioClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
