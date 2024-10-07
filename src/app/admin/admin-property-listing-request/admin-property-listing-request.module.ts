import { Module } from '@nestjs/common';
import { AdminPropertyListingRequestService } from './admin-property-listing-request.service';
import { AdminPropertyListingRequestController } from './admin-property-listing-request.controller';
import { PropertyModule } from '../../property/property.module';
import { PropertyService } from '../../property/property.service';
import { KolektivaContractService } from '../../kolektiva-contract/kolektiva-contract.service';
import { ContractInteractionService } from '../../contract-interaction/contract-interaction.service';

@Module({
  imports: [PropertyModule],
  exports: [PropertyService],
  controllers: [AdminPropertyListingRequestController],
  providers: [
    AdminPropertyListingRequestService,
    ContractInteractionService,
    KolektivaContractService,
    PropertyService,
  ],
})
export class AdminPropertyListingRequestModule {}
