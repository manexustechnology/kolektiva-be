import { Test, TestingModule } from '@nestjs/testing';
import { AdminListedPropertyService } from './admin-listed-property.service';

describe('AdminListedPropertyService', () => {
  let service: AdminListedPropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminListedPropertyService],
    }).compile();

    service = module.get<AdminListedPropertyService>(AdminListedPropertyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
