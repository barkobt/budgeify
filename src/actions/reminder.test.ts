import { describe, it, expect, beforeEach } from 'vitest';
import {
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  resetAllMocks,
  mockDb,
  mockRevalidatePath,
} from '@/__tests__/mocks/setup';
import {
  getReminders,
  getUpcomingReminders,
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
} from './reminder';

beforeEach(() => {
  resetAllMocks();
});

// ========================================
// AUTH TESTS
// ========================================

describe('Reminder Actions — Auth', () => {
  it('getReminders rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await getReminders();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('getUpcomingReminders rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await getUpcomingReminders();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('createReminder rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await createReminder({
      title: 'Test',
      type: 'custom',
      dueDate: new Date(),
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('updateReminder rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await updateReminder('550e8400-e29b-41d4-a716-446655440000', { title: 'Updated' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });

  it('deleteReminder rejects unauthenticated requests', async () => {
    mockUnauthenticatedUser();
    const result = await deleteReminder('some-id');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Oturum açmanız gerekiyor');
  });
});

// ========================================
// VALIDATION TESTS
// ========================================

describe('Reminder Actions — Validation', () => {
  it('createReminder rejects empty title', async () => {
    mockAuthenticatedUser();
    const result = await createReminder({
      title: '',
      type: 'custom',
      dueDate: new Date(),
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('createReminder rejects negative amount', async () => {
    mockAuthenticatedUser();
    const result = await createReminder({
      title: 'Test',
      type: 'bill_payment',
      dueDate: new Date(),
      amount: -100,
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz veri');
  });

  it('getReminderById rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await getReminderById('not-a-uuid');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz hatırlatıcı ID');
  });

  it('updateReminder rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await updateReminder('not-a-uuid', { title: 'Updated' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz hatırlatıcı ID');
  });

  it('deleteReminder rejects invalid UUID', async () => {
    mockAuthenticatedUser();
    const result = await deleteReminder('not-a-uuid');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Geçersiz hatırlatıcı ID');
  });
});

// ========================================
// HAPPY PATH TESTS
// ========================================

describe('Reminder Actions — Happy Path', () => {
  it('getReminders returns reminders list', async () => {
    mockAuthenticatedUser();
    const mockReminders = [
      { id: 'r1', title: 'Kira', type: 'bill_payment', dueDate: new Date(), isActive: true },
      { id: 'r2', title: 'Hedef', type: 'goal_deadline', dueDate: new Date(), isActive: true },
    ];
    mockDb.orderBy.mockResolvedValueOnce(mockReminders);

    const result = await getReminders();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockReminders);
  });

  it('getUpcomingReminders returns next 7 days reminders', async () => {
    mockAuthenticatedUser();
    const mockUpcoming = [
      { id: 'r1', title: 'Elektrik', type: 'bill_payment', dueDate: new Date(), isActive: true },
    ];
    mockDb.orderBy.mockResolvedValueOnce(mockUpcoming);

    const result = await getUpcomingReminders();
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockUpcoming);
  });

  it('getReminderById returns reminder when found', async () => {
    mockAuthenticatedUser();
    const reminderId = '550e8400-e29b-41d4-a716-446655440000';
    const mockReminder = { id: reminderId, title: 'Kira', type: 'bill_payment' };
    mockDb.limit.mockResolvedValueOnce([mockReminder]);

    const result = await getReminderById(reminderId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockReminder);
  });

  it('getReminderById returns null when not found', async () => {
    mockAuthenticatedUser();
    const reminderId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await getReminderById(reminderId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBeNull();
  });

  it('createReminder creates and returns reminder', async () => {
    mockAuthenticatedUser();
    const mockCreated = { id: 'r-new', title: 'Kira', type: 'bill_payment', frequency: 'monthly', isActive: true };
    mockDb.returning.mockResolvedValueOnce([mockCreated]);

    const result = await createReminder({
      title: 'Kira',
      type: 'bill_payment',
      dueDate: new Date(),
      amount: 5000,
      frequency: 'monthly',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(mockCreated);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('updateReminder updates existing reminder', async () => {
    mockAuthenticatedUser();
    const reminderId = '550e8400-e29b-41d4-a716-446655440000';
    const mockExisting = { id: reminderId, title: 'Kira', isActive: true };
    const mockUpdated = { id: reminderId, title: 'Kira Ödeme', isActive: true };
    // 2nd .limit() for ownership check
    mockDb.limit.mockResolvedValueOnce([mockExisting]);
    mockDb.returning.mockResolvedValueOnce([mockUpdated]);

    const result = await updateReminder(reminderId, { title: 'Kira Ödeme' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.title).toBe('Kira Ödeme');
    expect(mockRevalidatePath).toHaveBeenCalled();
  });

  it('deleteReminder deletes existing reminder', async () => {
    mockAuthenticatedUser();
    const reminderId = '550e8400-e29b-41d4-a716-446655440000';
    // 2nd .limit() for ownership check
    mockDb.limit.mockResolvedValueOnce([{ id: reminderId }]);

    const result = await deleteReminder(reminderId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.id).toBe(reminderId);
    expect(mockRevalidatePath).toHaveBeenCalled();
  });
});

// ========================================
// OWNERSHIP TESTS
// ========================================

describe('Reminder Actions — Ownership', () => {
  it('updateReminder rejects when reminder not found', async () => {
    mockAuthenticatedUser();
    const reminderId = '550e8400-e29b-41d4-a716-446655440000';
    // 2nd .limit() for ownership check returns empty
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await updateReminder(reminderId, { title: 'Updated' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Hatırlatıcı bulunamadı');
  });

  it('deleteReminder rejects when reminder not found', async () => {
    mockAuthenticatedUser();
    const reminderId = '550e8400-e29b-41d4-a716-446655440000';
    // 2nd .limit() for ownership check returns empty
    mockDb.limit.mockResolvedValueOnce([]);

    const result = await deleteReminder(reminderId);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Hatırlatıcı bulunamadı');
  });
});

// ========================================
// ERROR HANDLING TESTS
// ========================================

describe('Reminder Actions — Error Handling', () => {
  it('getReminders handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.orderBy.mockRejectedValueOnce(new Error('DB connection failed'));

    const result = await getReminders();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Hatırlatıcılar yüklenirken bir hata oluştu');
  });

  it('createReminder handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    mockDb.returning.mockRejectedValueOnce(new Error('Insert failed'));

    const result = await createReminder({
      title: 'Test',
      type: 'custom',
      dueDate: new Date(),
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Hatırlatıcı eklenirken bir hata oluştu');
  });

  it('deleteReminder handles DB error gracefully', async () => {
    mockAuthenticatedUser();
    const reminderId = '550e8400-e29b-41d4-a716-446655440000';
    mockDb.limit.mockRejectedValueOnce(new Error('DB failed'));

    const result = await deleteReminder(reminderId);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Hatırlatıcı silinirken bir hata oluştu');
  });
});
