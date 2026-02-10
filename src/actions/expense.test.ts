import { describe, it, expect, beforeEach } from 'vitest';
import {
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  resetAllMocks,
  mockDb,
  mockRevalidatePath,
} from '@/__tests__/mocks/setup';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from './expense';

beforeEach(() => {
  resetAllMocks();
});

// ========================================
// AUTH TESTS
// ========================================

describe('Expense Actions — Auth', () => {
  it('getExpenses rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await getExpenses();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('createExpense rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await createExpense({ amount: 100 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('deleteExpense rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await deleteExpense('some-id');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });
});

// ========================================
// VALIDATION TESTS
// ========================================

describe('Expense Actions — Validation', () => {
  it('createExpense rejects negative amount', async () => {
    mockAuthenticatedUser();
    const result = await createExpense({ amount: -50 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('createExpense rejects zero amount', async () => {
    mockAuthenticatedUser();
    const result = await createExpense({ amount: 0 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('getExpenseById rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await getExpenseById('not-a-uuid');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz gider ID');
  });

  it('deleteExpense rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await deleteExpense('not-a-uuid');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz gider ID');
  });

  it('updateExpense rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await updateExpense('not-a-uuid', { amount: 200 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz gider ID');
  });
});

// ========================================
// HAPPY PATH TESTS
// ========================================

describe('Expense Actions — Happy Path', () => {
  it('getExpenses returns expenses list', async () => {
    const userId = mockAuthenticatedUser();
    const mockExpenses = [
      { id: 'exp-1', userId, amount: '250', note: 'Market', date: new Date() },
    ];
    mockDb.orderBy.mockResolvedValueOnce(mockExpenses);

    const result = await getExpenses();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockExpenses);
  });

  it('createExpense creates and returns expense', async () => {
    mockAuthenticatedUser();
    const mockCreated = { id: 'exp-new', amount: '150', note: 'Kahve' };
    mockDb.returning.mockResolvedValueOnce([mockCreated]);

    const result = await createExpense({ amount: 150, note: 'Kahve' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockCreated);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('deleteExpense deletes existing expense', async () => {
    mockAuthenticatedUser();
    const expenseId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([{ id: expenseId }]);

    const result = await deleteExpense(expenseId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.id).toBe(expenseId);
    expect(mockRevalidatePath).toHaveBeenCalled();
  });

  it('updateExpense updates existing expense', async () => {
    mockAuthenticatedUser();
    const expenseId = '550e8400-e29b-41d4-a716-446655440000';
    const mockUpdated = { id: expenseId, amount: '300' };
    mockDb.limit.mockResolvedValueOnce([{ id: expenseId, amount: '150' }]);
    mockDb.returning.mockResolvedValueOnce([mockUpdated]);

    const result = await updateExpense(expenseId, { amount: 300 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockUpdated);
  });

  it('getExpenseById returns null when not found', async () => {
    mockAuthenticatedUser();
    const expenseId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await getExpenseById(expenseId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBeNull();
  });
});

// ========================================
// OWNERSHIP TESTS
// ========================================

describe('Expense Actions — Ownership', () => {
  it('deleteExpense rejects when not found (ownership fail)', async () => {
    mockAuthenticatedUser();
    const expenseId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await deleteExpense(expenseId);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Gider bulunamadı');
  });

  it('updateExpense rejects when not found (ownership fail)', async () => {
    mockAuthenticatedUser();
    const expenseId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await updateExpense(expenseId, { amount: 999 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Gider bulunamadı');
  });
});

// ========================================
// ERROR HANDLING TESTS
// ========================================

describe('Expense Actions — Error Handling', () => {
  it('getExpenses handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.orderBy.mockRejectedValueOnce(new Error('DB connection failed'));

    const result = await getExpenses();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Giderler yüklenirken bir hata oluştu');
  });

  it('createExpense handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.returning.mockRejectedValueOnce(new Error('Insert failed'));

    const result = await createExpense({ amount: 100 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Gider eklenirken bir hata oluştu');
  });
});
