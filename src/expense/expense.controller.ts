import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AuthGuard } from '../auth/auth.guard';
import {
  CreateMonthlyExpenseDto,
  UpdateMonthlyExpenseDto,
  CreateMiscExpenseDto,
  UpdateMiscExpenseDto,
  CreateDebtDto,
  UpdateDebtDto,
  CreateMonthlySummaryDto,
  UpdateMonthlySummaryDto,
  CreatePlanDto,
  SyncPlanDto,
  UpdatePlanDto,
  UpdatePlanActiveStatusDto,
  CreateFixedExpenseDto,
  UpdateFixedExpenseDto,
  CreateDebtPaymentDto,
  UpdateDebtPaymentDto,
  CreatePlanItemDto,
  UpdatePlanItemDto,
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
    return this.expenseService.createMonthlySummary(dto);
  }

  @Get('summary/:month')
  async getMonthlySummary(@Param('month') month: string) {
    return this.expenseService.getMonthlySummary(month);
  }

  // Debt Management
  @Get('debt')
  async getAllDebts() {
    return this.expenseService.getAllDebts();
  }

  @Post('debt')
  async createDebt(@Body() dto: CreateDebtDto) {
    return this.expenseService.createDebt(dto);
  }

  @Patch('debt/:id')
  async updateDebt(
    @Param('id') id: string,
    @Body() dto: UpdateDebtDto,
  ) {
    return this.expenseService.updateDebt(id, dto);
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

  @Get('plans')
  async getAllPlans(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('month') month?: string,
    @Query('isActive') isActive?: string,
  ) {
    const options = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
      month,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    };

    return this.expenseService.getAllPlans(options);
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

  @Patch('plan/:id/is_active')
  async updatePlanActiveStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePlanActiveStatusDto,
  ) {
    return this.expenseService.updatePlanActiveStatus(id, dto.is_active);
  }

  @Get('plan/:id/variance-history')
  async getPlanVarianceHistory(@Param('id') id: string) {
    return this.expenseService.getPlanVarianceHistory(id);
  }

  // Fixed Expenses
  @Post('fixed-expenses')
  async createFixedExpense(@Body() dto: CreateFixedExpenseDto) {
    return this.expenseService.createFixedExpense(dto);
  }

  @Get('fixed-expenses')
  async getFixedExpenses(
    @Query('profileId') profileId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      profileId,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.expenseService.getFixedExpenses(options);
  }

  @Patch('fixed-expenses/:id')
  async updateFixedExpense(
    @Param('id') id: string,
    @Body() dto: UpdateFixedExpenseDto,
  ) {
    return this.expenseService.updateFixedExpense(id, dto);
  }

  @Delete('fixed-expenses/:id')
  async deleteFixedExpense(@Param('id') id: string) {
    return this.expenseService.deleteFixedExpense(id);
  }

  // Enhanced Monthly Expenses
  @Get('monthly-expenses')
  async getMonthlyExpensesByProfile(
    @Query('profileId') profileId: string,
    @Query('month') month?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      month,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.expenseService.getMonthlyExpensesByProfile(profileId, options);
  }

  @Patch('monthly-expenses/:id')
  async updateMonthlyExpense(
    @Param('id') id: string,
    @Body() dto: UpdateMonthlyExpenseDto,
  ) {
    return this.expenseService.updateMonthlyExpense(id, dto);
  }

  @Delete('monthly-expenses/:id')
  async deleteMonthlyExpense(@Param('id') id: string) {
    return this.expenseService.deleteMonthlyExpense(id);
  }

  // Enhanced Misc Expenses
  @Get('misc-expenses')
  async getMiscExpenses(
    @Query('profileId') profileId?: string,
    @Query('month') month?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      profileId,
      month,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.expenseService.getMiscExpenses(options);
  }

  @Patch('misc-expenses/:id')
  async updateMiscExpense(
    @Param('id') id: string,
    @Body() dto: UpdateMiscExpenseDto,
  ) {
    return this.expenseService.updateMiscExpense(id, dto);
  }

  @Delete('misc-expenses/:id')
  async deleteMiscExpense(@Param('id') id: string) {
    return this.expenseService.deleteMiscExpense(id);
  }

  // Debt Payments
  @Post('debt-payments')
  async createDebtPayment(@Body() dto: CreateDebtPaymentDto) {
    return this.expenseService.createDebtPayment(dto);
  }

  @Get('debt-payments')
  async getDebtPayments(
    @Query('debtId') debtId?: string,
    @Query('profileId') profileId?: string,
    @Query('month') month?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      debtId: debtId ? parseInt(debtId, 10) : undefined,
      profileId,
      month,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.expenseService.getDebtPayments(options);
  }

  @Patch('debt-payments/:id')
  async updateDebtPayment(
    @Param('id') id: string,
    @Body() dto: UpdateDebtPaymentDto,
  ) {
    return this.expenseService.updateDebtPayment(id, dto);
  }

  @Delete('debt-payments/:id')
  async deleteDebtPayment(@Param('id') id: string) {
    return this.expenseService.deleteDebtPayment(id);
  }

  // Plan Items Management
  @Post('plan/:expensePlanId/item')
  async createPlanItem(
    @Param('expensePlanId') expensePlanId: string,
    @Body() dto: CreatePlanItemDto,
  ) {
    return this.expenseService.createPlanItem(expensePlanId, dto);
  }

  @Patch('plan/item/:id')
  async updatePlanItem(
    @Param('id') id: string,
    @Body() dto: UpdatePlanItemDto,
  ) {
    return this.expenseService.updatePlanItem(id, dto);
  }

  @Delete('plan/item/:id')
  async deletePlanItem(@Param('id') id: string) {
    return this.expenseService.deletePlanItem(id);
  }

  // Enhanced Monthly Summary
  @Get('summaries')
  async getMonthlySummariesByProfile(
    @Query('profileId') profileId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.expenseService.getMonthlySummariesByProfile(profileId, options);
  }

  @Patch('summary/:month')
  async updateMonthlySummary(
    @Param('month') month: string,
    @Body() dto: UpdateMonthlySummaryDto,
  ) {
    return this.expenseService.updateMonthlySummary(month, dto);
  }

  // Debt Summary
  @Get('debt/summary')
  async getDebtSummary(@Query('profileId') profileId: string) {
    return this.expenseService.getDebtSummary(profileId);
  }

  // Enhanced Debt Management
  @Get('debt/:id')
  async getDebtById(@Param('id') id: string) {
    return this.expenseService.getDebtById(id);
  }

  @Delete('debt/:id')
  async deleteDebt(@Param('id') id: string) {
    return this.expenseService.deleteDebt(id);
  }
} 