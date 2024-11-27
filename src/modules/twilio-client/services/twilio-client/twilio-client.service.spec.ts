import { Test, TestingModule } from '@nestjs/testing';
import { TwilioClientService } from './twilio-client.service';

describe('TwilioClientService', () => {
  let service: TwilioClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwilioClientService],
    }).compile();

    service = module.get<TwilioClientService>(TwilioClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
