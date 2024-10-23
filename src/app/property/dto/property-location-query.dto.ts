import { IsOptional, IsString } from 'class-validator';

export class PropertyLocationQueryDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  filterCity?: string;

  @IsOptional()
  @IsString()
  filterState?: string;

  @IsOptional()
  @IsString()
  filterCountry?: string;

  @IsOptional()
  @IsString()
  filterLocation?: string;
}
