import { ApiProperty } from '@nestjs/swagger';
import {
  isArray,
  IsBoolean,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Address } from 'viem';

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
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // marketAddress: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // tokenAddress: string;

  // @ApiProperty()
  // @IsEthereumAddress()
  // propertyOwnerAddress: Address;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

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

  @ApiProperty({ type: [CreatePropertyFacilityDto] })
  facilities: CreatePropertyFacilityDto[];

  @ApiProperty({ type: [CreatePropertyImageDto] })
  images: CreatePropertyImageDto[];
}
