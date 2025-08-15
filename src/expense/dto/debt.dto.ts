import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export enum DebtType {
  CREDIT_CARD = 'credit_card',
  PERSONAL_LOAN = 'personal_loan',
  HOME_LOAN = 'home_loan',
  CAR_LOAN = 'car_loan',
  STUDENT_LOAN = 'student_loan',
  BUSINESS_LOAN = 'business_loan',
  OTHER = 'other'
}

export class CreateDebtDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  total_limit?: number;

  @IsOptional()
  @IsNumber()
  total_due?: number;

  @IsOptional()
  @IsNumber()
  min_due?: number;

  @IsOptional()
  @IsEnum(DebtType)
  debt_type?: DebtType = DebtType.CREDIT_CARD;

  @IsOptional()
  @IsNumber()
  principal_amount?: number;

  @IsOptional()
  @IsNumber()
  outstanding_balance?: number;

  @IsOptional()
  @IsNumber()
  interest_rate?: number;

  @IsOptional()
  @IsNumber()
  loan_term_months?: number;

  @IsOptional()
  @IsNumber()
  emi_amount?: number;
}

export class UpdateDebtDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  total_limit?: number;

  @IsOptional()
  @IsNumber()
  total_due?: number;

  @IsOptional()
  @IsNumber()
  min_due?: number;

  @IsOptional()
  @IsEnum(DebtType)
  debt_type?: DebtType;

  @IsOptional()
  @IsNumber()
  principal_amount?: number;

  @IsOptional()
  @IsNumber()
  outstanding_balance?: number;

  @IsOptional()
  @IsNumber()
  interest_rate?: number;

  @IsOptional()
  @IsNumber()
  loan_term_months?: number;

  @IsOptional()
  @IsNumber()
  emi_amount?: number;
} 