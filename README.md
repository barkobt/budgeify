# 💸 Budgeify

**Bütçenizi Yapay Zekâ ile Yönetin**

**TR**  
Budgeify; gelir–gider takibi, birikim hedefleri ve takvim tabanlı finans planlamasını tek bir panelde sunan, modern ve AI destekli kişisel finans uygulamasıdır.

**EN**  
Budgeify is a modern, AI-assisted personal finance app that helps you track income and expenses, manage savings goals, and plan your finances with a calendar-first approach.

---

## ✨ Features

- **Dashboard**
  - Toplam bakiye
  - Gelir / gider özeti
  - Trend ve özet metrikler

- **Transactions**
  - Gelir & gider ekleme
  - Düzenleme / silme
  - Kategorize edilmiş hareketler

- **Goals**
  - Birikim hedefleri
  - İlerleme takibi
  - Görsel durum göstergeleri

- **Calendar**
  - Tarih bazlı finansal hareketler
  - Planlama ve hatırlatıcı altyapısı

- **Authentication**
  - Clerk ile güvenli oturum yönetimi

- **PWA (Basic)**
  - Manifest desteği
  - 192 / 512 ikonlar
  - App-like deneyim

---

## 🧱 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Auth:** Clerk
- **Database:** Neon Postgres
- **ORM:** Drizzle ORM
- **State Management:** Zustand
- **Deployment:** Vercel

---

## 🚀 Local Development

### 1️⃣ Node Version

- **Recommended:** Node.js **20+**
- Project expects: `engines.node >= 20`

### 2️⃣ Install Dependencies

```bash
npm ci
3️⃣ Environment Variables
Create a .env.local file:
DATABASE_URL=postgresql://...neon...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Optional but recommended
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

CLERK_WEBHOOK_SECRET=whsec_...
CRON_SECRET=...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Budgeify
4️⃣ Run the App
npm run dev
🧪 Scripts
npm run lint
npm run typecheck
npm test
npm run build
☁️ Vercel Deployment Notes
Preview & Production env parity
DATABASE_URL ve Clerk key’leri her iki ortamda da tanımlı olmalı.
NEXT_PUBLIC_* değişkenleri değiştiğinde redeploy zorunludur.
Production ortamında doğru Neon DATABASE_URL kullanıldığını doğrulayın.
🛠 Troubleshooting
❌ GET / → 401 + __clerk_handshake
src/middleware.ts içinde public / protected route ayrımını kontrol edin.
Aşağıdaki rotalar public olmalı:
/
/pricing
/sign-in*
/sign-up*
❌ Sign-in methods görünmüyor
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ve CLERK_SECRET_KEY değerlerini kontrol edin.
CSP / header ayarlarının Clerk domainlerini engellemediğinden emin olun.
❌ Favicon 404
Aşağıdaki dosyaların mevcut olduğundan emin olun:
public/favicon.ico
public/favicon-16x16.png
public/favicon-32x32.png
public/apple-touch-icon.png
public/icon-192.png
public/icon-512.png
src/app/layout.tsx içindeki metadata.icons ve manifest path’lerini kontrol edin.
🧪 Test & CI Notes
Vitest + Vite Node 20+ gerektirir.
Node 18 ortamında npm test ESM startup hatası verebilir.
CI/CD (GitHub Actions, Vercel) için Node 20 kullanın.
🔐 Security
Secret bilgileri asla repoya commit etmeyin:
DATABASE_URL
CLERK_SECRET_KEY
Webhook / cron secret’ları
Sadece .env.local ve Vercel Environment Variables kullanın.
📌 Status
Budgeify aktif olarak geliştirilen bir production-ready MVP’dir.
Yeni özellikler ve AI tabanlı finans önerileri roadmap’te yer almaktadır.
