/**
 * Budgeify - Integrated Zustand Store
 *
 * Centralized state management for income, expenses, goals, and categories.
 * Uses persist middleware for automatic localStorage synchronization.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Income, Expense, Goal, Category } from '@/types';
import { DEFAULT_CATEGORIES } from '@/constants/categories';

/**
 * Main Budget Store State Interface
 */
interface BudgetStoreState {
  // ==================== INCOME STATE ====================
  incomes: Income[];
  addIncome: (income: Income) => void;
  updateIncome: (id: string, updates: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  getMainSalary: () => Income | undefined;
  getTotalIncome: () => number;

  // ==================== EXPENSE STATE ====================
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getTotalExpenses: () => number;
  getExpensesByCategory: (categoryId: string) => Expense[];
  getExpensesByDateRange: (startDate: string, endDate: string) => Expense[];

  // ==================== GOAL STATE ====================
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];

  // ==================== CATEGORY STATE ====================
  categories: Category[];
  getCategoryById: (id: string) => Category | undefined;
  getActiveCategories: () => Category[];

  // ==================== UTILITY ACTIONS ====================
  getBalance: () => number;
  getSavingsRate: () => number;
  resetAll: () => void;
}

/**
 * Initial state
 */
const initialState = {
  incomes: [],
  expenses: [],
  goals: [],
  categories: DEFAULT_CATEGORIES,
};

/**
 * Main Budgeify Store
 */
export const useBudgetStore = create<BudgetStoreState>()(
  persist(
    (set, get) => ({
      // ==================== INITIAL STATE ====================
      ...initialState,

      // ==================== INCOME ACTIONS ====================
      addIncome: (income) =>
        set((state) => ({
          incomes: [...state.incomes, income],
        })),

      updateIncome: (id, updates) =>
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === id ? { ...income, ...updates, updatedAt: new Date().toISOString() } : income
          ),
        })),

      deleteIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        })),

      getMainSalary: () => {
        const { incomes } = get();
        return incomes.find((income) => income.type === 'salary' && income.category === 'salary');
      },

      getTotalIncome: () => {
        const { incomes } = get();
        return incomes.reduce((total, income) => total + income.amount, 0);
      },

      // ==================== EXPENSE ACTIONS ====================
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, expense],
        })),

      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updates, updatedAt: new Date().toISOString() } : expense
          ),
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      getTotalExpenses: () => {
        const { expenses } = get();
        return expenses.reduce((total, expense) => total + expense.amount, 0);
      },

      getExpensesByCategory: (categoryId) => {
        const { expenses } = get();
        return expenses.filter((expense) => expense.categoryId === categoryId);
      },

      getExpensesByDateRange: (startDate, endDate) => {
        const { expenses } = get();
        return expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
        });
      },

      // ==================== GOAL ACTIONS ====================
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, goal],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),

      getActiveGoals: () => {
        const { goals } = get();
        return goals.filter((goal) => goal.status === 'active');
      },

      getCompletedGoals: () => {
        const { goals } = get();
        return goals.filter((goal) => goal.status === 'completed');
      },

      // ==================== CATEGORY ACTIONS ====================
      getCategoryById: (id) => {
        const { categories } = get();
        return categories.find((category) => category.id === id);
      },

      getActiveCategories: () => {
        const { categories } = get();
        return categories.filter((category) => category.isActive);
      },

      // ==================== UTILITY ACTIONS ====================
      getBalance: () => {
        const { getTotalIncome, getTotalExpenses } = get();
        return getTotalIncome() - getTotalExpenses();
      },

      getSavingsRate: () => {
        const { getTotalIncome, getTotalExpenses } = get();
        const totalIncome = getTotalIncome();
        if (totalIncome === 0) return 0;
        const savings = totalIncome - getTotalExpenses();
        return Math.round((savings / totalIncome) * 100);
      },

      resetAll: () =>
        set(() => ({
          ...initialState,
        })),
    }),
    {
      name: 'budgeify-store', // localStorage key
      version: 1, // versioning for migrations
    }
  )
);

/**
 * USAGE EXAMPLES:
 *
 * import { useBudgetStore } from '@/store/useBudgetStore';
 * import { generateId, getCurrentISODate, getTodayDate } from '@/utils';
 *
 * // Add income
 * const { addIncome } = useBudgetStore();
 * addIncome({
 *   id: generateId(),
 *   type: 'salary',
 *   category: 'salary',
 *   amount: 25000,
 *   description: 'Aylık maaş',
 *   isRecurring: true,
 *   createdAt: getCurrentISODate(),
 *   updatedAt: getCurrentISODate(),
 * });
 *
 * // Add expense
 * const { addExpense } = useBudgetStore();
 * addExpense({
 *   id: generateId(),
 *   categoryId: 'cat_food',
 *   amount: 150,
 *   note: 'Öğle yemeği',
 *   date: getTodayDate(),
 *   createdAt: getCurrentISODate(),
 *   updatedAt: getCurrentISODate(),
 * });
 *
 * // Get balance
 * const { getBalance, getTotalIncome, getTotalExpenses } = useBudgetStore();
 * const balance = getBalance();
 * const totalIncome = getTotalIncome();
 * const totalExpenses = getTotalExpenses();
 *
 * // Get active categories
 * const { getActiveCategories } = useBudgetStore();
 * const activeCategories = getActiveCategories();
 */
