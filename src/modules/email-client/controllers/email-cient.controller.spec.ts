import { Test, TestingModule } from '@nestjs/testing';
import { EmailCientController } from './email-client.controller';

describe('EmailCientController', () => {
  let controller: EmailCientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailCientController],
    }).compile();

    controller = module.get<EmailCientController>(EmailCientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
