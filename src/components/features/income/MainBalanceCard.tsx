'use client';

import React from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency } from '@/utils';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

/**
 * MainBalanceCard - Ana Para Bloğu Component'i
 *
 * Ana sayfada kullanıcının mevcut bakiyesini ve gelir-gider özetini gösterir.
 * Gradient background ve büyük tipografi ile dikkat çeker.
 *
 * Features:
 * - Store'dan real-time bakiye çekme
 * - Gelir/Gider trend göstergeleri
 * - Tasarruf oranı gösterimi
 * - Responsive tasarım
 * - Client-only rendering (SSR disabled via dynamic import)
 */
export const MainBalanceCard = () => {
  const { getTotalIncome, getTotalExpenses, getBalance, getSavingsRate } = useBudgetStore();

  // Direct store access (no hydration issue because SSR is disabled)
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const savingsRate = getSavingsRate();

  const isPositive = balance >= 0;

  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg"
      aria-label="Finansal Özet Kartı"
    >
      <div className="p-8 sm:p-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100">
              <DollarSign className="h-6 w-6 text-accent-700" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Mevcut Bakiye</p>
              <p className="text-xs text-slate-500">Bu ay</p>
            </div>
          </div>

          {/* Savings Rate Badge */}
          {totalIncome > 0 && (
            <div className="rounded-full bg-accent-50 px-4 py-1.5 border border-accent-200">
              <p className="text-xs font-bold text-accent-700 flex items-center gap-1.5">
                {savingsRate >= 0 ? (
                  <TrendingUp size={14} strokeWidth={2.5} />
                ) : (
                  <TrendingDown size={14} strokeWidth={2.5} />
                )}
                %{Math.abs(savingsRate)} tasarruf
              </p>
            </div>
          )}
        </div>

        {/* Balance Amount */}
        <div className="mb-8">
          <h1
            className="mb-2 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl"
            aria-label={`Mevcut bakiye ${formatCurrency(balance)}`}
          >
            {formatCurrency(balance)}
          </h1>
          {balance !== 0 && (
            <div className="flex items-center gap-2" role="status" aria-live="polite">
              {isPositive ? (
                <TrendingUp className="h-5 w-5 text-green-600" aria-hidden="true" strokeWidth={2.5} />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" aria-hidden="true" strokeWidth={2.5} />
              )}
              <p className="text-sm font-medium text-slate-600">
                {isPositive ? 'Olumlu bakiye' : 'Dikkat: Eksi bakiye'}
              </p>
            </div>
          )}
        </div>

        {/* Income & Expense Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="group" aria-label="Gelir ve Gider Özeti">
          {/* Income */}
          <div className="rounded-xl bg-green-50 p-5 border border-green-200" role="article" aria-label="Toplam Gelir">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Gelir</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
          </div>

          {/* Expense */}
          <div className="rounded-xl bg-red-50 p-5 border border-red-200" role="article" aria-label="Toplam Gider">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Gider</p>
            </div>
            <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        {/* Empty State */}
        {totalIncome === 0 && totalExpenses === 0 && (
          <div className="mt-6 rounded-xl bg-accent-50 p-5 border border-accent-200">
            <p className="text-center text-sm text-accent-700 font-medium">
              <strong>İpucu:</strong> Gelir ve giderlerinizi ekleyerek başlayın
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MainBalanceCard;
