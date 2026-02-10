import { describe, it, expect, beforeEach } from 'vitest';
import {
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  resetAllMocks,
  mockDb,
  mockRevalidatePath,
} from '@/__tests__/mocks/setup';
import {
  getBudgetAlerts,
  createBudgetAlert,
  updateBudgetAlert,
  deleteBudgetAlert,
  checkBudgetAlerts,
} from './budget-alert';

beforeEach(() => {
  resetAllMocks();
});

// ========================================
// AUTH TESTS
// ========================================

describe('Budget Alert Actions — Auth', () => {
  it('getBudgetAlerts rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await getBudgetAlerts();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('createBudgetAlert rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await createBudgetAlert({
      name: 'Test',
      thresholdAmount: 5000,
      alertType: 'above_spending',
      period: 'monthly',
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('updateBudgetAlert rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await updateBudgetAlert('550e8400-e29b-41d4-a716-446655440000', { name: 'Updated' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('deleteBudgetAlert rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await deleteBudgetAlert('some-id');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('checkBudgetAlerts rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await checkBudgetAlerts();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });
});

// ========================================
// VALIDATION TESTS
// ========================================

describe('Budget Alert Actions — Validation', () => {
  it('createBudgetAlert rejects empty name', async () => {
    mockAuthenticatedUser();
    const result = await createBudgetAlert({
      name: '',
      thresholdAmount: 5000,
      alertType: 'above_spending',
      period: 'monthly',
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('createBudgetAlert rejects negative threshold', async () => {
    mockAuthenticatedUser();
    const result = await createBudgetAlert({
      name: 'Test',
      thresholdAmount: -100,
      alertType: 'above_spending',
      period: 'monthly',
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('createBudgetAlert rejects zero threshold', async () => {
    mockAuthenticatedUser();
    const result = await createBudgetAlert({
      name: 'Test',
      thresholdAmount: 0,
      alertType: 'above_spending',
      period: 'monthly',
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('updateBudgetAlert rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await updateBudgetAlert('not-a-uuid', { name: 'Updated' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz uyarı ID');
  });

  it('deleteBudgetAlert rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await deleteBudgetAlert('not-a-uuid');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz uyarı ID');
  });
});

// ========================================
// HAPPY PATH TESTS
// ========================================

describe('Budget Alert Actions — Happy Path', () => {
  it('getBudgetAlerts returns alerts list', async () => {
    mockAuthenticatedUser();
    const mockAlerts = [
      { id: 'a1', name: 'Aylık Limit', thresholdAmount: '10000', alertType: 'above_spending', period: 'monthly', isActive: true },
    ];
    mockDb.orderBy.mockResolvedValueOnce(mockAlerts);

    const result = await getBudgetAlerts();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockAlerts);
  });

  it('createBudgetAlert creates and returns alert', async () => {
    mockAuthenticatedUser();
    const mockCreated = { id: 'a-new', name: 'Aylık Limit', thresholdAmount: '10000', alertType: 'above_spending', period: 'monthly', isActive: true };
    mockDb.returning.mockResolvedValueOnce([mockCreated]);

    const result = await createBudgetAlert({
      name: 'Aylık Limit',
      thresholdAmount: 10000,
      alertType: 'above_spending',
      period: 'monthly',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockCreated);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('updateBudgetAlert updates existing alert', async () => {
    mockAuthenticatedUser();
    const alertId = '550e8400-e29b-41d4-a716-446655440000';
    const mockExisting = { id: alertId, name: 'Aylık Limit', isActive: true };
    const mockUpdated = { id: alertId, name: 'Haftalık Limit', isActive: true };
    // 2nd .limit() for ownership check
    mockDb.limit.mockResolvedValueOnce([mockExisting]);
    mockDb.returning.mockResolvedValueOnce([mockUpdated]);

    const result = await updateBudgetAlert(alertId, { name: 'Haftalık Limit' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe('Haftalık Limit');
    expect(mockRevalidatePath).toHaveBeenCalled();
  });

  it('deleteBudgetAlert deletes existing alert', async () => {
    mockAuthenticatedUser();
    const alertId = '550e8400-e29b-41d4-a716-446655440000';
    // 2nd .limit() for ownership check
    mockDb.limit.mockResolvedValueOnce([{ id: alertId }]);

    const result = await deleteBudgetAlert(alertId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.id).toBe(alertId);
    expect(mockRevalidatePath).toHaveBeenCalled();
  });

  it('checkBudgetAlerts returns empty when no active alerts', async () => {
    mockAuthenticatedUser();
    mockDb.where.mockReturnValueOnce(mockDb).mockResolvedValueOnce([]);

    const result = await checkBudgetAlerts();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual([]);
  });
});

// ========================================
// OWNERSHIP TESTS
// ========================================

describe('Budget Alert Actions — Ownership', () => {
  it('updateBudgetAlert rejects when alert not found', async () => {
    mockAuthenticatedUser();
    const alertId = '550e8400-e29b-41d4-a716-446655440000';
    // 2nd .limit() for ownership check returns empty
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await updateBudgetAlert(alertId, { name: 'Updated' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Bütçe uyarısı bulunamadı');
  });

  it('deleteBudgetAlert rejects when alert not found', async () => {
    mockAuthenticatedUser();
    const alertId = '550e8400-e29b-41d4-a716-446655440000';
    // 2nd .limit() for ownership check returns empty
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await deleteBudgetAlert(alertId);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Bütçe uyarısı bulunamadı');
  });
});

// ========================================
// ERROR HANDLING TESTS
// ========================================

describe('Budget Alert Actions — Error Handling', () => {
  it('getBudgetAlerts handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.orderBy.mockRejectedValueOnce(new Error('DB connection failed'));

    const result = await getBudgetAlerts();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Bütçe uyarıları yüklenirken bir hata oluştu');
  });

  it('createBudgetAlert handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.returning.mockRejectedValueOnce(new Error('Insert failed'));

    const result = await createBudgetAlert({
      name: 'Test',
      thresholdAmount: 5000,
      alertType: 'above_spending',
      period: 'monthly',
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Bütçe uyarısı eklenirken bir hata oluştu');
  });

  it('deleteBudgetAlert handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    const alertId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockRejectedValueOnce(new Error('DB failed'));

    const result = await deleteBudgetAlert(alertId);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Bütçe uyarısı silinirken bir hata oluştu');
  });
});
