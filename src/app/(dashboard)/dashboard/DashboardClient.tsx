'use client';

/**
 * DashboardClient — v6.0 Overhaul M3 (Desktop Grid + Mobile Bento)
 *
 * Responsive dashboard:
 * - Desktop (lg+): Stitch 3 inspired 12-col grid with DashboardHeader,
 *   DesktopBalanceHero (SVG chart), DesktopAICard, RecentTransactions, MiniGoalGrid.
 * - Mobile (< lg): Sovereign bento grid preserved (OracleHero, BentoGrid, DockBar).
 *
 * Shared: Sidebar (lg+), PortalNavbar + DockBar (mobile), activeTab state,
 * Drawers, AI Assistant. All data from useBudgetStore.
 */

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { PortalNavbar } from '@/components/layout/PortalNavbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DockBar } from '@/components/layout/DockBar';
import { Drawer } from '@/components/ui/Drawer';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';
import { SkeletonCard, SkeletonList, SkeletonChart } from '@/components/ui/Skeleton';
import { useBudgetStore } from '@/store/useBudgetStore';
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
} from '@/lib/motion';
import { features } from '@/lib/env';
import type { WalletModuleId } from '@/components/features/oracle/OracleHero';
import type { Income, CurrencyCode } from '@/types';
import type { MergedTransaction } from '@/components/features/transactions/TransactionTable';
import { exportToCSV, exportToPDF } from '@/lib/export';
import {
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Globe,
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
const SpendingVelocity = dynamic(
  () => import('@/components/features/analytics/SpendingVelocity').then((mod) => ({ default: mod.SpendingVelocity })),
  { ssr: false }
);
const GoalList = dynamic(
  () => import('@/components/features/goals/GoalCard').then((mod) => ({ default: mod.GoalList })),
  { ssr: false, loading: () => <SkeletonList count={3} /> }
);
const GoalForm = dynamic(
  () => import('@/components/features/goals/GoalForm').then((mod) => ({ default: mod.GoalForm })),
  { ssr: false }
);
const AIAssistant = features.oracle ? dynamic(
  () => import('@/components/features/ai/AIAssistant').then((mod) => ({ default: mod.AIAssistant })),
  { ssr: false }
) : () => null;
const OracleHero = features.oracle ? dynamic(
  () => import('@/components/features/oracle/OracleHero').then((mod) => ({ default: mod.OracleHero })),
  { ssr: false }
) : () => null;
const OracleInsightCard = features.oracle ? dynamic(
  () => import('@/components/features/oracle/OracleInsightCard').then((mod) => ({ default: mod.OracleInsightCard })),
  { ssr: false }
) : () => null;
const OracleBrainCard = features.oracle ? dynamic(
  () => import('@/components/features/oracle/OracleBrainCard').then((mod) => ({ default: mod.OracleBrainCard })),
  { ssr: false }
) : () => null;

// M3: Desktop Dashboard Components (lg+ only)
const DashboardHeader = dynamic(
  () => import('@/components/features/dashboard/DashboardHeader').then((mod) => ({ default: mod.DashboardHeader })),
  { ssr: false }
);
const DesktopBalanceHero = dynamic(
  () => import('@/components/features/dashboard/DesktopBalanceHero').then((mod) => ({ default: mod.DesktopBalanceHero })),
  { ssr: false, loading: () => <SkeletonCard /> }
);
const RecentTransactions = dynamic(
  () => import('@/components/features/dashboard/RecentTransactions').then((mod) => ({ default: mod.RecentTransactions })),
  { ssr: false, loading: () => <SkeletonList count={5} /> }
);
const MiniGoalGrid = dynamic(
  () => import('@/components/features/dashboard/MiniGoalGrid').then((mod) => ({ default: mod.MiniGoalGrid })),
  { ssr: false }
);
const DesktopAICard = features.oracle ? dynamic(
  () => import('@/components/features/dashboard/DesktopAICard').then((mod) => ({ default: mod.DesktopAICard })),
  { ssr: false }
) : () => null;

// M5: Desktop Goals Full-Page (lg+ only)
const GoalsPage = dynamic(
  () => import('@/components/features/goals/GoalsPage').then((mod) => ({ default: mod.GoalsPage })),
  { ssr: false, loading: () => <SkeletonList count={6} /> }
);

// M6: Desktop Analytics Full-Page (lg+ only)
const AnalyticsPage = dynamic(
  () => import('@/components/features/analytics/AnalyticsPage').then((mod) => ({ default: mod.AnalyticsPage })),
  { ssr: false, loading: () => <SkeletonList count={6} /> }
);

// M10: Command Palette (⌘K Global Search)
const CommandPalette = dynamic(
  () => import('@/components/features/search/CommandPalette').then((mod) => ({ default: mod.CommandPalette })),
  { ssr: false }
);

// M7: Calendar & Reminder UI
const CalendarPage = dynamic(
  () => import('@/components/features/calendar/CalendarPage').then((mod) => ({ default: mod.CalendarPage })),
  { ssr: false, loading: () => <SkeletonList count={6} /> }
);
const ReminderForm = dynamic(
  () => import('@/components/features/calendar/ReminderForm').then((mod) => ({ default: mod.ReminderForm })),
  { ssr: false }
);
const BudgetAlertForm = dynamic(
  () => import('@/components/features/calendar/BudgetAlertForm').then((mod) => ({ default: mod.BudgetAlertForm })),
  { ssr: false }
);

// M7: Desktop Settings Page (lg+ only)
const SettingsPage = dynamic(
  () => import('@/components/features/settings/SettingsPage').then((mod) => ({ default: mod.SettingsPage })),
  { ssr: false, loading: () => <SkeletonList count={4} /> }
);

// M4: Desktop Transaction Components (lg+ only)
const TransactionTable = dynamic(
  () => import('@/components/features/transactions/TransactionTable').then((mod) => ({ default: mod.TransactionTable })),
  { ssr: false, loading: () => <SkeletonList count={8} /> }
);
const TransactionDetailPanel = dynamic(
  () => import('@/components/features/transactions/TransactionDetailPanel').then((mod) => ({ default: mod.TransactionDetailPanel })),
  { ssr: false }
);

type TabType = 'dashboard' | 'transactions' | 'goals' | 'analytics' | 'calendar' | 'settings';
type DrawerType = 'income' | 'expense' | null;
type TransactionView = 'expenses' | 'incomes';

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);
  const [showReminderDrawer, setShowReminderDrawer] = useState(false);
  const [showAlertDrawer, setShowAlertDrawer] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [txView, setTxView] = useState<TransactionView>('expenses');
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<{ id: string; categoryId: string; amount: number; note?: string; date: string; status: 'completed' | 'pending'; expectedDate?: string } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<MergedTransaction | null>(null);

  const [showPreflight, setShowPreflight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Hydration guard: skip initial animations on SSR
  useEffect(() => {
    setIsMounted(true);
    // Client-side cinematic entrance — dismiss after 1.8s
    const timer = setTimeout(() => setShowPreflight(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Logo click → reset to dashboard tab
  useEffect(() => {
    const handler = () => setActiveTab('dashboard');
    window.addEventListener('oracle:reset-dashboard', handler);
    return () => window.removeEventListener('oracle:reset-dashboard', handler);
  }, []);

  // M10: ⌘K keyboard shortcut to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // M10: Listen for open:command-palette event (from DashboardHeader search input)
  useEffect(() => {
    const handler = () => setShowCommandPalette(true);
    window.addEventListener('open:command-palette', handler);
    return () => window.removeEventListener('open:command-palette', handler);
  }, []);

  // Track overlay state for DockBar visibility (AI Assistant + Drawers)
  useEffect(() => {
    const showHandler = () => setIsOverlayActive(true);
    const hideHandler = () => setIsOverlayActive(false);
    window.addEventListener('overlay:show', showHandler);
    window.addEventListener('overlay:hide', hideHandler);
    return () => {
      window.removeEventListener('overlay:show', showHandler);
      window.removeEventListener('overlay:hide', hideHandler);
    };
  }, []);

  // Drawers also count as overlays
  useEffect(() => {
    if (openDrawer || editingIncome) {
      window.dispatchEvent(new CustomEvent('overlay:show'));
    } else {
      window.dispatchEvent(new CustomEvent('overlay:hide'));
    }
  }, [openDrawer, editingIncome]);

  // M11: Ambient ignition — drive orb opacity via CSS custom properties
  const handleScrollProgress = (progress: number) => {
    setScrollProgress(progress);
    // Phase 3 Ignition (50–70%): ambient orbs intensify
    const indigoOpacity = progress < 0.5 ? 0.06
      : progress < 0.7 ? 0.06 + (progress - 0.5) / 0.2 * 0.14
      : 0.20;
    const violetOpacity = progress < 0.5 ? 0.04
      : progress < 0.7 ? 0.04 + (progress - 0.5) / 0.2 * 0.08
      : 0.12;
    document.documentElement.style.setProperty('--ambient-indigo-opacity', String(indigoOpacity));
    document.documentElement.style.setProperty('--ambient-violet-opacity', String(violetOpacity));
  };

  // Live store data
  const expenses = useBudgetStore((s) => s.expenses);
  const incomes = useBudgetStore((s) => s.incomes);
  const deleteExpense = useBudgetStore((s) => s.deleteExpense);
  const deleteIncome = useBudgetStore((s) => s.deleteIncome);
  const getSavingsRate = useBudgetStore((s) => s.getSavingsRate);
  const getActiveGoals = useBudgetStore((s) => s.getActiveGoals);

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

  const currency = useBudgetStore((s) => s.currency);
  const setCurrency = useBudgetStore((s) => s.setCurrency);
  const allIncomes = useBudgetStore((s) => s.incomes);
  const getCategoryById = useBudgetStore((s) => s.getCategoryById);

  const buildMergedTransactions = useCallback((): MergedTransaction[] => {
    const merged: MergedTransaction[] = [];
    expenses.forEach((exp) => {
      const cat = getCategoryById(exp.categoryId);
      merged.push({
        id: exp.id, type: 'expense', label: cat?.name || 'Gider', description: exp.note || '',
        categoryId: exp.categoryId, categoryName: cat?.name || 'Diğer', categoryColor: cat?.color || '#6B7280',
        amount: exp.amount, date: exp.date || exp.createdAt, createdAt: exp.createdAt,
        status: exp.status ?? 'completed', expectedDate: exp.expectedDate,
      });
    });
    allIncomes.forEach((inc) => {
      merged.push({
        id: inc.id, type: 'income', label: inc.description || 'Gelir', description: inc.description || '',
        categoryId: inc.category, categoryName: inc.description || 'Gelir', categoryColor: '#10B981',
        amount: inc.amount, date: inc.date || inc.createdAt, createdAt: inc.createdAt,
        status: inc.status ?? 'completed', expectedDate: inc.expectedDate,
      });
    });
    merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return merged;
  }, [expenses, allIncomes, getCategoryById]);

  const transactionCount = isMounted ? expenses.length : 0;
  const goalCount = isMounted ? getActiveGoals().length : 0;
  const savingsRate = isMounted ? getSavingsRate() : 0;
  const savingsTarget = 30;
  const savingsProgress = savingsTarget > 0 ? Math.min(Math.round((savingsRate / savingsTarget) * 100), 100) : 0;

  const CURRENCIES: CurrencyCode[] = ['TRY', 'USD', 'EUR'];
  const cycleCurrency = () => {
    const idx = CURRENCIES.indexOf(currency);
    setCurrency(CURRENCIES[(idx + 1) % CURRENCIES.length]);
  };

  // Hydration guard: defer full render until after mount to prevent
  // SSR/client mismatch from Zustand store + localStorage rehydration.
  if (!isMounted) {
    return (
      <div className="relative">
        <div className="preflight-screen">
          <div
            className="absolute rounded-full blur-xl animate-pulse"
            style={{
              width: 240,
              height: 240,
              background: 'radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)',
            }}
          />
          <div className="loading-logo relative z-10">
            <PiggyBank size={80} className="text-primary" style={{ filter: 'drop-shadow(0 0 20px rgba(124,58,237,0.5))' }} />
          </div>
          <div className="preflight-status" aria-live="polite">
            <span className="preflight-text preflight-text-1">Sistemler uyanıyor...</span>
            <span className="preflight-text preflight-text-2">Finansal çekirdek hazırlanıyor...</span>
            <span className="preflight-text preflight-text-3">Veriler senkronize ediliyor...</span>
            <span className="preflight-text preflight-text-4">Oracle aktif</span>
          </div>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-0.5 rounded-full bg-white/6 overflow-hidden">
            <div className="loading-progress-bar" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Client-side cinematic entrance — replaces server-side delay */}
      <AnimatePresence>
        {showPreflight && (
          <motion.div
            className="preflight-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ambient glow */}
            <div
              className="absolute rounded-full blur-xl animate-pulse"
              style={{
                width: 240,
                height: 240,
                background: 'radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)',
              }}
            />
            {/* PiggyBank icon — spin-slow + pulsate */}
            <div className="loading-logo relative z-10">
              <PiggyBank size={80} className="text-primary" style={{ filter: 'drop-shadow(0 0 20px rgba(124,58,237,0.5))' }} />
            </div>
            <div className="preflight-status" aria-live="polite">
              <span className="preflight-text preflight-text-1">Sistemler uyanıyor...</span>
              <span className="preflight-text preflight-text-2">Finansal çekirdek hazırlanıyor...</span>
              <span className="preflight-text preflight-text-3">Veriler senkronize ediliyor...</span>
              <span className="preflight-text preflight-text-4">Oracle aktif</span>
            </div>
            {/* Progress bar — neon gradient */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-0.5 rounded-full bg-white/6 overflow-hidden">
              <div className="loading-progress-bar" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* M11: Scroll Progress Indicator — right edge indigo bar */}
      {features.oracle && activeTab === 'dashboard' && scrollProgress > 0 && scrollProgress < 1 && (
        <div
          className="scroll-progress-bar"
          style={{ height: `${scrollProgress * 100}vh`, opacity: scrollProgress < 0.98 ? 1 : 0 }}
          aria-hidden="true"
        />
      )}

      {/* v6.0: Desktop Sidebar — hidden on mobile */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <PageWrapper>
        <main id="main-content" className="min-h-screen pb-24 lg:pb-8 px-4 sm:px-6 lg:pl-72 lg:pr-8 lg:pt-6">
          <div className="mx-auto max-w-lg md:max-w-xl lg:max-w-5xl xl:max-w-6xl">
          {/* ========================================
              DASHBOARD TAB — Responsive: Desktop Grid + Mobile Bento
              ======================================== */}
          {activeTab === 'dashboard' && (
            <>
            {/* ── DESKTOP DASHBOARD (lg+) ── Stitch 3 inspired 12-col grid */}
            <div className="hidden lg:block">
              <motion.div
                initial={isMounted ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <DashboardHeader
                  onAddIncome={() => setOpenDrawer('income')}
                  onAddExpense={() => setOpenDrawer('expense')}
                />

                {/* 12-column grid */}
                <div className="grid grid-cols-12 gap-4">
                  {/* Total Balance — col-span-8 */}
                  <div className="col-span-8 min-h-90">
                    <DesktopBalanceHero />
                  </div>

                  {/* AI Assistant — col-span-4 */}
                  {features.oracle && (
                  <div className="col-span-4 min-h-90">
                    <DesktopAICard />
                  </div>
                  )}

                  {/* Recent Transactions — col-span-7 */}
                  <div className="col-span-7 min-h-80">
                    <RecentTransactions onViewAll={() => setActiveTab('transactions')} />
                  </div>

                  {/* Savings Goals — col-span-5 */}
                  <div className="col-span-5 min-h-80">
                    <MiniGoalGrid onViewAll={() => setActiveTab('goals')} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── MOBILE BENTO (< lg) ── Sovereign bento grid preserved */}
            <div className="lg:hidden">
            <LayoutGroup>
            <BentoGrid isMounted={isMounted}>
              {/* Oracle Core Hero — full width, no card chrome */}
              {features.oracle && (
              <BentoCard size="full">
                <OracleHero onModuleClick={handleModuleClick} onScrollProgress={handleScrollProgress} />
              </BentoCard>
              )}

              {/* Hero Balance — 2×2 (child has own glass-card styling) */}
              <BentoCard size="2x2" bare>
                <MainBalanceCard />
              </BentoCard>

              {/* Transaction Count — 1×1 stat widget */}
              <BentoCard
                size="1x1"
                pressable
                onClick={() => setActiveTab('transactions')}
                ariaLabel={`${transactionCount} islem, tiklayarak goruntule`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/15">
                    <TrendingUp size={18} className="text-accent-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white tabular-nums">{transactionCount}</p>
                    <p className="text-xs text-slate-500">Islem</p>
                  </div>
                </div>
              </BentoCard>

              {/* Goal Count — 1×1 stat widget */}
              <BentoCard
                size="1x1"
                pressable
                onClick={() => setActiveTab('goals')}
                ariaLabel={`${goalCount} hedef, tiklayarak goruntule`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15">
                    <Target size={18} className="text-violet-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white tabular-nums">{goalCount}</p>
                    <p className="text-xs text-slate-500">Hedef</p>
                  </div>
                </div>
              </BentoCard>

              {/* Add Income — 1×1 action widget */}
              <BentoCard
                size="1x1"
                pressable
                onClick={() => setOpenDrawer('income')}
                ariaLabel="Gelir ekle"
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                    <ArrowUpRight size={20} className="text-emerald-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Gelir Ekle</p>
                    <p className="text-xs text-slate-500">Maas, ek gelir</p>
                  </div>
                </div>
              </BentoCard>

              {/* Add Expense — 1×1 action widget */}
              <BentoCard
                size="1x1"
                pressable
                onClick={() => setOpenDrawer('expense')}
                ariaLabel="Gider ekle"
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15">
                    <ArrowDownRight size={20} className="text-rose-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Gider Ekle</p>
                    <p className="text-xs text-slate-500">Harcama, fatura</p>
                  </div>
                </div>
              </BentoCard>

              {/* Oracle Brain — 1×1 AI widget (M7) */}
              {features.oracle && (
              <BentoCard
                size="1x1"
                pressable
                ariaLabel="Oracle AI durumu"
              >
                <OracleBrainCard />
              </BentoCard>
              )}

              {/* Savings — 1×1 compact widget */}
              <BentoCard size="1x1" ariaLabel="Tasarruf oranı">
                <div className="flex flex-col h-full justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15">
                    <PiggyBank size={14} className="text-violet-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-white tabular-nums">%{savingsRate}</p>
                    <div className="mt-1">
                      <div
                        className="h-1 rounded-full bg-white/10 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={savingsProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Tasarruf ilerlemesi"
                      >
                        <motion.div
                          className="h-full rounded-full bg-violet-400"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${savingsProgress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Tasarruf</p>
                    </div>
                  </div>
                </div>
              </BentoCard>

              {/* Oracle AI Insight — 2×1 (child has own glass-card styling) */}
              {features.oracle && (
              <BentoCard size="2x1" bare>
                <OracleInsightCard />
              </BentoCard>
              )}

              {/* Currency Selector — 1×1 (M6) */}
              <BentoCard
                size="1x1"
                pressable
                onClick={cycleCurrency}
                ariaLabel={`Para birimi: ${currency}, degistirmek icin tiklayin`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/15">
                    <Globe size={14} className="text-accent-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{currency}</p>
                    <p className="text-[10px] text-slate-500">Para Birimi</p>
                  </div>
                </div>
              </BentoCard>

              {/* Savings Target — 1×1 */}
              <BentoCard size="1x1" ariaLabel="Tasarruf hedefi">
                <div className="flex flex-col h-full justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
                    <Target size={14} className="text-emerald-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white tabular-nums">%{savingsTarget}</p>
                    <p className="text-[10px] text-slate-500">Hedef Oran</p>
                  </div>
                </div>
              </BentoCard>
            </BentoGrid>
            </LayoutGroup>
            </div>
            </>
          )}

          {/* ========================================
              TRANSACTIONS TAB — Desktop Table + Mobile Toggle
              ======================================== */}
          {activeTab === 'transactions' && (
            <>
            {/* ── DESKTOP TRANSACTION LEDGER (lg+) ── */}
            <div className="hidden lg:block">
              <motion.div
                initial={isMounted ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex gap-5">
                  {/* Main table area */}
                  <div className={selectedTransaction ? 'flex-1 min-w-0' : 'w-full'}>
                    <TransactionTable
                      onSelectTransaction={setSelectedTransaction}
                      selectedId={selectedTransaction?.id ?? null}
                      onAddIncome={() => setOpenDrawer('income')}
                      onAddExpense={() => setOpenDrawer('expense')}
                      onExportCSV={() => {
                        const merged = buildMergedTransactions();
                        exportToCSV(merged, currency as CurrencyCode);
                      }}
                      onExportPDF={() => {
                        const merged = buildMergedTransactions();
                        exportToPDF(merged, currency as CurrencyCode);
                      }}
                    />
                  </div>

                  {/* Detail side panel — xl+ */}
                  {selectedTransaction && (
                    <div className="hidden xl:block w-80 shrink-0">
                      <TransactionDetailPanel
                        transaction={selectedTransaction}
                        onClose={() => setSelectedTransaction(null)}
                        onEdit={(tx) => {
                          if (tx.type === 'expense') {
                            setEditingExpense({
                              id: tx.id,
                              categoryId: tx.categoryId,
                              amount: tx.amount,
                              note: tx.description || undefined,
                              date: tx.date,
                              status: tx.status,
                              expectedDate: tx.expectedDate,
                            });
                            setOpenDrawer('expense');
                          } else {
                            const inc = incomes.find((i) => i.id === tx.id);
                            if (inc) {
                              setEditingIncome(inc);
                            }
                          }
                          setSelectedTransaction(null);
                        }}
                        onDelete={(id, type) => {
                          if (confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
                            if (type === 'expense') {
                              deleteExpense(id);
                            } else {
                              deleteIncome(id);
                            }
                            setSelectedTransaction(null);
                          }
                        }}
                        currency={currency}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* ── MOBILE TRANSACTIONS (< lg) ── */}
            <div className="lg:hidden">
            <motion.div
              className="space-y-4"
              variants={fadeInUp}
              initial={isMounted ? 'hidden' : false}
              animate="visible"
            >
              {/* Toggle: Giderler / Gelirler */}
              <div className="flex rounded-xl bg-white/5 border border-white/10 p-1" role="tablist" aria-label="İşlem türü">
                <button
                  onClick={() => setTxView('expenses')}
                  role="tab"
                  aria-selected={txView === 'expenses'}
                  aria-controls="tx-panel-expenses"
                  id="tx-tab-expenses"
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${
                    txView === 'expenses'
                      ? 'bg-rose-500/15 text-rose-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <ArrowDownRight size={16} aria-hidden="true" />
                  Giderler
                </button>
                <button
                  onClick={() => setTxView('incomes')}
                  role="tab"
                  aria-selected={txView === 'incomes'}
                  aria-controls="tx-panel-incomes"
                  id="tx-tab-incomes"
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${
                    txView === 'incomes'
                      ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <ArrowUpRight size={16} aria-hidden="true" />
                  Gelirler
                </button>
              </div>

              <div
                role="tabpanel"
                id={txView === 'expenses' ? 'tx-panel-expenses' : 'tx-panel-incomes'}
                aria-labelledby={txView === 'expenses' ? 'tx-tab-expenses' : 'tx-tab-incomes'}
              >
                {txView === 'expenses' ? (
                  <ExpenseList />
                ) : (
                  <IncomeList onEditIncome={setEditingIncome} />
                )}
              </div>
            </motion.div>
            </div>
            </>
          )}

          {/* ========================================
              GOALS TAB — Desktop Full-Page + Mobile Form+List
              ======================================== */}
          {activeTab === 'goals' && (
            <>
            {/* ── DESKTOP GOALS (lg+) ── Stitch 3 milestone page */}
            <div className="hidden lg:block">
              <motion.div
                initial={isMounted ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <GoalsPage />
              </motion.div>
            </div>

            {/* ── MOBILE GOALS (< lg) ── Preserved GoalForm + GoalList */}
            <div className="lg:hidden">
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
            </div>
            </>
          )}

          {/* ========================================
              ANALYTICS TAB — Desktop Full-Page + Mobile Cards
              ======================================== */}
          {activeTab === 'analytics' && (
            <>
            {/* ── DESKTOP ANALYTICS (lg+) ── Stitch 3 analysis page */}
            <div className="hidden lg:block">
              <motion.div
                initial={isMounted ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnalyticsPage />
              </motion.div>
            </div>

            {/* ── MOBILE ANALYTICS (< lg) ── Preserved SpendingVelocity + Charts */}
            <div className="lg:hidden">
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial={isMounted ? 'hidden' : false}
                animate="visible"
              >
                <motion.div variants={staggerItem}>
                  <SpendingVelocity />
                </motion.div>
                <motion.div variants={staggerItem}>
                  <CategoryChart />
                </motion.div>
                <motion.div variants={staggerItem}>
                  <ExpenseChart />
                </motion.div>
              </motion.div>
            </div>
            </>
          )}

          {/* ========================================
              CALENDAR TAB — Finansal Takvim & Hatırlatıcılar
              ======================================== */}
          {activeTab === 'calendar' && (
            <motion.div
              initial={isMounted ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <CalendarPage
                onOpenReminderForm={() => setShowReminderDrawer(true)}
                onOpenAlertForm={() => setShowAlertDrawer(true)}
                onSelectTransaction={(tx) => {
                  setSelectedTransaction(tx);
                  setActiveTab('transactions');
                }}
              />
            </motion.div>
          )}

          {/* ========================================
              SETTINGS TAB — Desktop Full-Page + Mobile Settings
              ======================================== */}
          {activeTab === 'settings' && (
            <motion.div
              initial={isMounted ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <SettingsPage />
            </motion.div>
          )}
        {/* Version — bottom of scrollable content */}
        <p className="text-center text-[10px] text-white/10 py-4 select-none">
          Budgeify v6.0
        </p>
        </div>
      </main>
      </PageWrapper>

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
          onSuccess={() => { setOpenDrawer(null); setEditingIncome(null); }}
        />
      </Drawer>

      <Drawer
        open={openDrawer === 'expense'}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDrawer(null);
            setEditingExpense(null);
          }
        }}
        title={editingExpense ? 'Gider Düzenle' : 'Gider Ekle'}
      >
        <ExpenseForm
          key={editingExpense?.id || 'new'}
          editingExpense={editingExpense}
          onSuccess={() => { setOpenDrawer(null); setEditingExpense(null); }}
          onCancelEdit={() => { setOpenDrawer(null); setEditingExpense(null); }}
        />
      </Drawer>

      {/* Reminder Drawer */}
      <Drawer
        open={showReminderDrawer}
        onOpenChange={(open) => { if (!open) setShowReminderDrawer(false); }}
        title="Hatırlatıcı Ekle"
      >
        <ReminderForm onSuccess={() => setShowReminderDrawer(false)} />
      </Drawer>

      {/* Budget Alert Drawer */}
      <Drawer
        open={showAlertDrawer}
        onOpenChange={(open) => { if (!open) setShowAlertDrawer(false); }}
        title="Bütçe Uyarısı Ekle"
      >
        <BudgetAlertForm onSuccess={() => setShowAlertDrawer(false)} />
      </Drawer>

      {/* AI Assistant */}
      {features.oracle && <AIAssistant />}

      {/* M10: Command Palette (⌘K Global Search) */}
      <CommandPalette
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={(tab) => { setActiveTab(tab); setShowCommandPalette(false); }}
      />

      {/* v4.6: Portal Navbar + Dock Bar — mobile only */}
      <div className="lg:hidden">
        <PortalNavbar activeTab={activeTab} />
        <DockBar activeTab={activeTab} onTabChange={setActiveTab} onOpenDrawer={setOpenDrawer} hidden={isOverlayActive} />
      </div>
    </div>
  );
}
