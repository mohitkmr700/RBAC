import { IsString, IsNumber, IsOptional, Matches } from 'class-validator';

export class CreateMonthlySummaryDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Month must be in YYYY-MM format (e.g., 2024-01)' })
  month: string;

  @IsNumber()
  salary_inhand: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMonthlySummaryDto {
  @IsOptional()
  @IsNumber()
  salary_inhand?: number;

  @IsOptional()
  @IsString()
  notes?: string;
} 