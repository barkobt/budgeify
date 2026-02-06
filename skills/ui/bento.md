# Skill: Bento Grid Layout — Sovereign v4.0

> Apple Control Center / Widget-inspired spatial dashboard layout.
> Canonical source: `skills/ui/bento.md` — CONVENTIONS.md references this file.
> Parent spec: `skills/ui/styles.md`

---

## 1. Design Vision

```
"Japon yemek kutusu düzeni — her veri parçası kendi kutusunda,
ama hepsi birlikte mükemmel bir bütün oluşturur."

Ilham Kaynaklari:
- Apple Control Center (iOS 18)
- Apple Widget Gallery
- Linear App Dashboard
- Vercel Analytics Grid
```

---

## 2. Grid System

### Foundation: CSS Grid (2-Column Base)

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;                          /* Tight spacing for cohesion */
  padding: 0;
  width: 100%;
}
```

### Card Sizes (col × row)

```
1×1  : Single cell       — stats, quick actions, mini indicators
2×1  : Full-width short  — insights, savings bar, notification banners
1×2  : Tall card         — vertical chart, goal progress stack
2×2  : Hero card         — balance display, main data surface
full : Full-width auto   — Oracle Hero, special sections
```

### Grid Template

```
Dashboard Layout (Mobile 375px, 2-col):

┌─────────────────────────────┐
│      Oracle Hero (full)     │  row-auto
├──────────────┬──────────────┤
│              │              │
│  Balance     │  Balance     │  2×2 hero
│  (2×2)       │  (cont.)    │
│              │              │
├──────────────┼──────────────┤
│  İşlemler    │  Hedefler    │  1×1 stats
│  (1×1)       │  (1×1)       │
├──────────────┼──────────────┤
│  + Gelir     │  + Gider     │  1×1 actions
│  (1×1)       │  (1×1)       │
├──────────────┴──────────────┤
│  Oracle Insight (2×1)       │  AI card
├──────────────┴──────────────┤
│  Tasarruf Oranı (2×1)      │  Savings ring
└─────────────────────────────┘
```

---

## 3. BentoCard Component

### Base Styles

```css
.bento-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition: transform 300ms var(--ease-out-expo),
              box-shadow 300ms var(--ease-out-expo);
}

.bento-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
```

### Size Variants

```css
/* 1×1 — Single cell */
.bento-1x1 {
  grid-column: span 1;
  grid-row: span 1;
  padding: 16px;
  min-height: 100px;
}

/* 2×1 — Full width, single row */
.bento-2x1 {
  grid-column: span 2;
  grid-row: span 1;
  padding: 20px;
  min-height: 100px;
}

/* 1×2 — Single column, double row */
.bento-1x2 {
  grid-column: span 1;
  grid-row: span 2;
  padding: 20px;
}

/* 2×2 — Full width, double row */
.bento-2x2 {
  grid-column: span 2;
  grid-row: span 2;
  padding: 24px;
  min-height: 200px;
}

/* Full — breaks out of grid, full width */
.bento-full {
  grid-column: 1 / -1;
  padding: 0;
}
```

### Interactive States

```css
/* Pressable bento card */
.bento-card--pressable {
  cursor: pointer;
}

.bento-card--pressable:active {
  transform: scale(0.98);
}

/* Accent glow on active/focused */
.bento-card--glow {
  border-color: rgba(79, 70, 229, 0.25);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 0 24px rgba(79, 70, 229, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
```

---

## 4. Stagger Animation

```typescript
// BentoGrid children animate in with staggered delay
const bentoStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

const bentoItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
      mass: 0.8,
    },
  },
};
```

---

## 5. Responsive Behavior

```css
/* Mobile (375px) — default 2-col */
.bento-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* Tablet (768px) — wider gaps */
@media (min-width: 768px) {
  .bento-grid {
    gap: 16px;
  }
}
```

### Mobile Rules
- 2×2 cards remain full-width on all breakpoints
- 1×1 cards stack 2 per row
- Touch targets: minimum 44×44px
- Safe area padding for notched devices

---

## 6. Card Content Patterns

### 1×1 Stat Card
```
┌─────────────┐
│ 🔵 Icon     │
│              │
│   42         │  ← Big number
│  İşlem       │  ← Label
│         ›    │  ← Chevron
└─────────────┘
```

### 1×1 Action Card
```
┌─────────────┐
│   ↗ Icon    │  ← Semantic color bg
│              │
│  Gelir Ekle  │  ← Action title
│  Maaş, ek   │  ← Subtitle
└─────────────┘
```

### 2×1 Insight Card
```
┌─────────────────────────────┐
│ ✨ Oracle AI    Score: 78   │
│ Harcamalarınız geçen aya... │
│ ● ● ○                      │
└─────────────────────────────┘
```

### 2×2 Balance Hero
```
┌─────────────────────────────┐
│ 💰 Mevcut Bakiye    +23%  │
│                             │
│    ₺12,450.00              │  ← AnimatedCounter
│                             │
│ ┌───────────┬─────────────┐ │
│ │ ● Gelir   │ ● Gider     │ │
│ │ ₺18,000   │ ₺5,550      │ │
│ └───────────┴─────────────┘ │
└─────────────────────────────┘
```

### 2×1 Savings Card
```
┌─────────────────────────────┐
│ 🐷 Tasarruf Oranı          │
│  %23 / %30 hedef           │
│ ████████████░░░░░   %77    │
└─────────────────────────────┘
```

---

## 7. Accessibility

- All interactive bento cards: `role="button"`, `tabIndex={0}`
- Keyboard navigation: `Enter`/`Space` to activate
- `aria-label` on stat cards with full context
- Focus ring: `box-shadow: 0 0 0 2px #000, 0 0 0 4px rgba(79,70,229,0.5)`
- `prefers-reduced-motion`: disable stagger, keep opacity fade

---

## 8. Prohibited Patterns

```
[X] Fixed pixel widths on bento cards (use grid span)
[X] More than 2 columns on mobile
[X] Cards without min-height (causes layout shift)
[X] Missing hover/active states on interactive cards
[X] Inline styles for sizing (use bento-* classes)
[X] Nested grids inside bento cards (keep flat)
[X] Shadow without backdrop-filter on glass bento cards
```

---

*Skill Module: Bento Grid Layout — Sovereign v4.0*
*Grid: 2-col CSS Grid | Gap: 12px | Sizes: 1×1, 2×1, 1×2, 2×2, full*
*Style: Glassmorphism blur(12px) + VisionOS inner light + 20px border-radius*
*Animation: Framer Motion stagger (0.06s) + spring entry (260/24/0.8)*
