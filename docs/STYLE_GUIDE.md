# Budgeify — Style Guide

## Theme: Cosmic Indigo
- Background: `#080B14 → #0D1321 → #151E31 → #1E293B`
- Accent (Kral İndigo): `#1E40AF` — used sparingly for CTAs, focus states
- Text primary: `#E2E8F0` (slate-200)
- Text secondary: `#94A3B8` (slate-400)
- Cards: glassmorphism (`bg-white/5 backdrop-blur`)

## Typography
- Font: Inter (variable, via next/font)
- Currency: `font-variant-numeric: tabular-nums`
- Headings: font-semibold, tracking-tight

## Icons
- Library: Lucide React
- Size: 20px default, strokeWidth 2
- No emojis in UI (Lucide icons only)

## Components
- Buttons: `bg-accent-700 hover:bg-accent-800` for primary CTA
- Cards: Use `<Card>` component with glassmorphism
- Inputs: `focus:border-accent-700 focus:ring-accent-700/20`

## Spacing
- 8px grid system
- Standard padding: `p-4` (mobile), `p-6` (desktop)
- Section gaps: `space-y-6`

## Animations
- Transitions: `duration-200` default
- Framer Motion for page/component animations
- `will-change` used only when needed, removed after animation
