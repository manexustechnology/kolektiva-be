import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { IsDateOrNullConstraint } from '../../../validators/is-date-or-null.validator';

export class DashboardQueryDto {
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

export class DashboardLatestTrendDto extends DashboardQueryDto {
  @ApiPropertyOptional({
    description: 'Activity type for filtering',
    enum: ['buy', 'sell'],
  })
  @IsOptional()
  activity?: 'buy' | 'sell';

  @ApiPropertyOptional({ description: 'Limit for query results' })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;
}
