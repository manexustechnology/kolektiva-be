import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PropertyListingRequestStatus } from '../../../../constants/property-listing-request.constants';

export class AdminChangePropertyListingRequestStatusBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(PropertyListingRequestStatus)
  status: PropertyListingRequestStatus;
}
