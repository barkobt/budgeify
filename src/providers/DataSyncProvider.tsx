'use client';

/**
 * DataSyncProvider - Zustand & Server Actions Sync (v4.0)
 *
 * All server actions return ActionResult<T> — no throw pattern.
 * Optimistic UI with rollback on ActionResult failure.
 *
 * Flow:
 * 1. Component mount → Server'dan veri çek (ActionResult)
 * 2. Veriyi Zustand store'a yaz
 * 3. Kullanıcı değişiklik yapar → Store güncelle + Server'a gönder
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  updateIncome as serverUpdateIncome,
  updateExpense as serverUpdateExpense,
  deleteIncome as serverDeleteIncome,
  deleteExpense as serverDeleteExpense,
  deleteGoal as serverDeleteGoal,
} from '@/actions';

interface DataSyncContextType {
  isLoading: boolean;
  isSynced: boolean;
  error: string | null;
  lastError: string | null;
  clearError: () => void;
  syncData: () => Promise<void>;
  createIncome: (data: { amount: number; description?: string; categoryId?: string; isRecurring?: boolean }) => Promise<void>;
  createExpense: (data: { amount: number; note?: string; categoryId?: string }) => Promise<void>;
  createGoal: (data: { name: string; targetAmount: number; icon: string; targetDate?: Date }) => Promise<void>;
  updateIncome: (id: string, data: { amount?: number; description?: string; categoryId?: string; isRecurring?: boolean }) => Promise<void>;
  updateExpense: (id: string, data: { amount?: number; note?: string; categoryId?: string }) => Promise<void>;
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
  const [lastError, setLastError] = useState<string | null>(null);

  const pendingDeletesRef = useRef<Set<string>>(new Set());
  const operationLockRef = useRef<boolean>(false);

  const store = useBudgetStore();

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  /**
   * Sync data from server to local store
   * All fetches return ActionResult<T> — extract .data on success
   */
  const syncData = useCallback(async () => {
    if (!isSignedIn) {
      setIsLoading(false);
      return;
    }

    if (operationLockRef.current) return;

    try {
      operationLockRef.current = true;
      setIsLoading(true);
      setError(null);

      await getOrCreateUser();
      await seedDefaultCategories();

      const [incomesResult, expensesResult, goalsResult] = await Promise.all([
        getIncomes(),
        getExpenses(),
        getGoals(),
        getCategories(),
      ]) as [Awaited<ReturnType<typeof getIncomes>>, Awaited<ReturnType<typeof getExpenses>>, Awaited<ReturnType<typeof getGoals>>, unknown];

      // Extract data from ActionResult — fallback to empty arrays on failure
      const serverIncomes = incomesResult.success ? incomesResult.data : [];
      const serverExpenses = expensesResult.success ? expensesResult.data : [];
      const serverGoals = goalsResult.success ? goalsResult.data : [];

      const pendingDeletes = pendingDeletesRef.current;

      const localIncomes = serverIncomes
        .filter((income) => !pendingDeletes.has(income.id))
        .map((income) => ({
          id: income.id,
          type: 'salary' as const,
          category: 'salary' as const,
          amount: parseFloat(income.amount),
          description: income.description ?? undefined,
          isRecurring: income.isRecurring,
          createdAt: income.createdAt.toISOString(),
          updatedAt: income.updatedAt.toISOString(),
        }));

      const localExpenses = serverExpenses
        .filter((expense) => !pendingDeletes.has(expense.id))
        .map((expense) => ({
          id: expense.id,
          categoryId: expense.categoryId ?? 'cat_other',
          amount: parseFloat(expense.amount),
          note: expense.note ?? undefined,
          date: expense.date.toISOString().split('T')[0],
          createdAt: expense.createdAt.toISOString(),
          updatedAt: expense.updatedAt.toISOString(),
        }));

      const localGoals = serverGoals
        .filter((goal) => !pendingDeletes.has(goal.id))
        .map((goal) => ({
          id: goal.id,
          name: goal.name,
          targetAmount: parseFloat(goal.targetAmount),
          currentAmount: parseFloat(goal.currentAmount),
          icon: goal.icon,
          targetDate: goal.targetDate?.toISOString().split('T')[0],
          status: goal.status,
          createdAt: goal.createdAt.toISOString(),
        }));

      useBudgetStore.setState({
        incomes: localIncomes,
        expenses: localExpenses,
        goals: localGoals,
      });

      setIsSynced(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Veri senkronizasyonu başarısız';
      setError(errorMessage);
      setLastError(errorMessage);
    } finally {
      setIsLoading(false);
      operationLockRef.current = false;
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      syncData();
    } else if (isLoaded && !isSignedIn) {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, syncData]);

  /**
   * Create Income — ActionResult pattern
   */
  const createIncome = useCallback(async (data: {
    amount: number;
    description?: string;
    categoryId?: string;
    isRecurring?: boolean;
  }) => {
    const tempId = `temp_${Date.now()}`;
    const now = new Date().toISOString();

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

    const result = await serverCreateIncome(data);
    if (!result.success) {
      store.deleteIncome(tempId);
      setLastError(result.error);
      return;
    }

    useBudgetStore.setState((state) => ({
      incomes: state.incomes.map((i) =>
        i.id === tempId ? { ...i, id: result.data.id } : i
      ),
    }));
  }, [store]);

  /**
   * Create Expense — ActionResult pattern
   */
  const createExpense = useCallback(async (data: {
    amount: number;
    note?: string;
    categoryId?: string;
  }) => {
    const tempId = `temp_${Date.now()}`;
    const now = new Date().toISOString();
    const today = now.split('T')[0];

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

    const result = await serverCreateExpense(data);
    if (!result.success) {
      store.deleteExpense(tempId);
      setLastError(result.error);
      return;
    }

    useBudgetStore.setState((state) => ({
      expenses: state.expenses.map((e) =>
        e.id === tempId ? { ...e, id: result.data.id } : e
      ),
    }));
  }, [store]);

  /**
   * Create Goal — ActionResult pattern (no double-throw)
   */
  const createGoal = useCallback(async (data: {
    name: string;
    targetAmount: number;
    icon: string;
    targetDate?: Date;
  }) => {
    const tempId = `temp_${Date.now()}`;
    const now = new Date().toISOString();

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

    const result = await serverCreateGoal(data);
    if (!result.success) {
      store.deleteGoal(tempId);
      setLastError(result.error);
      return;
    }

    useBudgetStore.setState((state) => ({
      goals: state.goals.map((g) =>
        g.id === tempId ? { ...g, id: result.data.id } : g
      ),
    }));
  }, [store]);

  /**
   * Update Income — Optimistic + ActionResult
   */
  const updateIncome = useCallback(async (id: string, data: {
    amount?: number;
    description?: string;
    categoryId?: string;
    isRecurring?: boolean;
  }) => {
    // Snapshot for rollback
    const current = useBudgetStore.getState().incomes.find((i) => i.id === id);
    if (!current) return;

    // Optimistic update
    store.updateIncome(id, data);

    // Skip server call for temp IDs
    if (id.startsWith('temp_')) return;

    const result = await serverUpdateIncome(id, data);
    if (!result.success) {
      // Rollback
      store.updateIncome(id, current);
      setLastError(result.error);
    }
  }, [store]);

  /**
   * Update Expense — Optimistic + ActionResult
   */
  const updateExpense = useCallback(async (id: string, data: {
    amount?: number;
    note?: string;
    categoryId?: string;
  }) => {
    // Snapshot for rollback
    const current = useBudgetStore.getState().expenses.find((e) => e.id === id);
    if (!current) return;

    // Optimistic update
    store.updateExpense(id, data);

    // Skip server call for temp IDs
    if (id.startsWith('temp_')) return;

    const result = await serverUpdateExpense(id, data);
    if (!result.success) {
      // Rollback
      store.updateExpense(id, current);
      setLastError(result.error);
    }
  }, [store]);

  /**
   * Remove Income — pending deletes + ActionResult
   */
  const removeIncome = useCallback(async (id: string) => {
    const currentIncomes = useBudgetStore.getState().incomes;
    const incomeToDelete = currentIncomes.find((i) => i.id === id);

    pendingDeletesRef.current.add(id);
    store.deleteIncome(id);

    if (!id.startsWith('temp_')) {
      const result = await serverDeleteIncome(id);
      if (!result.success) {
        pendingDeletesRef.current.delete(id);
        if (incomeToDelete) store.addIncome(incomeToDelete);
        setLastError(result.error);
        return;
      }
    }
    pendingDeletesRef.current.delete(id);
  }, [store]);

  /**
   * Remove Expense — pending deletes + ActionResult
   */
  const removeExpense = useCallback(async (id: string) => {
    const currentExpenses = useBudgetStore.getState().expenses;
    const expenseToDelete = currentExpenses.find((e) => e.id === id);

    pendingDeletesRef.current.add(id);
    store.deleteExpense(id);

    if (!id.startsWith('temp_')) {
      const result = await serverDeleteExpense(id);
      if (!result.success) {
        pendingDeletesRef.current.delete(id);
        if (expenseToDelete) store.addExpense(expenseToDelete);
        setLastError(result.error);
        return;
      }
    }
    pendingDeletesRef.current.delete(id);
  }, [store]);

  /**
   * Remove Goal — pending deletes + ActionResult (no double-throw)
   */
  const removeGoal = useCallback(async (id: string) => {
    const currentGoals = useBudgetStore.getState().goals;
    const goalToDelete = currentGoals.find((g) => g.id === id);

    pendingDeletesRef.current.add(id);
    store.deleteGoal(id);

    if (!id.startsWith('temp_')) {
      const result = await serverDeleteGoal(id);
      if (!result.success) {
        pendingDeletesRef.current.delete(id);
        if (goalToDelete) store.addGoal(goalToDelete);
        setLastError(result.error);
        return;
      }
    }
    pendingDeletesRef.current.delete(id);
  }, [store]);

  const value: DataSyncContextType = {
    isLoading,
    isSynced,
    error,
    lastError,
    clearError,
    syncData,
    createIncome,
    createExpense,
    createGoal,
    updateIncome,
    updateExpense,
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
