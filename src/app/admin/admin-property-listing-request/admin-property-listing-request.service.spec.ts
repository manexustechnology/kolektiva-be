import { Test, TestingModule } from '@nestjs/testing';
import { AdminPropertyListingRequestService } from './admin-property-listing-request.service';

describe('AdminPropertyListingRequestService', () => {
  let service: AdminPropertyListingRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminPropertyListingRequestService],
    }).compile();

    service = module.get<AdminPropertyListingRequestService>(AdminPropertyListingRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
