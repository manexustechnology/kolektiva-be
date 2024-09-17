import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KolektivaApproveMarketDto {
  @ApiProperty()
  @IsNumber()
  chainId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
