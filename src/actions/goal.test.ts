import { describe, it, expect, beforeEach } from 'vitest';
import {
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  resetAllMocks,
  mockDb,
  mockRevalidatePath,
  mockWhereTerminalQuery,
} from '@/__tests__/mocks/setup';
import {
  getGoals,
  getGoalById,
  createGoal,
  addToGoal,
  deleteGoal,
  getGoalStatistics,
} from './goal';

beforeEach(() => {
  resetAllMocks();
});

// ========================================
// AUTH TESTS
// ========================================

describe('Goal Actions — Auth', () => {
  it('getGoals rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await getGoals();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('createGoal rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await createGoal({ name: 'Test', targetAmount: 1000, icon: 'Star' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('deleteGoal rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await deleteGoal('some-id');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('addToGoal rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await addToGoal('some-id', 100);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });
});

// ========================================
// VALIDATION TESTS
// ========================================

describe('Goal Actions — Validation', () => {
  it('createGoal rejects empty name', async () => {
    mockAuthenticatedUser();
    const result = await createGoal({ name: '', targetAmount: 1000, icon: 'Star' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('createGoal rejects negative targetAmount', async () => {
    mockAuthenticatedUser();
    const result = await createGoal({ name: 'Araba', targetAmount: -500, icon: 'Car' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('createGoal rejects zero targetAmount', async () => {
    mockAuthenticatedUser();
    const result = await createGoal({ name: 'Araba', targetAmount: 0, icon: 'Car' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('getGoalById rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await getGoalById('not-a-uuid');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz hedef ID');
  });

  it('deleteGoal rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await deleteGoal('not-a-uuid');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz hedef ID');
  });

  it('addToGoal rejects negative amount', async () => {
    mockAuthenticatedUser();
    const goalId = '550e8400-e29b-41d4-a716-446655440000';
    const result = await addToGoal(goalId, -100);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz tutar');
  });

  it('addToGoal rejects zero amount', async () => {
    mockAuthenticatedUser();
    const goalId = '550e8400-e29b-41d4-a716-446655440000';
    const result = await addToGoal(goalId, 0);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz tutar');
  });
});

// ========================================
// HAPPY PATH TESTS
// ========================================

describe('Goal Actions — Happy Path', () => {
  it('getGoals returns goals list', async () => {
    const userId = mockAuthenticatedUser();
    const mockGoals = [
      { id: 'goal-1', userId, name: 'Araba', targetAmount: '50000', currentAmount: '10000', status: 'active' },
    ];
    mockDb.orderBy.mockResolvedValueOnce(mockGoals);

    const result = await getGoals();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockGoals);
  });

  it('createGoal creates and returns goal', async () => {
    mockAuthenticatedUser();
    const mockCreated = { id: 'goal-new', name: 'Tatil', targetAmount: '10000', currentAmount: '0', status: 'active' };
    mockDb.returning.mockResolvedValueOnce([mockCreated]);

    const result = await createGoal({ name: 'Tatil', targetAmount: 10000, icon: 'Plane' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockCreated);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('addToGoal adds amount and keeps active when below target', async () => {
    mockAuthenticatedUser();
    const goalId = '550e8400-e29b-41d4-a716-446655440000';
    const mockUpdated = { id: goalId, currentAmount: '600', status: 'active' };
    mockDb.limit.mockResolvedValueOnce([{ id: goalId, currentAmount: '500', targetAmount: '10000' }]);
    mockDb.returning.mockResolvedValueOnce([mockUpdated]);

    const result = await addToGoal(goalId, 100);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe('active');
  });

  it('addToGoal completes goal when reaching target', async () => {
    mockAuthenticatedUser();
    const goalId = '550e8400-e29b-41d4-a716-446655440000';
    const mockUpdated = { id: goalId, currentAmount: '10000', status: 'completed' };
    mockDb.limit.mockResolvedValueOnce([{ id: goalId, currentAmount: '9500', targetAmount: '10000' }]);
    mockDb.returning.mockResolvedValueOnce([mockUpdated]);

    const result = await addToGoal(goalId, 500);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe('completed');
  });

  it('deleteGoal deletes existing goal', async () => {
    mockAuthenticatedUser();
    const goalId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([{ id: goalId }]);

    const result = await deleteGoal(goalId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.id).toBe(goalId);
    expect(mockRevalidatePath).toHaveBeenCalled();
  });

  it('getGoalById returns null when not found', async () => {
    mockAuthenticatedUser();
    const goalId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await getGoalById(goalId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBeNull();
  });

  it('getGoalStatistics calculates stats correctly', async () => {
    mockAuthenticatedUser();
    const mockGoals = [
      { id: 'g1', status: 'active', targetAmount: '10000', currentAmount: '5000' },
      { id: 'g2', status: 'active', targetAmount: '20000', currentAmount: '10000' },
      { id: 'g3', status: 'completed', targetAmount: '5000', currentAmount: '5000' },
    ];
    // getGoalStatistics: select().from().where() — .where() is terminal
    mockWhereTerminalQuery(mockGoals);

    const result = await getGoalStatistics();
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalGoals).toBe(3);
      expect(result.data.activeGoals).toBe(2);
      expect(result.data.completedGoals).toBe(1);
      expect(result.data.totalTarget).toBe(30000);
      expect(result.data.totalCurrent).toBe(15000);
      expect(result.data.overallProgress).toBe(50);
    }
  });
});

// ========================================
// OWNERSHIP TESTS
// ========================================

describe('Goal Actions — Ownership', () => {
  it('deleteGoal rejects when not found', async () => {
    mockAuthenticatedUser();
    const goalId = '550e8400-e29b-41d4-a716-446655440000';
    // 2nd .limit() call (after resolveUserId) for ownership check
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await deleteGoal(goalId);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Hedef bulunamadı');
  });

  it('addToGoal rejects when goal not found', async () => {
    mockAuthenticatedUser();
    const goalId = '550e8400-e29b-41d4-a716-446655440000';
    // 2nd .limit() call (after resolveUserId) for ownership check
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await addToGoal(goalId, 100);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Hedef bulunamadı');
  });
});

// ========================================
// ERROR HANDLING TESTS
// ========================================

describe('Goal Actions — Error Handling', () => {
  it('getGoals handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.orderBy.mockRejectedValueOnce(new Error('DB connection failed'));

    const result = await getGoals();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Hedefler yüklenirken bir hata oluştu');
  });

  it('createGoal handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.returning.mockRejectedValueOnce(new Error('Insert failed'));

    const result = await createGoal({ name: 'Test', targetAmount: 1000, icon: 'Star' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('hata');
  });
});
