import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateDebtPaymentDto {
  @IsNumber()
  debt_id: number;

  @IsNumber()
  amount: number;

  @IsDateString()
  payment_date: string; // YYYY-MM-DD format

  @IsOptional()
  @IsNumber()
  expense_record_id?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateDebtPaymentDto {
  @IsOptional()
  @IsNumber()
  debt_id?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  payment_date?: string; // YYYY-MM-DD format

  @IsOptional()
  @IsNumber()
  expense_record_id?: number;

  @IsOptional()
  @IsString()
  notes?: string;
} 