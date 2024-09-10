import { ApiProperty } from '@nestjs/swagger';
import { isArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePropertyFacilityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  facility: string;

  @ApiProperty()
  @IsBoolean()
  isHighlight: boolean;
}

export class CreatePropertyImageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsBoolean()
  isHighlight: boolean;
}

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  marketAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tokenAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  updatedBy: string;

  @ApiProperty({ type: [CreatePropertyFacilityDto] })
  facilities: CreatePropertyFacilityDto[];

  @ApiProperty({ type: [CreatePropertyImageDto] })
  images: CreatePropertyImageDto[];
}
