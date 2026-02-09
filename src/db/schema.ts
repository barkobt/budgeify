/**
 * Budgeify v2.0 "Sovereign" - Database Schema
 *
 * 🎓 MENTOR NOTU - Drizzle Schema Yapısı:
 * ----------------------------------------
 * Drizzle'da her tablo bir TypeScript objesi olarak tanımlanır.
 * Bu yaklaşımın avantajları:
 *
 * 1. Type Safety: TypeScript compiler hataları yakalar
 * 2. Autocomplete: IDE'de tablo ve kolon isimleri otomatik tamamlanır
 * 3. Migrations: Schema değişiklikleri otomatik algılanır
 *
 * İlişkisel Veritabanı Kavramları:
 * - Primary Key (PK): Her satırı benzersiz tanımlayan kolon
 * - Foreign Key (FK): Başka tabloya referans veren kolon
 * - One-to-Many: Bir kullanıcının birçok gideri olabilir
 */

import {
  pgTable,
  text,
  timestamp,
  boolean,
  decimal,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ========================================
// ENUMS - Sabit değer listeleri
// ========================================

/**
 * Goal Status Enum
 * PostgreSQL'de ENUM tipi, sadece belirli değerleri kabul eder
 * Bu sayede yanlış veri girişi önlenir
 */
export const goalStatusEnum = pgEnum('goal_status', [
  'active',
  'completed',
  'cancelled',
]);

/**
 * Category Type Enum
 * Kategori gelir mi gider mi belirlenir
 */
export const categoryTypeEnum = pgEnum('category_type', [
  'income',
  'expense',
]);

/**
 * Transaction Status Enum
 * İşlem durumu: tamamlandı veya bekliyor
 */
export const transactionStatusEnum = pgEnum('transaction_status', [
  'completed',
  'pending',
]);

// ========================================
// TABLES - Veritabanı tabloları
// ========================================

/**
 * Users Table
 *
 * 🎓 MENTOR NOTU:
 * Clerk authentication kullandığımız için, kullanıcı bilgileri
 * Clerk'te saklanır. Burada sadece Clerk ID'sini tutuyoruz.
 * Bu pattern'e "External Auth Reference" denir.
 *
 * clerkId: Clerk'ten gelen benzersiz kullanıcı ID'si
 * email: Kullanıcının email adresi (Clerk'ten senkronize)
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Categories Table
 *
 * 🎓 MENTOR NOTU:
 * Kategoriler hem sistem tanımlı (isDefault=true) hem de
 * kullanıcı tanımlı (isDefault=false) olabilir.
 *
 * Sistem kategorileri tüm kullanıcılar için ortaktır.
 * Kullanıcı kategorileri sadece o kullanıcıya aittir.
 */
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(), // Lucide icon name veya emoji
  color: text('color').notNull(), // Hex color code
  type: categoryTypeEnum('type').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Incomes Table
 *
 * 🎓 MENTOR NOTU:
 * decimal tipi parasal değerler için kullanılır çünkü
 * floating point (float/double) hassasiyet kaybına neden olabilir.
 *
 * Örnek: 0.1 + 0.2 = 0.30000000000000004 (float)
 * Decimal ile: 0.1 + 0.2 = 0.3 (kesin)
 */
export const incomes = pgTable('incomes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  date: timestamp('date').defaultNow().notNull(),
  isRecurring: boolean('is_recurring').default(false).notNull(),
  status: transactionStatusEnum('status').default('completed').notNull(),
  expectedDate: timestamp('expected_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Expenses Table
 *
 * 🎓 MENTOR NOTU:
 * onDelete: 'cascade' ne demek?
 * Eğer kullanıcı silinirse, onun tüm giderleri de otomatik silinir.
 * Bu "referential integrity" (referans bütünlüğü) sağlar.
 */
export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  note: text('note'),
  date: timestamp('date').defaultNow().notNull(),
  status: transactionStatusEnum('status').default('completed').notNull(),
  expectedDate: timestamp('expected_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Goals Table
 *
 * 🎓 MENTOR NOTU:
 * currentAmount başlangıçta 0, kullanıcı birikim yaptıkça artar.
 * targetAmount hedefe ulaşıldığında status 'completed' olur.
 */
export const goals = pgTable('goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  targetAmount: decimal('target_amount', { precision: 12, scale: 2 }).notNull(),
  currentAmount: decimal('current_amount', { precision: 12, scale: 2 })
    .default('0')
    .notNull(),
  icon: text('icon').notNull(),
  targetDate: timestamp('target_date'),
  status: goalStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ========================================
// RELATIONS - Tablo ilişkileri
// ========================================

/**
 * 🎓 MENTOR NOTU - Relations:
 *
 * Drizzle'da relations() fonksiyonu JOIN sorgularını kolaylaştırır.
 * Bu "ORM-level relations" - veritabanında fiziksel FK'ler dışında
 * uygulama seviyesinde ilişkileri tanımlar.
 *
 * Avantajı: `db.query.users.findMany({ with: { incomes: true } })`
 * gibi nested sorgular yapabilirsin.
 */

export const usersRelations = relations(users, ({ many }) => ({
  incomes: many(incomes),
  expenses: many(expenses),
  goals: many(goals),
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  incomes: many(incomes),
  expenses: many(expenses),
}));

export const incomesRelations = relations(incomes, ({ one }) => ({
  user: one(users, {
    fields: [incomes.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [incomes.categoryId],
    references: [categories.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(users, {
    fields: [expenses.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [expenses.categoryId],
    references: [categories.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));

// ========================================
// TYPE EXPORTS
// ========================================

/**
 * 🎓 MENTOR NOTU - Type Inference:
 *
 * Drizzle schema'dan otomatik TypeScript tipleri çıkarır.
 * Bu sayede INSERT ve SELECT işlemlerinde tip güvenliği sağlanır.
 *
 * $inferInsert: INSERT için gerekli alanlar (id opsiyonel)
 * $inferSelect: SELECT sonucu (tüm alanlar)
 */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Income = typeof incomes.$inferSelect;
export type NewIncome = typeof incomes.$inferInsert;

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
