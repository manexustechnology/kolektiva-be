import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserPropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  propertyId: string;
}
