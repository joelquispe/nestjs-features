import { Test, TestingModule } from '@nestjs/testing';
import { PushToTalkService } from './push-to-talk.service';

describe('PushToTalkService', () => {
  let service: PushToTalkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PushToTalkService],
    }).compile();

    service = module.get<PushToTalkService>(PushToTalkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
