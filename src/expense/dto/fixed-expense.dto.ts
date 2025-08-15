import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateFixedExpenseDto {
  @IsString()
  category: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsBoolean()
  is_credit_card?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  exclude_from_tracking?: boolean;

  @IsOptional()
  @IsUUID()
  profile_id?: string;
}

export class UpdateFixedExpenseDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsBoolean()
  is_credit_card?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  exclude_from_tracking?: boolean;

  @IsOptional()
  @IsUUID()
  profile_id?: string;
} 