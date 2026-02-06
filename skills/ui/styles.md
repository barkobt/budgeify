# Skill: UI Styles — HubX Edition v3.2

> Budgeify'ın görsel anayasası. Tüm bileşenler bu dosyadaki kurallara uymalıdır.
> Canonical source: `skills/ui/styles.md` — CONVENTIONS.md bu dosyaya referans verir.

---

## 1. Visual Identity: Pure Black + Indigo Glow

### Foundation Philosophy
```
"Siyah bir tuvaldir. Indigo ışığı sadece anlam taşıyan yerlerde parlar."

Renk Dağılımı:
- %75 Pure Black Foundation (backgrounds, surfaces)
- %15 Semantic Colors (emerald=income, rose=expense, amber=warning)
- %10 Indigo Glow Accent (CTA, focus, active states ONLY)
```

### Background Palette
```css
/* Pure Black Foundation */
--bg-base:      #000000;   /* Body background — absolute black */
--bg-surface:   #050505;   /* Primary surface */
--bg-elevated:  #0A0A0A;   /* Elevated containers */
--bg-card:      #0F0F0F;   /* Card backgrounds */
--bg-interactive:#141414;   /* Hover/interactive surfaces */
```

### Indigo Glow Accent
```css
/* Primary Accent — strategic use only */
--indigo-glow:  #4F46E5;   /* Hero accent, CTA buttons */
--indigo-400:   #818CF8;   /* Light accent, links, subtle highlights */
--indigo-500:   #6366F1;   /* Secondary accent */
--indigo-600:   #4F46E5;   /* Primary accent — THE glow */
--indigo-700:   #4338CA;   /* Hover state */
--indigo-800:   #3730A3;   /* Active/pressed state */
--indigo-900:   #312E81;   /* Deep accent, backgrounds */

/* Glow Effects */
--glow-sm:      0 0 12px rgba(79, 70, 229, 0.15);
--glow-md:      0 0 24px rgba(79, 70, 229, 0.20);
--glow-lg:      0 0 48px rgba(79, 70, 229, 0.25);
--glow-xl:      0 0 64px rgba(79, 70, 229, 0.30), 0 0 128px rgba(79, 70, 229, 0.10);
```

### Semantic Colors
```css
--success:      #10B981;   /* Income, positive actions, goal completion */
--error:        #F43F5E;   /* Expense, destructive actions, alerts */
--warning:      #F59E0B;   /* Approaching limits, caution states */
--info:         #818CF8;   /* Informational, neutral highlights */
```

### Text Hierarchy
```css
--text-primary:   #FFFFFF;              /* Headings, primary content */
--text-secondary: #A1A1AA;              /* Body text, descriptions */
--text-tertiary:  #71717A;              /* Captions, metadata */
--text-muted:     #52525B;              /* Disabled, placeholder */
--text-accent:    #818CF8;              /* Links, interactive text */
```

---

## 2. Glassmorphism v3.2

### Core Formula
```
background: rgba(255, 255, 255, {opacity});
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.10);
```

### Levels
```css
/* Level 1 — Ambient (background elements, overlays) */
.glass-ambient {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

/* Level 2 — Subtle (secondary containers, sidebars) */
.glass-subtle {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Level 3 — Card (primary containers, data cards) */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Level 4 — Elevated (modals, drawers, active cards) */
.glass-elevated {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

/* Level 5 — Focus (active/focused elements, Indigo glow) */
.glass-focus {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(79, 70, 229, 0.40);
  box-shadow: var(--glow-md);
}
```

### Rules
- **blur: 12px** is the universal constant — never deviate
- **border: 1px solid white/10** is the default card border
- Glow borders (`--indigo-glow`) reserved for focus/active states only
- No `box-shadow` without `backdrop-filter` — they are paired

---

## 3. Motion Math — HubX Assembly System

### Spring Physics (Canonical Config)
```typescript
// THE spring — used for all scroll-driven assembly animations
const ASSEMBLY_SPRING = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
  mass: 1,
} as const;
```

### Spring Variants
```typescript
const springs = {
  /** Assembly: scroll-driven module convergence */
  assembly: { type: 'spring', stiffness: 260, damping: 20, mass: 1 },

  /** Gentle: content reveals, fade-ins */
  gentle:   { type: 'spring', stiffness: 170, damping: 26, mass: 1 },

  /** Snappy: tap feedback, toggles, micro-interactions */
  snappy:   { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 },

  /** Heavy: drawers, sheets, deliberate movement */
  heavy:    { type: 'spring', stiffness: 200, damping: 28, mass: 1.2 },
} as const;
```

### Scroll-Driven Assembly Logic
```
Oracle Core Assembly — modules arrive at different scroll offsets:

ScrollY Progress:  0.0 ──── 0.15 ──── 0.25 ──── 0.35 ──── 0.50 ──── 1.0
                    │         │          │          │          │         │
                    │    Income arrives   │     Goals arrive    │         │
                    │         │     Expense arrives  │    All merged      │
                    │         │          │          │          │         │
State:          [Scattered] ─── [Identifying Patterns] ─── [Predicting] ─── [Active]
```

### Module Interpolation Map
```typescript
// Each module has a unique scroll offset for non-linear arrival
const MODULE_SCROLL_OFFSETS = {
  income:    { start: 0.05, end: 0.20 },  // First to arrive
  expense:   { start: 0.12, end: 0.30 },  // Second wave
  goals:     { start: 0.20, end: 0.40 },  // Third wave
  analytics: { start: 0.25, end: 0.45 },  // Fourth wave
  insights:  { start: 0.30, end: 0.50 },  // Last to arrive
} as const;

// Easing: non-linear approach — fast start, slow settle
// Use cubicBezier(0.16, 1, 0.3, 1) for expo-out feel
```

### Assembly States (layoutId transitions)
```typescript
type OracleState = 'identifying' | 'predicting' | 'active';

// State transitions driven by scroll progress:
// 0.00 - 0.30 → 'identifying'  (modules scattered, circuit lines dim)
// 0.30 - 0.60 → 'predicting'   (modules converging, glow intensifying)
// 0.60 - 1.00 → 'active'       (all merged at core, full indigo glow)
```

### Duration Guidelines
```
Micro  (hover, focus)      : 150ms
Small  (buttons, toggles)  : 200ms
Medium (cards, panels)     : 300ms
Large  (modals, drawers)   : 400ms
Hero   (page transitions)  : 500ms
Assembly (scroll-driven)   : spring-based (no fixed duration)
```

### Golden Rules
1. **60fps or nothing** — only animate `transform` and `opacity`
2. **Spring > duration** — prefer spring physics over fixed durations
3. **Purpose over pretty** — every animation must have a functional reason
4. **Respect `prefers-reduced-motion`** — disable assembly, keep opacity fades
5. **No overshoot on data surfaces** — financial numbers must never bounce

---

## 4. Iconography — Lucide React (Strict)

### Rules
```
- ONLY Lucide React icons in production UI
- NO emojis anywhere in the interface
- NO custom SVGs unless approved in this manifest
- strokeWidth: 2 (default), 1.5 (large icons > 24px)
- size: 16 (inline), 20 (standard), 24 (hero/feature)
```

### Icon Color Rules
```tsx
// Default: inherit text color
<Wallet size={20} className="text-current" strokeWidth={2} />

// Accent: Indigo Glow — CTA/active only
<Wallet size={20} className="text-indigo-400" strokeWidth={2} />

// Semantic: match context
<TrendingUp size={20} className="text-emerald-400" />   // Income
<TrendingDown size={20} className="text-rose-400" />     // Expense
<Target size={20} className="text-violet-400" />          // Goals
<BarChart3 size={20} className="text-indigo-400" />       // Analytics
```

### Module Icon Map
```typescript
const MODULE_ICONS = {
  income:    TrendingUp,
  expense:   TrendingDown,
  goals:     Target,
  analytics: BarChart3,
  insights:  Sparkles,
  wallet:    Wallet,
  oracle:    Sparkles,
} as const;
```

---

## 5. Typography (Inter Variable)

```
Display    : text-5xl  / font-black  / tracking-tight  / text-white
Heading 1  : text-3xl  / font-bold   / text-white
Heading 2  : text-2xl  / font-semibold / text-white
Heading 3  : text-xl   / font-semibold / text-zinc-200
Body Large : text-lg   / font-normal / text-zinc-300
Body       : text-base / font-normal / text-zinc-400
Body Small : text-sm   / font-medium / text-zinc-400
Caption    : text-xs   / font-medium / tracking-wide / text-zinc-500
Mono       : text-sm   / font-mono   / tabular-nums  / text-zinc-300
```

---

## 6. Spacing (8px Harmonic Grid)

```
Card padding     : p-6 (24px)
Section gaps     : gap-6 (24px)
Button padding   : px-6 py-3 (24px x 12px)
Input padding    : px-4 py-3.5 (16px x 14px)
Touch targets    : min 44x44px
Component gap    : gap-4 (16px)
Inline gap       : gap-2 (8px)
```

---

## 7. Component Styling Patterns

### Card
```tsx
className="rounded-2xl glass-card p-6"
```

### Primary Button (Indigo Glow — CTA only)
```tsx
className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
           text-white rounded-xl px-6 py-3
           shadow-[0_0_24px_rgba(79,70,229,0.20)]
           hover:shadow-[0_0_32px_rgba(79,70,229,0.30)]
           transition-all duration-200"
```

### Ghost Button
```tsx
className="bg-transparent hover:bg-white/5 text-zinc-400
           hover:text-zinc-200 rounded-xl px-4 py-2
           transition-colors duration-150"
```

### Input with Indigo Focus
```tsx
className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5
           text-white placeholder:text-zinc-600
           focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20
           transition-all duration-200"
```

---

## 8. Responsive Strategy (Mobile-First)

```
Base   : 375px  (design target)
sm     : 640px  (large phones)
md     : 768px  (tablets)
lg     : 1024px (laptops)
xl     : 1280px (desktops)
```

### Rules
- Design for 375px first, enhance progressively
- Touch targets: minimum 44x44px
- Safe area support for notched devices
- Bottom navigation for mobile, sidebar for desktop
- Oracle Assembly: simplified on mobile (no scroll-driven, fade-in only)

---

## 9. Prohibited Patterns

```
[X] Inline styles (use Tailwind)
[X] CSS modules / styled-components
[X] Hardcoded color values (use CSS variables / Tailwind)
[X] Emojis in production UI (use Lucide icons)
[X] Animations > 600ms (except spring-based assembly)
[X] Non-GPU properties in animations (no width, height, top, left)
[X] Missing loading/error/empty states
[X] box-shadow without backdrop-filter on glass elements
[X] Fixed durations for interactive animations (use springs)
[X] Overshoot/bounce on financial data displays
```

---

*Skill Module: UI Styles — HubX Edition v3.2*
*Stack: Tailwind CSS 4 | Framer Motion | Lucide React | Inter Variable Font*
*Foundation: Pure Black #000 | Indigo Glow #4F46E5 | Glassmorphism blur(12px)*
