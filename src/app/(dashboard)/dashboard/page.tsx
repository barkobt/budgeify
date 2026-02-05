'use client';

/**
 * Dashboard Page - Main App View
 *
 * Sovereign v2.0 — Scroll-aware storytelling with Framer Motion.
 * Protected route: unauthenticated users redirected to /sign-in.
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/layout/BottomNav';
import { Drawer } from '@/components/ui/Drawer';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { SkeletonCard, SkeletonList, SkeletonChart } from '@/components/ui/Skeleton';
import {
  staggerContainer,
  staggerItem,
  revealOnScroll,
  viewportConfig,
  fadeInUp,
} from '@/lib/motion';
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
const ExpenseList = dynamic(
  () => import('@/components/features/expenses/ExpenseList').then((mod) => ({ default: mod.ExpenseList })),
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

type TabType = 'dashboard' | 'transactions' | 'goals' | 'analytics';
type DrawerType = 'income' | 'expense' | null;

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);

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
              initial="hidden"
              animate="visible"
            >
              {/* Hero Balance Card */}
              <motion.div variants={staggerItem}>
                <MainBalanceCard />
              </motion.div>

              {/* Quick Actions - Glassmorphism 2.0 */}
              <motion.section
                className="grid grid-cols-2 gap-3"
                variants={staggerItem}
                aria-label="Hizli islemler"
              >
                {/* Gelir Ekle */}
                <motion.button
                  onClick={() => setOpenDrawer('income')}
                  className="group glass-card hover-lift p-4 flex items-center gap-3 transition-all duration-300"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 transition-colors group-hover:bg-emerald-500/30">
                    <ArrowUpRight size={20} strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Gelir Ekle</p>
                    <p className="text-xs text-slate-400">Maas, ek gelir</p>
                  </div>
                </motion.button>

                {/* Gider Ekle */}
                <motion.button
                  onClick={() => setOpenDrawer('expense')}
                  className="group glass-card hover-lift p-4 flex items-center gap-3 transition-all duration-300"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 transition-colors group-hover:bg-rose-500/30">
                    <ArrowDownRight size={20} strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Gider Ekle</p>
                    <p className="text-xs text-slate-400">Harcama, fatura</p>
                  </div>
                </motion.button>
              </motion.section>

              {/* Stats Row - Glass Cards */}
              <motion.section
                className="grid grid-cols-2 gap-3"
                variants={staggerItem}
                aria-label="Ozet istatistikler"
              >
                <motion.button
                  onClick={() => setActiveTab('transactions')}
                  className="group glass-subtle hover-lift p-4 flex items-center justify-between transition-all duration-300"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/20">
                      <TrendingUp size={18} className="text-accent-400" strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-white tabular-nums">12</p>
                      <p className="text-xs text-slate-400">Islem</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:text-accent-400 transition-colors" />
                </motion.button>

                <motion.button
                  onClick={() => setActiveTab('goals')}
                  className="group glass-subtle hover-lift p-4 flex items-center justify-between transition-all duration-300"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/20">
                      <Target size={18} className="text-accent-400" strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-white tabular-nums">3</p>
                      <p className="text-xs text-slate-400">Hedef</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:text-accent-400 transition-colors" />
                </motion.button>
              </motion.section>

              {/* Savings Insight - AI Gradient with scroll reveal */}
              <motion.section
                className="rounded-2xl ai-gradient p-5 shadow-lg shadow-accent-500/20"
                variants={revealOnScroll}
                initial="offscreen"
                whileInView="onscreen"
                viewport={viewportConfig}
                aria-label="Tasarruf durumu"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <PiggyBank size={22} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white/70 uppercase tracking-wide">Tasarruf Orani</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-black text-white tabular-nums">%25</p>
                      <p className="text-sm text-white/80">/ %30 hedef</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1.5 rounded-full bg-white/20 overflow-hidden" role="progressbar" aria-valuenow={83} aria-valuemin={0} aria-valuemax={100} aria-label="Tasarruf ilerlemesi">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={{ width: 0 }}
                      whileInView={{ width: '83%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    />
                  </div>
                  <p className="mt-2 text-right text-xs text-white/70">Hedefe %83 ulastin</p>
                </div>
              </motion.section>
            </motion.div>
          )}

          {/* ========================================
              TRANSACTIONS TAB
              ======================================== */}
          {activeTab === 'transactions' && (
            <motion.div
              className="space-y-4"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <ExpenseList />
            </motion.div>
          )}

          {/* ========================================
              GOALS TAB
              ======================================== */}
          {activeTab === 'goals' && (
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
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
              initial="hidden"
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
