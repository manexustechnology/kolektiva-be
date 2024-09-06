import { Test, TestingModule } from '@nestjs/testing';
import { PropertyListingRequestController } from './property-listing-request.controller';
import { PropertyListingRequestService } from './property-listing-request.service';

describe('PropertyListingRequestController', () => {
  let controller: PropertyListingRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyListingRequestController],
      providers: [PropertyListingRequestService],
    }).compile();

    controller = module.get<PropertyListingRequestController>(PropertyListingRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
