import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { PropertyListingRequestStatus } from '../../../constants/property-listing-request.constants';

export class changePropertyListingRequestStatusBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(PropertyListingRequestStatus)
  status: PropertyListingRequestStatus;
}
