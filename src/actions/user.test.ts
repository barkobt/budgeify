import { describe, it, expect, beforeEach } from 'vitest';
import {
  mockUnauthenticatedUser,
  resetAllMocks,
  mockDb,
  mockAuth,
  mockCurrentUser,
} from '@/__tests__/mocks/setup';
import {
  getOrCreateUser,
  getCurrentUser,
  updateUserProfile,
} from './user';

beforeEach(() => {
  resetAllMocks();
});

// ========================================
// AUTH TESTS
// ========================================

describe('User Actions — Auth', () => {
  it('getOrCreateUser rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await getOrCreateUser();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('updateUserProfile rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await updateUserProfile({ name: 'Test' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('getCurrentUser returns null for unauthenticated', async () => {
    mockUnauthenticatedUser();
    const result = await getCurrentUser();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBeNull();
  });
});

// ========================================
// VALIDATION TESTS
// ========================================

describe('User Actions — Validation', () => {
  it('updateUserProfile rejects empty name', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_123' });
    const result = await updateUserProfile({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });
});

// ========================================
// HAPPY PATH TESTS
// ========================================

describe('User Actions — Happy Path', () => {
  it('getOrCreateUser returns existing user', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_123' });
    const mockUser = { id: 'user-1', clerkId: 'clerk_123', email: 'test@test.com', name: 'Test User' };
    mockDb.limit.mockResolvedValueOnce([mockUser]);

    const result = await getOrCreateUser();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockUser);
  });

  it('getOrCreateUser creates new user when not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_new' });
    // First query: user not found
    mockDb.limit.mockResolvedValueOnce([]);
    // Clerk user data
    mockCurrentUser.mockResolvedValue({
      firstName: 'Yeni',
      lastName: 'Kullanıcı',
      emailAddresses: [{ emailAddress: 'yeni@test.com' }],
      imageUrl: 'https://example.com/avatar.jpg',
    });
    // Insert returns new user
    const mockCreated = { id: 'user-new', clerkId: 'clerk_new', email: 'yeni@test.com', name: 'Yeni Kullanıcı' };
    mockDb.returning.mockResolvedValueOnce([mockCreated]);

    const result = await getOrCreateUser();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('yeni@test.com');
  });

  it('getOrCreateUser fails when Clerk user data unavailable', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_new' });
    mockDb.limit.mockResolvedValueOnce([]); // User not found
    mockCurrentUser.mockResolvedValue(null); // Clerk user unavailable

    const result = await getOrCreateUser();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Clerk kullanıcı bilgisi alınamadı');
  });

  it('getCurrentUser returns user when authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_123' });
    const mockUser = { id: 'user-1', clerkId: 'clerk_123', email: 'test@test.com' };
    mockDb.limit.mockResolvedValueOnce([mockUser]);

    const result = await getCurrentUser();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockUser);
  });

  it('getCurrentUser returns null when user not in DB', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_123' });
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await getCurrentUser();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBeNull();
  });

  it('updateUserProfile updates name', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_123' });
    const mockUser = { id: 'user-1', clerkId: 'clerk_123', name: 'Old Name' };
    mockDb.limit.mockResolvedValueOnce([mockUser]);
    const mockUpdated = { ...mockUser, name: 'New Name' };
    mockDb.returning.mockResolvedValueOnce([mockUpdated]);

    const result = await updateUserProfile({ name: 'New Name' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe('New Name');
  });

  it('updateUserProfile fails when user not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_123' });
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await updateUserProfile({ name: 'Test' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Kullanıcı bulunamadı');
  });
});

// ========================================
// ERROR HANDLING TESTS
// ========================================

describe('User Actions — Error Handling', () => {
  it('getOrCreateUser handles DB error gracefully', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_123' });
    mockDb.limit.mockRejectedValueOnce(new Error('DB failed'));

    const result = await getOrCreateUser();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Kullanıcı oluşturulamadı');
  });

  it('getCurrentUser handles DB error gracefully', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_123' });
    mockDb.limit.mockRejectedValueOnce(new Error('DB failed'));

    const result = await getCurrentUser();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Kullanıcı bilgisi alınamadı');
  });

  it('updateUserProfile handles DB error gracefully', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk_123' });
    mockDb.limit.mockRejectedValueOnce(new Error('DB failed'));

    const result = await updateUserProfile({ name: 'Test' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Profil güncellenemedi');
  });
});
