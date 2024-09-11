import { Module } from '@nestjs/common';
import { KolektivaContractService } from './kolektiva-contract.service';
import { KolektivaContractController } from './kolektiva-contract.controller';

@Module({
  controllers: [KolektivaContractController],
  providers: [KolektivaContractService],
})
export class KolektivaContractModule {}
