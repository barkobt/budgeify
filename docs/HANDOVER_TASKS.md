# Red Code Handover — 6 Feb 2026

## Completed (P0)

- **Currency Globalizer**: `CurrencyCode` type (`TRY`/`USD`/`EUR`), `setCurrency` in Zustand store, all components use dynamic `formatCurrency(amount, currency)` and `getCurrencySymbol()`
- **Header UserButton Fix**: Three-component dynamic-import pattern (`Header` → `ClerkAuthControls` → `AuthButtons`). Signed-in: UserButton + "Dashboard'a Git". Signed-out: "Hemen Basla". Loading: pulse skeleton.
- **Landing Auth-Aware Nav**: `LandingAuthNav` dynamically loads Clerk `useAuth`; shows "Dashboard'a Git" for signed-in users, guest CTA for others.
- **WalletCore Click Actions**: `OracleHero` accepts `onModuleClick` callback. Dashboard wires it: income/expense → open drawer, goals/analytics → switch tab.
- **Transactions Toggle Bar**: Giderler/Gelirler toggle in transactions tab with inline income list view.
- **GoalForm + SalaryForm Error Display**: `serverError` state + visible rose error banner on catch.
- **Logo → /dashboard**: All Logo instances link to `/dashboard`.

## Files Changed

- `src/types/index.ts` — added `CurrencyCode`
- `src/utils/index.ts` — rewrote `formatCurrency`, added `getCurrencySymbol`
- `src/store/useBudgetStore.ts` — added `currency` state + `setCurrency`
- `src/components/layout/Header.tsx` — full rewrite (dynamic Clerk)
- `src/app/page.tsx` — full rewrite (auth-aware landing)
- `src/components/features/oracle/OracleHero.tsx` — clickable modules + `onModuleClick`
- `src/app/(dashboard)/dashboard/page.tsx` — module click handler, tx toggle, currency
- `src/components/features/income/MainBalanceCard.tsx` — dynamic currency prefix
- `src/components/features/income/MainSalaryForm.tsx` — error display + currency
- `src/components/features/expenses/ExpenseList.tsx` — dynamic currency
- `src/components/features/goals/GoalForm.tsx` — error display + currency
- `src/components/features/goals/GoalCard.tsx` — dynamic currency

## BEYAZ EKRAN SEBEBI

**Kök Neden (2 katman):**

1. **Stale `.next` webpack cache**: Multi-file edit sonrası `.next/server/` içindeki chunk ID'leri bozuldu (`Cannot find module './682.js'`). Fix: `rm -rf .next` + rebuild.

2. **Framer Motion SSR opacity:0 tuzağı**: Landing page'deki TÜM elementler (`motion.nav`, `HeroText`, `FadeInSection`, `StaggerContainer`, `FadeInDiv`, footer) sunucuda `style="opacity:0;transform:translateY(-100px)"` ile render ediliyor. Eğer client JS herhangi bir sebeple çalışmazsa (hydration error, Clerk timeout, network fail) tüm içerik **kalıcı olarak görünmez** = beyaz ekran.

**Dashboard korunuyordu** — `initial={isMounted ? 'hidden' : false}` guard vardı.
**Landing page korunmuyordu** — tüm Framer Motion elementleri çıplak `initial={{ opacity: 0 }}` kullanıyordu.

**Uygulanan Fix:**
- `MotionElements.tsx`: `useHydrated()` hook eklendi, tüm component'lere `initial={hydrated ? 'hidden' : false}` guard
- `page.tsx` (landing): `isMounted` state + tüm `motion.*` elementlerine `initial={isMounted ? {...} : false}`
- `loading.tsx` (root + dashboard): "SİSTEM YÜKLENİYOR" safety render eklendi

**Doğrulama:** SSR HTML artık `opacity:1;transform:none` ile render — JS çalışmasa bile içerik görünür.

## Not Implemented

- **HubX Scroll Merge**: layoutId chip-merging animation on scroll (deferred — needs design spec)

## Build

- `npm run build` passes: 0 errors, 0 warnings
- Dashboard: 153kB First Load JS
