import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';
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
  CreateFixedExpenseDto,
  UpdateFixedExpenseDto,
  CreateDebtPaymentDto,
  UpdateDebtPaymentDto,
  CreatePlanItemDto,
  UpdatePlanItemDto,
} from './dto';

@Injectable()
export class ExpenseService {
  // Monthly Expenses
  async createMonthlyExpense(dto: CreateMonthlyExpenseDto) {
    try {
      const { data, error } = await supabase
        .from('monthly_expenses')
        .insert([dto])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create monthly expense: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateMonthlyExpense(id: string, dto: UpdateMonthlyExpenseDto) {
    try {
      const { data, error } = await supabase
        .from('monthly_expenses')
        .update(dto)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update monthly expense: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Misc Expenses
  async createMiscExpense(dto: CreateMiscExpenseDto) {
    try {
      const { data, error } = await supabase
        .from('misc_expenses')
        .insert([dto])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create misc expense: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateMiscExpense(id: string, dto: UpdateMiscExpenseDto) {
    try {
      const { data, error } = await supabase
        .from('misc_expenses')
        .update(dto)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update misc expense: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Get full month breakdown
  async getMonthlyExpenses(month: string) {
    try {
      // Convert month string (YYYY-MM) to proper date format for database
      const monthDate = new Date(month + '-01');
      const formattedMonth = monthDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      // Get monthly expenses with fixed expense details
      const { data: monthlyExpenses, error: monthlyError } = await supabase
        .from('monthly_expenses')
        .select(`
          *,
          fixed_expenses (
            id,
            category,
            amount,
            is_credit_card,
            notes
          ),
          debt (
            id,
            name,
            debt_type
          ),
          expense_plans (
            id,
            plan_name
          )
        `)
        .eq('month', formattedMonth);

      if (monthlyError) throw monthlyError;

      // Get misc expenses
      const { data: miscExpenses, error: miscError } = await supabase
        .from('misc_expenses')
        .select('*')
        .eq('month', formattedMonth);

      if (miscError) throw miscError;

      return {
        success: true,
        data: {
          monthly_expenses: monthlyExpenses || [],
          misc_expenses: miscExpenses || [],
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get monthly expenses: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Debt Management
  async getAllDebts() {
    try {
      const { data, error } = await supabase
        .from('debt')
        .select('*')
        .order('name');

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get debts: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createDebt(dto: CreateDebtDto) {
    try {
      const { data, error } = await supabase
        .from('debt')
        .insert([{ ...dto, last_updated: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create debt: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateDebt(id: string, dto: UpdateDebtDto) {
    try {
      const { data, error } = await supabase
        .from('debt')
        .update({ ...dto, last_updated: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update debt: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Monthly Summary
  async getMonthlySummary(month: string) {
    try {
      // Convert month string (YYYY-MM) to proper date format for database
      const monthDate = new Date(month + '-01');
      const formattedMonth = monthDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      const { data, error } = await supabase
        .from('monthly_summary')
        .select('*')
        .eq('month', formattedMonth)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      return {
        success: true,
        data: data || null,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get monthly summary: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async generateMonthlySummary(month: string, salaryInHand: number, notes?: string) {
    try {
      // Convert month string (YYYY-MM) to proper date format for database
      const monthDate = new Date(month + '-01');
      const formattedMonth = monthDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      // Calculate total fixed paid
      const { data: monthlyExpenses, error: monthlyError } = await supabase
        .from('monthly_expenses')
        .select(`
          actual_paid,
          fixed_expenses (
            is_credit_card
          )
        `)
        .eq('month', formattedMonth);

      if (monthlyError) throw monthlyError;

      // Calculate total misc expenses
      const { data: miscExpenses, error: miscError } = await supabase
        .from('misc_expenses')
        .select('amount')
        .eq('month', formattedMonth);

      if (miscError) throw miscError;

      // Calculate totals
      const totalFixedPaid = (monthlyExpenses || []).reduce((sum, exp) => sum + exp.actual_paid, 0);
      const totalMisc = (miscExpenses || []).reduce((sum, exp) => sum + exp.amount, 0);
      const totalDebtPaid = (monthlyExpenses || [])
        .filter(exp => exp.fixed_expenses && (exp.fixed_expenses as any).is_credit_card)
        .reduce((sum, exp) => sum + exp.actual_paid, 0);

      const totalExpenses = totalFixedPaid + totalMisc;
      const savings = salaryInHand - totalExpenses;

      // Check if summary already exists
      const { data: existingSummary } = await supabase
        .from('monthly_summary')
        .select('id')
        .eq('month', formattedMonth)
        .single();

      const summaryData = {
        month: formattedMonth,
        salary_inhand: salaryInHand,
        total_fixed_paid: totalFixedPaid,
        total_misc: totalMisc,
        total_credit_paid: totalDebtPaid,
        savings,
        notes: notes || '',
      };

      let result;
      if (existingSummary) {
        // Update existing summary
        const { data, error } = await supabase
          .from('monthly_summary')
          .update(summaryData)
          .eq('id', existingSummary.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new summary
        const { data, error } = await supabase
          .from('monthly_summary')
          .insert([summaryData])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to generate monthly summary: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateMonthlySummary(month: string, dto: UpdateMonthlySummaryDto) {
    try {
      // Convert month string (YYYY-MM) to proper date format for database
      const monthDate = new Date(month + '-01');
      const formattedMonth = monthDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      const { data, error } = await supabase
        .from('monthly_summary')
        .update(dto)
        .eq('month', formattedMonth)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update monthly summary: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Expense Planning
  async createExpensePlan(dto: CreatePlanDto) {
    try {
      // Convert month string (YYYY-MM) to proper date format for database
      const monthDate = new Date(dto.month + '-01');
      const formattedMonth = monthDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      // First, deactivate ALL existing active plans across ALL months
      await supabase
        .from('expense_plans')
        .update({ is_active: false })
        .eq('is_active', true);

      // Create the new plan
      const planData = {
        month: formattedMonth,
        plan_name: dto.plan_name,
        version: dto.version || '1.0',
        is_active: true,
        notes: dto.notes || '',
        created_at: new Date().toISOString(),
      };

      const { data: plan, error: planError } = await supabase
        .from('expense_plans')
        .insert([planData])
        .select()
        .single();

      if (planError) throw planError;

      // Create planned expense items
      const plannedItems = dto.items.map(item => ({
        plan_id: plan.id,
        category: item.category,
        planned_amount: item.planned_amount,
      }));

      const { data: items, error: itemsError } = await supabase
        .from('planned_expense_items')
        .insert(plannedItems)
        .select();

      if (itemsError) throw itemsError;

      return {
        success: true,
        data: {
          plan,
          items,
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create expense plan: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getActivePlan(month: string) {
    try {
      // Convert month string (YYYY-MM) to proper date format for database
      const monthDate = new Date(month + '-01');
      const formattedMonth = monthDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      const { data: plan, error: planError } = await supabase
        .from('expense_plans')
        .select('*')
        .eq('month', formattedMonth)
        .eq('is_active', true)
        .single();

      if (planError && planError.code !== 'PGRST116') throw planError;

      if (!plan) {
        return {
          success: true,
          data: null,
        };
      }

      // Get planned items
      const { data: items, error: itemsError } = await supabase
        .from('planned_expense_items')
        .select('*')
        .eq('plan_id', plan.id);

      if (itemsError) throw itemsError;

      return {
        success: true,
        data: {
          plan,
          items: items || [],
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get active plan: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllPlans(options?: { 
    limit?: number; 
    offset?: number; 
    month?: string;
    isActive?: boolean;
  }) {
    try {
      let query = supabase
        .from('expense_plans')
        .select(`
          *,
          planned_expense_items (
            id,
            category,
            planned_amount
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (options?.month) {
        const monthDate = new Date(options.month + '-01');
        const formattedMonth = monthDate.toISOString().split('T')[0];
        query = query.eq('month', formattedMonth);
      }

      if (options?.isActive !== undefined) {
        query = query.eq('is_active', options.isActive);
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
      }

      const { data: plans, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: plans || [],
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get all plans: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async syncPlanVariance(dto: SyncPlanDto) {
    try {
      // Convert month string (YYYY-MM) to proper date format for database
      const monthDate = new Date(dto.month + '-01');
      const formattedMonth = monthDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      // Get active plan for the month
      const planResult = await this.getActivePlan(dto.month);
      if (!planResult.data) {
        throw new HttpException(
          `No active plan found for month: ${dto.month}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const { plan, items: plannedItems } = planResult.data;

      // Get actual expenses for the month
      const { data: monthlyExpenses, error: monthlyError } = await supabase
        .from('monthly_expenses')
        .select(`
          actual_paid,
          fixed_expenses (
            category,
            is_credit_card
          )
        `)
        .eq('month', formattedMonth);

      if (monthlyError) throw monthlyError;

      const { data: miscExpenses, error: miscError } = await supabase
        .from('misc_expenses')
        .select('category, amount')
        .eq('month', formattedMonth);

      if (miscError) throw miscError;

      // Calculate actual amounts by category
      const actualByCategory = new Map<string, number>();

      // Process monthly expenses
      (monthlyExpenses || []).forEach(exp => {
        const category = (exp.fixed_expenses as any)?.category || 'Unknown';
        const current = actualByCategory.get(category) || 0;
        actualByCategory.set(category, current + exp.actual_paid);
      });

      // Process misc expenses
      (miscExpenses || []).forEach(exp => {
        const current = actualByCategory.get(exp.category) || 0;
        actualByCategory.set(exp.category, current + exp.amount);
      });

      // Calculate variance for each planned item
      const varianceResults = plannedItems.map(item => {
        const actualAmount = actualByCategory.get(item.category) || 0;
        const variance = actualAmount - item.planned_amount;
        
        return {
          category: item.category,
          planned_amount: item.planned_amount,
          actual_paid: actualAmount,
          variance,
          variance_percentage: item.planned_amount > 0 ? (variance / item.planned_amount) * 100 : 0,
        };
      });

      // Optionally log the variance
      const varianceLogs = varianceResults.map(result => ({
        plan_id: plan.id,
        category: result.category,
        planned_amount: result.planned_amount,
        actual_paid: result.actual_paid,
        variance: result.variance,
        prompt: dto.prompt,
        created_at: new Date().toISOString(),
      }));

      // Insert variance logs
      const { error: logError } = await supabase
        .from('plan_variance_log')
        .insert(varianceLogs);

      if (logError) {
        console.warn('Failed to log variance:', logError);
      }

      return {
        success: true,
        data: {
          plan,
          variance_results: varianceResults,
          summary: {
            total_planned: plannedItems.reduce((sum, item) => sum + item.planned_amount, 0),
            total_actual: Array.from(actualByCategory.values()).reduce((sum, amount) => sum + amount, 0),
            total_variance: varianceResults.reduce((sum, result) => sum + result.variance, 0),
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to sync plan variance: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateExpensePlan(planId: string, dto: UpdatePlanDto) {
    try {
      const { data, error } = await supabase
        .from('expense_plans')
        .update(dto)
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update expense plan: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePlanActiveStatus(planId: string, isActive: boolean) {
    try {
      // If setting to active, first deactivate ALL other plans across ALL months
      if (isActive) {
        // Deactivate all other plans (regardless of month)
        await supabase
          .from('expense_plans')
          .update({ is_active: false })
          .neq('id', planId);
      }

      // Update the target plan
      const { data, error } = await supabase
        .from('expense_plans')
        .update({ is_active: isActive })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update plan active status: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPlanVarianceHistory(planId: string) {
    try {
      const { data, error } = await supabase
        .from('plan_variance_log')
        .select('*')
        .eq('plan_id', planId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get plan variance history: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Fixed Expenses
  async createFixedExpense(dto: CreateFixedExpenseDto) {
    try {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .insert([dto])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create fixed expense: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateFixedExpense(id: string, dto: UpdateFixedExpenseDto) {
    try {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .update(dto)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update fixed expense: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteFixedExpense(id: string) {
    try {
      const { error } = await supabase
        .from('fixed_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Fixed expense deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete fixed expense: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getFixedExpenses(options?: { 
    profileId?: string; 
    limit?: number; 
    offset?: number; 
  }) {
    try {
      let query = supabase
        .from('fixed_expenses')
        .select('*')
        .order('id', { ascending: false });

      if (options?.profileId) {
        query = query.eq('profile_id', options.profileId);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get fixed expenses: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Debt Payments
  async createDebtPayment(dto: CreateDebtPaymentDto) {
    try {
      const { data, error } = await supabase
        .from('debt_payments')
        .insert([dto])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create debt payment: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateDebtPayment(id: string, dto: UpdateDebtPaymentDto) {
    try {
      const { data, error } = await supabase
        .from('debt_payments')
        .update(dto)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update debt payment: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteDebtPayment(id: string) {
    try {
      const { error } = await supabase
        .from('debt_payments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Debt payment deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete debt payment: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getDebtPayments(options?: { 
    debtId?: number; 
    profileId?: string; 
    month?: string; 
    limit?: number; 
    offset?: number; 
  }) {
    try {
      let query = supabase
        .from('debt_payments')
        .select(`
          *,
          debt (
            id,
            name,
            debt_type
          )
        `)
        .order('payment_date', { ascending: false });

      if (options?.debtId) {
        query = query.eq('debt_id', options.debtId);
      }

      if (options?.profileId) {
        query = query.eq('profile_id', options.profileId);
      }

      if (options?.month) {
        const monthDate = new Date(options.month + '-01');
        const formattedMonth = monthDate.toISOString().split('T')[0];
        query = query.eq('payment_date', formattedMonth);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get debt payments: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Plan Items Management
  async createPlanItem(expensePlanId: string, dto: CreatePlanItemDto) {
    try {
      const { data, error } = await supabase
        .from('planned_expense_items')
        .insert([{ ...dto, expense_plan_id: parseInt(expensePlanId) }])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create plan item: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePlanItem(id: string, dto: UpdatePlanItemDto) {
    try {
      const { data, error } = await supabase
        .from('planned_expense_items')
        .update(dto)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update plan item: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deletePlanItem(id: string) {
    try {
      const { error } = await supabase
        .from('planned_expense_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Plan item deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete plan item: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Enhanced Monthly Expenses with new schema
  async getMonthlyExpensesByProfile(profileId: string, options?: { 
    month?: string; 
    limit?: number; 
    offset?: number; 
  }) {
    try {
      let query = supabase
        .from('monthly_expenses')
        .select(`
          *,
          fixed_expenses (
            id,
            category,
            amount,
            is_credit_card,
            notes
          ),
          debt (
            id,
            name,
            debt_type
          ),
          expense_plans (
            id,
            plan_name
          )
        `)
        .eq('profile_id', profileId)
        .order('month', { ascending: false });

      if (options?.month) {
        const monthDate = new Date(options.month + '-01');
        const formattedMonth = monthDate.toISOString().split('T')[0];
        query = query.eq('month', formattedMonth);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get monthly expenses: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteMonthlyExpense(id: string) {
    try {
      const { error } = await supabase
        .from('monthly_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Monthly expense deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete monthly expense: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Enhanced Monthly Summary with new schema
  async createMonthlySummary(dto: CreateMonthlySummaryDto) {
    try {
      // Convert month string (YYYY-MM) to proper date format for database
      const monthDate = new Date(dto.month + '-01');
      const formattedMonth = monthDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      const summaryData = {
        ...dto,
        month: formattedMonth,
      };

      const { data, error } = await supabase
        .from('monthly_summary')
        .insert([summaryData])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create monthly summary: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getMonthlySummariesByProfile(profileId: string, options?: { 
    limit?: number; 
    offset?: number; 
  }) {
    try {
      let query = supabase
        .from('monthly_summary')
        .select('*')
        .eq('profile_id', profileId)
        .order('month', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get monthly summaries: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Debt Summary
  async getDebtSummary(profileId: string) {
    try {
      const { data: debts, error: debtsError } = await supabase
        .from('debt')
        .select('*')
        .eq('profile_id', profileId);

      if (debtsError) throw debtsError;

      const { data: payments, error: paymentsError } = await supabase
        .from('debt_payments')
        .select('*')
        .eq('profile_id', profileId);

      if (paymentsError) throw paymentsError;

      const totalOutstanding = (debts || []).reduce((sum, debt) => {
        if (debt.outstanding_balance) {
          return sum + debt.outstanding_balance;
        }
        if (debt.total_due) {
          return sum + debt.total_due;
        }
        return sum;
      }, 0);

      const totalPayments = (payments || []).reduce((sum, payment) => sum + payment.amount, 0);

      return {
        success: true,
        data: {
          total_debts: debts?.length || 0,
          total_outstanding: totalOutstanding,
          total_payments: totalPayments,
          net_debt: totalOutstanding - totalPayments,
          debts: debts || [],
          recent_payments: payments?.slice(0, 5) || [],
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get debt summary: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Enhanced Misc Expenses with filtering
  async getMiscExpenses(options?: { 
    profileId?: string; 
    month?: string; 
    limit?: number; 
    offset?: number; 
  }) {
    try {
      let query = supabase
        .from('misc_expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.profileId) {
        query = query.eq('profile_id', options.profileId);
      }

      if (options?.month) {
        const monthDate = new Date(options.month + '-01');
        const formattedMonth = monthDate.toISOString().split('T')[0];
        query = query.eq('month', formattedMonth);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get misc expenses: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteMiscExpense(id: string) {
    try {
      const { error } = await supabase
        .from('misc_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Misc expense deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete misc expense: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Enhanced Debt Management
  async getDebtById(id: string) {
    try {
      const { data, error } = await supabase
        .from('debt')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get debt: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteDebt(id: string) {
    try {
      const { error } = await supabase
        .from('debt')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Debt deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete debt: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
} 