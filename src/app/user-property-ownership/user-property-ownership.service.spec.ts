import { Test, TestingModule } from '@nestjs/testing';
import { UserPropertyOwnershipService } from './user-property-ownership.service';

describe('UserPropertyOwnershipService', () => {
  let service: UserPropertyOwnershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPropertyOwnershipService],
    }).compile();

    service = module.get<UserPropertyOwnershipService>(UserPropertyOwnershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
