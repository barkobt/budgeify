# Skill: UI & Design System

> Budgeify'ın görsel kimliği ve bileşen mimarisi.
> Tetikleyici: UI bileşeni oluşturma, styling, animasyon, responsive tasarım görevleri.

---

## Design Vision: HubX / Cosmic Indigo / Glassmorphism 2.0

### Temel Felsefe
```
"İndigo bir kraldır, her yerde görünmez ama göründüğü yerde otorite kurar."

Renk Dağılımı:
- %70 Neutral Foundation (cosmic backgrounds, slate tones)
- %20 Semantic Colors (emerald=income, rose=expense, amber=warning)
- %10 Kral İndigo Accent (CTA buttons, focus rings, active indicators ONLY)
```

---

## Color System

### Cosmic Backgrounds (Dark Theme)
```css
--cosmic-950: #040608;   /* Deepest space - body bg */
--cosmic-900: #080B14;   /* Primary background */
--cosmic-800: #0D1321;   /* Elevated surfaces */
--cosmic-700: #151E31;   /* Cards, containers */
--cosmic-600: #1E293B;   /* Interactive elements */
```

### Kral İndigo Accent
```css
--accent-400: #60A5FA;   /* Light accent, links */
--accent-500: #3B82F6;   /* Primary accent */
--accent-600: #2563EB;   /* Hover state */
--accent-700: #1D4ED8;   /* Active/pressed state */
--accent-800: #1E40AF;   /* Deep accent */
```

### Semantic Colors
```css
--success: #10B981;      /* Income, positive actions */
--error: #F43F5E;        /* Expense, destructive actions */
--warning: #F59E0B;      /* Alerts, approaching limits */
```

### Glass & Transparency
```css
--glass-white-subtle: rgba(255, 255, 255, 0.02);
--glass-white-card:   rgba(255, 255, 255, 0.04);
--glass-white-hover:  rgba(255, 255, 255, 0.08);
--glass-white-focus:  rgba(255, 255, 255, 0.12);
--border-subtle:      rgba(255, 255, 255, 0.08);
--border-visible:     rgba(255, 255, 255, 0.12);
```

---

## Glassmorphism Levels

```css
/* Level 1 - Ambient (background elements) */
.glass-ambient {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

/* Level 2 - Subtle (secondary containers) */
.glass-subtle {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Level 3 - Card (primary containers) */
.glass-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Level 4 - Elevated (interactive cards, modals) */
.glass-elevated {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* Level 5 - Focus (active/focused elements) */
.glass-focus {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
}
```

---

## Component Patterns

### Card Component
```tsx
<Card variant="default" size="md" hover>
  <CardHeader noBorder>
    <CardTitle>Aylık Özet</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Button Variants
```tsx
// Primary (Kral İndigo) - CTA only
<Button variant="primary">Gelir Ekle</Button>
className="bg-accent-500 hover:bg-accent-600 text-white rounded-xl px-6 py-3"

// Secondary
<Button variant="secondary">İptal</Button>
className="bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl"

// Ghost
<Button variant="ghost">Detaylar</Button>
className="bg-transparent hover:bg-white/5 text-slate-400 rounded-xl"

// Danger
<Button variant="danger">Sil</Button>
className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl"
```

### Input Component
```tsx
<Input
  label="Tutar"
  leftIcon={<TurkishLira />}
  placeholder="0.00"
  error={errors.amount?.message}
/>
className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5
           focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20
           placeholder:text-slate-500 text-white"
```

---

## Typography (Inter Variable)

```
Display    : text-5xl  / font-black  / tracking-tight  / text-white
Heading 1  : text-3xl  / font-bold   / text-white
Heading 2  : text-2xl  / font-semibold / text-white
Heading 3  : text-xl   / font-semibold / text-slate-200
Body Large : text-lg   / font-normal / text-slate-300
Body       : text-base / font-normal / text-slate-300
Body Small : text-sm   / font-medium / text-slate-400
Caption    : text-xs   / font-medium / tracking-wide / text-slate-500
```

---

## Icons (Lucide React)

```tsx
import { Wallet, TrendingUp, TrendingDown, Target, Receipt } from 'lucide-react';

// Standard icon usage
<Wallet size={20} className="text-accent-500" strokeWidth={2} />

// Category icons (expense)
const EXPENSE_ICONS = {
  cat_food: Pizza, cat_coffee: Coffee, cat_market: ShoppingCart,
  cat_transport: Car, cat_bills: Lightbulb, cat_rent: Home,
  cat_health: Heart, cat_entertainment: Film, cat_clothing: Shirt,
  cat_tech: Laptop, cat_personal: Scissors, cat_education: BookOpen,
  cat_credit_card: CreditCard, cat_loan: Building2, cat_gift: Gift,
  cat_sports: Dumbbell, cat_pet: Dog, cat_other: Package,
};

// NO emojis in production UI
```

---

## Spacing (8px Harmonic Grid)

```
Card padding     : p-6 (24px)
Section gaps     : gap-6 (24px)
Button padding   : px-6 py-3 (24px × 12px)
Input padding    : px-4 py-3.5 (16px × 14px)
Touch targets    : min 44×44px
```

---

## Animation Principles

### Timing Functions
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);     /* Premium feel */
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Overshoot */
--spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);   /* Organic */
```

### Duration Guidelines
```
Micro  (hover, focus)     : 150ms
Small  (buttons, toggles) : 200ms
Medium (cards, panels)    : 300ms
Large  (modals, drawers)  : 400ms
Hero   (page transitions) : 500ms
```

### Golden Rules
1. **Purpose over pretty** - her animasyonun bir sebebi olmalı
2. **60fps or nothing** - sadece `transform` ve `opacity`
3. **Respect reduced motion** - `prefers-reduced-motion` kontrol et
4. **200-600ms sweet spot** - daha uzun = yavaş his

---

## Responsive Strategy (Mobile-First)

```
Base   : 375px (design target)
sm     : 640px (large phones)
md     : 768px (tablets)
lg     : 1024px (laptops)
xl     : 1280px (desktops)
```

### Rules
- Design for 375px first, enhance progressively
- Touch targets: minimum 44×44px
- Safe area support for notched devices
- Bottom navigation for mobile, sidebar for desktop

---

## Prohibited
```
❌ Inline styles
❌ CSS modules / styled-components
❌ Hardcoded color values (use CSS variables / Tailwind)
❌ Emojis in production UI (use Lucide icons)
❌ Animations > 600ms
❌ Non-GPU properties in animations (avoid width, height, top, left)
❌ Missing loading/error/empty states
```

---

*Skill Module: UI & Design System*
*Stack: Tailwind CSS 4 | Framer Motion | Lucide React | Inter Variable Font*
*Vision: HubX / Cosmic Indigo / Glassmorphism 2.0*
