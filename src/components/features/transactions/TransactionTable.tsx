'use client';

/**
 * TransactionTable — v6.0 M4 Desktop Transaction Ledger
 *
 * Stitch 3 inspired full-page transaction table for desktop (lg+):
 * - Page header: "İşlem Defteri" + "Live Sync" badge + search + filter/download
 * - Filter tabs: Tümü | Gelir | Gider
 * - Full <table> layout with category badges, color-coded amounts, staggered rows
 * - Pagination footer: "X / Y gösteriliyor" + rows per page + prev/next
 * - Click row → opens detail panel (xl+)
 *
 * Data: useBudgetStore (expenses + incomes merged)
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Radio,
  MoreVertical,
} from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { getCategoryIcon } from '@/lib/category-icons';
import { formatCurrency, formatDateShort } from '@/utils';
import type { CurrencyCode } from '@/types';

// ========================================
// TYPES
// ========================================

export interface MergedTransaction {
  id: string;
  type: 'income' | 'expense';
  label: string;
  description: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  date: string;
  createdAt: string;
  status: 'completed' | 'pending';
  expectedDate?: string;
}

type FilterTab = 'all' | 'income' | 'expense';

interface TransactionTableProps {
  onSelectTransaction: (tx: MergedTransaction | null) => void;
  selectedId: string | null;
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  onAddTransaction?: () => void;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
}

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50];

// ========================================
// COMPONENT
// ========================================

export const TransactionTable: React.FC<TransactionTableProps> = ({
  onSelectTransaction,
  selectedId,
  onAddIncome,
  onAddExpense,
  onAddTransaction,
  onExportCSV,
  onExportPDF,
}) => {
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const expenses = useBudgetStore((s) => s.expenses);
  const incomes = useBudgetStore((s) => s.incomes);
  const getCategoryById = useBudgetStore((s) => s.getCategoryById);
  const currency = useBudgetStore((s) => s.currency) as CurrencyCode;

  // Merge expenses + incomes into unified transaction list
  const allTransactions = useMemo(() => {
    const merged: MergedTransaction[] = [];

    expenses.forEach((exp) => {
      const cat = getCategoryById(exp.categoryId);
      merged.push({
        id: exp.id,
        type: 'expense',
        label: cat?.name || 'Gider',
        description: exp.note || '',
        categoryId: exp.categoryId,
        categoryName: cat?.name || 'Diğer',
        categoryColor: cat?.color || '#6B7280',
        amount: exp.amount,
        date: exp.date || exp.createdAt,
        createdAt: exp.createdAt,
        status: exp.status ?? 'completed',
        expectedDate: exp.expectedDate,
      });
    });

    incomes.forEach((inc) => {
      merged.push({
        id: inc.id,
        type: 'income',
        label: inc.description || 'Gelir',
        description: inc.description || 'Maaş / Gelir',
        categoryId: inc.category,
        categoryName: inc.description || 'Gelir',
        categoryColor: '#10B981',
        amount: inc.amount,
        date: inc.date || inc.createdAt,
        createdAt: inc.createdAt,
        status: inc.status ?? 'completed',
        expectedDate: inc.expectedDate,
      });
    });

    merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return merged;
  }, [expenses, incomes, getCategoryById]);

  // Filter by tab + search
  const filteredTransactions = useMemo(() => {
    let result = allTransactions;

    if (filterTab === 'income') {
      result = result.filter((tx) => tx.type === 'income');
    } else if (filterTab === 'expense') {
      result = result.filter((tx) => tx.type === 'expense');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.label.toLowerCase().includes(q) ||
          tx.description.toLowerCase().includes(q) ||
          tx.categoryName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allTransactions, filterTab, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (safeCurrentPage - 1) * rowsPerPage,
    safeCurrentPage * rowsPerPage
  );
  const showingFrom = filteredTransactions.length === 0 ? 0 : (safeCurrentPage - 1) * rowsPerPage + 1;
  const showingTo = Math.min(safeCurrentPage * rowsPerPage, filteredTransactions.length);

  const handleFilterChange = useCallback((tab: FilterTab) => {
    setFilterTab(tab);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const FILTER_TABS: { label: string; value: FilterTab; count: number }[] = [
    { label: 'Tümü', value: 'all', count: allTransactions.length },
    { label: 'Gelir', value: 'income', count: allTransactions.filter((t) => t.type === 'income').length },
    { label: 'Gider', value: 'expense', count: allTransactions.filter((t) => t.type === 'expense').length },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-display text-white">İşlem Defteri</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
            <Radio size={8} className="animate-pulse" />
            Live Sync
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Ara... (⌘K)"
              className="h-9 w-52 rounded-lg bg-white/5 border border-white/10 pl-8 pr-3 text-xs text-white placeholder:text-slate-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Filter button (decorative) */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/8 hover:text-white transition-all"
            aria-label="Filtrele"
          >
            <Filter size={14} />
          </button>

          {/* Download dropdown */}
          <ExportDropdown onExportCSV={onExportCSV} onExportPDF={onExportPDF} />

          {/* Add Transaction CTA — dropdown */}
          <TransactionAddDropdown
            onAddIncome={onAddIncome}
            onAddExpense={onAddExpense}
            onAddTransaction={onAddTransaction}
          />
        </div>
      </div>

      {/* ── FILTER TABS ── */}
      <div className="flex gap-1 rounded-xl bg-white/5 border border-white/8 p-1 w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange(tab.value)}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              filterTab === tab.value
                ? 'bg-primary/20 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] tabular-nums ${
              filterTab === tab.value ? 'text-primary' : 'text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── TABLE ── */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider uppercase text-slate-500">İşlem</th>
                <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider uppercase text-slate-500">Kategori</th>
                <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider uppercase text-slate-500">Tarih</th>
                <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider uppercase text-slate-500">Durum</th>
                <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider uppercase text-slate-500 text-right">Tutar</th>
                <th className="px-3 py-3.5 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <p className="text-sm text-slate-600">
                      {searchQuery ? 'Aramanızla eşleşen işlem bulunamadı' : 'Henüz işlem yok'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx, idx) => {
                  const Icon = getCategoryIcon(tx.categoryId);
                  const isIncome = tx.type === 'income';
                  const isSelected = selectedId === tx.id;
                  const delayClass = idx < 8 ? `animate-row animate-row-delay-${idx + 1}` : 'animate-row';

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => onSelectTransaction(isSelected ? null : tx)}
                      className={`border-b border-white/5 cursor-pointer transition-colors duration-150 ${delayClass} ${
                        isSelected
                          ? 'bg-primary/10'
                          : 'hover:bg-white/3'
                      }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectTransaction(isSelected ? null : tx);
                        }
                      }}
                    >
                      {/* Transaction / Label */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                            style={{
                              backgroundColor: isIncome
                                ? 'rgba(16, 185, 129, 0.15)'
                                : `${tx.categoryColor}20`,
                            }}
                          >
                            <Icon
                              size={15}
                              strokeWidth={1.8}
                              style={{ color: isIncome ? '#10B981' : tx.categoryColor }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate max-w-48">
                              {tx.label}
                            </p>
                            {tx.description && tx.description !== tx.label && (
                              <p className="text-[10px] text-slate-600 truncate max-w-48">
                                {tx.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset"
                          style={{
                            color: isIncome ? '#10B981' : tx.categoryColor,
                            backgroundColor: isIncome
                              ? 'rgba(16, 185, 129, 0.10)'
                              : `${tx.categoryColor}15`,
                            borderColor: isIncome
                              ? 'rgba(16, 185, 129, 0.25)'
                              : `${tx.categoryColor}30`,
                          }}
                        >
                          {tx.categoryName}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3">
                        <span className="text-xs text-slate-400 tabular-nums">
                          {formatDateShort(tx.date)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-1.5 w-1.5 rounded-full ${
                            tx.status === 'completed'
                              ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                              : 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                          }`} />
                          <span className="text-xs text-slate-400">
                            {tx.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                          </span>
                          {tx.expectedDate && tx.status === 'pending' && (
                            <span className="text-[10px] text-slate-600 ml-1">
                              ({formatDateShort(tx.expectedDate)})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isIncome ? (
                            <ArrowUpRight size={12} className="text-emerald-400" />
                          ) : (
                            <ArrowDownRight size={12} className="text-rose-400" />
                          )}
                          <span className={`text-sm font-semibold tabular-nums font-mono ${
                            isIncome ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-3 py-3">
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors"
                          aria-label="İşlem detayı"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onSelectTransaction(tx);
                          }}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION FOOTER ── */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/8 px-5 py-3">
            <p className="text-[11px] text-slate-500">
              <span className="tabular-nums">{showingFrom}-{showingTo}</span> / <span className="tabular-nums">{filteredTransactions.length}</span> işlem gösteriliyor
            </p>

            <div className="flex items-center gap-3">
              {/* Rows per page */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-600">Sayfa başına:</span>
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="h-7 rounded-md bg-white/5 border border-white/10 px-1.5 text-[10px] text-slate-300 outline-none focus:border-primary/50"
                >
                  {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-card-dark">{opt}</option>
                  ))}
                </select>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage <= 1}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/8 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                  aria-label="Önceki sayfa"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="min-w-12 text-center text-[10px] text-slate-400 tabular-nums">
                  {safeCurrentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage >= totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/8 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                  aria-label="Sonraki sayfa"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── EXPORT DROPDOWN ──

function ExportDropdown({
  onExportCSV,
  onExportPDF,
}: {
  onExportCSV?: () => void;
  onExportPDF?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleExport = (fn?: () => void) => {
    setOpen(false);
    fn?.();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/8 hover:text-white transition-all"
        aria-label="İndir"
      >
        <Download size={14} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-xl bg-card-dark border border-white/10 p-1 shadow-xl">
            <button
              onClick={() => handleExport(onExportCSV)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Download size={13} className="text-emerald-400" />
              CSV İndir
            </button>
            <button
              onClick={() => handleExport(onExportPDF)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Download size={13} className="text-rose-400" />
              PDF İndir
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── TRANSACTION ADD DROPDOWN ──

function TransactionAddDropdown({
  onAddIncome,
  onAddExpense,
  onAddTransaction,
}: {
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  onAddTransaction?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleAdd = (fn?: () => void) => {
    setOpen(false);
    fn?.();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-1.5 rounded-lg bg-primary/20 border border-primary/30 px-3.5 text-xs font-medium text-white hover:bg-primary/30 transition-all"
      >
        <span className="text-sm">+</span>
        İşlem Ekle
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl bg-card-dark border border-white/10 p-1 shadow-xl">
            {onAddIncome && (
              <button
                onClick={() => handleAdd(onAddIncome)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <ArrowUpRight size={13} className="text-emerald-400" />
                Gelir Ekle
              </button>
            )}
            {onAddExpense && (
              <button
                onClick={() => handleAdd(onAddExpense)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <ArrowDownRight size={13} className="text-rose-400" />
                Gider Ekle
              </button>
            )}
            {onAddTransaction && !onAddIncome && !onAddExpense && (
              <button
                onClick={() => handleAdd(onAddTransaction)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                İşlem Ekle
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TransactionTable;
