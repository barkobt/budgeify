# Skill: UI Styles — Sovereign v4.0

> Budgeify'ın görsel anayasası. Tüm bileşenler bu dosyadaki kurallara uymalıdır.
> Canonical source: `skills/ui/styles.md` — CONVENTIONS.md bu dosyaya referans verir.
> Oracle Chip Core spec: `skills/ui/oracle.md`

---

## 1. Visual Identity: Depth Black + Indigo Glow

### Foundation Philosophy
```
"Siyah bir tuval değil, derinliği olan bir atmosfer.
Indigo ışığı sadece anlam taşıyan yerlerde parlar."

Renk Dağılımı:
- %70 Depth Black Foundation (layered backgrounds with atmosphere)
- %15 Semantic Colors (emerald=income, rose=expense, amber=warning)
- %10 Indigo Glow Accent (CTA, focus, active states ONLY)
- %5  Atmospheric Layer (mesh gradients, noise, ambient orbs)
```

### Background Palette
```css
/* Depth Black Foundation */
--bg-base:      #000000;   /* Body background — absolute black */
--bg-surface:   #050505;   /* Primary surface */
--bg-elevated:  #0A0A0A;   /* Elevated containers */
--bg-card:      #0F0F0F;   /* Card backgrounds */
--bg-interactive:#141414;   /* Hover/interactive surfaces */

/* Atmospheric Body Gradient (replaces flat #000) */
--bg-atmosphere: radial-gradient(
  ellipse at 50% 0%,
  #0a0a1a 0%,
  #050508 50%,
  #000000 100%
);
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

## 2. Depth Layer System (v4.0)

> *"From amateur void to VisionOS atmosphere."*

### Body Atmosphere
```css
/* Body background — atmospheric gradient, NOT flat black */
body {
  background: var(--bg-atmosphere);
  /* radial-gradient(ellipse at 50% 0%, #0a0a1a 0%, #050508 50%, #000000 100%) */
}
```

### Noise Texture (Global)
```css
/* Applied to body::after — adds film grain depth */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,..."); /* noise pattern */
  mix-blend-mode: overlay;
}
```

### Ambient Gradient Orbs
```css
/* Fixed-position ambient layer behind all content */
.ambient-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* Indigo orb — top center */
.ambient-orb-indigo {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%);
  filter: blur(80px);
}

/* Violet orb — bottom right */
.ambient-orb-violet {
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: 600px;
  height: 500px;
  background: radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%);
  filter: blur(80px);
}
```

### VisionOS Inner Light
```css
/* Top-edge light catch for glass elements — simulates overhead light source */
.inner-glow {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* Apply to ALL glass-card and glass-elevated elements */
/* Combined: glass-card + inner-glow */
```

### Layer Stack (z-index)
```
z-0   : body background (atmospheric gradient)
z-1   : noise overlay (body::after)
z-2   : ambient orbs (.ambient-layer)
z-10  : page content
z-20  : glass cards
z-30  : elevated elements (modals, drawers)
z-40  : header / navigation
z-50  : toast notifications
```

---

## 3. Glassmorphism v4.0

### Core Formula
```
background: rgba(255, 255, 255, {opacity});
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.10);
box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);  /* v4.0: VisionOS inner light */
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
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);  /* v4.0: inner light */
}

/* Level 4 — Elevated (modals, drawers, active cards) */
.glass-elevated {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);  /* v4.0: inner light */
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

## 4. Motion Math — Chip Core Assembly System

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
Oracle Chip Core Assembly — modules dock into concentric rings:

ScrollY Progress:  0.0 ──── 0.15 ──── 0.25 ──── 0.35 ──── 0.50 ──── 1.0
                    │         │          │          │          │         │
                    │    Income docks    │     Goals dock      │         │
                    │         │     Expense docks    │    Core active    │
                    │         │          │          │          │         │
State:          [Dormant] ─── [Assembling — rings brighten] ─── [Active — full glow]
```

> Full Oracle Chip Core spec → `skills/ui/oracle.md`

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

### Assembly States (3-State Machine)
```typescript
type OracleState = 'dormant' | 'assembling' | 'active';

// State transitions driven by scroll progress:
// 0.00 - 0.25 → 'dormant'      (rings dim, no modules visible, core pulse faint)
// 0.25 - 0.60 → 'assembling'   (modules flying in, rings brightening, glow traces)
// 0.60 - 1.00 → 'active'       (all docked, full indigo glow, data readout visible)
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

## 5. Iconography — Lucide React (Strict)

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

## 6. Typography (Inter Variable)

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

## 7. Spacing (8px Harmonic Grid)

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

## 8. Component Styling Patterns

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

## 9. Responsive Strategy (Mobile-First)

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

## 10. Prohibited Patterns

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
[X] Flat #000 body without atmospheric gradient (v4.0)
[X] Glass cards without inner-glow (v4.0)
```

---

## 11. Bento Grid Layout (v4.0)

> Full spec → `skills/ui/bento.md`

### Summary
```
Grid: 2-column CSS Grid | gap: 12px (mobile), 16px (tablet+)
Sizes: 1×1, 2×1, 1×2, 2×2, full
Card: border-radius 20px, glass bg rgba(255,255,255,0.04), blur(12px), inner light
Animation: Framer Motion stagger (0.06s children delay) + spring entry (260/24/0.8)
Components: BentoGrid (container), BentoCard (cell with size/pressable/glow/bare variants)
```

### Dashboard Layout
```
Oracle Hero  → full   (no card chrome)
Balance      → 2×2    (bare — child has own glass-card)
Stats        → 1×1    (pressable — transaction count, goal count)
Actions      → 1×1    (pressable — add income, add expense)
AI Insight   → 2×1    (bare — child has own glass-card)
Savings      → 2×1    (bare — ai-gradient premium card)
```

---

*Skill Module: UI Styles — Sovereign v4.0*
*Stack: Tailwind CSS 4 | Framer Motion | Lucide React | Inter Variable Font*
*Foundation: Depth Black (atmospheric gradient) | Indigo Glow #4F46E5 | Glassmorphism blur(12px) + inner light*
*New in v4.0: Depth Layer System, VisionOS inner light, ambient orbs, noise texture, Bento Grid layout*
