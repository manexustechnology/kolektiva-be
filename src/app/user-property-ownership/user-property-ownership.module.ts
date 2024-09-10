import { Module } from '@nestjs/common';
import { UserPropertyOwnershipService } from './user-property-ownership.service';
import { UserPropertyOwnershipController } from './user-property-ownership.controller';

@Module({
  controllers: [UserPropertyOwnershipController],
  providers: [UserPropertyOwnershipService],
})
export class UserPropertyOwnershipModule {}
