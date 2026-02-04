
'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { TrendingUp, BarChart3, Target } from 'lucide-react';

// FORCE CLIENT: Disable SSR for all components with dynamic data (store-based)
// This eliminates hydration errors by preventing server/client mismatch
const MainBalanceCard = dynamic(() => import('@/components/features/income/MainBalanceCard').then(mod => ({ default: mod.MainBalanceCard })), { ssr: false });
const MainSalaryForm = dynamic(() => import('@/components/features/income/MainSalaryForm').then(mod => ({ default: mod.MainSalaryForm })), { ssr: false });
const ExpenseForm = dynamic(() => import('@/components/features/expenses/ExpenseForm').then(mod => ({ default: mod.ExpenseForm })), { ssr: false });
const ExpenseList = dynamic(() => import('@/components/features/expenses/ExpenseList').then(mod => ({ default: mod.ExpenseList })), { ssr: false });
const CategoryChart = dynamic(() => import('@/components/features/analytics/CategoryChart').then(mod => ({ default: mod.CategoryChart })), { ssr: false });
const ExpenseChart = dynamic(() => import('@/components/features/analytics/ExpenseChart').then(mod => ({ default: mod.ExpenseChart })), { ssr: false });
const GoalList = dynamic(() => import('@/components/features/goals/GoalCard').then(mod => ({ default: mod.GoalList })), { ssr: false });
const GoalForm = dynamic(() => import('@/components/features/goals/GoalForm').then(mod => ({ default: mod.GoalForm })), { ssr: false });

export default function HomePage() {
  return (
    <main className="pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Balance Card - Hero */}
        <div className="w-full max-w-3xl mx-auto">
          <MainBalanceCard />
        </div>

        {/* Main Salary Form */}
        <div className="w-full max-w-3xl mx-auto">
          <MainSalaryForm />
        </div>

        {/* Expense Form */}
        <div className="w-full max-w-3xl mx-auto">
          <ExpenseForm />
        </div>

        {/* Expense List */}
        <div className="w-full max-w-3xl mx-auto">
          <ExpenseList />
        </div>

        {/* Analytics - 2 Column Grid on Desktop */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategoryChart />
          <ExpenseChart />
        </div>

        {/* Goal Form */}
        <div className="w-full max-w-3xl mx-auto">
          <GoalForm />
        </div>

        {/* Goal List */}
        <div className="w-full max-w-3xl mx-auto">
          <GoalList />
        </div>

        {/* Welcome Card - Professional Fintech Style */}
        <div className="w-full max-w-3xl mx-auto">
          <Card variant="elevated" hover>
            <CardHeader noBorder>
              {/* Logo - Centered */}
              <div className="flex justify-center mb-6">
                <Logo size="lg" showText={true} />
              </div>
              <CardTitle as="h1" className="text-center text-2xl">
                Hoş Geldiniz!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-8 text-center leading-relaxed">
                Budgeify ile gelir ve giderlerinizi profesyonelce takip edin,
                harcama alışkanlıklarınızı analiz edin ve finansal
                hedeflerinize ulaşın.
              </p>

              {/* Feature List - Professional Icons */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-600 to-accent-700 flex items-center justify-center shadow-accent-sm">
                    <TrendingUp size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Gelir ve Gider Takibi</p>
                    <p className="text-sm text-slate-500">Tüm finansal hareketlerinizi kaydedin</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-600 to-accent-700 flex items-center justify-center shadow-accent-sm">
                    <BarChart3 size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Detaylı Harcama Analizi</p>
                    <p className="text-sm text-slate-500">Grafiklerle alışkanlıklarınızı görün</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-600 to-accent-700 flex items-center justify-center shadow-accent-sm">
                    <Target size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Tasarruf Hedefleri</p>
                    <p className="text-sm text-slate-500">Hedeflerinize adım adım ilerleyin</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter noBorder className="flex-col sm:flex-row">
              <Button variant="primary" isFullWidth>
                Başlayalım
              </Button>
              <Button variant="ghost" isFullWidth>
                Daha Sonra
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Footer - Professional */}
        <div className="text-center pt-8 pb-4">
          <p className="text-sm text-slate-400">
            Budgeify v1.1.0 • Professional Edition
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Powered by Kral İndigo Design System
          </p>
        </div>
      </div>
    </main>
  );
}
