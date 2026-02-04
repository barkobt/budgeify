
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BottomNav } from '@/components/layout/BottomNav';
import { Plus, TrendingUp, Target, BarChart3 } from 'lucide-react';

// FORCE CLIENT: Disable SSR for all components with dynamic data
const MainBalanceCard = dynamic(() => import('@/components/features/income/MainBalanceCard').then(mod => ({ default: mod.MainBalanceCard })), { ssr: false });
const MainSalaryForm = dynamic(() => import('@/components/features/income/MainSalaryForm').then(mod => ({ default: mod.MainSalaryForm })), { ssr: false });
const ExpenseForm = dynamic(() => import('@/components/features/expenses/ExpenseForm').then(mod => ({ default: mod.ExpenseForm })), { ssr: false });
const ExpenseList = dynamic(() => import('@/components/features/expenses/ExpenseList').then(mod => ({ default: mod.ExpenseList })), { ssr: false });
const CategoryChart = dynamic(() => import('@/components/features/analytics/CategoryChart').then(mod => ({ default: mod.CategoryChart })), { ssr: false });
const ExpenseChart = dynamic(() => import('@/components/features/analytics/ExpenseChart').then(mod => ({ default: mod.ExpenseChart })), { ssr: false });
const GoalList = dynamic(() => import('@/components/features/goals/GoalCard').then(mod => ({ default: mod.GoalList })), { ssr: false });
const GoalForm = dynamic(() => import('@/components/features/goals/GoalForm').then(mod => ({ default: mod.GoalForm })), { ssr: false });

type TabType = 'dashboard' | 'transactions' | 'goals' | 'analytics';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <main className="min-h-screen pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto space-y-6">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Hero Balance Card */}
              <MainBalanceCard />

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card variant="default" hover size="md">
                  <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
                        <TrendingUp size={24} className="text-accent-700" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Son İşlemler</p>
                        <p className="text-2xl font-bold text-slate-900">12</p>
                        <p className="text-xs text-slate-400">Bu ay</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="default" hover size="md">
                  <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                        <Target size={24} className="text-green-600" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Aktif Hedefler</p>
                        <p className="text-2xl font-bold text-slate-900">3</p>
                        <p className="text-xs text-slate-400">Devam ediyor</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="default" hover size="md" className="sm:col-span-2 lg:col-span-1">
                  <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                        <BarChart3 size={24} className="text-emerald-600" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Tasarruf Oranı</p>
                        <p className="text-2xl font-bold text-green-600">%25</p>
                        <p className="text-xs text-slate-400">Hedef: %30</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Income Form */}
              <MainSalaryForm />
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-fadeIn">
              <ExpenseList />
            </div>
          )}

          {/* GOALS TAB */}
          {activeTab === 'goals' && (
            <div className="space-y-6 animate-fadeIn">
              <GoalForm />
              <GoalList />
            </div>
          )}

          {/* ANALYTICS TAB */}
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

      {/* FAB - Floating Action Button */}
      {activeTab === 'transactions' && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-accent-600 to-accent-700
                     text-white rounded-full shadow-accent-lg hover:shadow-accent-md
                     flex items-center justify-center transition-all duration-200
                     hover:scale-110 active:scale-95 z-50"
          aria-label="Gider Ekle"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      )}

      {/* Simple Drawer (TODO: Replace with vaul in next step) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setIsDrawerOpen(false)}>
          <div className="w-full bg-white rounded-t-2xl p-6 animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <ExpenseForm />
          </div>
        </div>
      )}

      {/* Bottom Navigation with Tab State */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
