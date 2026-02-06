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

## Not Implemented

- **HubX Scroll Merge**: layoutId chip-merging animation on scroll (deferred — needs design spec)

## Build

- `npm run build` passes: 0 errors, 0 warnings
- Dashboard: 153kB First Load JS
