import { Test, TestingModule } from '@nestjs/testing';
import { AdminListedPropertyController } from './admin-listed-property.controller';
import { AdminListedPropertyService } from './admin-listed-property.service';

describe('AdminListedPropertyController', () => {
  let controller: AdminListedPropertyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminListedPropertyController],
      providers: [AdminListedPropertyService],
    }).compile();

    controller = module.get<AdminListedPropertyController>(AdminListedPropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
