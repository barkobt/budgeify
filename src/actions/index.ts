/**
 * Server Actions Index
 *
 * 🎓 MENTOR NOTU - Barrel Export:
 * ------------------------------
 * Bu dosya "barrel export" pattern'i kullanır.
 * Tüm actions tek bir yerden import edilebilir:
 *
 * import { createIncome, getExpenses, getGoals } from '@/actions';
 */

// User Actions
export {
  getOrCreateUser,
  getCurrentUser,
  updateUserProfile,
} from './user';

// Income Actions
export {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
  getTotalIncomeThisMonth,
} from './income';

// Expense Actions
export {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getTotalExpensesThisMonth,
  getExpensesByCategory,
  getMonthlyExpenseSummary,
} from './expense';

// Goal Actions
export {
  getGoals,
  getActiveGoals,
  getGoalById,
  createGoal,
  updateGoal,
  addToGoal,
  deleteGoal,
  cancelGoal,
  getGoalStatistics,
  getDailySavingsNeeded,
} from './goal';

// Category Actions
export {
  seedDefaultCategories,
  getCategories,
  getExpenseCategories,
  getIncomeCategories,
  createCategory,
  deleteCategory,
} from './category';
