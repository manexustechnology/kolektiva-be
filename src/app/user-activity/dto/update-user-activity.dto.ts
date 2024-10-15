import { OmitType } from '@nestjs/mapped-types';
import { CreateUserActivityDto } from './create-user-activity.dto';

export class UpdateUserActivityDto extends OmitType(CreateUserActivityDto, [
  'propertyId',
] as const) {}
