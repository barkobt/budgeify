/**
 * Budget Store - Zustand Pattern Implementation Guide
 *
 * This file demonstrates the Zustand store pattern used throughout the Budgeify application.
 * Zustand provides a lightweight, flexible state management solution with persistence support.
 *
 * PATTERN OVERVIEW:
 * =================
 *
 * 1. Define a State Interface
 *    - List all state properties (data)
 *    - List all actions (functions that modify state)
 *
 * 2. Create the Store using create<StateType>()
 *    - Wrap with persist() middleware for localStorage integration
 *    - Use (set) callback to access state update function
 *    - Return initial state and action implementations
 *
 * 3. Export the useStore hook
 *    - Consumers import and use like: const { items, addItem } = useStore()
 *
 * EXAMPLE IMPLEMENTATION:
 * =======================
 *
 * import { create } from 'zustand';
 * import { persist } from 'zustand/middleware';
 * import type { BudgetData } from '@/types';
 *
 * interface BudgetState {
 *   // State properties
 *   totalIncome: number;
 *   totalExpenses: number;
 *   budgetItems: BudgetData[];
 *   isLoading: boolean;
 *
 *   // Actions
 *   setTotalIncome: (amount: number) => void;
 *   setTotalExpenses: (amount: number) => void;
 *   addBudgetItem: (item: BudgetData) => void;
 *   removeBudgetItem: (id: string) => void;
 *   updateBudgetItem: (id: string, updates: Partial<BudgetData>) => void;
 *   resetBudget: () => void;
 * }
 *
 * export const useBudgetStore = create<BudgetState>()(
 *   persist(
 *     (set) => ({
 *       // Initial state
 *       totalIncome: 0,
 *       totalExpenses: 0,
 *       budgetItems: [],
 *       isLoading: false,
 *
 *       // Action implementations
 *       setTotalIncome: (amount) =>
 *         set(() => ({ totalIncome: amount })),
 *
 *       setTotalExpenses: (amount) =>
 *         set(() => ({ totalExpenses: amount })),
 *
 *       addBudgetItem: (item) =>
 *         set((state) => ({
 *           budgetItems: [...state.budgetItems, item],
 *         })),
 *
 *       removeBudgetItem: (id) =>
 *         set((state) => ({
 *           budgetItems: state.budgetItems.filter((item) => item.id !== id),
 *         })),
 *
 *       updateBudgetItem: (id, updates) =>
 *         set((state) => ({
 *           budgetItems: state.budgetItems.map((item) =>
 *             item.id === id ? { ...item, ...updates } : item
 *           ),
 *         })),
 *
 *       resetBudget: () =>
 *         set(() => ({
 *           totalIncome: 0,
 *           totalExpenses: 0,
 *           budgetItems: [],
 *           isLoading: false,
 *         })),
 *     }),
 *     {
 *       name: 'budgeify-budget', // localStorage key
 *     }
 *   )
 * );
 *
 * USAGE IN COMPONENTS:
 * ====================
 *
 * import { useBudgetStore } from '@/store/useBudgetStore';
 *
 * export function MyComponent() {
 *   const { totalIncome, addBudgetItem } = useBudgetStore();
 *
 *   return (
 *     <div>
 *       <p>Income: ₺{totalIncome}</p>
 *       <button onClick={() => addBudgetItem({ id: '1', ... })}>
 *         Add Item
 *       </button>
 *     </div>
 *   );
 * }
 *
 * KEY PRINCIPLES:
 * ===============
 * - Always use (set) callback, never mutate state directly
 * - Keep state flat and predictable
 * - Named actions make code self-documenting
 * - persist() middleware automatically syncs with localStorage
 * - Use TypeScript interfaces for type safety
 */
