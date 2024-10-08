import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KolektivaReadDto {
  @ApiProperty()
  @IsNumber()
  chainId: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;
}
