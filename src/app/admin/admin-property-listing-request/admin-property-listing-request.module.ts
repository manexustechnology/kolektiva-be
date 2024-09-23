import { Module } from '@nestjs/common';
import { AdminPropertyListingRequestService } from './admin-property-listing-request.service';
import { AdminPropertyListingRequestController } from './admin-property-listing-request.controller';

@Module({
  controllers: [AdminPropertyListingRequestController],
  providers: [AdminPropertyListingRequestService],
})
export class AdminPropertyListingRequestModule {}
