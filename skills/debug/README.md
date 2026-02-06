# Skill: Testing & Debugging

> Budgeify'ın test stratejisi ve hata ayıklama protokolleri.
> Tetikleyici: Bug fix, test yazma, hata ayıklama, performans sorunları görevleri.

---

## Debugging Protocol

### 1. Reproduce First
```
1. Hatayı tam olarak tekrarla
2. Beklenen davranış vs gerçek davranış belirle
3. Minimum reproduction case oluştur
4. Console/network/DB loglarını kontrol et
```

### 2. Root Cause Analysis
```
1. Hatanın kaynağını bul (symptom değil, root cause)
2. Upstream fix tercih et (downstream workaround değil)
3. Tek satırlık fix yeterliyse over-engineer etme
4. Fix'in yan etkilerini kontrol et
```

### 3. Fix & Verify
```
1. Minimal fix uygula
2. Build kontrol et: npm run build
3. TypeScript kontrol et: npm run typecheck
4. Regression test ekle
5. İlgili sayfaları manuel test et
```

---

## Common Bug Categories

### Hydration Errors (Next.js + Zustand)
```typescript
// Problem: Server/client mismatch with persist middleware
// Solution: Dynamic import with ssr: false
const Component = dynamic(
  () => import('@/components/Feature').then(mod => ({ default: mod.Feature })),
  { ssr: false }
);
```

### Auth Errors
```typescript
// Problem: userId is null
// Check: Is the route protected in middleware?
// Check: Is auth() called correctly?
const { userId } = await auth();
if (!userId) {
  // This means: route is public OR user not signed in
  return { success: false, error: 'Unauthorized' };
}
```

### Database Errors
```typescript
// Problem: Query returns unexpected results
// Check 1: userId filter present?
// Check 2: deletedAt filter present?
// Check 3: Correct table/column names?
const results = await db.select()
  .from(expenses)
  .where(and(
    eq(expenses.userId, userId),    // ← Check 1
    isNull(expenses.deletedAt)      // ← Check 2
  ));
```

### Type Errors
```typescript
// Problem: decimal returns string from Drizzle
// Solution: Parse to number
const amount = parseFloat(result.amount); // decimal → string → number

// Problem: Date serialization
// Solution: Use ISO strings
const date = result.createdAt.toISOString();
```

---

## Test Structure

### Unit Tests (Server Actions)
```typescript
describe('IncomeActions', () => {
  describe('createIncome', () => {
    it('creates income with valid data', async () => {
      const result = await createIncome({
        amount: 5000,
        categoryId: 'salary',
        date: '2026-02-01',
        isRecurring: true,
      });
      expect(result.success).toBe(true);
      expect(result.data.amount).toBe('5000.00');
    });

    it('rejects unauthenticated requests', async () => {
      // Mock auth to return null
      const result = await createIncome(validData);
      expect(result).toEqual({ success: false, error: 'Unauthorized' });
    });

    it('rejects negative amounts', async () => {
      const result = await createIncome({ ...validData, amount: -100 });
      expect(result.success).toBe(false);
    });

    it('rejects missing category', async () => {
      const result = await createIncome({ ...validData, categoryId: '' });
      expect(result.success).toBe(false);
    });
  });
});
```

### Integration Tests (DB Queries)
```typescript
describe('Database Queries', () => {
  it('filters by userId (multi-tenant isolation)', async () => {
    // Create expenses for user A and user B
    // Query as user A
    // Verify only user A's expenses returned
  });

  it('excludes soft-deleted records', async () => {
    // Create and soft-delete an expense
    // Query active expenses
    // Verify deleted expense not in results
  });

  it('paginates correctly', async () => {
    // Create 25 expenses
    // Query page 1 (limit 20) → 20 results
    // Query page 2 (limit 20) → 5 results
  });
});
```

### Component Tests
```typescript
describe('ExpenseForm', () => {
  it('renders all category options', () => {
    render(<ExpenseForm />);
    expect(screen.getByText('Yemek')).toBeInTheDocument();
    expect(screen.getByText('Ulaşım')).toBeInTheDocument();
  });

  it('validates amount before submit', async () => {
    render(<ExpenseForm />);
    fireEvent.click(screen.getByText('Kaydet'));
    expect(screen.getByText('Tutar pozitif olmalı')).toBeInTheDocument();
  });

  it('shows success toast on submit', async () => {
    // Mock createExpense to return success
    render(<ExpenseForm />);
    // Fill form and submit
    expect(toast.success).toHaveBeenCalledWith('Gider başarıyla eklendi');
  });
});
```

---

## Coverage Requirements

```
Minimum overall    : 80%
Server actions     : 100% (auth + validation + happy + error paths)
Money calculations : 100%
Auth flows         : 100%
UI components      : Snapshot + key interactions
```

---

## Build Verification Checklist

```bash
# 1. TypeScript check
npm run typecheck

# 2. Lint check
npm run lint

# 3. Build check
npm run build

# 4. Verify output
# - 0 errors
# - 0 warnings (ideally)
# - Bundle size reasonable (< 150kB first load)
```

---

## Performance Debugging

### Bundle Size
```bash
# Analyze bundle
npm run analyze
# Check for: large dependencies, duplicate imports, unused code
```

### Slow Queries
```typescript
// Add timing to server actions
const start = performance.now();
const result = await db.select()...;
const duration = performance.now() - start;
if (duration > 1000) {
  console.warn('[SLOW_QUERY]', { action: 'getExpenses', duration: `${duration}ms` });
}
```

### Rendering Performance
```
- Use React DevTools Profiler
- Check for unnecessary re-renders
- Verify memo/useMemo usage
- Check Framer Motion animations are GPU-accelerated
```

---

## Prohibited

```
❌ console.log for debugging in committed code
❌ Skipping build check after fixes
❌ Fixing symptoms instead of root cause
❌ Deleting tests to make them pass
❌ Ignoring TypeScript errors with @ts-ignore
❌ Using any to bypass type errors
```

---

*Skill Module: Testing & Debugging*
*Stack: Jest | React Testing Library | TypeScript strict*
