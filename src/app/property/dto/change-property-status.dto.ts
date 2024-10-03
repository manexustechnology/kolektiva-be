import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PropertyStatus } from '../../../constants/property.constants';

export class ChangePropertyStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(PropertyStatus)
  status: PropertyStatus;
}
