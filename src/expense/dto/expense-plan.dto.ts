import { IsString, IsNumber, IsArray, IsOptional, ValidateNested, IsBoolean, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class PlannedExpenseItemDto {
  @IsString()
  category: string;

  @IsNumber()
  planned_amount: number;
}

export class CreatePlanDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Month must be in YYYY-MM format (e.g., 2024-01)' })
  month: string;

  @IsString()
  plan_name: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlannedExpenseItemDto)
  items: PlannedExpenseItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SyncPlanDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Month must be in YYYY-MM format (e.g., 2024-01)' })
  month: string;

  @IsString()
  prompt: string;
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  plan_name?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePlanActiveStatusDto {
  @IsBoolean()
  is_active: boolean;
} 