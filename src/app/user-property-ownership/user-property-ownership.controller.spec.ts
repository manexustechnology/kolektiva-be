import { Test, TestingModule } from '@nestjs/testing';
import { UserPropertyOwnershipController } from './user-property-ownership.controller';
import { UserPropertyOwnershipService } from './user-property-ownership.service';

describe('UserPropertyOwnershipController', () => {
  let controller: UserPropertyOwnershipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPropertyOwnershipController],
      providers: [UserPropertyOwnershipService],
    }).compile();

    controller = module.get<UserPropertyOwnershipController>(UserPropertyOwnershipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
