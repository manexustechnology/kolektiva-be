import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
  Validate,
} from 'class-validator';
import { IsDateOrNullConstraint } from '../../../validators/is-date-or-null.validator';

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
  @Validate(IsDateOrNullConstraint, { each: true })
  @Transform(({ value }) => {
    const dates = Array.isArray(value) ? value : [value];

    return dates.map((date: string) => {
      if (!date || date === 'null' || isNaN(Date.parse(date))) {
        return null;
      }
      return new Date(date);
    });
  })
  dateRange?: [Date | null, Date | null];
}
