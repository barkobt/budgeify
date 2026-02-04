/**
 * Budgeify - Analytics Utility Functions
 *
 * Harcama analizi ve istatistik hesaplamaları için yardımcı fonksiyonlar.
 */

import type { Expense, Category, CategorySummary } from '@/types';

/**
 * Kategoriye göre harcamaları grupla ve topla
 */
export function groupExpensesByCategory(
  expenses: Expense[],
  categories: Category[]
): CategorySummary[] {
  const categoryTotals = expenses.reduce((acc, expense) => {
    const categoryId = expense.categoryId;
    acc[categoryId] = (acc[categoryId] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  return Object.entries(categoryTotals)
    .map(([categoryId, total]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || 'Bilinmeyen',
        total,
        percentage: totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0,
        color: category?.color || '#6B7280',
      };
    })
    .sort((a, b) => b.total - a.total);
}

/**
 * En çok harcama yapılan kategorileri getir
 */
export function getTopCategories(
  expenses: Expense[],
  categories: Category[],
  limit = 5
): CategorySummary[] {
  const grouped = groupExpensesByCategory(expenses, categories);
  return grouped.slice(0, limit);
}

/**
 * Belirli tarih aralığındaki harcamaları filtrele
 */
export function filterExpensesByDateRange(
  expenses: Expense[],
  startDate: string,
  endDate: string
): Expense[] {
  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
  });
}

/**
 * Bu ayın harcamalarını getir
 */
export function getCurrentMonthExpenses(expenses: Expense[]): Expense[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return filterExpensesByDateRange(
    expenses,
    startOfMonth.toISOString().split('T')[0],
    endOfMonth.toISOString().split('T')[0]
  );
}

/**
 * Günlük ortalama harcama hesapla
 */
export function calculateDailyAverage(expenses: Expense[], days: number): number {
  if (days <= 0 || expenses.length === 0) return 0;

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  return Math.round(total / days);
}

/**
 * Kategori bazında aylık trend hesapla (son N ay)
 */
export function calculateMonthlyTrend(
  expenses: Expense[],
  categoryId: string,
  months: number = 3
): { month: string; total: number }[] {
  const now = new Date();
  const trends: { month: string; total: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = targetDate.toLocaleDateString('tr-TR', {
      month: 'short',
      year: 'numeric',
    });

    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

    const monthExpenses = filterExpensesByDateRange(
      expenses.filter((e) => e.categoryId === categoryId),
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );

    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    trends.push({ month: monthName, total });
  }

  return trends;
}

/**
 * Haftalık harcama dağılımı (Pazartesi-Pazar)
 */
export function getWeeklyDistribution(expenses: Expense[]): Record<string, number> {
  const weekDays = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const distribution: Record<string, number> = {};

  weekDays.forEach((day) => {
    distribution[day] = 0;
  });

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const dayIndex = date.getDay();
    distribution[weekDays[dayIndex]] += expense.amount;
  });

  return distribution;
}

/**
 * Bütçe kullanım oranı hesapla
 */
export function calculateBudgetUsage(totalExpenses: number, budget: number): number {
  if (budget <= 0) return 0;
  return Math.min(Math.round((totalExpenses / budget) * 100), 100);
}

/**
 * Tasarruf hedefi için kalan süre ve gereken günlük tasarruf
 */
export function calculateSavingsGoal(
  currentAmount: number,
  targetAmount: number,
  targetDate?: string
): { remaining: number; daysLeft: number; dailySavingsNeeded: number } {
  const remaining = Math.max(targetAmount - currentAmount, 0);

  if (!targetDate) {
    return { remaining, daysLeft: 0, dailySavingsNeeded: 0 };
  }

  const now = new Date();
  const target = new Date(targetDate);
  const daysLeft = Math.max(
    Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );

  const dailySavingsNeeded = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining;

  return { remaining, daysLeft, dailySavingsNeeded };
}
