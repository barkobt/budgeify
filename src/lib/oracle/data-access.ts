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

function getMonthExpensesAbsolute(expenses: Expense[], year: number, month: number): Expense[] {
  const targetMonth = new Date(year, month, 1);
  const nextMonth = new Date(year, month + 1, 1);
  return expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= targetMonth && d < nextMonth;
  });
}

function getMonthIncomesAbsolute(incomes: Income[], year: number, month: number): Income[] {
  const targetMonth = new Date(year, month, 1);
  const nextMonth = new Date(year, month + 1, 1);
  return incomes.filter((inc) => {
    const d = new Date(inc.date);
    return d >= targetMonth && d < nextMonth;
  });
}

export function getFinancialSnapshot(month?: { year: number; month: number }): FinancialSnapshot {
  const state = useBudgetStore.getState();

  const activeGoals = state.getActiveGoals();

  let currentMonthExpenses: Expense[];
  let previousMonthExpenses: Expense[];
  let currentMonthIncomes: Income[];

  if (month) {
    currentMonthExpenses = getMonthExpensesAbsolute(state.expenses, month.year, month.month);
    const prevMonth = month.month === 0 ? 11 : month.month - 1;
    const prevYear = month.month === 0 ? month.year - 1 : month.year;
    previousMonthExpenses = getMonthExpensesAbsolute(state.expenses, prevYear, prevMonth);
    currentMonthIncomes = getMonthIncomesAbsolute(state.incomes, month.year, month.month);
  } else {
    currentMonthExpenses = getMonthExpenses(state.expenses, 0);
    previousMonthExpenses = getMonthExpenses(state.expenses, -1);
    currentMonthIncomes = state.incomes; // all-time fallback when no month specified
  }

  const totalIncome = month
    ? currentMonthIncomes.reduce((s, i) => s + i.amount, 0)
    : state.getTotalIncome();
  const totalExpenses = month
    ? currentMonthExpenses.reduce((s, e) => s + e.amount, 0)
    : state.getTotalExpenses();
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const sortedExpenses = [...state.expenses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const oldestDate = sortedExpenses[0]?.date ?? null;
  const dataSpanDays = oldestDate
    ? Math.ceil((Date.now() - new Date(oldestDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    incomes: month ? currentMonthIncomes : state.incomes,
    expenses: month ? currentMonthExpenses : state.expenses,
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
