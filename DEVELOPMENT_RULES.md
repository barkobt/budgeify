# Budgeify - Development Rules (Sarsılmaz Kurallar)

## 🛡️ Proje Sürekliliği Kuralları

### 1. Build Kontrolü (Mandatory)

**Kural:** Her büyük kod değişikliğinden sonra `npm run build` çalıştırılmalı.

**Ne zaman:**
- Yeni component oluşturulduktan sonra
- Store veya tip değişiklikleri yapıldıktan sonra
- Import path'leri değiştirildikten sonra
- Herhangi bir refactoring işleminden sonra

**Komut:**
```bash
npm run build
```

**Beklenen Sonuç:**
```
✓ Compiled successfully
✓ Linting and checking validity of types ...
✓ Generating static pages (4/4)
```

### 2. Error Handling (Critical)

**Kural:** Merkezi dosyalarda yapılan değişikliklerin cascade etkisi kontrol edilmeli.

**Kritik Dosyalar:**
- `src/store/useBudgetStore.ts` → Tüm feature component'ler etkilenir
- `src/types/index.ts` → Store ve tüm component'ler etkilenir
- `src/app/layout.tsx` → Tüm sayfalar etkilenir
- `src/app/globals.css` → Tüm stiller etkilenir

**Kontrol Listesi:**
- [ ] Import path'leri doğru mu?
- [ ] TypeScript tipleri uyumlu mu?
- [ ] Yeni eklenen prop'lar varsa default değerleri verilmiş mi?
- [ ] Dependency'ler eksik mi? (package.json kontrol)

### 3. Debug Protokolü

**Problem:** Module hatası, build başarısız, dev server patlıyor

**Çözüm Adımları:**

```bash
# 1. Dev server'ı durdur
pkill -f "next dev"

# 2. Cache'leri temizle
rm -rf .next
rm -rf node_modules/.cache

# 3. Build test et
npm run build

# 4. Hata varsa, TypeScript kontrolü
npx tsc --noEmit

# 5. Dev server'ı yeniden başlat
npm run dev
```

**Yaygın Hatalar:**
- `MODULE_NOT_FOUND: './XXX.js'` → .next klasörünü sil
- `Cannot find module '@/...'` → tsconfig.json path alias kontrol
- `Type error: ...` → src/types/index.ts kontrol
- CSS yüklenmiyor → globals.css import kontrol

### 4. Görsellik (Tailwind 4 Kontrolü)

**Kural:** Her styling değişikliğinden sonra Tailwind 4 syntax'ının doğru olduğunu teyit et.

**Kontrol Noktaları:**
- [ ] `@import "tailwindcss"` globals.css'de var mı?
- [ ] `@theme { ... }` bloğu düzgün mü?
- [ ] Custom utility class'lar `.glass`, `.gradient-primary` çalışıyor mu?
- [ ] Tailwind class'ları browser'da render oluyor mu?

**Test Komutu:**
```bash
# Dev server çalışırken, sayfaya git ve inspect et
# Elements panelinde Tailwind class'ların uygulandığını gör
```

### 5. Token Yönetimi (%90 Kuralı) 🔴

**Kural:** Token kullanımı %90'a ulaştığında mevcut işi commit edip handover summary hazırla.

**Token Limiti:** 200,000 tokens
**Kritik Eşik:** 180,000 tokens (%90)

**%90'da Yapılacaklar:**

1. **Tüm değişiklikleri commit et:**
```bash
git add -A
git commit -m "feat/fix/refactor: [açıklama]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push origin main
```

2. **HANDOVER_SUMMARY.md oluştur:**
```markdown
# Handover Summary - [Tarih]

## Tamamlanan Görevler
- Task X.X: [Açıklama]

## Devam Eden İş
- Sıradaki: Task Y.Y
- Durum: [Açıklama]

## Önemli Notlar
- [Kritik bilgi 1]
- [Kritik bilgi 2]

## Bilinen Sorunlar
- [Varsa]
```

3. **Son build kontrolü:**
```bash
npm run build
npm run dev # Test et
```

4. **Agent'a özet mesaj:**
```
"Token limit %90'a ulaştı. Tüm değişiklikler commit edildi ve push yapıldı.
HANDOVER_SUMMARY.md dosyası oluşturuldu. Sonraki agent Task Y.Y'den devam edebilir."
```

### 6. Commit Standartları

**Format:**
```
<type>(<scope>): <description>

[optional body]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:**
- `feat`: Yeni özellik
- `fix`: Bug düzeltme
- `refactor`: Kod yeniden yapılandırma
- `style`: UI/styling değişikliği
- `chore`: Bakım işleri
- `docs`: Döküman güncelleme

**Scopes:**
- `ui`, `store`, `layout`, `income`, `expense`, `analytics`, `goals`

### 7. Continuous Validation

**Her PR/Push Öncesi:**
- [ ] `npm run build` başarılı
- [ ] `npm run dev` çalışıyor
- [ ] TypeScript hatasız
- [ ] Tailwind stilleri aktif
- [ ] Console'da kritik hata yok
- [ ] TASKS.md güncel
- [ ] CLAUDE.md gerekirse güncellendi

---

## 🚀 Quick Reference

### Hızlı Düzeltme
```bash
pkill -f "next dev" && rm -rf .next && npm run build && npm run dev
```

### Build Test
```bash
npm run build
```

### TypeScript Test
```bash
npx tsc --noEmit
```

### Token Kontrolü
- Kullanımı takip et
- %90 (180k) kritik eşik
- Commit + Summary + Push

---

*Son Güncelleme: 4 Şubat 2026*
*Agent: Claude Sonnet 4.5*
