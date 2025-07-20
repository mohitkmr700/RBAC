import { IsString, IsNumber, IsOptional, IsUUID, Matches } from 'class-validator';

export class CreateMonthlyExpenseDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Month must be in YYYY-MM format (e.g., 2024-01)' })
  month: string;

  @IsUUID()
  fixed_expense_id: string;

  @IsNumber()
  actual_paid: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateMonthlyExpenseDto {
  @IsOptional()
  @IsNumber()
  actual_paid?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
} 