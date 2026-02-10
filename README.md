# Budgeify

**TR:** Budgeify, gelir-gider takibi, hedef yönetimi ve takvim tabanlı finans planlamasını tek panelde sunan yapay zeka destekli kişisel finans uygulamasıdır.

**EN:** Budgeify is an AI-assisted personal finance app for tracking income/expenses, savings goals, and calendar-based planning.

## Özellikler

- Dashboard: toplam bakiye, gelir/gider özeti, trendler
- Transactions: gelir ve gider ekleme/düzenleme/silme
- Goals: birikim hedefleri ve ilerleme takibi
- Calendar: tarih bazlı finans hareketleri ve hatırlatıcılar
- Auth: Clerk ile güvenli oturum yönetimi
- PWA temel desteği: manifest + 192/512 ikonlar

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Clerk (Authentication)
- Neon Postgres + Drizzle ORM
- Zustand (client state)
- Vercel (deployment)

## Local Setup

### 1) Node sürümü

- Önerilen: **Node.js 20+**
- Proje `engines.node >= 20` bekler.

### 2) Kurulum

```bash
npm ci
```

### 3) Ortam değişkenleri

`.env.local` oluşturun:

```env
DATABASE_URL=postgresql://...neon...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Opsiyonel ama önerilenler
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_...
CRON_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Budgeify
```

### 4) Çalıştırma

```bash
npm run dev
```

## Scripts

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Vercel Deployment Notları

- **Preview ve Production env parity**: iki ortamda da aynı kritik anahtarlar tanımlı olmalı (`DATABASE_URL`, Clerk key'leri).
- `NEXT_PUBLIC_*` değişkenleri değiştiğinde yeni build gerekir. Değişiklik sonrası **redeploy** zorunludur.
- Neon bağlantısı için Production ortamında doğru `DATABASE_URL` kullanıldığını doğrulayın.

## Troubleshooting

- **`GET /` 401 + `__clerk_handshake`**
  - `src/middleware.ts` içinde public/protected route ayrımını kontrol edin.
  - `/`, `/pricing`, `/sign-in*`, `/sign-up*` public olmalı.

- **Sign-in methods görünmüyor**
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` ve `CLERK_SECRET_KEY` değerlerini doğrulayın.
  - CSP/header yapılandırmasının Clerk domainlerini engellemediğini kontrol edin.

- **Favicon 404**
  - `public/favicon.ico`, `public/favicon-32x32.png`, `public/favicon-16x16.png`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png` dosyalarının mevcut olduğunu doğrulayın.
  - `src/app/layout.tsx` metadata `icons` ve `manifest` alanlarının doğru path gösterdiğini kontrol edin.

## Test/CI Notu

- Vitest + Vite sürümleri Node 20+ gerektirir.
- Lokal Node 18 ortamında `npm test` ESM startup hatası verebilir.
- CI/CD (GitHub Actions, Vercel) için Node 20 kullanın.

## Security

- Secret bilgileri (`DATABASE_URL`, `CLERK_SECRET_KEY`, webhook/cron secret) **asla** repoya commit etmeyin.
- Sadece `.env.local` ve Vercel Environment Variables kullanın.
