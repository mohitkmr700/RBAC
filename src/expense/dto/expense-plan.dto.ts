import { IsString, IsNumber, IsOptional, IsDateString, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlanItemDto {
  @IsString()
  category: string;

  @IsNumber()
  planned_amount: number;
}

export class UpdatePlanItemDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  planned_amount?: number;
}

export class CreatePlanDto {
  @IsOptional()
  @IsString()
  profile_id?: string;

  @IsDateString()
  month: string; // YYYY-MM format

  @IsString()
  plan_name: string;

  @IsOptional()
  @IsNumber()
  version?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanItemDto)
  items: CreatePlanItemDto[];
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  profile_id?: string;

  @IsOptional()
  @IsDateString()
  month?: string; // YYYY-MM format

  @IsOptional()
  @IsString()
  plan_name?: string;

  @IsOptional()
  @IsNumber()
  version?: number;

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

export class SyncPlanDto {
  @IsDateString()
  month: string; // YYYY-MM format

  @IsOptional()
  @IsString()
  prompt?: string;
} 