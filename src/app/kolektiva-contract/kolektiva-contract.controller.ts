import { Controller } from '@nestjs/common';
import { KolektivaContractService } from './kolektiva-contract.service';

@Controller('kolektiva-contract')
export class KolektivaContractController {
  constructor(private readonly kolektivaContractService: KolektivaContractService) {}
}
