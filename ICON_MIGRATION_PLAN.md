# Icon Migration Plan - Emoji → Lucide React

> **Hedef:** Amatör emoji ikonlardan profesyonel Lucide icons'a geçiş

**Date:** 4 Şubat 2026
**Status:** 📋 Planning Complete - Ready for Implementation (Milestone 2+)

---

## 🎯 Stratejik Hedef

**Current:** 18 kategori + 12 hedef ikonu = **30 emoji** (amatör görünüm)
**Target:** 30 Lucide React icon (fintech-grade, tutarlı, ölçeklenebilir)

---

## 📦 Kategori İkonları (18 adet)

### Current → Target Mapping

| Kategori | Mevcut Emoji | Lucide Icon | Rationale |
|----------|--------------|-------------|-----------|
| Yemek | 🍕 | `Utensils` | Çatal-bıçak sembolü evrensel |
| Kahve | ☕ | `Coffee` | Direkt match, kahve fincanı |
| Market | 🛒 | `ShoppingCart` | Alışveriş sepeti |
| Ulaşım | 🚗 | `Car` | Araba ikonu |
| Faturalar | 💡 | `Lightbulb` | Elektrik/fatura sembolü |
| Kira | 🏠 | `Home` | Ev ikonu |
| Sağlık | 💊 | `HeartPulse` | Sağlık + nabız göstergesi |
| Eğlence | 🎬 | `Film` | Sinema/eğlence |
| Giyim | 👕 | `Shirt` | Giysi ikonu |
| Teknoloji | 💻 | `Laptop` | Laptop/bilgisayar |
| Kişisel Bakım | 🪒 | `Scissors` | Berber/makas (daha evrensel) |
| Eğitim | 📚 | `BookOpen` | Açık kitap |
| Kredi Kartı | 💳 | `CreditCard` | Kredi kartı |
| Kredi Borcu | 🏦 | `Landmark` | Banka binası |
| Hediye | 🎁 | `Gift` | Hediye kutusu |
| Spor | 🏋️ | `Dumbbell` | Ağırlık/spor |
| Evcil Hayvan | 🐕 | `Dog` | Köpek ikonu |
| Diğer | 📦 | `Package` | Paket/kutu |

---

## 🎯 Hedef İkonları (12 adet)

### Current → Target Mapping

| Hedef Adı | Mevcut Emoji | Lucide Icon | Rationale |
|-----------|--------------|-------------|-----------|
| Ev | 🏠 | `Home` | Ev ikonu |
| Araba | 🚗 | `Car` | Araba ikonu |
| Tatil | ✈️ | `Plane` | Uçak |
| Teknoloji | 💻 | `Laptop` | Laptop |
| Düğün | 👰 | `Heart` | Kalp (aşk/düğün) |
| Eğitim | 🎓 | `GraduationCap` | Mezuniyet şapkası |
| Yatırım | 💍 | `TrendingUp` | Yükselen grafik |
| Sağlık | 🏥 | `HeartPulse` | Sağlık nabız |
| Etkinlik | 🎂 | `PartyPopper` | Parti konfetisi |
| Evcil Hayvan | 🐕 | `Dog` | Köpek |
| Mobilya | 🛋️ | `Sofa` | Koltuk |
| Diğer | 💰 | `Wallet` | Cüzdan (para/tasarruf) |

---

## 🏗️ Implementation Strategy

### Phase 1: Type System Update (Milestone 2)

**File:** `src/types/index.ts`

```typescript
// BEFORE
interface Category {
  id: string;
  name: string;
  emoji: string; // ❌ Amatör
  color: string;
  isDefault: boolean;
  isActive: boolean;
}

// AFTER
interface Category {
  id: string;
  name: string;
  iconName: string; // ✅ Lucide icon name (örn: 'Utensils')
  color: string;
  isDefault: boolean;
  isActive: boolean;
}
```

---

### Phase 2: Constants Update (Milestone 2)

**File:** `src/constants/categories.ts`

```typescript
// BEFORE
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Yemek', emoji: '🍕', color: '#EF4444', ... },
  // ...
];

// AFTER
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Yemek', iconName: 'Utensils', color: '#EF4444', ... },
  { id: 'cat_coffee', name: 'Kahve', iconName: 'Coffee', color: '#8B4513', ... },
  // ... (18 total)
];
```

**File:** `src/constants/goals.ts` (new file)

```typescript
import type { LucideIcon } from 'lucide-react';
import {
  Home, Car, Plane, Laptop, Heart, GraduationCap,
  TrendingUp, HeartPulse, PartyPopper, Dog, Sofa, Wallet
} from 'lucide-react';

export const GOAL_ICONS: Array<{ icon: LucideIcon; label: string; name: string }> = [
  { icon: Home, label: 'Ev', name: 'Home' },
  { icon: Car, label: 'Araba', name: 'Car' },
  { icon: Plane, label: 'Tatil', name: 'Plane' },
  { icon: Laptop, label: 'Teknoloji', name: 'Laptop' },
  { icon: Heart, label: 'Düğün', name: 'Heart' },
  { icon: GraduationCap, label: 'Eğitim', name: 'GraduationCap' },
  { icon: TrendingUp, label: 'Yatırım', name: 'TrendingUp' },
  { icon: HeartPulse, label: 'Sağlık', name: 'HeartPulse' },
  { icon: PartyPopper, label: 'Etkinlik', name: 'PartyPopper' },
  { icon: Dog, label: 'Evcil Hayvan', name: 'Dog' },
  { icon: Sofa, label: 'Mobilya', name: 'Sofa' },
  { icon: Wallet, label: 'Diğer', name: 'Wallet' },
];
```

---

### Phase 3: Icon Component (Milestone 2)

**File:** `src/components/ui/CategoryIcon.tsx` (new)

```typescript
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CategoryIconProps {
  iconName: string; // Lucide icon name
  color?: string; // Hex color
  size?: number; // Icon size
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  color = '#64748B',
  size = 20,
  className = ''
}) => {
  // Dynamically get icon from lucide-react
  const Icon = (LucideIcons as any)[iconName] as LucideIcon;

  if (!Icon) {
    // Fallback to Package icon
    return <LucideIcons.Package size={size} className={className} style={{ color }} />;
  }

  return <Icon size={size} className={className} style={{ color }} />;
};
```

**Usage:**
```tsx
<CategoryIcon iconName="Utensils" color="#EF4444" size={24} />
```

---

### Phase 4: Component Updates (Milestone 2)

**Files to Update:**

1. **CategoryAutocomplete.tsx**
   - Replace emoji rendering with `<CategoryIcon />`
   - Update keyboard navigation to work with icons

2. **ExpenseList.tsx**
   - Replace emoji with `<CategoryIcon />`
   - Ensure consistent icon size (20px)

3. **CategoryChart.tsx**
   - Replace emoji labels with icon + text
   - Adjust legend spacing

4. **GoalForm.tsx**
   - Replace emoji grid with icon grid
   - Use GOAL_ICONS constant
   - Update selection state

5. **GoalCard.tsx**
   - Replace emoji with `<CategoryIcon />`
   - Adjust icon size (24px for prominence)

---

## 🎨 Design Guidelines

### Icon Sizing

| Context | Size | Rationale |
|---------|------|-----------|
| Dropdown/List | 18-20px | Compact, readable |
| Card/Form | 24px | Prominent, balanced |
| Hero/Featured | 32-40px | Large, attention-grabbing |

### Icon Coloring

1. **Category Icons:**
   - Use category.color (semantic color)
   - Example: Food → Red (#EF4444)

2. **Goal Icons:**
   - Use Kral İndigo (#1E40AF) for active goals
   - Use slate-400 (#94A3B8) for inactive

3. **Hover States:**
   - Darken color by 10% (HSL manipulation)
   - Add subtle scale animation (1.1x)

### Icon Backgrounds

**Option A: Minimal (Recommended)**
```tsx
<CategoryIcon iconName="Utensils" color="#EF4444" size={20} />
```

**Option B: Circular Background**
```tsx
<div className="p-2 rounded-full bg-red-50">
  <CategoryIcon iconName="Utensils" color="#EF4444" size={20} />
</div>
```

**Option C: Square Background (Current style)**
```tsx
<div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600">
  <CategoryIcon iconName="Utensils" color="#FFFFFF" size={20} />
</div>
```

---

## 🔄 Migration Checklist

### Pre-Migration
- [x] Plan icon mapping (this document) ✅
- [ ] Create CategoryIcon component
- [ ] Create GOAL_ICONS constant
- [ ] Update TypeScript types

### Migration
- [ ] Update categories.ts (emoji → iconName)
- [ ] Update CategoryAutocomplete component
- [ ] Update ExpenseList component
- [ ] Update CategoryChart component
- [ ] Update GoalForm component
- [ ] Update GoalCard component

### Post-Migration
- [ ] Remove all emoji references (global search)
- [ ] Test all icon displays (visual QA)
- [ ] Verify accessibility (ARIA labels)
- [ ] Update CLAUDE.md (icon system documentation)
- [ ] Commit: "feat(icons): migrate from emoji to Lucide React"

---

## 📊 Impact Analysis

### Bundle Size Impact
- Lucide React (tree-shakeable): +2-3kB per icon imported
- Estimated: +60-90kB for 30 icons
- **Total:** 242kB → ~300-320kB (still under 400kB target)

### Performance Impact
- SVG icons render faster than emoji (browser consistency)
- No font loading (emoji rely on system fonts)
- Better scaling (vector vs. raster)

### Accessibility Impact
- Better screen reader support (proper ARIA labels)
- Consistent rendering across platforms
- Higher contrast (controlled colors)

---

## 🚀 Timeline

- **Milestone 2 (Task 2.1-2.4):** Layout Revolution
- **Milestone 3 (Task 3.1-3.5):** UI Consistency & Design System
  - **Task 3.5:** Icon System Implementation ⚡ (2-3 hours)

**Estimated Total Effort:** 4 hours (planning: 30min, implementation: 3.5 hours)

---

## 📝 Notes

- **Backward Compatibility:** Store migration akan keep emoji temporarily during transition
- **User Data:** Existing user data won't be affected (localStorage remains compatible)
- **Fallback:** CategoryIcon component has Package icon fallback for unknown icons

---

**Status:** ✅ Plan Complete - Ready for Implementation in Milestone 3
