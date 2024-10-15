import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateUserActivityDto {
  @IsUUID()
  @IsNotEmpty()
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  activity: 'buy' | 'sell';

  @IsString()
  @IsNotEmpty()
  activityType: ActivityType;

  @IsOptional()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  txHash?: string;
}

export enum ActivityType {
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_FULFILLED = 'ORDER_FULFILLED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  INSTANT_TRADE = 'INSTANT_TRADE',
  INITIAL_OFFERING_PURCHASE = 'INITIAL_OFFERING_PURCHASE',
}
