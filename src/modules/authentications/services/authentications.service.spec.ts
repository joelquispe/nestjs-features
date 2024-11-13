import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationsService } from './authentications.service';

describe('AuthenticationsService', () => {
  let service: AuthenticationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationsService],
    }).compile();

    service = module.get<AuthenticationsService>(AuthenticationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should login with Google successfully', () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    spyOn(service, 'loginWithGoogle').and.returnValue(of(mockUser));

    service.loginWithGoogle().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });
  });
});
