import { Test, TestingModule } from '@nestjs/testing';
import { AdminPropertyListingRequestController } from './admin-property-listing-request.controller';
import { AdminPropertyListingRequestService } from './admin-property-listing-request.service';

describe('AdminPropertyListingRequestController', () => {
  let controller: AdminPropertyListingRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPropertyListingRequestController],
      providers: [AdminPropertyListingRequestService],
    }).compile();

    controller = module.get<AdminPropertyListingRequestController>(AdminPropertyListingRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
