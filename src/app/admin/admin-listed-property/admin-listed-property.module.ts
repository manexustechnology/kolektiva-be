import { Module } from '@nestjs/common';
import { AdminListedPropertyService } from './admin-listed-property.service';
import { AdminListedPropertyController } from './admin-listed-property.controller';

@Module({
  controllers: [AdminListedPropertyController],
  providers: [AdminListedPropertyService],
})
export class AdminListedPropertyModule {}
