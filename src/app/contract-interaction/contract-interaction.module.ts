import { Module } from '@nestjs/common';
import { ContractInteractionService } from './contract-interaction.service';

@Module({
  providers: [ContractInteractionService],
  exports: [ContractInteractionService],
})
export class ContractInteractionModule {}
