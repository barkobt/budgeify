'use client';

/**
 * DataSyncProvider - Zustand & Server Actions Sync
 *
 * 🎓 MENTOR NOTU - Hybrid State Pattern:
 * -------------------------------------
 * Bu provider, Zustand (client) ve Server Actions (server) arasında
 * senkronizasyon sağlar.
 *
 * Neden bu pattern?
 * 1. Optimistic UI: Kullanıcı değişikliği anında görür (localStorage)
 * 2. Persistence: Veriler sunucuda kalıcı olarak saklanır (Neon DB)
 * 3. Offline Support: İnternet kesilse bile localStorage çalışır
 *
 * Flow:
 * 1. Component mount → Server'dan veri çek
 * 2. Veriyi Zustand store'a yaz
 * 3. Kullanıcı değişiklik yapar → Store güncelle + Server'a gönder
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useAuth } from '@clerk/nextjs';
import {
  getOrCreateUser,
  getIncomes,
  getExpenses,
  getGoals,
  seedDefaultCategories,
  getCategories,
  createIncome as serverCreateIncome,
  createExpense as serverCreateExpense,
  createGoal as serverCreateGoal,
  deleteIncome as serverDeleteIncome,
  deleteExpense as serverDeleteExpense,
  deleteGoal as serverDeleteGoal,
} from '@/actions';

interface DataSyncContextType {
  isLoading: boolean;
  isSynced: boolean;
  error: string | null;
  syncData: () => Promise<void>;
  createIncome: (data: { amount: number; description?: string; categoryId?: string; isRecurring?: boolean }) => Promise<void>;
  createExpense: (data: { amount: number; note?: string; categoryId?: string }) => Promise<void>;
  createGoal: (data: { name: string; targetAmount: number; icon: string; targetDate?: Date }) => Promise<void>;
  removeIncome: (id: string) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
}

const DataSyncContext = createContext<DataSyncContextType | null>(null);

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const store = useBudgetStore();

  /**
   * Sync data from server to local store
   */
  const syncData = useCallback(async () => {
    if (!isSignedIn) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Ensure user exists in database
      await getOrCreateUser();

      // Seed default categories if needed
      await seedDefaultCategories();

      // Fetch all data from server
      const [serverIncomes, serverExpenses, serverGoals, serverCategories] = await Promise.all([
        getIncomes(),
        getExpenses(),
        getGoals(),
        getCategories(),
      ]);

      // Transform server data to local format
      const localIncomes = serverIncomes.map((income) => ({
        id: income.id,
        type: 'salary' as const,
        category: 'salary' as const,
        amount: parseFloat(income.amount),
        description: income.description ?? undefined,
        isRecurring: income.isRecurring,
        createdAt: income.createdAt.toISOString(),
        updatedAt: income.updatedAt.toISOString(),
      }));

      const localExpenses = serverExpenses.map((expense) => ({
        id: expense.id,
        categoryId: expense.categoryId ?? 'cat_other',
        amount: parseFloat(expense.amount),
        note: expense.note ?? undefined,
        date: expense.date.toISOString().split('T')[0],
        createdAt: expense.createdAt.toISOString(),
        updatedAt: expense.updatedAt.toISOString(),
      }));

      const localGoals = serverGoals.map((goal) => ({
        id: goal.id,
        name: goal.name,
        targetAmount: parseFloat(goal.targetAmount),
        currentAmount: parseFloat(goal.currentAmount),
        icon: goal.icon,
        targetDate: goal.targetDate?.toISOString().split('T')[0],
        status: goal.status,
        createdAt: goal.createdAt.toISOString(),
      }));

      // Reset and update store with server data
      // We use direct state manipulation here
      useBudgetStore.setState({
        incomes: localIncomes,
        expenses: localExpenses,
        goals: localGoals,
      });

      setIsSynced(true);
    } catch (err) {
      console.error('Data sync error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync data');
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  /**
   * Initial sync on mount
   */
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      syncData();
    } else if (isLoaded && !isSignedIn) {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, syncData]);

  /**
   * Create Income - Optimistic update + Server persist
   */
  const createIncome = useCallback(async (data: {
    amount: number;
    description?: string;
    categoryId?: string;
    isRecurring?: boolean;
  }) => {
    const tempId = `temp_${Date.now()}`;
    const now = new Date().toISOString();

    // Optimistic: Add to local store immediately
    const localIncome = {
      id: tempId,
      type: 'salary' as const,
      category: 'salary' as const,
      amount: data.amount,
      description: data.description,
      isRecurring: data.isRecurring ?? false,
      createdAt: now,
      updatedAt: now,
    };
    store.addIncome(localIncome);

    try {
      // Persist to server
      const serverIncome = await serverCreateIncome(data);

      // Update local store with real ID
      useBudgetStore.setState((state) => ({
        incomes: state.incomes.map((i) =>
          i.id === tempId
            ? { ...i, id: serverIncome.id }
            : i
        ),
      }));
    } catch (err) {
      // Rollback on error
      store.deleteIncome(tempId);
      throw err;
    }
  }, [store]);

  /**
   * Create Expense - Optimistic update + Server persist
   */
  const createExpense = useCallback(async (data: {
    amount: number;
    note?: string;
    categoryId?: string;
  }) => {
    const tempId = `temp_${Date.now()}`;
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    // Optimistic: Add to local store immediately
    const localExpense = {
      id: tempId,
      categoryId: data.categoryId ?? 'cat_other',
      amount: data.amount,
      note: data.note,
      date: today,
      createdAt: now,
      updatedAt: now,
    };
    store.addExpense(localExpense);

    try {
      // Persist to server
      const serverExpense = await serverCreateExpense(data);

      // Update local store with real ID
      useBudgetStore.setState((state) => ({
        expenses: state.expenses.map((e) =>
          e.id === tempId
            ? { ...e, id: serverExpense.id }
            : e
        ),
      }));
    } catch (err) {
      // Rollback on error
      store.deleteExpense(tempId);
      throw err;
    }
  }, [store]);

  /**
   * Create Goal - Optimistic update + Server persist
   */
  const createGoal = useCallback(async (data: {
    name: string;
    targetAmount: number;
    icon: string;
    targetDate?: Date;
  }) => {
    const tempId = `temp_${Date.now()}`;
    const now = new Date().toISOString();

    // Optimistic: Add to local store immediately
    const localGoal = {
      id: tempId,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: 0,
      icon: data.icon,
      targetDate: data.targetDate?.toISOString().split('T')[0],
      status: 'active' as const,
      createdAt: now,
    };
    store.addGoal(localGoal);

    try {
      // Persist to server
      const serverGoal = await serverCreateGoal(data);

      // Update local store with real ID
      useBudgetStore.setState((state) => ({
        goals: state.goals.map((g) =>
          g.id === tempId
            ? { ...g, id: serverGoal.id }
            : g
        ),
      }));
    } catch (err) {
      // Rollback on error
      store.deleteGoal(tempId);
      throw err;
    }
  }, [store]);

  /**
   * Remove Income
   */
  const removeIncome = useCallback(async (id: string) => {
    // Store current state for rollback
    const currentIncomes = useBudgetStore.getState().incomes;
    const incomeToDelete = currentIncomes.find((i) => i.id === id);

    // Optimistic: Remove from local store immediately
    store.deleteIncome(id);

    try {
      // Persist to server (skip temp IDs)
      if (!id.startsWith('temp_')) {
        await serverDeleteIncome(id);
      }
    } catch (err) {
      // Rollback on error
      if (incomeToDelete) {
        store.addIncome(incomeToDelete);
      }
      throw err;
    }
  }, [store]);

  /**
   * Remove Expense
   */
  const removeExpense = useCallback(async (id: string) => {
    const currentExpenses = useBudgetStore.getState().expenses;
    const expenseToDelete = currentExpenses.find((e) => e.id === id);

    store.deleteExpense(id);

    try {
      if (!id.startsWith('temp_')) {
        await serverDeleteExpense(id);
      }
    } catch (err) {
      if (expenseToDelete) {
        store.addExpense(expenseToDelete);
      }
      throw err;
    }
  }, [store]);

  /**
   * Remove Goal
   */
  const removeGoal = useCallback(async (id: string) => {
    const currentGoals = useBudgetStore.getState().goals;
    const goalToDelete = currentGoals.find((g) => g.id === id);

    store.deleteGoal(id);

    try {
      if (!id.startsWith('temp_')) {
        await serverDeleteGoal(id);
      }
    } catch (err) {
      if (goalToDelete) {
        store.addGoal(goalToDelete);
      }
      throw err;
    }
  }, [store]);

  const value: DataSyncContextType = {
    isLoading,
    isSynced,
    error,
    syncData,
    createIncome,
    createExpense,
    createGoal,
    removeIncome,
    removeExpense,
    removeGoal,
  };

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
}

/**
 * Hook to use data sync context
 */
export function useDataSync() {
  const context = useContext(DataSyncContext);

  if (!context) {
    throw new Error('useDataSync must be used within a DataSyncProvider');
  }

  return context;
}

/**
 * Hook for components that only read data (not auth dependent)
 * Falls back gracefully when not in provider
 */
export function useDataSyncOptional() {
  const context = useContext(DataSyncContext);
  return context;
}
