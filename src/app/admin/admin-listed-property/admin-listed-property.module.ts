import { Module } from '@nestjs/common';
import { AdminListedPropertyService } from './admin-listed-property.service';
import { AdminListedPropertyController } from './admin-listed-property.controller';
import { KolektivaContractModule } from '../../kolektiva-contract/kolektiva-contract.module';

@Module({
  imports: [KolektivaContractModule],
  controllers: [AdminListedPropertyController],
  providers: [AdminListedPropertyService],
})
export class AdminListedPropertyModule {}
