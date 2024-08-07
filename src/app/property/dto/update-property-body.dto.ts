import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property-body.dto';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}