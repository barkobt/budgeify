# Skill: Oracle Chip Core — Sovereign v4.0

> Oracle bileşeninin görsel spesifikasyonu. Silikon çip estetiği, konsantrik halkalar, 3-state machine.
> Parent spec: `skills/ui/styles.md` — Motion Math & Depth Layer System burada tanımlıdır.

---

## 1. Design Vision: From Diagram to Silicon

```
"Ok ve çizgilerden silikon çipe. Kablolama diyagramından premium donanıma."

Oracle Core artık bir işlemci gibi görünür:
- Merkez die: Indigo gradient işlemci, nabız atan glow
- 3 konsantrik halka: Farklı hızlarda dönen, dash-array animasyonlu
- Modül çipleri: Kenarlardan uçarak gelir, halka pozisyonlarına dock olur
- Veri readout: Aktif durumda bakiye/tasarruf merkez üzerinde görünür
```

---

## 2. Anatomy

```
┌─────────────────────────────────────────────┐
│                                             │
│         ╭── Ring 3 (outer, slowest) ──╮     │
│        ╭── Ring 2 (middle) ──╮        │     │
│       ╭── Ring 1 (inner, fastest) ──╮ │     │
│       │                             │ │     │
│       │     ┌───────────────┐       │ │     │
│       │     │  Central Die  │       │ │     │
│       │     │  (Indigo Glow)│       │ │     │
│       │     │  Data Readout │       │ │     │
│       │     └───────────────┘       │ │     │
│       │                             │ │     │
│       ╰─────────────────────────────╯ │     │
│        ╰──────────────────────────────╯     │
│         ╰───────────────────────────────╯   │
│                                             │
│  [Income Chip]  [Expense Chip]  [Goal Chip] │
│         [Analytics Chip]  [Insights Chip]   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 3. Central Die

```css
/* Indigo gradient processor core */
.oracle-die {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background: linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%);
  box-shadow:
    0 0 48px rgba(79, 70, 229, 0.30),
    0 0 96px rgba(79, 70, 229, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);
  position: relative;
  z-index: 10;
}

/* Pulse animation — subtle heartbeat when active */
@keyframes die-pulse {
  0%, 100% { box-shadow: 0 0 48px rgba(79,70,229,0.30), 0 0 96px rgba(79,70,229,0.15); }
  50%      { box-shadow: 0 0 64px rgba(79,70,229,0.40), 0 0 128px rgba(79,70,229,0.20); }
}

.oracle-die--active {
  animation: die-pulse 3s ease-in-out infinite;
}

/* Dormant state — dimmed */
.oracle-die--dormant {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%);
  box-shadow: 0 0 24px rgba(79, 70, 229, 0.10);
}
```

---

## 4. Concentric Rings

```css
/* Shared ring base */
.chip-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(79, 70, 229, 0.15);
  /* Dash-array creates segmented ring look */
}

/* Ring 1 — Inner (fastest rotation) */
.chip-ring-1 {
  width: 200px;
  height: 200px;
  border: 1px dashed rgba(79, 70, 229, 0.25);
  animation: ring-rotate 20s linear infinite;
}

/* Ring 2 — Middle */
.chip-ring-2 {
  width: 300px;
  height: 300px;
  border: 1px dashed rgba(79, 70, 229, 0.18);
  animation: ring-rotate 35s linear infinite reverse;
}

/* Ring 3 — Outer (slowest rotation) */
.chip-ring-3 {
  width: 400px;
  height: 400px;
  border: 1px dashed rgba(79, 70, 229, 0.12);
  animation: ring-rotate 50s linear infinite;
}

@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* State-driven brightness */
.chip-ring--dormant    { opacity: 0.3; }
.chip-ring--assembling { opacity: 0.6; transition: opacity 1s ease; }
.chip-ring--active     { opacity: 1.0; transition: opacity 0.5s ease; }
```

### Ring Rules
- Rings use CSS `@keyframes` for 60fps (GPU-composited `transform: rotate`)
- Different speeds create parallax depth illusion
- Reverse direction on middle ring adds visual complexity
- `prefers-reduced-motion`: stop rotation, keep static rings visible

---

## 5. Module Chips (OracleModuleChip)

### Visual Spec
```css
/* Hardware-aesthetic chip */
.oracle-chip {
  border-radius: 16px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}

/* Docked state — color-matched glow */
.oracle-chip--docked-income {
  border-color: rgba(16, 185, 129, 0.30);   /* emerald */
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.15);
}

.oracle-chip--docked-expense {
  border-color: rgba(244, 63, 94, 0.30);    /* rose */
  box-shadow: 0 0 16px rgba(244, 63, 94, 0.15);
}

.oracle-chip--docked-goals {
  border-color: rgba(139, 92, 246, 0.30);   /* violet */
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.15);
}

.oracle-chip--docked-analytics {
  border-color: rgba(79, 70, 229, 0.30);    /* indigo */
  box-shadow: 0 0 16px rgba(79, 70, 229, 0.15);
}

.oracle-chip--docked-insights {
  border-color: rgba(251, 191, 36, 0.30);   /* amber */
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.15);
}
```

### Circuit Trace Animation (on dock)
```css
/* Border trace that lights up when chip docks */
@keyframes circuit-trace {
  0%   { border-image: linear-gradient(0deg, transparent 0%, currentColor 0%) 1; }
  100% { border-image: linear-gradient(360deg, transparent 0%, currentColor 100%) 1; }
}
```

### Framer Motion Integration
```typescript
// Each chip uses layoutId for smooth position transitions
<motion.div
  layoutId={`oracle-chip-${module.id}`}
  transition={springs.assembly}
  whileTap={{ scale: 0.97 }}  // Haptic-like feedback
>
  <OracleModuleChip module={module} isDocked={isDocked} />
</motion.div>
```

---

## 6. 3-State Machine

```typescript
type OracleState = 'dormant' | 'assembling' | 'active';
```

### State: Dormant (scroll 0.00 – 0.25)
```
- Central die: dimmed indigo (#1e1b4b → #3730a3)
- Rings: opacity 0.3, rotating slowly
- Module chips: NOT visible (opacity 0, translateY +40px)
- Data readout: hidden
- Glow: minimal (--glow-sm)
```

### State: Assembling (scroll 0.25 – 0.60)
```
- Central die: brightening gradient
- Rings: opacity 0.6, rotation speed unchanged
- Module chips: flying in from edges, staggered by MODULE_SCROLL_OFFSETS
  - Income:    0.05 → 0.20 (first to dock)
  - Expense:   0.12 → 0.30
  - Goals:     0.20 → 0.40
  - Analytics: 0.25 → 0.45
  - Insights:  0.30 → 0.50
- Each chip uses layoutId to animate from scattered → ring position
- Glow traces appear on dock (circuit-trace animation)
- Ring brightness increases as more chips dock
```

### State: Active (scroll 0.60 – 1.00)
```
- Central die: full indigo gradient, pulse animation active
- Rings: opacity 1.0, full brightness
- All module chips: docked, color-matched glow active
- Data readout: fade in on central die (balance, savings)
- Full glow: --glow-xl on central die
- Silicon glow cascade: multi-layer shadow on entire assembly
```

### State Transition Logic
```typescript
function getOracleState(scrollProgress: number): OracleState {
  if (scrollProgress < 0.25) return 'dormant';
  if (scrollProgress < 0.60) return 'assembling';
  return 'active';
}
```

---

## 7. Silicon Glow Effect

```css
/* Multi-layer indigo shadow cascade — applied to entire oracle container */
.silicon-glow {
  box-shadow:
    0 0 24px rgba(79, 70, 229, 0.15),
    0 0 48px rgba(79, 70, 229, 0.10),
    0 0 96px rgba(79, 70, 229, 0.05),
    0 0 192px rgba(79, 70, 229, 0.02);
}

/* Active state intensification */
.silicon-glow--active {
  box-shadow:
    0 0 32px rgba(79, 70, 229, 0.25),
    0 0 64px rgba(79, 70, 229, 0.15),
    0 0 128px rgba(79, 70, 229, 0.08),
    0 0 256px rgba(79, 70, 229, 0.03);
}
```

---

## 8. Data Readout (Active State)

```typescript
// Overlaid on central die when state === 'active'
interface DataReadout {
  balance: number;      // Total balance (income - expense)
  savings: number;      // Total goal savings
  currency: string;     // Active currency symbol
}

// Fade in with springs.gentle transition
// Use tabular-nums for stable number width
// Font: text-2xl font-bold tabular-nums text-white
```

---

## 9. Mobile Variant

```
Mobile (< 768px):
- NO scroll-driven assembly
- NO concentric ring rotation
- Chips fade in with stagger (springs.gentle)
- Central die: static, no pulse
- Simplified layout: vertical stack instead of radial
- Touch: tap chip to expand details
```

---

## 10. Accessibility

```
- prefers-reduced-motion: disable ring rotation, chip fly-in → simple fade
- All chips have aria-label with module name and value
- Central die has role="status" with live balance readout
- Color is never the only indicator — icons + labels always present
- Focus visible on all interactive chips
```

---

*Skill Module: Oracle Chip Core — Sovereign v4.0*
*Visual: Concentric rings + silicon die + docking module chips*
*States: dormant → assembling → active (scroll-driven)*
*Motion: Spring 260/20/1 + CSS @keyframes for rings*
