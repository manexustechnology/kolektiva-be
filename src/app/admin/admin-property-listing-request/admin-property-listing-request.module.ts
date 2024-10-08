import { Module } from '@nestjs/common';
import { AdminPropertyListingRequestService } from './admin-property-listing-request.service';
import { AdminPropertyListingRequestController } from './admin-property-listing-request.controller';
import { KolektivaContractService } from '../../kolektiva-contract/kolektiva-contract.service';
import { ContractInteractionService } from '../../contract-interaction/contract-interaction.service';
import { AdminListedPropertyModule } from '../admin-listed-property/admin-listed-property.module';
import { AdminListedPropertyService } from '../admin-listed-property/admin-listed-property.service';
import { PropertyModule } from '../../property/property.module';

@Module({
  imports: [AdminListedPropertyModule, PropertyModule],
  controllers: [AdminPropertyListingRequestController],
  providers: [
    AdminPropertyListingRequestService,
    ContractInteractionService,
    KolektivaContractService,
    AdminListedPropertyService,
  ],
})
export class AdminPropertyListingRequestModule {}
