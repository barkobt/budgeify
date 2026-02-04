# Budgeify - Claude Code Rehberi

> Bu dosya, projeye yeni katılan geliştiricilerin hızlıca adapte olması için hazırlanmıştır.

## Proje Özeti

**Budgeify**, Türkçe arayüzlü, mobile-first bir kişisel finans yönetimi uygulamasıdır. Kullanıcılar gelirlerini ve giderlerini takip edebilir, harcama analizi yapabilir ve tasarruf hedefleri belirleyebilir.

**Hedef Kitle:** 22-45 yaş arası, düzenli geliri olan Türk kullanıcılar
**Para Birimi:** Türk Lirası (₺)

---

## Teknoloji Stack'i

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| Next.js | 14.2.x | App Router, SSR |
| React | 18.3.x | UI Framework |
| TypeScript | 5.7.x (strict mode) | Tip güvenliği |
| Tailwind CSS | 4.0.x (CSS-first) | Styling |
| Zustand | 5.0.x | State management |
| Recharts | 2.14.x | Grafikler |
| Framer Motion | 11.15.x | Animasyonlar |
| Zod | 3.24.x | Veri doğrulama |
| Lucide React | 0.460.x | İkonlar |

> **Not:** Node.js 18 uyumluluğu için Next.js 14 kullanılıyor.

---

## Hızlı Başlangıç

### Gerekli Komutlar

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build'i test et
npm run start
```

### Geliştirme URL'i
```
http://localhost:3000
```

---

## Klasör Yapısı

```
budgeify/
├── src/
│   ├── app/                    # Next.js App Router sayfaları
│   │   ├── page.tsx            # Dashboard (Ana sayfa)
│   │   ├── layout.tsx          # Root layout
│   │   ├── income/             # Gelir sayfası
│   │   ├── expenses/           # Giderler sayfası
│   │   ├── analytics/          # Analiz sayfası
│   │   ├── goals/              # Hedefler sayfası
│   │   └── settings/           # Ayarlar sayfası
│   │
│   ├── components/
│   │   ├── ui/                 # Tekrar kullanılabilir UI bileşenleri
│   │   │   ├── Button.tsx      # Primary, secondary, ghost varyantları
│   │   │   ├── Card.tsx        # Glassmorphism kartlar
│   │   │   ├── Input.tsx       # Text/numeric input
│   │   │   └── Modal.tsx       # Modal/Dialog
│   │   │
│   │   ├── features/           # Özellik bazlı bileşenler
│   │   │   ├── income/         # MainBalanceCard, MainSalaryForm
│   │   │   ├── expenses/       # ExpenseForm, ExpenseList, CategoryAutocomplete
│   │   │   ├── analytics/      # Grafikler, özet kartları
│   │   │   └── goals/          # Hedef kartları
│   │   │
│   │   └── layout/             # Layout bileşenleri
│   │       ├── Header.tsx      # Üst header
│   │       ├── BottomNav.tsx   # Mobil alt navigasyon
│   │       └── Sidebar.tsx     # Desktop yan menü
│   │
│   ├── stores/                 # Zustand state yönetimi
│   │   ├── incomeStore.ts      # Gelir state'i
│   │   ├── expenseStore.ts     # Gider state'i
│   │   └── goalStore.ts        # Hedef state'i
│   │
│   ├── services/               # İş mantığı
│   │   ├── storage.ts          # LocalStorage wrapper
│   │   └── analytics.ts        # Analiz hesaplamaları
│   │
│   ├── types/                  # TypeScript tipleri
│   │   └── index.ts            # Tüm interface'ler
│   │
│   ├── utils/                  # Yardımcı fonksiyonlar
│   │   ├── formatters.ts       # Para, tarih formatlama
│   │   └── calculations.ts     # Matematik işlemleri
│   │
│   └── constants/              # Sabitler
│       └── categories.ts       # Varsayılan kategoriler
│
├── public/                     # Statik dosyalar
│   ├── icons/                  # PWA ikonları
│   └── manifest.json           # PWA manifest
│
├── budgeify-starter-pack/      # Proje dökümanları
│   ├── PRD.md                  # Product Requirements Document
│   ├── .cursorrules            # AI kodlama kuralları
│   ├── UI_REFERENCE.jpeg       # Görsel referans
│   └── README.md               # Kurulum notları
│
├── TASKS.md                    # Görev listesi (31 görev)
├── CLAUDE.md                   # Bu dosya
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

---

## Kodlama Standartları

### TypeScript Kuralları

```typescript
// ✅ DOĞRU: Strict typing, named exports
export interface Income {
  id: string;
  type: 'salary' | 'additional';
  amount: number;
  description?: string;
  createdAt: string;
}

export const useIncomeStore = create<IncomeState>()(/* ... */);

// ❌ YANLIŞ: any kullanma, class kullanma
const data: any = {};
class IncomeManager {}
```

**Temel Kurallar:**
- `any` tipi YASAK - her zaman doğru tip belirt
- Functional/declarative pattern kullan, class kullanma
- Named export tercih et (pages hariç)
- Değişken isimleri açıklayıcı olsun: `isLoading`, `hasError`, `totalIncome`

### Tailwind CSS 4 Kullanımı

```tsx
// ✅ DOĞRU: Tailwind class'ları
<div className="rounded-2xl bg-white/80 backdrop-blur-md shadow-xl">
  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3">
    Kaydet
  </button>
</div>

// ❌ YANLIŞ: Inline style, CSS modules
<div style={{ borderRadius: '16px' }}>
<div className={styles.card}>
```

**Renk Paleti (Tailwind class'ları):**
| Kullanım | Tailwind Class |
|----------|----------------|
| Primary | `blue-600`, `blue-700` |
| Accent | `teal-500`, `cyan-500` |
| Success | `green-500` |
| Warning | `amber-500` |
| Error | `red-500` |
| Background | `slate-50` |
| Text Primary | `slate-900` |
| Text Secondary | `slate-500` |

**Component Stilleri:**
```tsx
// Glassmorphism Card
className="rounded-2xl bg-white/80 backdrop-blur-md shadow-xl shadow-black/5 border border-white/20"

// Gradient Card (Ana Para Bloğu)
className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-2xl"

// Primary Button
className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 transition-all duration-200"

// Ghost Button
className="bg-transparent hover:bg-slate-100 text-slate-700 rounded-xl"

// Input
className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
```

### Zustand Store Pattern

```typescript
// stores/incomeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Income } from '@/types';

interface IncomeState {
  incomes: Income[];
  addIncome: (income: Income) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
}

export const useIncomeStore = create<IncomeState>()(
  persist(
    (set) => ({
      incomes: [],
      addIncome: (income) =>
        set((state) => ({ incomes: [...state.incomes, income] })),
      updateIncome: (id, updates) =>
        set((state) => ({
          incomes: state.incomes.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        })),
      deleteIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((i) => i.id !== id),
        })),
    }),
    { name: 'budgeify-income' } // LocalStorage key
  )
);
```

### Dosya İsimlendirme

| Tip | Format | Örnek |
|-----|--------|-------|
| Component | PascalCase | `MainBalanceCard.tsx` |
| Store | camelCase + Store | `incomeStore.ts` |
| Utility | camelCase | `formatCurrency.ts` |
| Type | camelCase | `index.ts` |
| Klasör | lowercase-dashes | `features/income/` |

---

## Git Commit Kuralları

### Conventional Commits Format

```
<type>(<scope>): <description>
```

**Types:**
- `feat`: Yeni özellik
- `fix`: Bug düzeltme
- `style`: UI/styling değişikliği (mantık değişmez)
- `refactor`: Kod yeniden yapılandırma
- `docs`: Döküman güncelleme
- `chore`: Bakım işleri

**Scopes:**
`ui` | `income` | `expense` | `analytics` | `goals` | `layout` | `store` | `utils`

**Örnekler:**
```bash
feat(ui): add Button component with variants
feat(expense): implement category autocomplete dropdown
fix(income): correct percentage calculation
style(layout): adjust bottom nav spacing for mobile
refactor(store): migrate to persist middleware
chore(setup): initialize Next.js project with Tailwind CSS
```

---

## Veri Modelleri

### Income (Gelir)

```typescript
interface Income {
  id: string;                    // UUID
  type: 'salary' | 'additional'; // Maaş veya ek gelir
  category: 'salary' | 'rent' | 'freelance' | 'bonus' | 'investment' | 'other';
  amount: number;                // Tutar (₺)
  description?: string;          // Açıklama (max 100 karakter)
  isRecurring: boolean;          // Düzenli mi?
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
}
```

### Expense (Gider)

```typescript
interface Expense {
  id: string;           // UUID
  categoryId: string;   // Kategori referansı
  amount: number;       // Tutar (₺)
  note?: string;        // Not (max 200 karakter)
  date: string;         // ISO date (YYYY-MM-DD)
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
```

### Category (Kategori)

```typescript
interface Category {
  id: string;           // Örn: 'cat_food'
  name: string;         // Örn: 'Yemek'
  emoji: string;        // Örn: '🍕'
  color: string;        // Hex renk
  isDefault: boolean;   // Sistem tanımlı mı?
  isActive: boolean;    // Aktif mi?
}
```

### Goal (Hedef)

```typescript
interface Goal {
  id: string;           // UUID
  name: string;         // Hedef adı (max 50 karakter)
  targetAmount: number; // Hedef tutar (₺)
  currentAmount: number;// Mevcut birikim (₺)
  icon: string;         // Emoji
  targetDate?: string;  // Hedef tarihi (opsiyonel)
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;    // ISO 8601
}
```

---

## Varsayılan Kategoriler

```typescript
const DEFAULT_CATEGORIES = [
  { id: 'cat_food', name: 'Yemek', emoji: '🍕', color: '#EF4444' },
  { id: 'cat_coffee', name: 'Kahve', emoji: '☕', color: '#8B4513' },
  { id: 'cat_market', name: 'Market', emoji: '🛒', color: '#22C55E' },
  { id: 'cat_transport', name: 'Ulaşım', emoji: '🚗', color: '#3B82F6' },
  { id: 'cat_bills', name: 'Faturalar', emoji: '💡', color: '#F59E0B' },
  { id: 'cat_rent', name: 'Kira', emoji: '🏠', color: '#8B5CF6' },
  { id: 'cat_health', name: 'Sağlık', emoji: '💊', color: '#EC4899' },
  { id: 'cat_entertainment', name: 'Eğlence', emoji: '🎬', color: '#06B6D4' },
  { id: 'cat_clothing', name: 'Giyim', emoji: '👕', color: '#14B8A6' },
  { id: 'cat_tech', name: 'Teknoloji', emoji: '💻', color: '#6366F1' },
  { id: 'cat_personal', name: 'Kişisel Bakım', emoji: '🪒', color: '#F472B6' },
  { id: 'cat_education', name: 'Eğitim', emoji: '📚', color: '#10B981' },
  { id: 'cat_credit_card', name: 'Kredi Kartı Borcu', emoji: '💳', color: '#DC2626' },
  { id: 'cat_loan', name: 'Kredi Borcu', emoji: '🏦', color: '#7C3AED' },
  { id: 'cat_gift', name: 'Hediye', emoji: '🎁', color: '#F97316' },
  { id: 'cat_sports', name: 'Spor', emoji: '🏋️', color: '#059669' },
  { id: 'cat_pet', name: 'Evcil Hayvan', emoji: '🐕', color: '#D97706' },
  { id: 'cat_other', name: 'Diğer', emoji: '📦', color: '#6B7280' },
];
```

---

## Mevcut Durum ve İlerleme

### Proje Durumu: **Geliştirme Aşaması**

| Faz | Durum | Açıklama |
|-----|-------|----------|
| Setup | ✅ Task 1.1-1.2 Tamamlandı | Next.js kurulumu, Tailwind CSS, klasör yapısı |
| UI Foundations | ✅ Task 2.1-2.3 Tamamlandı | Button, Card, Input componentleri |
| Layout | ✅ Task 3.1 Tamamlandı | Header, BottomNav, Sidebar |
| Income Module | Başlanmadı | Ana maaş girişi ve görüntüleme |
| Expense Module | Başlanmadı | Harcama ekleme, listeleme |
| Analytics & Goals | Başlanmadı | Grafikler, hedefler |

### Toplam İlerleme: **4/31 Görev (~13%)**

### Task 1.2 İlerleme ✅ TAMAMLANDI

✅ Tamamlanan:
- Klasör yapısı oluşturuldu (src/app, src/components, src/store, src/types, src/utils, src/constants, src/lib)
- tsconfig.json yapılandırıldı
- src/store/useBudgetStore.ts oluşturuldu (Zustand pattern rehberi ile)
- src/types/index.ts oluşturuldu
- Development Workflow protokolleri eklendi

### Task 2.1 İlerleme ✅ TAMAMLANDI

✅ Tamamlanan:
- Button component oluşturuldu (`src/components/ui/Button.tsx`)
- 4 varyant desteği: primary, secondary, outline, ghost
- 3 boyut desteği: sm, md, lg
- Icon desteği (left/right positioning)
- Loading state animasyonu
- Framer Motion entegrasyonu
- Full width desteği
- TypeScript strict typing

### Task 2.2 İlerleme ✅ TAMAMLANDI

✅ Tamamlanan:
- Card component oluşturuldu (`src/components/ui/Card.tsx`)
- Glassmorphism styling: `bg-white/80 backdrop-blur-md shadow-xl border-white/20`
- CardHeader, CardTitle, CardContent, CardFooter subcomponents
- Soft shadows ve border efektleri
- Compound component pattern
- page.tsx güncellendi (Button + Card test demo)
- Tüm button varyantları showcase edildi

### Task 2.3 İlerleme ✅ TAMAMLANDI

✅ Tamamlanan:
- Input component oluşturuldu (`src/components/ui/Input.tsx`)
- Label ve helper text desteği
- Error state styling (red border/ring)
- Left/right icon desteği (₺ simgesi örneği)
- 3 boyut desteği: sm, md, lg
- Focus ring efekti (blue-500)
- Disabled state desteği
- page.tsx güncellendi (Input + Button demo)
- Demo: Gelir Miktarı (₺ icon) ve Açıklama (error state)

### Task 3.1 İlerleme ✅ TAMAMLANDI

✅ Tamamlanan:
- Header Component oluşturuldu (`src/components/layout/Header.tsx`)
  - Sol taraf: Budgeify logosu (gradient renk) ve metin
  - Sağ taraf: User profil ikonu (hover efektiyle)
  - Glassmorphism: `backdrop-blur-md bg-white/80` ile görünür arka plan, `shadow-sm`
  - Fixed positioning: `top-0`, `z-50`, `w-full` ile sayfanın tamamını kaplama
- Layout Entegrasyonu: `src/app/layout.tsx` güncellendi
  - Header bileşeni import edildi ve `<body>` içinde `children`'ın üstünde konumlandırıldı
  - `<body>` etiketine `pt-16` class'ı eklenerek fixed header'ın altında doğru boşluk sağlandı
- Sayfa Yapısı Güncellemesi: `src/app/page.tsx` güncellendi
  - Demo bileşenler `<main>` etiketi içine sarıldı
  - `max-w-7xl mx-auto` ile içerik ortalandı
  - `pb-8 px-4 sm:px-6 lg:px-8` ile responsive padding eklendi (Header'dan sonraki `pt-16` ile çakışmaması için `main`'den `pt` kaldırıldı)
- Protokoller Applied: Token Protection (%90) ve Automatic Synchronization korundu.

---

## Sonraki Adım

**Task 3.2: BottomNav Component'i Oluşturma**
- Layout milestone'ına devam et
- Mobil alt navigasyon menüsü

Detaylı görev listesi için: `TASKS.md`

---

## Referans Dökümanlar

| Dosya | Açıklama |
|-------|----------|
| `budgeify-starter-pack/PRD.md` | Tüm özellik detayları, wireframe'ler |
| `budgeify-starter-pack/.cursorrules` | AI kodlama kuralları |
| `budgeify-starter-pack/UI_REFERENCE.jpeg` | Görsel tasarım referansı |
| `TASKS.md` | 31 görevlik yol haritası |

---

## Development Workflow Protokolleri

### Token Koruma Protokolü (Token Protection Protocol)
- Session token limiti maksimum: **%100**
- **KRİTİK**: Token kullanımı **%90**'a ulaştığında derhal DURDUR
- Limit yaklaşırken yeni görevlere başlama
- Durma anında tüm ilerlemeyi kaydet

### Otomatik Senkronizasyon (Automatic Synchronization)
Her başarılı görev bitiminde VEYA token limit nedeniyle durduğunda:
- `CLAUDE.md` ve `TASKS.md` dosyalarını otomatik güncelle
- Mevcut ilerleme durumunu kaydet
- Tamamlanan/devam eden/engellenen görevleri işle
- Son dosya değişikliklerini dokümante et
- Oturum notlarını kaydet

### Git Otomasyonu (Git Automation)
Her milestone (görev bloğu) tamamlandığında:
- Değişiklikleri CLAUDE.md standartlarında commit et
- GitHub'a push et: `git push origin main`
- Tanımlayıcı commit mesajı kullan: `feat(scope): description`
- Conventional Commits formatına uygun kalma

### Devir Teslim (Handover Documentation)
Token limit veya oturum bitiminde:
- `CLAUDE.md`'ye "Token Limit Summary" başlığı ekle
- Tamamlananları, bekleyenleri, sonraki adımları dokümante et
- Engelleme sorunlarını ve bağımlılıkları belirt
- Sonraki oturum için anında başlayabilecek durumda bırak

---

## Önemli Hatırlatmalar

### Yapılması Gerekenler ✅

- [x] Her değişiklikten sonra `npm run build` kontrol et
- [x] TypeScript hatalarını çöz
- [x] Mobile-first tasarım uygula
- [x] Tailwind class'ları kullan
- [x] Component'leri 200 satırın altında tut
- [x] Semantic HTML kullan
- [x] Türkçe UI, İngilizce kod
- [x] CLAUDE.md ve TASKS.md'yi senkron tut
- [x] Token limitini izle (%90 yaklaşıldığında dur)
- [x] Her milestone'dan sonra commit ve push yap

### Yapılmaması Gerekenler ❌

- [ ] `any` tipi kullanma
- [ ] Hardcoded renk değerleri kullanma
- [ ] CSS modules veya styled-components kullanma
- [ ] Bozuk kod commit etme
- [ ] Class-based component yazma
- [ ] Inline style kullanma
- [ ] Token limit yaklaşırken devam etme
- [ ] Progress dosyalarını güncellememek
- [ ] GitHub'a push yapmadan commit etme

---

## Yardımcı Linkler

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Zustand:** https://zustand-demo.pmnd.rs/
- **Recharts:** https://recharts.org/
- **Framer Motion:** https://www.framer.com/motion/
- **Lucide Icons:** https://lucide.dev/icons/

---

*Son Güncelleme: 4 Şubat 2026*