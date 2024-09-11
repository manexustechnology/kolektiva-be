import { Test, TestingModule } from '@nestjs/testing';
import { KolektivaContractService } from './kolektiva-contract.service';

describe('KolektivaContractService', () => {
  let service: KolektivaContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KolektivaContractService],
    }).compile();

    service = module.get<KolektivaContractService>(KolektivaContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
