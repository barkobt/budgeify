'use client';

import React from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { generateId, getCurrentISODate, getTodayDate, formatCurrency } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

/**
 * StoreTestPanel - Store fonksiyonlarını test etmek için geçici panel
 * Production'a geçmeden önce bu component silinecek
 */
export const StoreTestPanel = () => {
  const {
    incomes,
    expenses,
    goals,
    addIncome,
    addExpense,
    addGoal,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
    getSavingsRate,
    getActiveCategories,
  } = useBudgetStore();

  const handleAddTestIncome = () => {
    addIncome({
      id: generateId(),
      type: 'salary',
      category: 'salary',
      amount: 25000,
      description: 'Test Maaş',
      isRecurring: true,
      createdAt: getCurrentISODate(),
      updatedAt: getCurrentISODate(),
    });
  };

  const handleAddTestExpense = () => {
    addExpense({
      id: generateId(),
      categoryId: 'cat_food',
      amount: 150,
      note: 'Test Yemek Harcaması',
      date: getTodayDate(),
      createdAt: getCurrentISODate(),
      updatedAt: getCurrentISODate(),
    });
  };

  const handleAddTestGoal = () => {
    addGoal({
      id: generateId(),
      name: 'Tatil',
      targetAmount: 10000,
      currentAmount: 0,
      icon: '✈️',
      status: 'active',
      createdAt: getCurrentISODate(),
    });
  };

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const savingsRate = getSavingsRate();
  const activeCategories = getActiveCategories();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>🧪 Store Test Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <p className="text-sm text-green-600 font-medium">Toplam Gelir</p>
              <p className="text-2xl font-bold text-green-700 tabular-nums">{formatCurrency(totalIncome)}</p>
              <p className="text-xs text-green-500 mt-1 tabular-nums">{incomes.length} kayıt</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 font-medium">Toplam Gider</p>
              <p className="text-2xl font-bold text-red-700 tabular-nums">{formatCurrency(totalExpenses)}</p>
              <p className="text-xs text-red-500 mt-1 tabular-nums">{expenses.length} kayıt</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Bakiye</p>
              <p className="text-2xl font-bold text-blue-700 tabular-nums">{formatCurrency(balance)}</p>
              <p className="text-xs text-blue-500 mt-1 tabular-nums">Tasarruf: %{savingsRate}</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <p className="text-sm text-purple-600 font-medium">Hedefler</p>
              <p className="text-2xl font-bold text-purple-700">{goals.length}</p>
              <p className="text-xs text-purple-500 mt-1">{activeCategories.length} kategori aktif</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleAddTestIncome} variant="primary" size="sm">
              ➕ Test Gelir Ekle
            </Button>
            <Button onClick={handleAddTestExpense} variant="secondary" size="sm">
              ➖ Test Gider Ekle
            </Button>
            <Button onClick={handleAddTestGoal} variant="outline" size="sm">
              🎯 Test Hedef Ekle
            </Button>
          </div>

          {/* Debug Info */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-900 font-medium">
              🔍 Store Detayları (Debug)
            </summary>
            <pre className="mt-3 p-4 bg-slate-100 rounded-lg text-xs overflow-auto max-h-96">
              {JSON.stringify({ incomes, expenses, goals, activeCategories }, null, 2)}
            </pre>
          </details>

          <p className="text-xs text-slate-400 italic mt-4 border-t border-slate-200 pt-4">
            ⚠️ Bu panel sadece test amaçlıdır. Production'a geçmeden önce silinecektir.
            LocalStorage'a kaydedilen veriler tarayıcı geliştirici araçlarından kontrol edilebilir
            (Application → Local Storage → budgeify-store).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreTestPanel;
