import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class SubmitPropertyListingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  googleMapsLink: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  landArea: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  buildingArea: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  priceEstimation: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  planToSell: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  propertyType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ownershipStatus: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  propertyCondition: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  occupancyStatus: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  propertyManager: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  furniture: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  propertyIssues: string[];

  @ApiProperty()
  @IsString()
  includedFurniture: string;
}