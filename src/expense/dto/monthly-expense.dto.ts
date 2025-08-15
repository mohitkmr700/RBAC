import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean, IsUUID } from 'class-validator';

export class CreateMonthlyExpenseDto {
  @IsDateString()
  month: string; // YYYY-MM-DD format

  @IsNumber()
  actual_paid: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  exclude_from_tracking?: boolean;

  @IsOptional()
  @IsUUID()
  profile_id?: string;

  @IsOptional()
  @IsNumber()
  expense_plan_id?: number;

  @IsOptional()
  @IsNumber()
  debt_id?: number;

  @IsOptional()
  @IsNumber()
  fixed_expense_id?: number;
}

export class UpdateMonthlyExpenseDto {
  @IsOptional()
  @IsDateString()
  month?: string; // YYYY-MM-DD format

  @IsOptional()
  @IsNumber()
  actual_paid?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  exclude_from_tracking?: boolean;

  @IsOptional()
  @IsUUID()
  profile_id?: string;

  @IsOptional()
  @IsNumber()
  expense_plan_id?: number;

  @IsOptional()
  @IsNumber()
  debt_id?: number;

  @IsOptional()
  @IsNumber()
  fixed_expense_id?: number;
} 