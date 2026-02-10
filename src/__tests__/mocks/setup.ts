/**
 * Vitest Global Mocks
 *
 * Mocks for server-side dependencies used across all action tests:
 * - @clerk/nextjs/server (auth)
 * - @/db (Drizzle client)
 * - next/cache (revalidatePath)
 */

import { vi } from 'vitest';

// ========================================
// CLERK AUTH MOCK
// ========================================

const mockAuth = vi.fn().mockResolvedValue({ userId: null as string | null });
const mockCurrentUser = vi.fn().mockResolvedValue(null);

vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth,
  currentUser: mockCurrentUser,
}));

// ========================================
// NEXT/CACHE MOCK
// ========================================

const mockRevalidatePath = vi.fn();

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

// ========================================
// DRIZZLE DB MOCK
// ========================================

interface MockChain {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  values: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
  query: {
    expenses: {
      findMany: ReturnType<typeof vi.fn>;
    };
  };
}

function initChain(chain: MockChain): void {
  chain.select.mockReturnValue(chain);
  chain.insert.mockReturnValue(chain);
  chain.update.mockReturnValue(chain);
  chain.delete.mockReturnValue(chain);
  chain.from.mockReturnValue(chain);
  chain.where.mockReturnValue(chain);
  chain.orderBy.mockReturnValue(chain);
  chain.limit.mockReturnValue(chain);
  chain.values.mockReturnValue(chain);
  chain.set.mockReturnValue(chain);
  chain.returning.mockResolvedValue([]);
  chain.query.expenses.findMany.mockResolvedValue([]);
}

const mockDb: MockChain = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  values: vi.fn(),
  set: vi.fn(),
  returning: vi.fn(),
  query: {
    expenses: {
      findMany: vi.fn(),
    },
  },
};

initChain(mockDb);

vi.mock('@/db', () => ({
  db: mockDb,
}));

// ========================================
// DRIZZLE ORM MOCK (operators)
// ========================================

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((_col: unknown, val: unknown) => ({ op: 'eq', val })),
  and: vi.fn((...args: unknown[]) => ({ op: 'and', args })),
  or: vi.fn((...args: unknown[]) => ({ op: 'or', args })),
  desc: vi.fn((col: unknown) => ({ op: 'desc', col })),
  lte: vi.fn((_col: unknown, val: unknown) => ({ op: 'lte', val })),
  gte: vi.fn((_col: unknown, val: unknown) => ({ op: 'gte', val })),
  sql: vi.fn(),
  relations: vi.fn(),
}));

// ========================================
// DB SCHEMA MOCK (table references)
// ========================================

vi.mock('@/db/schema', () => ({
  users: { id: 'users.id', clerkId: 'users.clerkId', $inferSelect: {} },
  incomes: { id: 'incomes.id', userId: 'incomes.userId', date: 'incomes.date', $inferSelect: {} },
  expenses: { id: 'expenses.id', userId: 'expenses.userId', date: 'expenses.date', $inferSelect: {} },
  goals: { id: 'goals.id', userId: 'goals.userId', status: 'goals.status', createdAt: 'goals.createdAt', $inferSelect: {} },
  reminders: { id: 'reminders.id', userId: 'reminders.userId', dueDate: 'reminders.dueDate', isActive: 'reminders.isActive', lastTriggered: 'reminders.lastTriggered', frequency: 'reminders.frequency', $inferSelect: {} },
  budgetAlerts: { id: 'budgetAlerts.id', userId: 'budgetAlerts.userId', isActive: 'budgetAlerts.isActive', $inferSelect: {} },
  categories: { id: 'categories.id', userId: 'categories.userId', isDefault: 'categories.isDefault', $inferSelect: {} },
  goalStatusEnum: {},
  categoryTypeEnum: {},
  transactionStatusEnum: {},
}));

// ========================================
// HELPERS
// ========================================

export { mockAuth, mockCurrentUser, mockRevalidatePath, mockDb };

/**
 * Resets all mocks between tests.
 * Uses vi.resetAllMocks() to clear BOTH call history AND once-queues.
 */
export function resetAllMocks(): void {
  vi.resetAllMocks();
  mockAuth.mockResolvedValue({ userId: null });
  mockCurrentUser.mockResolvedValue(null);
  initChain(mockDb);
}

/**
 * Sets up unauthenticated user mock.
 */
export function mockUnauthenticatedUser(): void {
  mockAuth.mockResolvedValue({ userId: null });
}

/**
 * Sets up authenticated user mock.
 * resolveUserId path: db.select().from(users).where(...).limit(1)
 * This queues .limit() to resolve to [{id: dbUserId}] on its first call.
 * Returns the mock DB userId (internal UUID).
 */
export function mockAuthenticatedUser(clerkId = 'clerk_test_123', dbUserId = 'db-user-uuid-123'): string {
  mockAuth.mockResolvedValue({ userId: clerkId });
  mockDb.limit.mockResolvedValueOnce([{ id: dbUserId }]);
  return dbUserId;
}

/**
 * For actions where the query terminates with .where() (no .limit()),
 * e.g. getCategories, getGoalStatistics.
 * Queues: 1st .where() → chains (for resolveUserId), 2nd .where() → resolves data.
 */
export function mockWhereTerminalQuery(data: unknown[]): void {
  mockDb.where
    .mockReturnValueOnce(mockDb)      // resolveUserId's .where() → chains to .limit()
    .mockResolvedValueOnce(data);     // action's .where() → terminal, resolves data
}
