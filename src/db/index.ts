/**
 * Budgeify v2.0 - Database Client
 *
 * 🎓 MENTOR NOTU - Neon Serverless:
 * --------------------------------
 * Neon, "serverless PostgreSQL" sağlar. Bu ne demek?
 *
 * Geleneksel DB:
 * - Sürekli çalışan bir sunucu
 * - Bağlantı havuzu (connection pool) yönetimi
 * - Aylık sabit maliyet
 *
 * Serverless DB:
 * - İstek geldiğinde aktif olur
 * - Otomatik ölçeklenir
 * - Kullandığın kadar öde
 *
 * Neon'un @neondatabase/serverless paketi, WebSocket üzerinden
 * bağlantı kurar - bu Edge Runtime için idealdir.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * 🎓 MENTOR NOTU - Environment Variables:
 *
 * DATABASE_URL format:
 * postgresql://user:password@host/database?sslmode=require
 *
 * Bu URL, Neon dashboard'dan alınır.
 * .env.local dosyasına eklenir, ASLA git'e commit edilmez!
 */

// Neon HTTP client oluştur
const sql = neon(process.env.DATABASE_URL!);

/**
 * Drizzle instance - tüm DB operasyonları buradan yapılır
 *
 * 🎓 MENTOR NOTU:
 * { schema } parametresi, relations() ile tanımlanan ilişkileri
 * db.query API'si için aktif eder.
 *
 * Kullanım örnekleri:
 *
 * // Basit SELECT
 * const allExpenses = await db.select().from(schema.expenses);
 *
 * // WHERE ile filtreleme
 * const userExpenses = await db.select()
 *   .from(schema.expenses)
 *   .where(eq(schema.expenses.userId, userId));
 *
 * // JOIN ile ilişkili veri çekme
 * const expensesWithCategory = await db.query.expenses.findMany({
 *   with: { category: true }
 * });
 */
export const db = drizzle(sql, { schema });

/**
 * Type-safe database instance export
 * Bu tip, IDE'de autocomplete için kullanılır
 */
export type Database = typeof db;

/**
 * Helper: Kullanıcıyı Clerk ID ile bul
 *
 * 🎓 MENTOR NOTU:
 * Bu pattern'e "Data Access Layer (DAL)" denir.
 * Veritabanı sorgularını merkezi bir yerden yönetmek,
 * kod tekrarını önler ve test edilebilirliği artırır.
 */
export async function getUserByClerkId(clerkId: string) {
  const result = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  return result[0] ?? null;
}

// Re-export schema for convenience
export * from './schema';

// Import eq for where clauses
import { eq } from 'drizzle-orm';
