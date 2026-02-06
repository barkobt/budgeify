'use client';

/**
 * Dashboard Page — Sovereign v2.1
 *
 * Hydration-safe: uses initial={false} on first render to prevent
 * SSR opacity:0 white screen. Animations activate after mount.
 * All data pulled from useBudgetStore — no hardcoded values.
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/layout/BottomNav';
import { Drawer } from '@/components/ui/Drawer';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { SkeletonCard, SkeletonList, SkeletonChart } from '@/components/ui/Skeleton';
import { useBudgetStore } from '@/store/useBudgetStore';
import {
  staggerContainer,
  staggerItem,
  revealOnScroll,
  viewportConfig,
  fadeInUp,
} from '@/lib/motion';
import { getCurrencySymbol } from '@/utils';
import type { WalletModuleId } from '@/components/features/oracle/OracleHero';
import type { Income } from '@/types';
import {
  Plus,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  PiggyBank,
} from 'lucide-react';

// Dynamic imports with skeleton loaders
const MainBalanceCard = dynamic(
  () => import('@/components/features/income/MainBalanceCard').then((mod) => ({ default: mod.MainBalanceCard })),
  { ssr: false, loading: () => <SkeletonCard /> }
);
const MainSalaryForm = dynamic(
  () => import('@/components/features/income/MainSalaryForm').then((mod) => ({ default: mod.MainSalaryForm })),
  { ssr: false }
);
const ExpenseForm = dynamic(
  () => import('@/components/features/expenses/ExpenseForm').then((mod) => ({ default: mod.ExpenseForm })),
  { ssr: false }
);
const IncomeList = dynamic(
  () => import('@/components/features/income/IncomeList').then((mod) => ({ default: mod.IncomeList })),
  { ssr: false, loading: () => <SkeletonList count={5} /> }
);
const CategoryChart = dynamic(
  () => import('@/components/features/analytics/CategoryChart').then((mod) => ({ default: mod.CategoryChart })),
  { ssr: false, loading: () => <SkeletonChart /> }
);
const ExpenseChart = dynamic(
  () => import('@/components/features/analytics/ExpenseChart').then((mod) => ({ default: mod.ExpenseChart })),
  { ssr: false, loading: () => <SkeletonChart /> }
);
const GoalList = dynamic(
  () => import('@/components/features/goals/GoalCard').then((mod) => ({ default: mod.GoalList })),
  { ssr: false, loading: () => <SkeletonList count={3} /> }
);
const GoalForm = dynamic(
  () => import('@/components/features/goals/GoalForm').then((mod) => ({ default: mod.GoalForm })),
  { ssr: false }
);
const AIAssistant = dynamic(
  () => import('@/components/features/ai/AIAssistant').then((mod) => ({ default: mod.AIAssistant })),
  { ssr: false }
);
const OracleHero = dynamic(
  () => import('@/components/features/oracle/OracleHero').then((mod) => ({ default: mod.OracleHero })),
  { ssr: false }
);
const OracleInsightCard = dynamic(
  () => import('@/components/features/oracle/OracleInsightCard').then((mod) => ({ default: mod.OracleInsightCard })),
  { ssr: false }
);

type TabType = 'dashboard' | 'transactions' | 'goals' | 'analytics';
type DrawerType = 'income' | 'expense' | null;
type TransactionView = 'expenses' | 'incomes';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [txView, setTxView] = useState<TransactionView>('expenses');
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Hydration guard: skip initial animations on SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Live store data
  const expenses = useBudgetStore((s) => s.expenses);
  const incomes = useBudgetStore((s) => s.incomes);
  const currency = useBudgetStore((s) => s.currency);
  const getSavingsRate = useBudgetStore((s) => s.getSavingsRate);
  const getActiveGoals = useBudgetStore((s) => s.getActiveGoals);
  const symbol = getCurrencySymbol(currency);

  // OracleHero module click handler
  const handleModuleClick = (moduleId: WalletModuleId) => {
    switch (moduleId) {
      case 'income':
        setOpenDrawer('income');
        break;
      case 'expense':
        setOpenDrawer('expense');
        break;
      case 'goals':
        setActiveTab('goals');
        break;
      case 'analytics':
        setActiveTab('analytics');
        break;
      case 'insights':
        // Scroll to Oracle insight card
        break;
    }
  };

  const transactionCount = expenses.length;
  const goalCount = getActiveGoals().length;
  const savingsRate = getSavingsRate();
  const savingsTarget = 30;
  const savingsProgress = savingsTarget > 0 ? Math.min(Math.round((savingsRate / savingsTarget) * 100), 100) : 0;

  return (
    <>
      <PageWrapper>
        <main id="main-content" className="min-h-screen pb-24 px-4 sm:px-6" role="main">
          <div className="mx-auto max-w-lg">
          {/* ========================================
              DASHBOARD TAB
              ======================================== */}
          {activeTab === 'dashboard' && (
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial={isMounted ? 'hidden' : false}
              animate="visible"
            >
              {/* Oracle Core Hero — clickable modules */}
              <motion.div variants={staggerItem}>
                <OracleHero onModuleClick={handleModuleClick} />
              </motion.div>

              {/* Oracle AI Insight */}
              <motion.div variants={staggerItem}>
                <OracleInsightCard />
              </motion.div>

              {/* Hero Balance Card */}
              <motion.div variants={staggerItem}>
                <MainBalanceCard />
              </motion.div>

              {/* Quick Actions */}
              <motion.section
                className="grid grid-cols-2 gap-3"
                variants={staggerItem}
                aria-label="Hizli islemler"
              >
                <motion.button
                  onClick={() => setOpenDrawer('income')}
                  className="group glass-card rounded-2xl hover-lift p-4 flex items-center gap-3 transition-all duration-300"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 transition-colors group-hover:bg-emerald-500/25">
                    <ArrowUpRight size={20} strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-200">Gelir Ekle</p>
                    <p className="text-xs text-slate-500">Maas, ek gelir</p>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => setOpenDrawer('expense')}
                  className="group glass-card rounded-2xl hover-lift p-4 flex items-center gap-3 transition-all duration-300"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 transition-colors group-hover:bg-rose-500/25">
                    <ArrowDownRight size={20} strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-200">Gider Ekle</p>
                    <p className="text-xs text-slate-500">Harcama, fatura</p>
                  </div>
                </motion.button>
              </motion.section>

              {/* Stats Row — Live Data */}
              <motion.section
                className="grid grid-cols-2 gap-3"
                variants={staggerItem}
                aria-label="Ozet istatistikler"
              >
                <motion.button
                  onClick={() => setActiveTab('transactions')}
                  className="group glass-card rounded-2xl hover-lift p-4 flex items-center justify-between transition-all duration-300"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/15">
                      <TrendingUp size={18} className="text-accent-400" strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-white tabular-nums">{transactionCount}</p>
                      <p className="text-xs text-slate-500">Islem</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-accent-400 transition-colors" />
                </motion.button>

                <motion.button
                  onClick={() => setActiveTab('goals')}
                  className="group glass-card rounded-2xl hover-lift p-4 flex items-center justify-between transition-all duration-300"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/15">
                      <Target size={18} className="text-accent-400" strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-white tabular-nums">{goalCount}</p>
                      <p className="text-xs text-slate-500">Hedef</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-accent-400 transition-colors" />
                </motion.button>
              </motion.section>

              {/* Savings Insight — Live Data */}
              <motion.section
                className="rounded-2xl ai-gradient p-5 shadow-lg shadow-accent-500/20"
                variants={revealOnScroll}
                initial={isMounted ? 'offscreen' : false}
                whileInView="onscreen"
                viewport={viewportConfig}
                aria-label="Tasarruf durumu"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <PiggyBank size={22} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Tasarruf Orani</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-black text-white tabular-nums">%{savingsRate}</p>
                      <p className="text-sm text-white/60 tabular-nums">/ %{savingsTarget} hedef</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div
                    className="h-1.5 rounded-full bg-white/20 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={savingsProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Tasarruf ilerlemesi"
                  >
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${savingsProgress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    />
                  </div>
                  <p className="mt-2 text-right text-xs text-white/70">
                    {savingsProgress > 0
                      ? `Hedefe %${savingsProgress} ulastin`
                      : 'Gelir ekleyerek tasarruf takibini baslatin'}
                  </p>
                </div>
              </motion.section>
            </motion.div>
          )}

          {/* ========================================
              TRANSACTIONS TAB — Integrated Toggle Bar
              ======================================== */}
          {activeTab === 'transactions' && (
            <motion.div
              className="space-y-4"
              variants={fadeInUp}
              initial={isMounted ? 'hidden' : false}
              animate="visible"
            >
              {/* Toggle: Giderler / Gelirler */}
              <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
                <button
                  onClick={() => setTxView('expenses')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${
                    txView === 'expenses'
                      ? 'bg-rose-500/15 text-rose-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <ArrowDownRight size={16} />
                  Giderler
                </button>
                <button
                  onClick={() => setTxView('incomes')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${
                    txView === 'incomes'
                      ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <ArrowUpRight size={16} />
                  Gelirler
                </button>
              </div>

              {txView === 'expenses' ? (
                <ExpenseList />
              ) : (
                <IncomeList onEditIncome={setEditingIncome} />
              )}
            </motion.div>
          )}

          {/* ========================================
              GOALS TAB
              ======================================== */}
          {activeTab === 'goals' && (
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial={isMounted ? 'hidden' : false}
              animate="visible"
            >
              <motion.div variants={staggerItem}>
                <GoalForm />
              </motion.div>
              <motion.div variants={staggerItem}>
                <GoalList />
              </motion.div>
            </motion.div>
          )}

          {/* ========================================
              ANALYTICS TAB
              ======================================== */}
          {activeTab === 'analytics' && (
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial={isMounted ? 'hidden' : false}
              animate="visible"
            >
              <motion.div variants={staggerItem}>
                <CategoryChart />
              </motion.div>
              <motion.div variants={staggerItem}>
                <ExpenseChart />
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
      </PageWrapper>

      {/* FAB - Transactions Tab Only */}
      {activeTab === 'transactions' && (
        <motion.button
          onClick={() => setOpenDrawer('expense')}
          className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full
                     ai-gradient shadow-lg shadow-accent-500/30"
          aria-label="Gider Ekle"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Plus size={24} strokeWidth={2} className="text-white" />
        </motion.button>
      )}

      {/* Drawers */}
      <Drawer
        open={openDrawer === 'income' || !!editingIncome}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDrawer(null);
            setEditingIncome(null);
          }
        }}
        title={editingIncome ? 'Gelir Düzenle' : 'Gelir Ekle'}
      >
        <MainSalaryForm 
          editingIncome={editingIncome} 
          onCancelEdit={() => setEditingIncome(null)} 
        />
      </Drawer>

      <Drawer
        open={openDrawer === 'expense'}
        onOpenChange={(open) => !open && setOpenDrawer(null)}
        title="Gider Ekle"
      >
        <ExpenseForm />
      </Drawer>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
