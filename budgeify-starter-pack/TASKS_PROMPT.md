# TASKS.md Oluşturma Talimatı

@PRD.md dosyasını ve eklediğim UI Reference görselini analiz et. Aşağıdaki kriterlere göre detaylı bir TASKS.md oluştur.

---

## Genel Kurallar

### 1. Mantıksal Sıralama
Projeyi şu sırayla task'lere böl:
1. **Setup** - Proje kurulumu, dependencies, klasör yapısı
2. **UI Foundations** - Design tokens, reusable components (Button, Card, Input vb.)
3. **Layout** - Header, Navigation, sayfa iskeletleri
4. **Core Features** - Ana özellikler (Income, Expenses modülleri)
5. **Analysis** - Grafikler, özetler, akıllı öneriler
6. **Goals** - Hedef modülü
7. **Polish** - Animasyonlar, PWA, son düzeltmeler

### 2. Atomik Tasklar
- Her task **maksimum 15-20 dakikalık** olsun
- Tek bir amaca hizmet etsin (örn: "Create GlassCard component")
- Bir task içinde birden fazla component oluşturulmasın

### 3. Task Formatı
Her task şu yapıda olsun:

```
### Task [Bölüm].[Sıra]: [Task Adı]

- [ ] [Ne yapılacağının kısa açıklaması]

**Dosya(lar):** `src/components/ui/Button.tsx`
**Bağımlılık:** Task X.Y tamamlanmalı (veya "Yok")
**Süre:** ~15-20 dk

**Acceptance Criteria:**
- [ ] Component renderlanıyor
- [ ] TypeScript hatasız
- [ ] UI Reference'taki stile uygun

**Styling Notes:** Glassmorphism efekti, rounded-2xl, subtle shadow

**Commit:** `feat(ui): add Button component with variants`
```

### 4. Bağımlılık Takibi
- Her task'ın hangi task'a bağımlı olduğunu açıkça belirt
- Bağımlılığı olmayan task'ları "Yok" olarak işaretle

### 5. Progress Tracker
Dosyanın en üstünde ilerleme takibi olsun:

```
# Budgeify - Development Tasks

## Progress: 0/X Tasks Complete (0%)

**Current Phase:** Setup
**Next Task:** Task 1.1
```

### 6. Milestone'lar
Her bölüm sonunda milestone ekle:

```
---
🎯 **Milestone: UI Foundations Complete**
Kontrol: Tüm reusable component'lar hazır, `npm run build` hatasız
---
```

### 7. Styling Reminder
Her UI task'ında görseldeki modern estetiğe sadık kalınmasını hatırlat:
- Glassmorphism: `backdrop-blur-md bg-white/80`
- Gradients: `bg-gradient-to-br from-blue-600 to-cyan-500`
- Soft shadows: `shadow-xl shadow-black/5`
- Rounded corners: `rounded-2xl`

---

## Workflow

1. Önce genel task listesini göster, onayımı al
2. Onayladığımda TASKS.md olarak kaydet
3. Her task bittiğinde ve ben onay verdiğimde:
   - Değişikliği conventional commit kurallarına uygun mesajla commit et
   - Push yapma, ben toplu push'layacağım
4. Her commit sonrası değişikliğin browser'da görünür olduğundan emin ol

---

## Çıktı Formatı
- Markdown formatında
- Her task `- [ ]` checkbox ile başlasın
- Bölümler arası `---` ayracı kullan
- Emoji'leri sadece milestone başlıklarında kullan
