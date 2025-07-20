import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AuthGuard } from '../auth/auth.guard';
import {
  CreateMonthlyExpenseDto,
  CreateMiscExpenseDto,
  CreateCreditCardDto,
  UpdateCreditCardDto,
  CreateMonthlySummaryDto,
  CreatePlanDto,
  SyncPlanDto,
  UpdatePlanDto,
} from './dto';

@Controller('expense')
@UseGuards(AuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  // Monthly Expenses
  @Post('monthly-expenses')
  async createMonthlyExpense(@Body() dto: CreateMonthlyExpenseDto) {
    return this.expenseService.createMonthlyExpense(dto);
  }

  // Misc Expenses
  @Post('misc-expenses')
  async createMiscExpense(@Body() dto: CreateMiscExpenseDto) {
    return this.expenseService.createMiscExpense(dto);
  }

  // Get full month breakdown
  @Get('expenses/:month')
  async getMonthlyExpenses(@Param('month') month: string) {
    return this.expenseService.getMonthlyExpenses(month);
  }

  // Monthly Summary
  @Post('summary/:month')
  async generateMonthlySummary(
    @Param('month') month: string,
    @Body() dto: CreateMonthlySummaryDto,
  ) {
    return this.expenseService.generateMonthlySummary(
      month,
      dto.salary_inhand,
      dto.notes,
    );
  }

  @Get('summary/:month')
  async getMonthlySummary(@Param('month') month: string) {
    return this.expenseService.getMonthlySummary(month);
  }

  // Credit Cards
  @Get('credit')
  async getAllCreditCards() {
    return this.expenseService.getAllCreditCards();
  }

  @Post('credit')
  async createCreditCard(@Body() dto: CreateCreditCardDto) {
    return this.expenseService.createCreditCard(dto);
  }

  @Patch('credit/:id')
  async updateCreditCard(
    @Param('id') id: string,
    @Body() dto: UpdateCreditCardDto,
  ) {
    return this.expenseService.updateCreditCard(id, dto);
  }

  // Expense Planning
  @Post('plan')
  async createExpensePlan(@Body() dto: CreatePlanDto) {
    return this.expenseService.createExpensePlan(dto);
  }

  @Get('plan/:month')
  async getActivePlan(@Param('month') month: string) {
    return this.expenseService.getActivePlan(month);
  }

  @Post('plan/sync')
  async syncPlanVariance(@Body() dto: SyncPlanDto) {
    return this.expenseService.syncPlanVariance(dto);
  }

  @Patch('plan/:id')
  async updateExpensePlan(
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.expenseService.updateExpensePlan(id, dto);
  }

  @Get('plan/:id/variance-history')
  async getPlanVarianceHistory(@Param('id') id: string) {
    return this.expenseService.getPlanVarianceHistory(id);
  }
} 