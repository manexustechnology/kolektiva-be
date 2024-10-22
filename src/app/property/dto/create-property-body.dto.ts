import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PropertyDataDto } from '../../property-listing-request/dto/property-data.dto';
import { Type } from 'class-transformer';

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

export class CreatePropertyDocumentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty()
  @IsBoolean()
  isHighlight: boolean;
}

export class CreatePropertyDto {
  @ApiProperty({ required: false })
  @IsEthereumAddress()
  @IsNotEmpty()
  marketAddress?: string;

  @ApiProperty({ required: false })
  @IsEthereumAddress()
  @IsNotEmpty()
  tokenAddress?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phase: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  googleMapUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location: string;

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
  tokenName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tokenSymbol: string;

  @ApiProperty()
  @IsNumber()
  totalSupply: number;

  @ApiProperty()
  @IsNumber()
  salePrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  updatedBy: string;

  @ApiProperty()
  @IsNumber()
  chainId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isUpcoming?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAftermarket?: boolean;

  @ApiProperty({ type: [CreatePropertyFacilityDto] })
  facilities: CreatePropertyFacilityDto[];

  @ApiProperty({ type: [CreatePropertyImageDto] })
  images: CreatePropertyImageDto[];

  @ApiProperty({ type: [CreatePropertyDocumentDto] })
  documents: CreatePropertyDocumentDto[];

  @ApiProperty({ type: PropertyDataDto })
  @ValidateNested()
  @Type(() => PropertyDataDto)
  propertyData: PropertyDataDto;
}
