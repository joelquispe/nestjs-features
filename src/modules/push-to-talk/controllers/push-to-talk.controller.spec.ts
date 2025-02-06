import { Test, TestingModule } from '@nestjs/testing';
import { PushToTalkController } from './push-to-talk.controller';

describe('PushToTalkController', () => {
  let controller: PushToTalkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushToTalkController],
    }).compile();

    controller = module.get<PushToTalkController>(PushToTalkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
