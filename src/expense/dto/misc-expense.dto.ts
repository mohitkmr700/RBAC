import { IsString, IsNumber, IsOptional, Matches } from 'class-validator';

export class CreateMiscExpenseDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Month must be in YYYY-MM format (e.g., 2024-01)' })
  month: string;

  @IsString()
  category: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateMiscExpenseDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;
} 