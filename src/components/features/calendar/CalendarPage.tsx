'use client';

/**
 * CalendarPage — Finansal Takvim
 *
 * Desktop full-page calendar with:
 * - Monthly grid (custom-built with date-fns)
 * - Day cells: expense dots (rose), income dots (emerald), reminder badges (amber)
 * - Click day → DayDetailPanel (xl+ side panel)
 * - KPI row: Yaklaşan Ödemeler, Bu Ay Harcama, Aktif Hatırlatıcılar
 * - Upcoming reminders list (next 7 days)
 * - Budget alert cards
 */

import React, { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Bell,
  Receipt,
  Target,
  AlertTriangle,
  TrendingDown,
  Plus,
  Shield,
  Clock,
} from 'lucide-react';
import { formatCurrency } from '@/utils';
import { useBudgetStore } from '@/store/useBudgetStore';
import { getReminders } from '@/actions/reminder';
import { getBudgetAlerts, checkBudgetAlerts } from '@/actions/budget-alert';
import type { Reminder, BudgetAlert } from '@/db/schema';

import { Drawer } from '@/components/ui/Drawer';

// Lazy-loaded sub-components
import { DayDetailPanel } from './DayDetailPanel';
import type { DayTransaction } from './DayDetailPanel';
import type { MergedTransaction } from '@/components/features/transactions/TransactionTable';

// ========================================
// DATE HELPERS (no date-fns needed for this)
// ========================================

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday-first
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const DAY_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const REMINDER_TYPE_ICON: Record<string, React.ElementType> = {
  bill_payment: Receipt,
  goal_deadline: Target,
  budget_limit: AlertTriangle,
  custom: Bell,
};

// ========================================
// MAIN COMPONENT
// ========================================

interface CalendarPageProps {
  onOpenReminderForm?: () => void;
  onOpenAlertForm?: () => void;
  onSelectTransaction?: (tx: MergedTransaction) => void;
}

// Mobile detection (< lg = < 1024px)
const LG_QUERY = '(max-width: 1023px)';
function subscribeMQ(cb: () => void) {
  const mql = window.matchMedia(LG_QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}
function getSnapshotMQ() { return window.matchMedia(LG_QUERY).matches; }
function getServerSnapshotMQ() { return false; }

export function CalendarPage({ onOpenReminderForm, onOpenAlertForm, onSelectTransaction }: CalendarPageProps) {
  const isMobile = useSyncExternalStore(subscribeMQ, getSnapshotMQ, getServerSnapshotMQ);
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayDrawer, setShowDayDrawer] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [budgetAlertsList, setBudgetAlertsList] = useState<BudgetAlert[]>([]);
  const [alertChecks, setAlertChecks] = useState<{ alertId: string; name: string; thresholdAmount: number; currentSpending: number; isTriggered: boolean; percentUsed: number }[]>([]);

  const expenses = useBudgetStore((s) => s.expenses);
  const incomes = useBudgetStore((s) => s.incomes);
  const currency = useBudgetStore((s) => s.currency);
  const getCategoryById = useBudgetStore((s) => s.getCategoryById);

  const handleTransactionClick = useCallback((dayTx: DayTransaction) => {
    if (!onSelectTransaction) return;
    if (dayTx.type === 'expense') {
      const exp = expenses.find((e) => e.id === dayTx.id);
      if (!exp) return;
      const cat = getCategoryById(exp.categoryId);
      onSelectTransaction({
        id: exp.id, type: 'expense', label: cat?.name || 'Gider', description: exp.note || '',
        categoryId: exp.categoryId, categoryName: cat?.name || 'Diğer', categoryColor: cat?.color || '#6B7280',
        amount: exp.amount, date: exp.date || exp.createdAt, createdAt: exp.createdAt,
        status: exp.status ?? 'completed', expectedDate: exp.expectedDate,
      });
    } else {
      const inc = incomes.find((i) => i.id === dayTx.id);
      if (!inc) return;
      onSelectTransaction({
        id: inc.id, type: 'income', label: inc.description || 'Gelir', description: inc.description || '',
        categoryId: inc.category, categoryName: inc.description || 'Gelir', categoryColor: '#10B981',
        amount: inc.amount, date: inc.date || inc.createdAt, createdAt: inc.createdAt,
        status: inc.status ?? 'completed', expectedDate: inc.expectedDate,
      });
    }
  }, [expenses, incomes, getCategoryById, onSelectTransaction]);

  // Fetch reminders and budget alerts
  useEffect(() => {
    async function fetchData() {
      const [remResult, alertResult, checkResult] = await Promise.all([
        getReminders(),
        getBudgetAlerts(),
        checkBudgetAlerts(),
      ]);
      if (remResult.success) setReminders(remResult.data);
      if (alertResult.success) setBudgetAlertsList(alertResult.data);
      if (checkResult.success) setAlertChecks(checkResult.data);
    }
    fetchData();
  }, []);

  // Navigation
  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  }, []);

  // Build day data map for the current month
  const dayDataMap = useMemo(() => {
    const map = new Map<string, { incomeCount: number; expenseCount: number; reminderCount: number; totalIncome: number; totalExpense: number }>();

    expenses.forEach((exp) => {
      const d = new Date(exp.date || exp.createdAt);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const key = d.getDate().toString();
        const existing = map.get(key) || { incomeCount: 0, expenseCount: 0, reminderCount: 0, totalIncome: 0, totalExpense: 0 };
        existing.expenseCount++;
        existing.totalExpense += exp.amount;
        map.set(key, existing);
      }
    });

    incomes.forEach((inc) => {
      const d = new Date(inc.date || inc.createdAt);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const key = d.getDate().toString();
        const existing = map.get(key) || { incomeCount: 0, expenseCount: 0, reminderCount: 0, totalIncome: 0, totalExpense: 0 };
        existing.incomeCount++;
        existing.totalIncome += inc.amount;
        map.set(key, existing);
      }
    });

    reminders.forEach((rem) => {
      const d = new Date(rem.dueDate);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const key = d.getDate().toString();
        const existing = map.get(key) || { incomeCount: 0, expenseCount: 0, reminderCount: 0, totalIncome: 0, totalExpense: 0 };
        existing.reminderCount++;
        map.set(key, existing);
      }
    });

    return map;
  }, [expenses, incomes, reminders, currentYear, currentMonth]);

  // Upcoming reminders (next 7 days)
  const upcomingReminders = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return reminders
      .filter((r) => r.isActive && new Date(r.dueDate) >= now && new Date(r.dueDate) <= nextWeek)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [reminders]);

  // KPI calculations
  const upcomingPaymentTotal = useMemo(() => {
    return upcomingReminders
      .filter((r) => r.type === 'bill_payment' && r.amount)
      .reduce((sum, r) => sum + parseFloat(r.amount!), 0);
  }, [upcomingReminders]);

  const thisMonthExpenseTotal = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((exp) => {
        const d = new Date(exp.date || exp.createdAt);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const activeReminderCount = reminders.filter((r) => r.isActive).length;

  // Reminders for selected date
  const selectedDateReminders = useMemo(() => {
    if (!selectedDate) return [];
    return reminders.filter((r) => isSameDay(new Date(r.dueDate), selectedDate));
  }, [selectedDate, reminders]);

  // Calendar grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold uppercase tracking-widest">
              <CalendarDays size={10} />
              Finansal Takvim
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400">
            Takvim & Hatırlatıcılar
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {onOpenAlertForm && (
            <button
              onClick={onOpenAlertForm}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 hover:bg-white/8 transition-all"
            >
              <Shield size={16} className="text-amber-400" />
              Bütçe Uyarısı
            </button>
          )}
          {onOpenReminderForm && (
            <button
              onClick={onOpenReminderForm}
              className="btn-portal-gradient flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
            >
              <Plus size={16} />
              Hatırlatıcı Ekle
            </button>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15">
              <Clock size={14} className="text-amber-400" />
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Yaklaşan Ödemeler</span>
          </div>
          <p className="text-xl font-black text-white tabular-nums">{formatCurrency(upcomingPaymentTotal, currency)}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">{upcomingReminders.filter((r) => r.type === 'bill_payment').length} fatura (7 gün)</p>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15">
              <TrendingDown size={14} className="text-rose-400" />
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Bu Ay Harcama</span>
          </div>
          <p className="text-xl font-black text-white tabular-nums">{formatCurrency(thisMonthExpenseTotal, currency)}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">{MONTH_NAMES[new Date().getMonth()]} toplamı</p>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Bell size={14} className="text-primary" />
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Aktif Hatırlatıcılar</span>
          </div>
          <p className="text-xl font-black text-white tabular-nums">{activeReminderCount}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">{upcomingReminders.length} yaklaşan (7 gün)</p>
        </div>
      </div>

      {/* Calendar + Detail Panel */}
      <div className="flex gap-5">
        {/* Calendar Grid */}
        <div className="flex-1 min-w-0">
          <div className="glass-panel rounded-2xl p-4 lg:p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPrevMonth}
                className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                aria-label="Önceki ay"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-white">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={goToToday}
                  className="text-[10px] font-semibold text-primary uppercase tracking-wider px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  Bugün
                </button>
              </div>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                aria-label="Sonraki ay"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_NAMES.map((day) => (
                <div key={day} className="text-center text-[10px] font-semibold text-zinc-500 uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentYear, currentMonth, day);
                const data = dayDataMap.get(day.toString());
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isTodayDate = isToday(date);

                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDate(date);
                      if (isMobile) setShowDayDrawer(true);
                    }}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-primary/20 border border-primary/40 text-white'
                        : isTodayDate
                          ? 'bg-white/8 text-white font-bold'
                          : 'hover:bg-white/5 text-zinc-400'
                    }`}
                    aria-label={`${day} ${MONTH_NAMES[currentMonth]}`}
                  >
                    <span className={`text-sm ${isTodayDate ? 'font-bold' : 'font-medium'}`}>{day}</span>

                    {/* Activity dots */}
                    {data && (
                      <div className="flex items-center gap-0.5">
                        {data.expenseCount > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" aria-label="Gider" />
                        )}
                        {data.incomeCount > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-label="Gelir" />
                        )}
                        {data.reminderCount > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-label="Hatırlatıcı" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-[10px] text-zinc-500">Gider</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-zinc-500">Gelir</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[10px] text-zinc-500">Hatırlatıcı</span>
              </div>
            </div>
          </div>

          {/* Budget Alerts */}
          {budgetAlertsList.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Shield size={16} className="text-amber-400" />
                Bütçe Uyarıları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {alertChecks.map((check) => (
                  <div
                    key={check.alertId}
                    className={`glass-panel rounded-xl p-4 border ${
                      check.isTriggered ? 'border-rose-500/30' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{check.name}</span>
                      {check.isTriggered && (
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15">
                          AŞILDI
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                      <span>Harcama: {formatCurrency(check.currentSpending, currency)}</span>
                      <span>Limit: {formatCurrency(check.thresholdAmount, currency)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          check.percentUsed >= 100 ? 'bg-rose-500' : check.percentUsed >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(check.percentUsed, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1 text-right">%{check.percentUsed} kullanıldı</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Reminders */}
          {upcomingReminders.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Yaklaşan Hatırlatıcılar (7 Gün)
              </h3>
              <div className="space-y-2">
                {upcomingReminders.map((rem) => {
                  const Icon = REMINDER_TYPE_ICON[rem.type] || Bell;
                  const dueDate = new Date(rem.dueDate);
                  const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                  return (
                    <div key={rem.id} className="glass-panel rounded-xl p-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 shrink-0">
                        <Icon size={18} className="text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{rem.title}</p>
                        <p className="text-[10px] text-zinc-500">
                          {dueDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                          {rem.amount && ` · ${formatCurrency(parseFloat(rem.amount), currency)}`}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        daysUntil <= 1 ? 'text-rose-400 bg-rose-500/15' :
                        daysUntil <= 3 ? 'text-amber-400 bg-amber-500/15' :
                        'text-zinc-400 bg-white/5'
                      }`}>
                        {daysUntil <= 0 ? 'Bugün' : `${daysUntil}g`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Day Detail Panel — xl+ desktop */}
        {selectedDate && (
          <div className="hidden xl:block w-80 shrink-0">
            <DayDetailPanel
              date={selectedDate}
              reminders={selectedDateReminders}
              onClose={() => setSelectedDate(null)}
              onTransactionClick={handleTransactionClick}
            />
          </div>
        )}
      </div>

      {/* Day Detail Drawer — mobile (< lg) */}
      <Drawer
        open={showDayDrawer && isMobile && !!selectedDate}
        onOpenChange={(open) => {
          setShowDayDrawer(open);
          if (!open) setSelectedDate(null);
        }}
        title={selectedDate?.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
      >
        {selectedDate && (
          <DayDetailPanel
            date={selectedDate}
            reminders={selectedDateReminders}
            onClose={() => { setShowDayDrawer(false); setSelectedDate(null); }}
            onTransactionClick={(tx) => {
              setShowDayDrawer(false);
              handleTransactionClick(tx);
            }}
          />
        )}
      </Drawer>
    </div>
  );
}

export default CalendarPage;
