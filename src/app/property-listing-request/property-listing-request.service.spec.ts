import { Test, TestingModule } from '@nestjs/testing';
import { PropertyListingRequestService } from './property-listing-request.service';

describe('PropertyListingRequestService', () => {
  let service: PropertyListingRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyListingRequestService],
    }).compile();

    service = module.get<PropertyListingRequestService>(PropertyListingRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
