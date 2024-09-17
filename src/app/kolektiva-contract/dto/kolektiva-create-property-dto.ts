import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsEthereumAddress,
} from 'class-validator';
import { Address } from 'viem';

export class KolektivaCreatePropertyDto {
  @ApiProperty()
  @IsNumber()
  chainId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  propertyType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  totalSupply: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  salePrice: number;

  @ApiProperty()
  @IsEthereumAddress()
  propertyOwnerAddress: Address;
}
