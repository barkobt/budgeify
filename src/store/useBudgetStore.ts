/**
 * Budgeify - Integrated Zustand Store
 *
 * Centralized state management for income, expenses, goals, and categories.
 * Uses persist middleware for automatic localStorage synchronization.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Income, Expense, Goal, Category, CurrencyCode } from '@/types';
import { DEFAULT_CATEGORIES } from '@/constants/categories';

/**
 * Main Budget Store State Interface
 */
/** Server category shape (UUID id + name) */
export interface ServerCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

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
  addToGoal: (id: string, amount: number) => void;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];

  // ==================== CATEGORY STATE ====================
  categories: Category[];
  serverCategories: ServerCategory[];
  setServerCategories: (cats: ServerCategory[]) => void;
  getCategoryById: (id: string) => Category | undefined;
  getActiveCategories: () => Category[];
  resolveServerCategoryId: (localIdOrName: string) => string | undefined;

  // ==================== MONTH NAVIGATION ====================
  selectedMonth: { year: number; month: number };
  setSelectedMonth: (year: number, month: number) => void;
  getMonthlyIncomes: () => Income[];
  getMonthlyExpenses: () => Expense[];
  getMonthlyBalance: () => number;

  // ==================== CURRENCY STATE ====================
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;

  // ==================== SEARCH ====================
  searchAll: (query: string) => Array<{ type: 'income' | 'expense' | 'goal'; id: string; label: string; amount: number; date?: string; categoryName?: string }>;

  // ==================== UTILITY ACTIONS ====================
  getBalance: () => number;
  getSavingsRate: () => number;
  resetAll: () => void;
}

/**
 * Initial state
 */
const now = new Date();
const initialState = {
  incomes: [] as Income[],
  expenses: [] as Expense[],
  goals: [] as Goal[],
  categories: DEFAULT_CATEGORIES,
  serverCategories: [] as ServerCategory[],
  currency: 'TRY' as CurrencyCode,
  selectedMonth: { year: now.getFullYear(), month: now.getMonth() },
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

      addToGoal: (id, amount) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, currentAmount: goal.currentAmount + amount }
              : goal
          ),
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
      setServerCategories: (cats) =>
        set(() => ({ serverCategories: cats })),

      getCategoryById: (id) => {
        const { categories, serverCategories } = get();
        const local = categories.find((category) => category.id === id);
        if (local) return local;
        const server = serverCategories.find((c) => c.id === id);
        if (server) return { id: server.id, name: server.name, icon: server.icon, color: server.color, isDefault: true, isActive: true };
        return undefined;
      },

      getActiveCategories: () => {
        const { categories } = get();
        return categories.filter((category) => category.isActive);
      },

      resolveServerCategoryId: (localIdOrName) => {
        const { serverCategories } = get();
        const byId = serverCategories.find((c) => c.id === localIdOrName);
        if (byId) return byId.id;
        const localCat = DEFAULT_CATEGORIES.find((c) => c.id === localIdOrName);
        const nameToFind = localCat ? localCat.name : localIdOrName;
        const byName = serverCategories.find((c) => c.name === nameToFind);
        return byName?.id;
      },

      // ==================== MONTH NAVIGATION ====================
      setSelectedMonth: (year, month) =>
        set(() => ({ selectedMonth: { year, month } })),

      getMonthlyIncomes: () => {
        const { incomes, selectedMonth } = get();
        return incomes.filter((inc) => {
          const d = new Date(inc.date);
          return d.getFullYear() === selectedMonth.year && d.getMonth() === selectedMonth.month;
        });
      },

      getMonthlyExpenses: () => {
        const { expenses, selectedMonth } = get();
        return expenses.filter((exp) => {
          const d = new Date(exp.date);
          return d.getFullYear() === selectedMonth.year && d.getMonth() === selectedMonth.month;
        });
      },

      getMonthlyBalance: () => {
        const { getMonthlyIncomes, getMonthlyExpenses } = get();
        const monthIncome = getMonthlyIncomes().reduce((s, i) => s + i.amount, 0);
        const monthExpense = getMonthlyExpenses().reduce((s, e) => s + e.amount, 0);
        return monthIncome - monthExpense;
      },

      // ==================== CURRENCY ACTIONS ====================
      setCurrency: (currency) =>
        set(() => ({ currency })),

      // ==================== SEARCH ====================
      searchAll: (query) => {
        const q = query.toLowerCase().trim();
        if (!q) return [];
        const { incomes, expenses, goals, getCategoryById: getCat } = get();
        const results: Array<{ type: 'income' | 'expense' | 'goal'; id: string; label: string; amount: number; date?: string; categoryName?: string }> = [];

        incomes.forEach((inc) => {
          const desc = inc.description || '';
          if (desc.toLowerCase().includes(q) || inc.category.toLowerCase().includes(q)) {
            results.push({ type: 'income', id: inc.id, label: desc || 'Gelir', amount: inc.amount, date: inc.date, categoryName: inc.category });
          }
        });

        expenses.forEach((exp) => {
          const cat = getCat(exp.categoryId);
          const note = exp.note || '';
          const catName = cat?.name || '';
          if (note.toLowerCase().includes(q) || catName.toLowerCase().includes(q)) {
            results.push({ type: 'expense', id: exp.id, label: note || catName || 'Gider', amount: exp.amount, date: exp.date, categoryName: catName });
          }
        });

        goals.forEach((g) => {
          if (g.name.toLowerCase().includes(q)) {
            results.push({ type: 'goal', id: g.id, label: g.name, amount: g.targetAmount });
          }
        });

        return results;
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
      name: 'budgeify-store',
      version: 3,
      skipHydration: true,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 2) {
          // v2: Migrate Category.emoji → Category.icon
          const cats = state.categories as Array<Record<string, unknown>> | undefined;
          if (cats) {
            state.categories = cats.map((cat) => {
              if ('emoji' in cat && !('icon' in cat)) {
                const { emoji, ...rest } = cat;
                return { ...rest, icon: emoji };
              }
              return cat;
            });
          }
        }
        if (version < 3) {
          // v3: Add date + status to existing incomes/expenses
          const incs = state.incomes as Array<Record<string, unknown>> | undefined;
          if (incs) {
            state.incomes = incs.map((inc) => ({
              ...inc,
              date: inc.date || inc.createdAt || new Date().toISOString(),
              status: inc.status || 'completed',
            }));
          }
          const exps = state.expenses as Array<Record<string, unknown>> | undefined;
          if (exps) {
            state.expenses = exps.map((exp) => ({
              ...exp,
              status: exp.status || 'completed',
            }));
          }
          state.serverCategories = [];
          const n = new Date();
          state.selectedMonth = { year: n.getFullYear(), month: n.getMonth() };
        }
        return state as unknown as BudgetStoreState;
      },
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
