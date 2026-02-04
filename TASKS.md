# Budgeify - Development Tasks

## Progress: 8/32 Tasks Complete (25%)

**Current Phase:** Income Module (Milestone 4)
**Next Task:** Task 4.1 - Ana Maaş State'i Oluşturma

### Task 1.1: Next.js Proje Kurulumu ✅ TAMAMLANDI

- [x] Yeni bir Next.js projesi oluştur ve Tailwind CSS'i entegre et.

**Dosya(lar):** `package.json`, `tailwind.config.js`, `postcss.config.js`, `globals.css`
**Bağımlılık:** Yok
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [x] Next.js projesi başarıyla oluşturuldu.
- [x] Tailwind CSS konfigürasyonu yapıldı ve çalışır durumda.
- [x] Proje `npm run dev` ile sorunsuz çalışıyor.

**Styling Notes:** Modern ve minimalist estetiğe uygun temel kurulum.

**Commit:** `feat(setup): initialize Next.js project with Tailwind CSS`

### Task 1.2: Klasör Yapısı ve Temel Dosyalar ✅ TAMAMLANDI

- [x] PRD'de belirtilen klasör yapısını (src/app, src/components, src/stores, etc.) oluştur.
- [x] Temel `tsconfig.json` dosyasını yapılandır.

**Dosya(lar):** `src/app`, `src/components`, `src/stores`, `src/services`, `src/types`, `src/utils`, `src/constants`, `tsconfig.json`
**Bağımlılık:** Task 1.1 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [x] Belirtilen klasör yapısı oluşturuldu.
- [x] `tsconfig.json` güncel TypeScript ayarlarıyla yapılandırıldı.
- [x] Boş `src/types/index.ts` dosyası oluşturuldu.

**Styling Notes:** Yok

**Commit:** `chore(setup): create base folder structure and tsconfig`

### Task 1.3: Integrated Zustand Store Schema ✅ TAMAMLANDI

- [x] `src/store/useBudgetStore.ts` içinde merkezi Zustand store'u oluştur.
- [x] Income, Expense, Goal, Category state'lerini persist middleware ile entegre et.
- [x] CRUD action'ları ve utility fonksiyonları (getBalance, getSavingsRate) ekle.

**Dosya(lar):** `src/store/useBudgetStore.ts`, `src/components/features/StoreTestPanel.tsx`
**Bağımlılık:** Task 1.2 tamamlanmalı
**Süre:** ~20-25 dk

**Acceptance Criteria:**
- [x] BudgetStoreState interface tanımlandı (Income, Expense, Goal, Category)
- [x] Persist middleware ile localStorage entegrasyonu yapıldı
- [x] CRUD action'ları (add, update, delete) her entity için mevcut
- [x] Utility fonksiyonlar: getTotalIncome, getTotalExpenses, getBalance, getSavingsRate
- [x] TypeScript tipleri @/types'dan import edildi
- [x] Test panel oluşturuldu ve store fonksiyonları doğrulandı

**Styling Notes:** Yok

**Commit:** `feat(store): implement integrated Zustand store with persist middleware`

---
🎯 **Milestone: Setup Complete**
Kontrol: Temel proje kurulumu ve klasör yapısı hazır, `npm run build` hatasız
---

### Task 2.1: Button Component'i Oluşturma ✅ TAMAMLANDI

- [x] Reusable bir Button component'i oluştur. Primary, secondary, ghost varyantlarını desteklesin.

**Dosya(lar):** `src/components/ui/Button.tsx`
**Bağımlılık:** Task 1.2 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [x] Component renderlanıyor.
- [x] TypeScript hatasız.
- [x] UI Reference'taki stile (rounded-xl, blue-600) uygun.

**Styling Notes:** Primary butonlar: `bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3`. Ghost butonlar: `bg-transparent hover:bg-slate-100 text-slate-700 rounded-xl`.

**Commit:** `feat(ui): add Button component with variants`

### Task 2.2: Card Component'i Oluşturma ✅ TAMAMLANDI

- [x] Reusable bir Card component'i oluştur. Glassmorphism estetiğine uygun olsun.

**Dosya(lar):** `src/components/ui/Card.tsx`
**Bağımlılık:** Task 1.2 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [x] Component renderlanıyor.
- [x] TypeScript hatasız.
- [x] UI Reference'taki (rounded-2xl, glassmorphism) stile uygun.

**Styling Notes:** `rounded-2xl bg-white/80 backdrop-blur-md shadow-xl shadow-black/5 border border-white/20`

**Commit:** `feat(ui): add GlassCard component with blur effect`

### Task 2.3: Input Component'i Oluşturma ✅ TAMAMLANDI

- [x] Reusable bir Input component'i oluştur. Standard text input ve numeric input varyantlarını desteklesin.

**Dosya(lar):** `src/components/ui/Input.tsx`
**Bağımlılık:** Task 1.2 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [x] Component renderlanıyor.
- [x] TypeScript hatasız.
- [x] UI Reference'taki stile uygun.

**Styling Notes:** `rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20`

**Commit:** `feat(ui): add Input component with styling`

--- 
🎯 **Milestone: UI Foundations Complete**
Kontrol: Tüm reusable component'lar hazır, `npm run build` hatasız
---

### Task 3.1: Header Component'i Oluşturma ✅ TAMAMLANDI

**Dosya(lar):** `src/components/layout/Header.tsx`
**Bağımlılık:** Task 2.1, 2.2 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [x] Header component'i sayfada görünüyor.
- [x] Logo ve ayarlar ikonu yerleşimleri doğru.
- [x] Responsive düzenlemeler yapıldı (mobile-first).

**Styling Notes:** Minimalist tasarım, sabit üst kısım.

**Commit:** `feat(layout): implement Header component`

### Task 3.2: Bottom Navigation Component'i Oluşturma ✅ TAMAMLANDI

- [x] Mobil cihazlar için `BottomNav` component'ini oluştur. Ana sayfa, gelir, harcama ekle, analiz ve hedefler ikonlarını içersin.

**Dosya(lar):** `src/components/layout/BottomNav.tsx`
**Bağımlılık:** Task 2.1 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [x] Bottom navigation mobil görünümde sayfada görünüyor.
- [x] İkonlar doğru yerleştirildi ve tıklanabilir durumda.
- [x] `+` butonu belirgin ve ortalanmış.

**Styling Notes:** `Floating Action Button (FAB)` ortada, aktif ikon belirgin.

**Commit:** `feat(layout): implement mobile BottomNav`

### Task 3.3: Temel Layout Yapısı ✅ TAMAMLANDI

- [x] `Header` ve `BottomNav`'ı içeren temel sayfa layout'unu oluştur. Desktop için Sidebar entegrasyonuna uygun bir yapı sağla.

**Dosya(lar):** `src/app/layout.tsx`
**Bağımlılık:** Task 3.1, 3.2 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [x] Tüm sayfalarda header ve bottom nav görünüyor.
- [x] İçerik bu layout içinde doğru şekilde renderlanıyor.
- [x] Responsive geçişler sorunsuz çalışıyor.

**Styling Notes:** Genel responsive tasarım prensiplerine uygunluk.

**Commit:** `chore(layout): establish base page layout`

--- 
🎯 **Milestone: Layout Complete**
Kontrol: Temel layout (Header, BottomNav) hazır, sayfa iskeletleri işlevsel.
---

### Task 4.1: Ana Maaş State'i Oluşturma

- [ ] `incomeStore.ts` içinde ana maaşı yönetecek Zustand state'ini oluştur.

**Dosya(lar):** `src/stores/incomeStore.ts`, `src/types/index.ts`
**Bağımlılık:** Task 1.2 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [ ] `useIncomeStore` hook'u tanımlandı.
- [ ] `mainSalary` state'i ve `setMainSalary` action'ı mevcut.
- [ ] TypeScript tipleri doğru şekilde tanımlandı (`Income` tipi MVP kapsamında sadece `salary` tipini içerecek şekilde basitleştirilebilir).

**Styling Notes:** Yok

**Commit:** `feat(store): implement main salary state in incomeStore`

### Task 4.2: Ana Para Bloğu Component'i

- [ ] Ana sayfada ana maaşı gösteren `MainBalanceCard` component'ini oluştur.

**Dosya(lar):** `src/components/features/income/MainBalanceCard.tsx`
**Bağımlılık:** Task 2.2, 4.1 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [ ] Component, `incomeStore`'dan ana maaşı çekıp gösteriyor.
- [ ] UI Reference'taki (gradient, büyük font, shadow) stile uygun.
- [ ] Miktar, ₺ formatında gösteriliyor.

**Styling Notes:** `bg-gradient-to-br from-blue-600 to-cyan-500 text-white`, büyük, bold tipografi, `rounded-2xl`.

**Commit:** `feat(income): create MainBalanceCard component`

### Task 4.3: Ana Maaş Giriş Formu

- [ ] Kullanıcının ana maaşını girebileceği bir form component'i oluştur. Input validation içermeli.

**Dosya(lar):** `src/components/features/income/MainSalaryForm.tsx`
**Bağımlılık:** Task 2.1, 2.3, 4.1 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [ ] Form, `MainBalanceCard`'daki maaşı güncelleyebiliyor.
- [ ] Tutar girişi için sadece sayısal değerler kabul ediliyor.
- [ ] Hata mesajları doğru şekilde gösteriliyor (örn: boş bırakılamaz).

**Styling Notes:** Standart Input component'i kullan.

**Commit:** `feat(income): develop MainSalaryForm for input`

### Task 4.4: Ana Sayfa (Dashboard) Düzenlemesi

- [ ] `MainBalanceCard` ve `MainSalaryForm`'u ana sayfaya (`src/app/page.tsx`) entegre et.

**Dosya(lar):** `src/app/page.tsx`
**Bağımlılık:** Task 4.2, 4.3 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [ ] Ana sayfada ana para bloğu ve maaş giriş formu görünüyor.
- [ ] Formdan girilen maaş değeri ana para bloğuna yansıyor.
- [ ] Sayfa responsive prensiplere uygun.

**Styling Notes:** Yok

**Commit:** `feat(dashboard): integrate income components into homepage`

--- 
🎯 **Milestone: Income Module MVP Complete**
Kontrol: Ana maaş girişi, görüntülenmesi ve güncellenmesi sorunsuz çalışıyor.
---

### Task 5.1: Kategori Verilerini Tanımlama

- [ ] PRD'deki varsayılan kategori listesini `src/constants/categories.ts` dosyasına tanımla.
- [ ] `src/types/index.ts` dosyasına `Category` interface'ini ekle.

**Dosya(lar):** `src/constants/categories.ts`, `src/types/index.ts`
**Bağımlılık:** Task 1.2 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [ ] `DEFAULT_CATEGORIES` array'i doğru şekilde oluşturuldu.
- [ ] `Category` interface'i JSON Schema'ya uygun.
- [ ] TypeScript hatasız.

**Styling Notes:** Yok

**Commit:** `feat(constants): define default categories and types`

### Task 5.2: Harcama State'i Oluşturma

- [ ] `expenseStore.ts` içinde harcamaları yönetecek Zustand state'ini oluştur. `Expense` interface'ini kullan.

**Dosya(lar):** `src/stores/expenseStore.ts`, `src/types/index.ts`
**Bağımlılık:** Task 5.1 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [ ] `useExpenseStore` hook'u tanımlandı.
- [ ] `expenses` array'i, `addExpense`, `updateExpense`, `deleteExpense` action'ları mevcut.
- [ ] TypeScript tipleri doğru şekilde tanımlandı.

**Styling Notes:** Yok

**Commit:** `feat(store): implement expense state management`

### Task 5.3: Category Autocomplete Component'i

- [ ] Harcama ekleme formunda kullanılacak akıllı autocomplete özellikli bir kategori seçici component'i oluştur. `DEFAULT_CATEGORIES`'i kullanmalı.

**Dosya(lar):** `src/components/features/expenses/CategoryAutocomplete.tsx`
**Bağımlılık:** Task 2.3, 5.1 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [ ] Input'a yazıldıkça kategoriler filtreleniyor.
- [ ] Her kategorinin yanında emojisi görünüyor.
- [ ] Bir kategori seçildiğinde değeri doğru şekilde ayarlanıyor.

**Styling Notes:** Standart Input component'i üzerine inşa et, dropdown stilleri UI Reference'a uygun.

**Commit:** `feat(expense): create CategoryAutocomplete component`

### Task 5.4: Harcama Ekleme Formu Component'i

- [ ] Yeni harcama eklemek için kullanılacak `ExpenseForm` component'ini oluştur. `CategoryAutocomplete`, tutar ve not alanlarını içermeli.

**Dosya(lar):** `src/components/features/expenses/ExpenseForm.tsx`
**Bağımlılık:** Task 2.1, 2.3, 5.2, 5.3 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [ ] Form component'i renderlanıyor ve tüm alanları içeriyor.
- [ ] Form gönderildiğinde `expenseStore`'a yeni harcama ekleniyor.
- [ ] Input validation (tutarın boş olmaması gibi) mevcut.

**Styling Notes:** Bottom Sheet / Drawer görünümüne uygun layout (ancak bu task'ta drawer'ı implemente etmeyeceğiz).

**Commit:** `feat(expense): develop ExpenseForm component`

### Task 5.5: Harcama Listesi Component'i

- [ ] Eklenen harcamaları listeleyecek `ExpenseList` component'ini oluştur. Harcamalar tarih bazlı gruplandırılmalı.

**Dosya(lar):** `src/components/features/expenses/ExpenseList.tsx`
**Bağımlılık:** Task 2.2, 5.2 tamamlanmalı
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [ ] `expenseStore`'daki harcamalar doğru formatta listeleniyor.
- [ ] Harcamalar 
