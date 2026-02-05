'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { BottomNav } from '@/components/layout/BottomNav';
import { Drawer } from '@/components/ui/Drawer';
import {
  Plus,
  TrendingUp,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  PiggyBank,
} from 'lucide-react';

// Dynamic imports with SSR disabled
const MainBalanceCard = dynamic(
  () => import('@/components/features/income/MainBalanceCard').then((mod) => ({ default: mod.MainBalanceCard })),
  { ssr: false, loading: () => <BalanceCardSkeleton /> }
);
const MainSalaryForm = dynamic(
  () => import('@/components/features/income/MainSalaryForm').then((mod) => ({ default: mod.MainSalaryForm })),
  { ssr: false }
);
const ExpenseForm = dynamic(
  () => import('@/components/features/expenses/ExpenseForm').then((mod) => ({ default: mod.ExpenseForm })),
  { ssr: false }
);
const ExpenseList = dynamic(
  () => import('@/components/features/expenses/ExpenseList').then((mod) => ({ default: mod.ExpenseList })),
  { ssr: false }
);
const CategoryChart = dynamic(
  () => import('@/components/features/analytics/CategoryChart').then((mod) => ({ default: mod.CategoryChart })),
  { ssr: false }
);
const ExpenseChart = dynamic(
  () => import('@/components/features/analytics/ExpenseChart').then((mod) => ({ default: mod.ExpenseChart })),
  { ssr: false }
);
const GoalList = dynamic(
  () => import('@/components/features/goals/GoalCard').then((mod) => ({ default: mod.GoalList })),
  { ssr: false }
);
const GoalForm = dynamic(
  () => import('@/components/features/goals/GoalForm').then((mod) => ({ default: mod.GoalForm })),
  { ssr: false }
);

// Skeleton for MainBalanceCard
function BalanceCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="h-2 w-14 rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-10 w-40 rounded bg-slate-200 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 rounded-xl bg-slate-100" />
          <div className="h-20 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

type TabType = 'dashboard' | 'transactions' | 'goals' | 'analytics';
type DrawerType = 'income' | 'expense' | null;

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);

  return (
    <>
      <main className="min-h-screen pb-24 px-4 sm:px-6">
        <div className="mx-auto max-w-lg">
          {/* ========================================
              DASHBOARD TAB
              ======================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Hero Balance Card */}
              <MainBalanceCard />

              {/* Quick Actions - Kral İndigo Strategy: Subtle, Premium */}
              <section className="grid grid-cols-2 gap-3">
                {/* Gelir Ekle - Outline Style */}
                <button
                  onClick={() => setOpenDrawer('income')}
                  className="group flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-4 transition-all duration-200 hover:border-accent-700 hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                    <ArrowUpRight size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">Gelir Ekle</p>
                    <p className="text-xs text-slate-500">Maaş, ek gelir</p>
                  </div>
                </button>

                {/* Gider Ekle - Outline Style */}
                <button
                  onClick={() => setOpenDrawer('expense')}
                  className="group flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-4 transition-all duration-200 hover:border-accent-700 hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-100">
                    <ArrowDownRight size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">Gider Ekle</p>
                    <p className="text-xs text-slate-500">Harcama, fatura</p>
                  </div>
                </button>
              </section>

              {/* Stats Row - Compact, Clean */}
              <section className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="group flex items-center justify-between rounded-xl bg-white border border-slate-200 p-4 transition-all hover:border-accent-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50">
                      <TrendingUp size={18} className="text-accent-700" strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-slate-900">12</p>
                      <p className="text-xs text-slate-500">İşlem</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-accent-700 transition-colors" />
                </button>

                <button
                  onClick={() => setActiveTab('goals')}
                  className="group flex items-center justify-between rounded-xl bg-white border border-slate-200 p-4 transition-all hover:border-accent-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50">
                      <Target size={18} className="text-accent-700" strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-slate-900">3</p>
                      <p className="text-xs text-slate-500">Hedef</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-accent-700 transition-colors" />
                </button>
              </section>

              {/* Savings Insight - Kral İndigo Accent */}
              <section className="rounded-xl bg-gradient-to-br from-accent-700 via-indigo-600 to-accent-800 p-5 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <PiggyBank size={22} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white/70 uppercase tracking-wide">Tasarruf Oranı</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-black text-white">%25</p>
                      <p className="text-sm text-white/80">/ %30 hedef</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: '83%' }} />
                  </div>
                  <p className="mt-2 text-right text-xs text-white/70">Hedefe %83 ulaştın</p>
                </div>
              </section>
            </div>
          )}

          {/* ========================================
              TRANSACTIONS TAB
              ======================================== */}
          {activeTab === 'transactions' && (
            <div className="space-y-4 animate-fadeIn">
              <ExpenseList />
            </div>
          )}

          {/* ========================================
              GOALS TAB
              ======================================== */}
          {activeTab === 'goals' && (
            <div className="space-y-4 animate-fadeIn">
              <GoalForm />
              <GoalList />
            </div>
          )}

          {/* ========================================
              ANALYTICS TAB
              ======================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-4 animate-fadeIn">
              <CategoryChart />
              <ExpenseChart />
            </div>
          )}
        </div>
      </main>

      {/* FAB - Transactions Tab Only */}
      {activeTab === 'transactions' && (
        <button
          onClick={() => setOpenDrawer('expense')}
          className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent-700 text-white shadow-lg shadow-accent-700/30 transition-all hover:bg-accent-800 hover:shadow-xl hover:scale-105 active:scale-95"
          aria-label="Gider Ekle"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      )}

      {/* Drawers */}
      <Drawer
        open={openDrawer === 'income'}
        onOpenChange={(open) => !open && setOpenDrawer(null)}
        title="Gelir Ekle"
      >
        <MainSalaryForm />
      </Drawer>

      <Drawer
        open={openDrawer === 'expense'}
        onOpenChange={(open) => !open && setOpenDrawer(null)}
        title="Gider Ekle"
      >
        <ExpenseForm />
      </Drawer>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
