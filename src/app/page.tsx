'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/layout/BottomNav';
import { Drawer } from '@/components/ui/Drawer';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

// FORCE CLIENT: Disable SSR for all components with dynamic data
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

// Skeleton for MainBalanceCard while loading
function BalanceCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg animate-pulse">
      <div className="p-8 sm:p-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-3 w-16 rounded bg-slate-200" />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="h-12 w-48 rounded bg-slate-200" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 rounded-xl bg-slate-100" />
          <div className="h-24 rounded-xl bg-slate-100" />
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

  const handleOpenDrawer = (type: DrawerType) => {
    setOpenDrawer(type);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(null);
  };

  return (
    <>
      <main className="min-h-screen pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* ========================================
              DASHBOARD TAB
              ======================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Hero Balance Card */}
              <MainBalanceCard />

              {/* Quick Actions - Prominent 2 Column Grid */}
              <section className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleOpenDrawer('income')}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-5 shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <ArrowUpCircle size={26} className="text-white" strokeWidth={2} />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-white">Gelir Ekle</p>
                      <p className="text-xs text-white/80">Maaş, ek gelir</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleOpenDrawer('expense')}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-5 shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-1 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <ArrowDownCircle size={26} className="text-white" strokeWidth={2} />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-white">Gider Ekle</p>
                      <p className="text-xs text-white/80">Harcama, fatura</p>
                    </div>
                  </div>
                </button>
              </section>

              {/* Stats Grid - 2 Column on Mobile, Clean Design */}
              <section className="grid grid-cols-2 gap-4">
                {/* Son İşlemler */}
                <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100">
                      <TrendingUp size={20} className="text-accent-700" strokeWidth={2.5} />
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                  <p className="text-sm text-slate-500">Son İşlemler</p>
                  <p className="text-xs text-slate-400 mt-1">Bu ay</p>
                </div>

                {/* Aktif Hedefler */}
                <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                      <Target size={20} className="text-green-600" strokeWidth={2.5} />
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">3</p>
                  <p className="text-sm text-slate-500">Aktif Hedefler</p>
                  <p className="text-xs text-slate-400 mt-1">Devam ediyor</p>
                </div>
              </section>

              {/* Tasarruf Progress Card */}
              <section className="rounded-2xl bg-gradient-to-r from-accent-700 to-indigo-600 p-6 shadow-lg shadow-accent-700/25">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Sparkles size={24} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="text-2xl font-bold text-white">%25</p>
                      <p className="text-sm text-white/80">tasarruf oranı</p>
                    </div>
                    <p className="text-xs text-white/70">Hedef: %30</p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-white/20">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-500"
                      style={{ width: '83%' }}
                    />
                  </div>
                  <p className="mt-2 text-right text-xs text-white/80">%83 hedefe yakın</p>
                </div>
              </section>
            </div>
          )}

          {/* ========================================
              TRANSACTIONS TAB
              ======================================== */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-fadeIn">
              <ExpenseList />
            </div>
          )}

          {/* ========================================
              GOALS TAB
              ======================================== */}
          {activeTab === 'goals' && (
            <div className="space-y-6 animate-fadeIn">
              <GoalForm />
              <GoalList />
            </div>
          )}

          {/* ========================================
              ANALYTICS TAB
              ======================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryChart />
                <ExpenseChart />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================
          FAB - Floating Action Button (Transactions Tab Only)
          ======================================== */}
      {activeTab === 'transactions' && (
        <button
          onClick={() => handleOpenDrawer('expense')}
          className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-600 to-accent-700 text-white shadow-lg shadow-accent-700/30 transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-accent-700/40 active:scale-95"
          aria-label="Gider Ekle"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      )}

      {/* ========================================
          DRAWERS - Vaul Bottom Sheets
          ======================================== */}

      {/* Income Drawer */}
      <Drawer
        open={openDrawer === 'income'}
        onOpenChange={(open) => !open && handleCloseDrawer()}
        title="Gelir Ekle"
      >
        <MainSalaryForm />
      </Drawer>

      {/* Expense Drawer */}
      <Drawer
        open={openDrawer === 'expense'}
        onOpenChange={(open) => !open && handleCloseDrawer()}
        title="Gider Ekle"
      >
        <ExpenseForm />
      </Drawer>

      {/* ========================================
          BOTTOM NAVIGATION
          ======================================== */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
