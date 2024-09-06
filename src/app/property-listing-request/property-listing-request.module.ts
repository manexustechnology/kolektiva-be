import { Module } from '@nestjs/common';
import { PropertyListingRequestService } from './property-listing-request.service';
import { PropertyListingRequestController } from './property-listing-request.controller';

@Module({
  controllers: [PropertyListingRequestController],
  providers: [PropertyListingRequestService],
})
export class PropertyListingRequestModule {}
