import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateMonthlySummaryDto {
  @IsOptional()
  @IsString()
  profile_id?: string;

  @IsDateString()
  month: string; // YYYY-MM format

  @IsNumber()
  total_income: number;

  @IsNumber()
  total_expenses: number;

  @IsNumber()
  total_savings: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMonthlySummaryDto {
  @IsOptional()
  @IsString()
  profile_id?: string;

  @IsOptional()
  @IsDateString()
  month?: string; // YYYY-MM format

  @IsOptional()
  @IsNumber()
  total_income?: number;

  @IsOptional()
  @IsNumber()
  total_expenses?: number;

  @IsOptional()
  @IsNumber()
  total_savings?: number;

  @IsOptional()
  @IsString()
  notes?: string;
} 