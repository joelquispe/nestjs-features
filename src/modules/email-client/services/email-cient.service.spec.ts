import { Test, TestingModule } from '@nestjs/testing';
import { EmailCientService } from './email-client.service';

describe('EmailCientService', () => {
  let service: EmailCientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailCientService],
    }).compile();

    service = module.get<EmailCientService>(EmailCientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
