import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCreditCardDto {
  @IsString()
  card_name: string;

  @IsNumber()
  total_limit: number;

  @IsNumber()
  total_due: number;

  @IsNumber()
  min_due: number;
}

export class UpdateCreditCardDto {
  @IsOptional()
  @IsString()
  card_name?: string;

  @IsOptional()
  @IsNumber()
  total_limit?: number;

  @IsOptional()
  @IsNumber()
  total_due?: number;

  @IsOptional()
  @IsNumber()
  min_due?: number;
} 