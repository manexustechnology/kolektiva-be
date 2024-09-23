import { Module } from '@nestjs/common';
import { KolektivaContractModule } from '../kolektiva-contract/kolektiva-contract.module';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { KolektivaContractService } from '../kolektiva-contract/kolektiva-contract.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ContractInteractionModule } from '../contract-interaction/contract-interaction.module';

@Module({
  imports: [KolektivaContractModule],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
