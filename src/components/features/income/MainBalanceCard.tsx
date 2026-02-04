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
 */
export const MainBalanceCard = () => {
  const { getTotalIncome, getTotalExpenses, getBalance, getSavingsRate } = useBudgetStore();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const savingsRate = getSavingsRate();

  const isPositive = balance >= 0;

  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-2xl shadow-blue-500/30"
      aria-label="Finansal Özet Kartı"
    >
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" aria-hidden="true" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Mevcut Bakiye</p>
              <p className="text-xs text-white/60">Bu ay</p>
            </div>
          </div>

          {/* Savings Rate Badge */}
          {totalIncome > 0 && (
            <div className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
              <p className="text-xs font-semibold">
                {savingsRate >= 0 ? '📈' : '📉'} %{Math.abs(savingsRate)} tasarruf
              </p>
            </div>
          )}
        </div>

        {/* Balance Amount */}
        <div className="mb-6">
          <h1
            className="mb-2 text-5xl font-bold tracking-tight sm:text-6xl"
            aria-label={`Mevcut bakiye ${formatCurrency(balance)}`}
          >
            {formatCurrency(balance)}
          </h1>
          {balance !== 0 && (
            <div className="flex items-center gap-1" role="status" aria-live="polite">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-200" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-200" aria-hidden="true" />
              )}
              <p className="text-sm text-white/80">
                {isPositive ? 'Olumlu bakiye' : 'Dikkat: Eksi bakiye'}
              </p>
            </div>
          )}
        </div>

        {/* Income & Expense Summary */}
        <div className="grid grid-cols-2 gap-4" role="group" aria-label="Gelir ve Gider Özeti">
          {/* Income */}
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm" role="article" aria-label="Toplam Gelir">
            <div className="mb-1 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-300" aria-hidden="true" />
              <p className="text-xs font-medium text-white/70">Gelir</p>
            </div>
            <p className="text-xl font-bold">{formatCurrency(totalIncome)}</p>
          </div>

          {/* Expense */}
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm" role="article" aria-label="Toplam Gider">
            <div className="mb-1 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-300" aria-hidden="true" />
              <p className="text-xs font-medium text-white/70">Gider</p>
            </div>
            <p className="text-xl font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        {/* Empty State */}
        {totalIncome === 0 && totalExpenses === 0 && (
          <div className="mt-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-center text-sm text-white/80">
              💡 <strong>İpucu:</strong> Gelir ve giderlerinizi ekleyerek başlayın
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MainBalanceCard;
