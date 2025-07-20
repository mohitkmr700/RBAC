import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';
import {
  CreateMonthlyExpenseDto,
  UpdateMonthlyExpenseDto,
  CreateMiscExpenseDto,
  UpdateMiscExpenseDto,
  CreateCreditCardDto,
  UpdateCreditCardDto,
  CreateMonthlySummaryDto,
  UpdateMonthlySummaryDto,
  CreatePlanDto,
  SyncPlanDto,
  UpdatePlanDto,
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

  // Credit Cards
  async getAllCreditCards() {
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .order('card_name');

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get credit cards: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createCreditCard(dto: CreateCreditCardDto) {
    try {
      const { data, error } = await supabase
        .from('credit_cards')
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
        `Failed to create credit card: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateCreditCard(id: string, dto: UpdateCreditCardDto) {
    try {
      const { data, error } = await supabase
        .from('credit_cards')
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
        `Failed to update credit card: ${error.message}`,
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
      const totalCreditPaid = (monthlyExpenses || [])
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
        total_credit_paid: totalCreditPaid,
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

      // First, deactivate any existing active plans for this month
      await supabase
        .from('expense_plans')
        .update({ is_active: false })
        .eq('month', formattedMonth)
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
} 