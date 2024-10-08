import { Module } from '@nestjs/common';
import { KolektivaContractService } from './kolektiva-contract.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ContractInteractionModule } from '../contract-interaction/contract-interaction.module';
import { KolektivaContractController } from './kolektiva-contract.controller';

@Module({
  imports: [ContractInteractionModule],
  exports: [KolektivaContractService],
  controllers: [KolektivaContractController],
  providers: [KolektivaContractService],
})
export class KolektivaContractModule {}
