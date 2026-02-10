import { describe, it, expect, beforeEach } from 'vitest';
import {
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  resetAllMocks,
  mockDb,
  mockRevalidatePath,
} from '@/__tests__/mocks/setup';
import {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
} from './income';

beforeEach(() => {
  resetAllMocks();
});

// ========================================
// AUTH TESTS (applies to all actions)
// ========================================

describe('Income Actions — Auth', () => {
  it('getIncomes rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await getIncomes();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('createIncome rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await createIncome({ amount: 100 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('deleteIncome rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await deleteIncome('some-id');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });
});

// ========================================
// VALIDATION TESTS
// ========================================

describe('Income Actions — Validation', () => {
  it('createIncome rejects negative amount', async () => {
    mockAuthenticatedUser();
    const result = await createIncome({ amount: -100 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('createIncome rejects zero amount', async () => {
    mockAuthenticatedUser();
    const result = await createIncome({ amount: 0 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('getIncomeById rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await getIncomeById('not-a-uuid');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz gelir ID');
  });

  it('deleteIncome rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await deleteIncome('not-a-uuid');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz gelir ID');
  });

  it('updateIncome rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await updateIncome('not-a-uuid', { amount: 200 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz gelir ID');
  });
});

// ========================================
// HAPPY PATH TESTS
// ========================================

describe('Income Actions — Happy Path', () => {
  it('getIncomes returns incomes list', async () => {
    const userId = mockAuthenticatedUser();
    const mockIncomes = [
      { id: 'inc-1', userId, amount: '1000', description: 'Maaş', date: new Date() },
    ];

    // resolveUserId returns user, then getIncomes query
    mockDb.orderBy.mockResolvedValueOnce(mockIncomes);

    const result = await getIncomes();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockIncomes);
  });

  it('createIncome creates and returns income', async () => {
    mockAuthenticatedUser();
    const mockCreated = { id: 'inc-new', amount: '500', description: 'Freelance' };
    mockDb.returning.mockResolvedValueOnce([mockCreated]);

    const result = await createIncome({ amount: 500, description: 'Freelance' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockCreated);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('deleteIncome deletes existing income', async () => {
    mockAuthenticatedUser();
    const incomeId = '550e8400-e29b-41d4-a716-446655440000';

    // Ownership check returns existing
    mockDb.limit.mockResolvedValueOnce([{ id: incomeId }]);

    const result = await deleteIncome(incomeId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.id).toBe(incomeId);
    expect(mockRevalidatePath).toHaveBeenCalled();
  });

  it('updateIncome updates existing income', async () => {
    mockAuthenticatedUser();
    const incomeId = '550e8400-e29b-41d4-a716-446655440000';
    const mockUpdated = { id: incomeId, amount: '750' };

    // Ownership check
    mockDb.limit.mockResolvedValueOnce([{ id: incomeId, amount: '500' }]);
    // Update returning
    mockDb.returning.mockResolvedValueOnce([mockUpdated]);

    const result = await updateIncome(incomeId, { amount: 750 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockUpdated);
  });

  it('getIncomeById returns null when not found', async () => {
    mockAuthenticatedUser();
    const incomeId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await getIncomeById(incomeId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBeNull();
  });
});

// ========================================
// OWNERSHIP TESTS
// ========================================

describe('Income Actions — Ownership', () => {
  it('deleteIncome rejects when income not found (ownership fail)', async () => {
    mockAuthenticatedUser();
    const incomeId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([]); // No ownership match

    const result = await deleteIncome(incomeId);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Gelir bulunamadı');
  });

  it('updateIncome rejects when income not found (ownership fail)', async () => {
    mockAuthenticatedUser();
    const incomeId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([]); // No ownership match

    const result = await updateIncome(incomeId, { amount: 999 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Gelir bulunamadı');
  });
});

// ========================================
// ERROR HANDLING TESTS
// ========================================

describe('Income Actions — Error Handling', () => {
  it('getIncomes handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.orderBy.mockRejectedValueOnce(new Error('DB connection failed'));

    const result = await getIncomes();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Gelirler yüklenirken bir hata oluştu');
  });

  it('createIncome handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.returning.mockRejectedValueOnce(new Error('Insert failed'));

    const result = await createIncome({ amount: 100 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Gelir eklenirken bir hata oluştu');
  });

  it('createIncome returns failure result when user resolution throws', async () => {
    mockAuthenticatedUser();
    mockDb.limit.mockRejectedValueOnce(new Error('User lookup failed'));

    const result = await createIncome({ amount: 100 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Kullanıcı doğrulanamadı');
  });
});
