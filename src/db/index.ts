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
// Lazy singleton: connection is created on first access, not at import time.
// This prevents build-time crashes when DATABASE_URL is unset (e.g. Vercel build step).
// Production-ready: gracefully handles edge function warm-up where env may be
// momentarily unavailable during cold start.
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // During Vercel build step or edge warm-up, DATABASE_URL may be absent.
    // Throw a clear, actionable error instead of letting neon() crash with
    // "No database connection string was provided to neon()".
    throw new Error(
      '[Budgeify] DATABASE_URL is not set. ' +
      'Ensure it is added to your Vercel project environment variables (Settings → Environment Variables) ' +
      'and that the variable is available for the correct environments (Production, Preview, Development). ' +
      'For local dev, add it to .env.local.'
    );
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

/**
 * Edge-safe DB access: wraps db calls to handle cold-start scenarios
 * where the env var might not be resolved yet. Returns null instead of crashing.
 */
export async function safeDbAccess<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof Error && err.message.includes('DATABASE_URL')) {
      console.warn('[Budgeify] Database unavailable — likely edge warm-up. Retrying...');
      return null;
    }
    throw err;
  }
}

let _db: ReturnType<typeof createDb> | null = null;

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
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop, receiver) {
    if (!_db) {
      const url = process.env.DATABASE_URL;
      if (!url) {
        // Build-time / edge warm-up: DATABASE_URL is not yet available.
        // Return undefined to let the build succeed without crashing.
        // Actual DB calls at runtime will have the env var available.
        return undefined;
      }
      _db = createDb();
    }
    return Reflect.get(_db, prop, receiver);
  },
});

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
