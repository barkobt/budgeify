'use client';

/**
 * Dashboard Page - Main App View
 *
 * 🎓 MENTOR NOTU - Protected Route:
 * --------------------------------
 * Bu sayfa middleware tarafından korunuyor.
 * Giriş yapmamış kullanıcılar /sign-in'e yönlendirilir.
 *
 * Client Component olarak çalışıyor çünkü:
 * - useState ile tab state yönetimi
 * - User interaction (drawer açma/kapama)
 * - Dynamic imports (SSR disabled)
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { BottomNav } from '@/components/layout/BottomNav';
import { Drawer } from '@/components/ui/Drawer';
import {
  Plus,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
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
const AIAssistant = dynamic(
  () => import('@/components/features/ai/AIAssistant').then((mod) => ({ default: mod.AIAssistant })),
  { ssr: false }
);

// Skeleton for MainBalanceCard - Cosmic Theme
function BalanceCardSkeleton() {
  return (
    <div className="rounded-2xl glass-card animate-pulse">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-white/10" />
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="h-2 w-14 rounded bg-white/5" />
          </div>
        </div>
        <div className="h-10 w-40 rounded bg-white/10 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 rounded-xl bg-white/5" />
          <div className="h-20 rounded-xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}

type TabType = 'dashboard' | 'transactions' | 'goals' | 'analytics';
type DrawerType = 'income' | 'expense' | null;

export default function DashboardPage() {
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

              {/* Quick Actions - Glassmorphism 2.0 */}
              <section className="grid grid-cols-2 gap-3">
                {/* Gelir Ekle */}
                <button
                  onClick={() => setOpenDrawer('income')}
                  className="group glass-card hover-lift p-4 flex items-center gap-3 transition-all duration-300 active:scale-[0.97]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 transition-colors group-hover:bg-emerald-500/30">
                    <ArrowUpRight size={20} strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Gelir Ekle</p>
                    <p className="text-xs text-slate-400">Maaş, ek gelir</p>
                  </div>
                </button>

                {/* Gider Ekle */}
                <button
                  onClick={() => setOpenDrawer('expense')}
                  className="group glass-card hover-lift p-4 flex items-center gap-3 transition-all duration-300 active:scale-[0.97]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 transition-colors group-hover:bg-rose-500/30">
                    <ArrowDownRight size={20} strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Gider Ekle</p>
                    <p className="text-xs text-slate-400">Harcama, fatura</p>
                  </div>
                </button>
              </section>

              {/* Stats Row - Glass Cards */}
              <section className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="group glass-subtle hover-lift p-4 flex items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/20">
                      <TrendingUp size={18} className="text-accent-400" strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-white">12</p>
                      <p className="text-xs text-slate-400">İşlem</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:text-accent-400 transition-colors" />
                </button>

                <button
                  onClick={() => setActiveTab('goals')}
                  className="group glass-subtle hover-lift p-4 flex items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/20">
                      <Target size={18} className="text-accent-400" strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-white">3</p>
                      <p className="text-xs text-slate-400">Hedef</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:text-accent-400 transition-colors" />
                </button>
              </section>

              {/* Savings Insight - AI Gradient */}
              <section className="rounded-2xl ai-gradient p-5 shadow-lg shadow-accent-500/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <PiggyBank size={22} className="text-white" strokeWidth={1.5} />
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
          className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full
                     ai-gradient shadow-lg shadow-accent-500/30
                     transition-all hover:shadow-xl hover:scale-105 active:scale-95"
          aria-label="Gider Ekle"
        >
          <Plus size={24} strokeWidth={2} className="text-white" />
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

      {/* AI Assistant - Floating Button & Chat Drawer */}
      <AIAssistant />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
