import { Module } from '@nestjs/common';
import { AdminListedPropertyService } from './admin-listed-property.service';
import { AdminListedPropertyController } from './admin-listed-property.controller';
import { KolektivaContractModule } from '../../kolektiva-contract/kolektiva-contract.module';
import { PropertyModule } from '../../property/property.module';
import { PropertyService } from '../../property/property.service';

@Module({
  imports: [KolektivaContractModule, PropertyModule],
  controllers: [AdminListedPropertyController],
  providers: [AdminListedPropertyService, PropertyService],
})
export class AdminListedPropertyModule {}
