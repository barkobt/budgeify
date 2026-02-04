'use client';

import React, { useState, useEffect } from 'react';
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
 * - Hydration-safe (client-only rendering for dynamic data)
 */
export const MainBalanceCard = () => {
  const { getTotalIncome, getTotalExpenses, getBalance, getSavingsRate } = useBudgetStore();

  // HYDRATION FIX: Client-only rendering
  const [isMounted, setIsMounted] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setTotalIncome(getTotalIncome());
    setTotalExpenses(getTotalExpenses());
    setBalance(getBalance());
    setSavingsRate(getSavingsRate());
  }, [getTotalIncome, getTotalExpenses, getBalance, getSavingsRate]);

  // Show loading state during SSR
  if (!isMounted) {
    return (
      <section
        className="relative overflow-hidden rounded-2xl gradient-accent text-white shadow-accent-lg"
        aria-label="Finansal Özet Kartı"
      >
        <div className="relative p-8 sm:p-10">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-white/10 rounded-xl w-48"></div>
            <div className="h-16 bg-white/10 rounded-xl w-64"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-24 bg-white/10 rounded-xl"></div>
              <div className="h-24 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const isPositive = balance >= 0;

  return (
    <section
      className="relative overflow-hidden rounded-2xl gradient-accent text-white shadow-accent-lg"
      aria-label="Finansal Özet Kartı"
    >
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" aria-hidden="true" />

      <div className="relative p-8 sm:p-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <DollarSign className="h-7 w-7" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">Mevcut Bakiye</p>
              <p className="text-xs text-white/70">Bu ay</p>
            </div>
          </div>

          {/* Savings Rate Badge */}
          {totalIncome > 0 && (
            <div className="rounded-full bg-white/25 px-4 py-1.5 backdrop-blur-sm border border-white/30">
              <p className="text-xs font-bold flex items-center gap-1.5">
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
            className="mb-3 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            aria-label={`Mevcut bakiye ${formatCurrency(balance)}`}
          >
            {formatCurrency(balance)}
          </h1>
          {balance !== 0 && (
            <div className="flex items-center gap-2" role="status" aria-live="polite">
              {isPositive ? (
                <TrendingUp className="h-5 w-5 text-green-200" aria-hidden="true" strokeWidth={2.5} />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-200" aria-hidden="true" strokeWidth={2.5} />
              )}
              <p className="text-sm font-medium text-white/90">
                {isPositive ? 'Olumlu bakiye' : 'Dikkat: Eksi bakiye'}
              </p>
            </div>
          )}
        </div>

        {/* Income & Expense Summary - FIXED EQUAL BOXES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" role="group" aria-label="Gelir ve Gider Özeti">
          {/* Income - EQUAL PADDING */}
          <div className="rounded-xl bg-white/15 p-6 backdrop-blur-sm border border-white/20" role="article" aria-label="Toplam Gelir">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-300" aria-hidden="true" />
              <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Gelir</p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
          </div>

          {/* Expense - EQUAL PADDING */}
          <div className="rounded-xl bg-white/15 p-6 backdrop-blur-sm border border-white/20" role="article" aria-label="Toplam Gider">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-300" aria-hidden="true" />
              <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Gider</p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        {/* Empty State */}
        {totalIncome === 0 && totalExpenses === 0 && (
          <div className="mt-6 rounded-xl bg-white/15 p-5 backdrop-blur-sm border border-white/20">
            <p className="text-center text-sm text-white/90 font-medium">
              <strong>İpucu:</strong> Gelir ve giderlerinizi ekleyerek başlayın
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MainBalanceCard;
