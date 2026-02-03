# Budgeify - Starter Pack

Bu paket, Budgeify projesini Cursor ile geliştirmeye başlamak için gerekli tüm dosyaları içerir.

---

## 📁 Paket İçeriği

```
budgeify-starter-pack/
├── PRD.md              # Product Requirements Document
├── .cursorrules        # Cursor AI kuralları
├── TASKS_PROMPT.md     # Task listesi oluşturma prompt'u
├── UI_REFERENCE.jpeg   # UI tasarım referansı
├── README.md           # Bu dosya
└── public/
    └── icons/          # Logo ve ikonlar (tüm boyutlar)
        ├── icon-1024x1024-appstore.png
        ├── icon-512x512-pwa.png
        ├── icon-192x192-pwa.png
        ├── icon-180x180-apple-touch.png
        ├── icon-152x152-ipad.png
        ├── icon-144x144-android.png
        ├── icon-120x120-iphone.png
        ├── icon-96x96-android.png
        ├── icon-72x72-android.png
        ├── icon-48x48-android.png
        ├── icon-32x32-favicon.png
        ├── icon-16x16-favicon.png
        ├── favicon.ico
        └── budgeify-logo.svg
```

---

## 🚀 Kurulum Adımları

### 1. GitHub Repo Oluştur
```bash
# GitHub'da "budgeify" adında yeni repo oluştur
# Sonra local'de:
git clone https://github.com/[username]/budgeify.git
cd budgeify
```

### 2. Next.js Projesi Oluştur
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 3. Starter Pack Dosyalarını Kopyala
```bash
# Bu paketin içeriğini proje root'una kopyala
cp -r budgeify-starter-pack/* ./
cp budgeify-starter-pack/.cursorrules ./
```

### 4. Dependencies Kur
```bash
npm install zustand framer-motion recharts lucide-react
npm install -D @types/node
```

### 5. Cursor'da Aç
```bash
cursor .
```

### 6. TASKS.md Oluştur
1. Cursor'da yeni chat/agent başlat
2. `TASKS_PROMPT.md` içeriğini kopyala
3. `@PRD.md` ve `UI_REFERENCE.jpeg` dosyalarını ekle
4. Prompt'u gönder
5. Task listesini onayla

---

## 📋 Geliştirme Workflow'u

### Her Task İçin:
1. Task'ı Cursor'a ver
2. Kod yazılsın
3. Browser'da kontrol et (`http://localhost:3000`)
4. Onay ver → Commit

### Her 5-7 Task'ta:
```
/summarize - Şu ana kadar yaptıklarımızı özetle
```

### Her Milestone'da:
1. Final summarize al
2. Commit'leri review et
3. `git push` yap
4. Yeni Agent oluştur

---

## 🎨 Tasarım Referansları

### Renkler
| Renk | Hex | Tailwind |
|------|-----|----------|
| Primary | #1E40AF | blue-700 |
| Primary Light | #3B82F6 | blue-500 |
| Accent | #14B8A6 | teal-500 |
| Success | #22C55E | green-500 |
| Warning | #F59E0B | amber-500 |
| Error | #EF4444 | red-500 |

### Component Patterns
```tsx
// Glassmorphism Card
className="rounded-2xl bg-white/80 backdrop-blur-md shadow-xl shadow-black/5 border border-white/20"

// Gradient Card
className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-2xl"

// Primary Button
className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 transition-all duration-200"
```

---

## 📱 PWA Manifest (Referans)

`public/manifest.json` için:
```json
{
  "name": "Budgeify - Kişisel Finans",
  "short_name": "Budgeify",
  "description": "Akıllı bütçe yönetimi",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8FAFC",
  "theme_color": "#1E40AF",
  "icons": [
    { "src": "/icons/icon-192x192-pwa.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512x512-pwa.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## ✅ Hazırsın!

Tüm dosyalar yerinde. Cursor'ı aç ve `TASKS_PROMPT.md` ile başla!

İyi kodlamalar! 🚀
