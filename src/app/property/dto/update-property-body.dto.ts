import { OmitType } from '@nestjs/swagger';
import { CreatePropertyDto } from './create-property-body.dto';

export class UpdatePropertyDto extends OmitType(CreatePropertyDto, [
  'propertyData',
] as const) {}
