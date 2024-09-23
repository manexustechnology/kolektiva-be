import { Test, TestingModule } from '@nestjs/testing';
import { KolektivaContractService } from './kolektiva-contract.service';
import { KolektivaContractController } from './kolektiva-contract.controller';

describe('KolektivaContractController', () => {
  let controller: KolektivaContractController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KolektivaContractController],
      providers: [KolektivaContractService],
    }).compile();

    controller = module.get<KolektivaContractController>(
      KolektivaContractController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
