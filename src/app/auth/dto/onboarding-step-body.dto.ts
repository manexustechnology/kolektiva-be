import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetOnBoardingStepBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}

export class StoreOnBoardingStepBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  step: number;
}
