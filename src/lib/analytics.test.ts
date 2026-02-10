import { describe, it, expect } from 'vitest';
import type { Expense, Category } from '@/types';
import {
  groupExpensesByCategory,
  getTopCategories,
  filterExpensesByDateRange,
  calculateDailyAverage,
  getWeeklyDistribution,
  calculateBudgetUsage,
  calculateSavingsGoal,
} from './analytics';

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Yemek', icon: 'Pizza', color: '#EF4444', isDefault: true, isActive: true },
  { id: 'cat-2', name: 'Ulaşım', icon: 'Car', color: '#3B82F6', isDefault: true, isActive: true },
  { id: 'cat-3', name: 'Market', icon: 'ShoppingCart', color: '#22C55E', isDefault: true, isActive: true },
];

function createExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: 'exp-1',
    categoryId: 'cat-1',
    amount: 100,
    date: '2026-02-05',
    status: 'completed',
    createdAt: '2026-02-05T00:00:00Z',
    updatedAt: '2026-02-05T00:00:00Z',
    ...overrides,
  };
}

describe('groupExpensesByCategory', () => {
  it('groups expenses by category with correct totals', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', categoryId: 'cat-1', amount: 100 }),
      createExpense({ id: 'e2', categoryId: 'cat-1', amount: 200 }),
      createExpense({ id: 'e3', categoryId: 'cat-2', amount: 50 }),
    ];

    const result = groupExpensesByCategory(expenses, mockCategories);

    expect(result).toHaveLength(2);
    expect(result[0].categoryName).toBe('Yemek');
    expect(result[0].total).toBe(300);
    expect(result[1].categoryName).toBe('Ulaşım');
    expect(result[1].total).toBe(50);
  });

  it('calculates correct percentages', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', categoryId: 'cat-1', amount: 75 }),
      createExpense({ id: 'e2', categoryId: 'cat-2', amount: 25 }),
    ];

    const result = groupExpensesByCategory(expenses, mockCategories);

    expect(result[0].percentage).toBe(75);
    expect(result[1].percentage).toBe(25);
  });

  it('sorts by total descending', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', categoryId: 'cat-2', amount: 500 }),
      createExpense({ id: 'e2', categoryId: 'cat-1', amount: 100 }),
      createExpense({ id: 'e3', categoryId: 'cat-3', amount: 300 }),
    ];

    const result = groupExpensesByCategory(expenses, mockCategories);

    expect(result[0].total).toBe(500);
    expect(result[1].total).toBe(300);
    expect(result[2].total).toBe(100);
  });

  it('returns empty array for no expenses', () => {
    const result = groupExpensesByCategory([], mockCategories);
    expect(result).toHaveLength(0);
  });

  it('uses "Bilinmeyen" for unknown category', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', categoryId: 'unknown-id', amount: 50 }),
    ];

    const result = groupExpensesByCategory(expenses, mockCategories);
    expect(result[0].categoryName).toBe('Bilinmeyen');
  });
});

describe('getTopCategories', () => {
  it('returns top N categories', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', categoryId: 'cat-1', amount: 100 }),
      createExpense({ id: 'e2', categoryId: 'cat-2', amount: 50 }),
      createExpense({ id: 'e3', categoryId: 'cat-3', amount: 200 }),
    ];

    const result = getTopCategories(expenses, mockCategories, 2);
    expect(result).toHaveLength(2);
    expect(result[0].total).toBe(200);
    expect(result[1].total).toBe(100);
  });

  it('defaults to top 5', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', categoryId: 'cat-1', amount: 100 }),
    ];

    const result = getTopCategories(expenses, mockCategories);
    expect(result.length).toBeLessThanOrEqual(5);
  });
});

describe('filterExpensesByDateRange', () => {
  it('filters expenses within date range', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', date: '2026-01-15' }),
      createExpense({ id: 'e2', date: '2026-02-05' }),
      createExpense({ id: 'e3', date: '2026-03-01' }),
    ];

    const result = filterExpensesByDateRange(expenses, '2026-02-01', '2026-02-28');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('e2');
  });

  it('includes boundary dates', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', date: '2026-02-01' }),
      createExpense({ id: 'e2', date: '2026-02-28' }),
    ];

    const result = filterExpensesByDateRange(expenses, '2026-02-01', '2026-02-28');
    expect(result).toHaveLength(2);
  });

  it('returns empty for no matching expenses', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', date: '2026-01-01' }),
    ];

    const result = filterExpensesByDateRange(expenses, '2026-02-01', '2026-02-28');
    expect(result).toHaveLength(0);
  });
});

describe('calculateDailyAverage', () => {
  it('calculates correct daily average', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', amount: 300 }),
      createExpense({ id: 'e2', amount: 200 }),
    ];

    expect(calculateDailyAverage(expenses, 10)).toBe(50);
  });

  it('returns 0 for zero days', () => {
    const expenses: Expense[] = [createExpense()];
    expect(calculateDailyAverage(expenses, 0)).toBe(0);
  });

  it('returns 0 for empty expenses', () => {
    expect(calculateDailyAverage([], 10)).toBe(0);
  });
});

describe('getWeeklyDistribution', () => {
  it('distributes expenses across weekdays', () => {
    const expenses: Expense[] = [
      createExpense({ id: 'e1', date: '2026-02-09', amount: 100 }), // Monday
      createExpense({ id: 'e2', date: '2026-02-10', amount: 200 }), // Tuesday
    ];

    const result = getWeeklyDistribution(expenses);
    expect(result['Pzt']).toBe(100);
    expect(result['Sal']).toBe(200);
    expect(result['Çar']).toBe(0);
  });

  it('initializes all days to 0', () => {
    const result = getWeeklyDistribution([]);
    expect(Object.keys(result)).toHaveLength(7);
    Object.values(result).forEach((val) => expect(val).toBe(0));
  });
});

describe('calculateBudgetUsage', () => {
  it('calculates correct percentage', () => {
    expect(calculateBudgetUsage(500, 1000)).toBe(50);
  });

  it('caps at 100%', () => {
    expect(calculateBudgetUsage(1500, 1000)).toBe(100);
  });

  it('returns 0 for zero budget', () => {
    expect(calculateBudgetUsage(500, 0)).toBe(0);
  });

  it('returns 0 for negative budget', () => {
    expect(calculateBudgetUsage(500, -100)).toBe(0);
  });
});

describe('calculateSavingsGoal', () => {
  it('calculates remaining amount', () => {
    const result = calculateSavingsGoal(3000, 10000);
    expect(result.remaining).toBe(7000);
  });

  it('remaining is 0 when current exceeds target', () => {
    const result = calculateSavingsGoal(12000, 10000);
    expect(result.remaining).toBe(0);
  });

  it('returns 0 daysLeft and dailySavingsNeeded when no target date', () => {
    const result = calculateSavingsGoal(5000, 10000);
    expect(result.daysLeft).toBe(0);
    expect(result.dailySavingsNeeded).toBe(0);
  });

  it('calculates daily savings needed with target date', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 100);
    const result = calculateSavingsGoal(0, 10000, futureDate.toISOString());
    expect(result.daysLeft).toBe(100);
    expect(result.dailySavingsNeeded).toBe(100);
  });

  it('handles past target date', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    const result = calculateSavingsGoal(5000, 10000, pastDate.toISOString());
    expect(result.daysLeft).toBe(0);
    expect(result.dailySavingsNeeded).toBe(5000);
  });
});
