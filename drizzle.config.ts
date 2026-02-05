/**
 * Drizzle Kit Configuration
 *
 * 🎓 MENTOR NOTU - Drizzle Kit:
 * ----------------------------
 * drizzle-kit, schema değişikliklerini yönetir:
 *
 * Commands:
 * - npx drizzle-kit generate:pg  → Migration SQL dosyaları oluşturur
 * - npx drizzle-kit push:pg      → Schema'yı direkt DB'ye uygular (dev için)
 * - npx drizzle-kit studio       → Görsel DB yönetim aracı açar
 *
 * Migration vs Push:
 * - Migration: Production için, değişiklikler kaydedilir, geri alınabilir
 * - Push: Development için, hızlı iterasyon, dikkatli kullan
 */

import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// .env.local dosyasını yükle
dotenv.config({ path: '.env.local' });

export default {
  // Schema dosyasının yolu
  schema: './src/db/schema.ts',

  // Migration dosyalarının kaydedileceği klasör
  out: './src/db/migrations',

  // PostgreSQL kullanıyoruz
  dialect: 'postgresql',

  // Veritabanı bağlantı bilgisi
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // Verbose output için
  verbose: true,

  // Migration öncesi strict type check
  strict: true,
} satisfies Config;
