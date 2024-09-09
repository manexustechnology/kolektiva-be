import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class ListPropertyListingRequestQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  status?: string;
}
