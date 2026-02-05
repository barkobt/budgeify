/**
 * Oracle AI — Data Access Layer (C-001)
 *
 * Reads from Zustand store and structures data for analysis.
 * All reads are from client-side state (Zustand).
 */

import { useBudgetStore } from '@/store/useBudgetStore';
import type { Income, Expense, Goal, Category } from '@/types';

export interface FinancialSnapshot {
  incomes: Income[];
  expenses: Expense[];
  goals: Goal[];
  categories: Category[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  currentMonthExpenses: Expense[];
  previousMonthExpenses: Expense[];
  activeGoals: Goal[];
  dataAvailability: DataAvailability;
}

export interface DataAvailability {
  hasIncomes: boolean;
  hasExpenses: boolean;
  hasGoals: boolean;
  incomeCount: number;
  expenseCount: number;
  goalCount: number;
  oldestExpenseDate: string | null;
  dataSpanDays: number;
}

function getMonthExpenses(expenses: Expense[], monthOffset: number): Expense[] {
  const now = new Date();
  const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 1);

  return expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= targetMonth && d < nextMonth;
  });
}

export function getFinancialSnapshot(): FinancialSnapshot {
  const state = useBudgetStore.getState();

  const totalIncome = state.getTotalIncome();
  const totalExpenses = state.getTotalExpenses();
  const balance = state.getBalance();
  const savingsRate = state.getSavingsRate();
  const activeGoals = state.getActiveGoals();

  const currentMonthExpenses = getMonthExpenses(state.expenses, 0);
  const previousMonthExpenses = getMonthExpenses(state.expenses, -1);

  const sortedExpenses = [...state.expenses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const oldestDate = sortedExpenses[0]?.date ?? null;
  const dataSpanDays = oldestDate
    ? Math.ceil((Date.now() - new Date(oldestDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    incomes: state.incomes,
    expenses: state.expenses,
    goals: state.goals,
    categories: state.categories,
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    currentMonthExpenses,
    previousMonthExpenses,
    activeGoals,
    dataAvailability: {
      hasIncomes: state.incomes.length > 0,
      hasExpenses: state.expenses.length > 0,
      hasGoals: state.goals.length > 0,
      incomeCount: state.incomes.length,
      expenseCount: state.expenses.length,
      goalCount: state.goals.length,
      oldestExpenseDate: oldestDate,
      dataSpanDays,
    },
  };
}
