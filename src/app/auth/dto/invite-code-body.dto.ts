import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InviteCodeBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  inviteCode: string;
}
