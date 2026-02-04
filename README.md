# 💰 Budgeify

> Modern ve minimalist kişisel finans yönetimi uygulaması

**Türkçe** | Mobile-First | PWA Ready

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-orange)](https://zustand-demo.pmnd.rs/)

---

## ✨ Özellikler

- 💰 **Gelir & Gider Takibi** - Tüm finansal hareketlerinizi kaydedin
- 📊 **Detaylı Analiz** - Harcama alışkanlıklarınızı görselleştirin
- 🎯 **Tasarruf Hedefleri** - Hedeflerinizi belirleyin ve ilerlemenizi takip edin
- 📈 **Kategori Bazlı Raporlar** - 18 varsayılan kategori ile detaylı raporlama
- 🎨 **Modern UI** - Glassmorphism tasarım, Framer Motion animasyonları
- 📱 **Mobile-First** - Responsive tasarım, PWA desteği
- 💾 **Offline Çalışma** - localStorage ile verileriniz güvende

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18.x veya üzeri
- npm veya yarn

### Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/barkobt/budgeify.git
cd budgeify

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

---

## 📦 Scripts

```bash
npm run dev          # Geliştirme sunucusu (port 3000)
npm run build        # Production build
npm run start        # Production sunucusu
npm run lint         # ESLint kontrolü
npm run type-check   # TypeScript tip kontrolü
```

---

## 🏗️ Teknoloji Stack

| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| **Next.js** | 14.2.x | React framework, App Router, SSR |
| **React** | 18.3.x | UI library |
| **TypeScript** | 5.7.x | Type safety (strict mode) |
| **Tailwind CSS** | 4.0.x | CSS-first styling |
| **Zustand** | 5.0.x | State management (persist middleware) |
| **Recharts** | 2.14.x | Data visualization |
| **Framer Motion** | 11.15.x | Animations |
| **Lucide React** | 0.460.x | Icons |
| **Zod** | 3.24.x | Validation |

---

## 📁 Proje Yapısı

```
budgeify/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Dashboard (Ana sayfa)
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── features/           # Feature-specific components
│   │   │   ├── income/         # Income module
│   │   │   ├── expenses/       # Expense module
│   │   │   ├── analytics/      # Analytics charts
│   │   │   └── goals/          # Goals module
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx
│   │       └── BottomNav.tsx
│   ├── store/                  # Zustand state management
│   │   └── useBudgetStore.ts   # Integrated store
│   ├── lib/                    # Business logic
│   │   └── analytics.ts        # Analytics utilities
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Helper functions
│   ├── constants/              # Constants
│   │   └── categories.ts       # 18 default categories
│   └── ...
├── public/                     # Static files
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO
├── TASKS.md                    # Development roadmap
├── CLAUDE.md                   # Developer guide
├── DEVELOPMENT_RULES.md        # Development protocols
├── HANDOVER_SUMMARY.md         # Session summary
└── package.json
```

---

## 🎯 Progress

**Current Status:** 32/32 tasks complete (%100) ✅

### Completed Milestones

1. ✅ **Setup & Configuration** - Next.js 14, Tailwind 4, TypeScript
2. ✅ **UI Foundations** - Button, Card, Input components
3. ✅ **Layout** - Header, BottomNav, Sidebar
4. ✅ **Income Module** - Balance card, income form
5. ✅ **Expense Module** - Category autocomplete, expense form & list
6. ✅ **Analytics & Goals** - Charts, analytics utils, goal tracking
7. ✅ **Final Polish** - Production cleanup, loading states, error boundary, a11y, SEO, PWA

---

## 🌐 Deployment

### Vercel (Recommended)

Vercel Next.js için optimize edilmiştir ve tek tıkla deploy imkanı sunar:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/barkobt/budgeify)

**Manuel Deploy:**

```bash
# Vercel CLI yükleyin
npm i -g vercel

# Deploy edin
vercel
```

### Environment Variables

Production'da şu environment variable'ları ayarlayın:

```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Budgeify
```

---

## 📱 PWA Kurulumu

Budgeify PWA (Progressive Web App) olarak kullanılabilir:

1. Uygulamayı tarayıcınızda açın
2. Tarayıcı menüsünden "Ana Ekrana Ekle" seçeneğini seçin
3. Uygulama ana ekranınıza eklenecektir

---

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

---

## 📝 Development Workflow

Detaylı development kuralları için:
- `DEVELOPMENT_RULES.md` - Stabilite protokolleri
- `CLAUDE.md` - Kodlama standartları ve rehber
- `TASKS.md` - 32 görevlik roadmap

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

**Commit Standardı:** [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📄 Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakın.

---

## 👥 Team

**Geliştirici:** Budgeify Team
**AI Partner:** Claude Sonnet 4.5 (Anthropic)

---

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Recharts](https://recharts.org/) - Data visualization
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev/) - Icons

---

**Made with 💙 in Turkey**
