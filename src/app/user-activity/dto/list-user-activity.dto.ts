import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsDate } from 'class-validator';

export class ListUserActivityDto {
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
  sort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  propertyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  activityType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString()
  activity?: string;

  @ApiPropertyOptional({ type: [Date] })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ each: true })
  dateRange?: [Date, Date];
}
