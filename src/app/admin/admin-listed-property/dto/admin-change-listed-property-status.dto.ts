import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  PropertyPhase,
  PropertyStatus,
} from '../../../../constants/property.constants';

export class AdminChangeListedPropertyStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(PropertyStatus)
  status: PropertyStatus;
}

export class AdminChangeListedPropertyPhaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(PropertyPhase)
  phase: PropertyPhase;
}
