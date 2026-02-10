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
  getCategories,
  getExpenseCategories,
  getIncomeCategories,
  createCategory,
  deleteCategory,
  seedDefaultCategories,
} from './category';

beforeEach(() => {
  resetAllMocks();
});

// ========================================
// AUTH TESTS
// ========================================

describe('Category Actions — Auth', () => {
  it('getCategories rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await getCategories();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('createCategory rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await createCategory({ name: 'Test', icon: 'Star', color: '#FF0000', type: 'expense' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('deleteCategory rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await deleteCategory('some-id');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });
});

// ========================================
// VALIDATION TESTS
// ========================================

describe('Category Actions — Validation', () => {
  it('createCategory rejects empty name', async () => {
    mockAuthenticatedUser();
    const result = await createCategory({ name: '', icon: 'Star', color: '#FF0000', type: 'expense' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('createCategory rejects empty icon', async () => {
    mockAuthenticatedUser();
    const result = await createCategory({ name: 'Test', icon: '', color: '#FF0000', type: 'expense' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('deleteCategory rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await deleteCategory('not-a-uuid');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz kategori ID');
  });
});

// ========================================
// HAPPY PATH TESTS
// ========================================

describe('Category Actions — Happy Path', () => {
  it('getCategories returns all categories (default + user)', async () => {
    mockAuthenticatedUser();
    const mockCats = [
      { id: 'c1', name: 'Yemek', type: 'expense', isDefault: true },
      { id: 'c2', name: 'Custom', type: 'expense', isDefault: false },
    ];
    mockWhereTerminalQuery(mockCats);

    const result = await getCategories();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockCats);
  });

  it('getCategories filters by type when specified', async () => {
    mockAuthenticatedUser();
    const mockCats = [
      { id: 'c1', name: 'Yemek', type: 'expense', isDefault: true },
      { id: 'c2', name: 'Maaş', type: 'income', isDefault: true },
    ];
    mockWhereTerminalQuery(mockCats);

    const result = await getCategories('income');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Maaş');
    }
  });

  it('getExpenseCategories delegates to getCategories with expense type', async () => {
    mockAuthenticatedUser();
    const mockCats = [
      { id: 'c1', name: 'Yemek', type: 'expense', isDefault: true },
    ];
    mockWhereTerminalQuery(mockCats);

    const result = await getExpenseCategories();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toHaveLength(1);
  });

  it('getIncomeCategories delegates to getCategories with income type', async () => {
    mockAuthenticatedUser();
    const mockCats = [
      { id: 'c1', name: 'Maaş', type: 'income', isDefault: true },
    ];
    mockWhereTerminalQuery(mockCats);

    const result = await getIncomeCategories();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toHaveLength(1);
  });

  it('createCategory creates a custom category', async () => {
    mockAuthenticatedUser();
    const mockCreated = { id: 'c-new', name: 'Hobi', icon: 'Gamepad', color: '#FF00FF', type: 'expense', isDefault: false };
    mockDb.returning.mockResolvedValueOnce([mockCreated]);

    const result = await createCategory({ name: 'Hobi', icon: 'Gamepad', color: '#FF00FF', type: 'expense' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isDefault).toBe(false);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('deleteCategory deletes user custom category', async () => {
    mockAuthenticatedUser();
    const catId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([{ id: catId, isDefault: false }]);

    const result = await deleteCategory(catId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.id).toBe(catId);
  });

  it('seedDefaultCategories returns success when defaults already exist', async () => {
    const mockExisting = [{ id: 'c1', name: 'Yemek', icon: 'Pizza', type: 'expense', isDefault: true }];
    mockDb.where.mockResolvedValueOnce(mockExisting);

    const result = await seedDefaultCategories();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.message).toContain('already exist');
  });
});

// ========================================
// OWNERSHIP TESTS
// ========================================

describe('Category Actions — Ownership', () => {
  it('deleteCategory rejects when category not found or is default', async () => {
    mockAuthenticatedUser();
    const catId = '550e8400-e29b-41d4-a716-446655440000';
    // 2nd .limit() call (after resolveUserId) returns empty for ownership check
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await deleteCategory(catId);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Kategori bulunamadı veya silinemez');
  });
});

// ========================================
// ERROR HANDLING TESTS
// ========================================

describe('Category Actions — Error Handling', () => {
  it('getCategories handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    // 1st .where() chains for resolveUserId, 2nd .where() rejects for the query
    mockDb.where
      .mockReturnValueOnce(mockDb)
      .mockRejectedValueOnce(new Error('DB failed'));

    const result = await getCategories();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Kategoriler yüklenemedi');
  });

  it('createCategory handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.returning.mockRejectedValueOnce(new Error('Insert failed'));

    const result = await createCategory({ name: 'Test', icon: 'Star', color: '#FF0000', type: 'expense' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Kategori oluşturulamadı');
  });

  it('seedDefaultCategories handles DB error gracefully', async () => {
    mockDb.where.mockRejectedValueOnce(new Error('DB failed'));

    const result = await seedDefaultCategories();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Varsayılan kategoriler oluşturulamadı');
  });
});
