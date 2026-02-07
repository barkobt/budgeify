# Sovereign v4.6: The Mechanical Heart — Execution Spec

> **Version**: v4.6 | **Codename**: The Mechanical Heart
> **Status**: Approved — Awaiting Execution
> **Date**: 2026-02-07
> **Prerequisite**: v4.5 Build Green (M9/M10/M6/M7 completed)

---

## Problem Statement

Oracle Core'un mevcut 150vh sticky runway'i montajı çok hızlı tamamlıyor (scroll %0→%50).
Core "active" olduktan sonra kullanıcı boş bir sticky alanda bekliyor — hikaye anlatılmadan bitiyor.
Header basit ve statik, BottomNav standart tab bar, loading ekranı sinematik değil.

---

## Constraints (NEVER Break)

- **ActionResult\<T\>** pattern → dokunulmaz
- **Zod validation** → dokunulmaz
- **M10 Bento Density** → gap 8px, padding spec korunur
- **Spring physics** → 260/20/1 canonical (`ASSEMBLY_SPRING`)
- **`prefers-reduced-motion`** → tüm yeni animasyonlarda saygı gösterilir
- **60fps mandatory** → only `transform` and `opacity` for animations
- **src/ execution zone** → tüm kod src/ altında
- **Lucide icons** → NO emojis in production UI

---

## Execution Order (Optimized)

| Sıra | Milestone | Bağımlılık | Dosyalar |
|------|-----------|------------|----------|
| 1 | **M13-C: Portal Navbar + Dock Bar** | Yok | `PortalNavbar.tsx` (NEW), `DockBar.tsx` (NEW), `globals.css`, `(dashboard)/layout.tsx`, `dashboard/page.tsx` |
| 2 | **M13-A: Pre-flight Screen** | Yok | `dashboard/loading.tsx`, `globals.css` |
| 3 | **M13-B: Auth Streamline** | M13-C | `(auth)/layout.tsx`, root `layout.tsx` (Clerk afterSignInUrl) |
| 4 | **M11: Cinematic Assembly** | M13-C | `OracleHero.tsx`, `OracleModuleChip.tsx`, `globals.css`, `dashboard/page.tsx` |
| 5 | **M12: Silicon Die** | M11 | `SiliconDie.tsx` (NEW), `OracleHero.tsx`, `globals.css` |

---

## M13-C: Portal Navbar + Dock Bar

### Top Bar — Command Strip (`PortalNavbar.tsx`)

**File**: `src/components/layout/PortalNavbar.tsx` (NEW — replaces Header.tsx usage in dashboard)

```
┌─────────────────────────────────────────────────┐
│  [Die Logo]    Dashboard      [UserBtn] [•]     │
└─────────────────────────────────────────────────┘
```

- **Position**: `fixed top-0`, `z-50`
- **Style**: `glass-elevated` + `backdrop-blur-xl` + `border-b border-white/5`
- **Left**: Animated mini Silicon Die logo (16×16), tap → scroll to top
- **Center**: Context-aware page title (Dashboard / İşlemler / Hedefler / Analiz)
  - Title changes with `activeTab` state
  - Smooth text crossfade with `AnimatePresence mode="wait"`
- **Right**: Clerk UserButton + notification dot placeholder (future-ready)
- **Height**: `h-14` (56px)
- Crash-proof Clerk dynamic import (same pattern as current Header.tsx)

### Bottom Bar — Dock Bar (`DockBar.tsx`)

**File**: `src/components/layout/DockBar.tsx` (NEW — replaces BottomNav.tsx usage)

```
              ┌─────────────────────────────────┐
              │  🏠  📊  [+]  🎯  📈           │
              └─────────────────────────────────┘
```

- **Position**: `fixed bottom-12`, centered with `left-1/2 -translate-x-1/2`
- **Max-width**: `max-w-[380px]` (mobile), scales on tablet
- **iPad/Wide**: `left: 50%`, `transform: translateX(-50%)` — floats centered
- **Style**: `glass-elevated`, `rounded-3xl`, `border border-white/8`
- **Layout**: `flex items-center justify-around`, 5 slots
- **Nav Items** (4 tabs):
  - **Active**: `scale-[1.15]` + indigo glow halo (`box-shadow: 0 0 12px rgba(79,70,229,0.4)`) + label fade-in below
  - **Inactive**: `text-zinc-500`, hover → `scale-[1.05]` + `text-zinc-300`
  - Spring transition: `ASSEMBLY_SPRING` (260/20/1)
- **Center FAB** ("+" button):
  - `w-12 h-12`, `rounded-2xl`, `ai-gradient`
  - Tap → dashboard background blurs (`backdrop-filter: blur(8px)`) + dims (`bg-black/60` overlay)
  - Quick-action radial menu: "Gelir Ekle" (up-left) + "Gider Ekle" (up-right)
  - `AnimatePresence` for mount/unmount
  - Tap outside or tap FAB again → dismiss
- **Safe area**: `safe-area-pb` preserved
- **Shadow**: `shadow-2xl shadow-black/50` for float depth

### Dashboard Layout Changes

**File**: `src/app/(dashboard)/layout.tsx`

- Replace `<Header />` import with `<PortalNavbar />`
- `pt-16` → `pt-14` (match new navbar height)
- `pb-24` stays (dock bar is floating, doesn't need extra padding)
- BottomNav still rendered in `page.tsx` but import changes to `DockBar`

### Dashboard Page Changes

**File**: `src/app/(dashboard)/dashboard/page.tsx`

- Replace `<BottomNav>` import with `<DockBar>`
- Pass `activeTab`, `onTabChange`, `onOpenDrawer` to DockBar
- FAB in transactions tab removed (DockBar center FAB replaces it)

### CSS Additions

**File**: `src/app/globals.css`

```css
/* v4.6: PORTAL NAVBAR */
.portal-navbar { ... }

/* v4.6: DOCK BAR */
.dock-bar { ... }
.dock-item { ... }
.dock-item--active { ... }
.dock-fab { ... }
.dock-overlay { ... }
```

---

## M13-A: Pre-flight Screen

**File**: `src/app/(dashboard)/dashboard/loading.tsx` (REWRITE)

### Visual Spec

- Full-screen centered layout, `bg-depth-base`
- **Center**: Slow-rotating Silicon Die placeholder (CSS-only, no framer-motion in RSC)
  - `@keyframes preflight-rotate`: 360° over 4s, `cubic-bezier(0.4, 0, 0.2, 1)`
  - Scale pulse: `@keyframes preflight-pulse`: 0.95→1.05 over 2s
  - Indigo glow ring behind die
- **Below Die**: Sequential text with fade transition
  - "Sistemler hazırlanıyor..." (0-1s)
  - "Veriler senkronize ediliyor..." (1-2s)  
  - "Hazır" (2s+)
  - Pure CSS animation with `animation-delay`
- **Background**: Ambient orbs (indigo + violet) at reduced opacity
- **Duration feel**: Min 2s visual via CSS animation timing

### Technical Note
- `loading.tsx` is a React Server Component — NO `'use client'`, NO framer-motion
- All animations must be CSS-only (`@keyframes`)

---

## M13-B: Auth Streamline

### Clerk Config

**File**: `src/app/layout.tsx`

```tsx
<ClerkProvider
  afterSignInUrl="/dashboard"
  afterSignUpUrl="/dashboard"
  // ... existing appearance config
>
```

This eliminates the intermediate "Dashboard'a Git" step after auth.

### Auth Layout (no changes needed)
- Current `(auth)/layout.tsx` is clean — just passes children
- Redirect happens via Clerk config, not layout

---

## M11: Cinematic Assembly

### Runway Extension

**File**: `src/app/globals.css`

- `.oracle-runway` height: `150vh` → `200vh`

### 4-Phase Scroll Choreography

**File**: `src/components/features/oracle/OracleHero.tsx`

Phase definitions via `useTransform`:

```
Phase 1 — Awakening (0% → 20%)
├── Core: dormant state, scale 0.8, breathing pulse
├── Rings: opacity 0.2, very slow rotation  
├── Modules: invisible (opacity 0)
└── Ambient: base state

Phase 2 — Assembly (20% → 50%)
├── Core: dormant→assembling, scale 0.8→0.95
├── Rings: opacity 0.2→0.6, rotation accelerates
├── Modules: staggered fade-in + convergence (non-linear)
└── Ambient: gradual warm-up

Phase 3 — Ignition (50% → 70%) ⚡ VISUAL SHOCK
├── Core: assembling→active, scale 0.95→1.0
├── Die pulse: glow intensity peaks
├── Data readout: fade in (balance, savings)
├── Ambient Layer Ignition:
│   └── .ambient-orb-indigo opacity: useTransform([0.5, 0.7], [0.06, 0.20])
│   └── .ambient-orb-violet opacity: useTransform([0.5, 0.7], [0.04, 0.12])
│   └── Formula: clamp((scroll - 0.5) / (0.7 - 0.5), 0, 1) * targetOpacity
└── Silicon glow: peak cascade

Phase 4 — Dock (70% → 100%) 🔗 SEAMLESS HANDOVER
├── Core: scale 1.0→0.6, translateY toward bento position
├── Rings: fade out (opacity→0)
├── Modules: already docked, fade out labels
├── Chromatic Aberration: 
│   └── At 95%+, subtle red/blue channel offset (CSS filter or box-shadow trick)
│   └── Duration: 200ms, single pulse
├── Screen Shake: 
│   └── At dock complete (98%), translateX jitter ±1px for 150ms
│   └── Gives "physical mass landed" feeling
└── Seamless Handover via layoutId:
    └── Die in OracleHero: layoutId="silicon-die-core"
    └── Die placeholder in first BentoCard: layoutId="silicon-die-core"
    └── LayoutGroup wraps both Hero and BentoGrid
    └── Framer Motion handles the physical slide automatically
```

### Ambient Layer Ignition (Scroll-Reactive)

**File**: `src/app/(dashboard)/dashboard/page.tsx` or wrapper component

- Expose `scrollYProgress` from OracleHero up to a parent
- Parent applies dynamic inline style to `.ambient-layer` children
- Or: OracleHero uses a portal/callback to drive ambient opacity

### Scroll Progress Indicator

- Thin (2px) indigo bar on right edge of screen
- `position: fixed; right: 0; top: 0; height: var(--scroll-pct)`
- Only visible during oracle-runway scroll region
- Fades out after Phase 4 completes

---

## M12: Silicon Die

**File**: `src/components/features/oracle/SiliconDie.tsx` (NEW)

### Multi-Layer SVG Structure

```
Layer 4 (top)    — Heat Spreader Frame: metallic edge, 5% opacity stroke
Layer 3          — Core Logic Block: bright indigo, inner glow, animated
Layer 2          — Circuit Traces: stroke-dashoffset animation, indigo paths
Layer 1 (bottom) — Substrate: dark indigo, subtle grid pattern
```

### Size States (Spring Transitions)
- **Dormant**: 100px × 100px
- **Active**: 120px × 120px  
- **Docked** (bento): 64px × 64px

### Z-axis Parallax
- `useTransform(scrollYProgress, ...)` drives:
  - `rotateX`: 0→2deg (subtle tilt)
  - Layer offsets: `translateZ` per layer (CSS `perspective` on parent)
  - Creates depth illusion as user scrolls

### Light Leaks
- 2-3 `radial-gradient` positioned at die edges
- Animate opacity + position with scroll
- Indigo (#4F46E5) to transparent
- `mix-blend-mode: screen` for light bleed effect

### Props Interface
```typescript
interface SiliconDieProps {
  size: 'dormant' | 'active' | 'docked';
  scrollProgress?: MotionValue<number>;
  layoutId?: string;
  className?: string;
}
```

### Integration
- Replaces `<Wallet>` icon in OracleHero central die
- Used in PortalNavbar as mini logo (static, no parallax)
- Used in Pre-flight loading screen (CSS-only rotation variant)

---

## File Change Summary

| File | Action | Milestone |
|------|--------|-----------|
| `src/components/layout/PortalNavbar.tsx` | NEW | M13-C |
| `src/components/layout/DockBar.tsx` | NEW | M13-C |
| `src/components/features/oracle/SiliconDie.tsx` | NEW | M12 |
| `src/app/globals.css` | EDIT | M13-C, M13-A, M11, M12 |
| `src/app/(dashboard)/layout.tsx` | EDIT | M13-C |
| `src/app/(dashboard)/dashboard/page.tsx` | EDIT | M13-C, M11 |
| `src/app/(dashboard)/dashboard/loading.tsx` | REWRITE | M13-A |
| `src/app/layout.tsx` | EDIT | M13-B |
| `src/components/features/oracle/OracleHero.tsx` | EDIT | M11, M12 |
| `src/components/features/oracle/OracleModuleChip.tsx` | EDIT (minor) | M11 |

### Files NOT Modified
- `src/actions/*` — ActionResult pattern untouched
- `src/middleware.ts` — no changes needed
- `src/store/*` — no changes needed
- `src/components/ui/BentoGrid.tsx` — M10 density preserved

### Files Deprecated (keep in src/, do not delete)
- `src/components/layout/Header.tsx` — replaced by PortalNavbar in dashboard context, still used by landing page
- `src/components/layout/BottomNav.tsx` — replaced by DockBar

---

## Technical Risks & Mitigations

### Risk 1: Seamless Handover DOM Hierarchy
**Problem**: layoutId animation requires both source and target in same LayoutGroup.
**Mitigation**: Wrap `<OracleHero>` and `<BentoGrid>` in a shared `<LayoutGroup>` at dashboard page level.

### Risk 2: Ambient Layer Ignition Performance
**Problem**: Animating gradient opacity on `.ambient-layer` children could cause repaints.
**Mitigation**: Use `will-change: opacity` on ambient orbs. They're already `position: fixed` so they're on their own compositor layer.

### Risk 3: Pre-flight Screen is RSC
**Problem**: `loading.tsx` is a React Server Component — no hooks, no framer-motion.
**Mitigation**: All animations are CSS `@keyframes` only. No client interactivity needed.

### Risk 4: DockBar Center FAB Overlay
**Problem**: Blur overlay must cover dashboard content but not the DockBar itself.
**Mitigation**: FAB overlay rendered as a sibling before DockBar, with `z-index` layering: overlay (z-40) < DockBar (z-50).

---

## Build Verification Checklist

After each milestone:
- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] Mobile viewport (375px) — layout correct
- [ ] iPad viewport (768px) — dock floating centered
- [ ] `prefers-reduced-motion` — animations disabled gracefully
- [ ] Clerk auth flow — sign-in → direct /dashboard redirect
- [ ] Oracle scroll — all 4 phases play correctly
- [ ] Bento density — M10 gap/padding preserved
