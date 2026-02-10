# 💸 Budgeify

**Bütçenizi Yapay Zekâ ile Yönetin**

Budgeify; gelir–gider takibi, birikim hedefleri ve takvim tabanlı finans planlamasını tek panelde sunan, modern ve AI destekli kişisel finans uygulamasıdır.  
Budgeify is a modern, AI-assisted personal finance app for tracking income and expenses, managing savings goals, and planning finances with a calendar-first experience.

---

## ✨ Features

📊 **Dashboard** — toplam bakiye, gelir/gider özeti, finansal trendler  
💳 **Transactions** — gelir & gider ekleme, düzenleme, silme ve kategoriler  
🎯 **Goals** — birikim hedefleri ve ilerleme takibi  
📅 **Calendar** — tarih bazlı finansal hareketler ve planlama altyapısı  
🔐 **Authentication** — Clerk ile güvenli kullanıcı oturumları  
📱 **PWA** — manifest, 192 / 512 ikonlar ve app-like deneyim

---

## 🧱 Tech Stack

Next.js 14 (App Router) · TypeScript · Clerk · Neon Postgres · Drizzle ORM · Zustand · Vercel

---

## 🚀 Local Development

Bu proje Node.js **20+** gerektirir ve `engines.node >= 20` bekler.

Bağımlılıkları yüklemek için:

```bash
npm ci
```

Çalışma ortamı için `.env.local` dosyası oluşturun:

```env
DATABASE_URL=postgresql://...neon...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

CLERK_WEBHOOK_SECRET=whsec_...
CRON_SECRET=...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Budgeify
```

Geliştirme ortamını başlatmak için:

```bash
npm run dev
```

---

## 🧪 Scripts

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

---

## ☁️ Deployment (Vercel)

Preview ve Production ortamlarında environment variable parity sağlanmalıdır.  
`DATABASE_URL` ve Clerk anahtarları her iki ortamda da tanımlı olmalıdır.  
`NEXT_PUBLIC_*` değişkenleri güncellendiğinde yeniden build ve deploy gereklidir.  
Production ortamında doğru Neon `DATABASE_URL` kullanıldığını mutlaka doğrulayın.

---

## 🛠 Troubleshooting

`GET /` isteğinde `401` veya `__clerk_handshake` hatası alıyorsanız `src/middleware.ts` içinde public / protected route ayrımını kontrol edin.  
`/`, `/pricing`, `/sign-in*`, `/sign-up*` rotaları public olmalıdır.

Sign-in yöntemleri görünmüyorsa Clerk publishable ve secret key’lerin doğru tanımlandığından emin olun.  
CSP veya header yapılandırmasının Clerk domainlerini engellemediğini kontrol edin.

Favicon 404 hatası alıyorsanız `public/` klasörü altında aşağıdaki dosyaların mevcut olduğunu doğrulayın:  
`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`.

---

## 🔐 Security

`DATABASE_URL`, `CLERK_SECRET_KEY`, webhook ve cron secret’ları **asla** repoya commit etmeyin.  
Sadece `.env.local` ve Vercel Environment Variables kullanın.

---

## 📌 Status

Budgeify aktif olarak geliştirilen bir **production-ready MVP**’dir.  
AI tabanlı finans önerileri ve otomasyon özellikleri roadmap’te yer almaktadır.
