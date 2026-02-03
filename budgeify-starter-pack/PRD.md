# Budgeify - Product Requirements Document (PRD)

**Sürüm:** 1.0  
**Tarih:** 03 Şubat 2026  
**Hazırlayan:** Senior Product Team  
**Durum:** Draft

---

## İçindekiler

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [User Personas](#3-user-personas)
4. [User Stories](#4-user-stories)
5. [Feature Specifications](#5-feature-specifications)
6. [Information Architecture](#6-information-architecture)
7. [Wireframe Descriptions](#7-wireframe-descriptions)
8. [Technical Architecture](#8-technical-architecture)
9. [Data Model](#9-data-model)
10. [API Endpoints](#10-api-endpoints)
11. [Success Metrics](#11-success-metrics)
12. [MVP Scope](#12-mvp-scope)
13. [Risk Assessment](#13-risk-assessment)
14. [Timeline Estimate](#14-timeline-estimate)

---

## 1. Executive Summary

**Budgeify**, bireylerin aylık gelir ve giderlerini kolayca takip etmelerini, harcama alışkanlıklarını analiz etmelerini ve finansal hedeflerine ulaşmalarını sağlayan modern bir kişisel finans yönetimi uygulamasıdır. Uygulama, kullanıcının maaşını görsel olarak etkileyici bir "ana para bloğu" şeklinde sunarak finansal farkındalık oluşturur; akıllı kategori sistemi ile harcama girişini hızlandırır ve yapay zeka destekli önerilerle tasarruf potansiyelini ortaya koyar. Mobile-first responsive web uygulaması olarak tasarlanan Budgeify, modern ve minimal UI tasarımıyla kullanıcı deneyimini ön planda tutar.

---

## 2. Problem Statement

### 2.1 Çözülen Problem

Türkiye'de bireyler, özellikle genç profesyoneller ve aileler, aylık bütçelerini etkin bir şekilde yönetmekte zorlanmaktadır. Mevcut problemler şunlardır:

| Problem | Etki |
|---------|------|
| **Finansal görünürlük eksikliği** | Kullanıcılar paranın nereye gittiğini bilmiyor |
| **Manuel takip zorluğu** | Excel veya kağıt tabanlı sistemler sürdürülebilir değil |
| **Anlık geri bildirim yokluğu** | Bütçe aşımı ancak ay sonunda fark ediliyor |
| **Hedef belirsizliği** | Tasarruf planlaması yapılamıyor |
| **Karmaşık uygulamalar** | Mevcut finans uygulamaları çok karmaşık veya İngilizce |

### 2.2 Hedef Kitle

Budgeify'in birincil hedef kitlesi, Türkiye'de yaşayan 22-45 yaş arası, düzenli geliri olan ve finansal bilinç geliştirmek isteyen bireylerdir. Uygulamanın dili Türkçe olup, Türk lirası (₺) para birimi kullanılmaktadır.

### 2.3 Değer Önerisi

Budgeify, kullanıcılara şu değerleri sunar:
- Paranızı **görsel ve anlaşılır** şekilde takip edin
- **30 saniyede** günlük harcamalarınızı kaydedin
- **Akıllı önerilerle** tasarruf potansiyelinizi keşfedin
- **Hedef belirleyin**, sistematik şekilde ulaşın

---

## 3. User Personas

### 3.1 Persona 1: Elif - Yeni Mezun Profesyonel

| Özellik | Detay |
|---------|-------|
| **Yaş** | 24 |
| **Meslek** | Junior Yazılım Geliştirici |
| **Gelir** | ₺45.000 / ay (net) |
| **Teknoloji Yatkınlığı** | Yüksek |
| **Finansal Bilgi** | Orta |

**Hikayesi:** Elif, üniversiteden yeni mezun olmuş ve ilk işine başlamıştır. Hayatında ilk kez düzenli bir gelire sahip ancak paranın nereye gittiğini anlamakta zorlanıyor. Ay sonunda "para nereye gitti?" sorusunu sık sık soruyor.

**Hedefleri:**
- 6 ay içinde ₺15.000'lik MacBook Pro almak istiyor
- Aylık harcamalarını kategorize etmek istiyor
- Kahve ve dışarıda yemek harcamalarını kontrol altına almak istiyor

**Acı Noktaları:**
- Maaş günü zengin, ay sonu sıkışık hissediyor
- Excel'de takip başlattı ama sürdüremedi
- Tasarruf yapamıyor ama nedenini bilmiyor

**Budgeify Kullanım Senaryosu:** Elif, her alışverişten sonra Budgeify'i açıp harcamasını kaydediyor. Haftalık özet bildirimleriyle kahve harcamasının toplam bütçesinin %8'ini oluşturduğunu öğreniyor ve haftalık kahve limitini belirliyor.

---

### 3.2 Persona 2: Ahmet - Aile Reisi

| Özellik | Detay |
|---------|-------|
| **Yaş** | 38 |
| **Meslek** | Muhasebe Müdürü |
| **Gelir** | ₺85.000 / ay (net) + ₺12.000 kira geliri |
| **Teknoloji Yatkınlığı** | Orta |
| **Finansal Bilgi** | Yüksek |

**Hikayesi:** Ahmet, eşi ve 2 çocuğuyla birlikte yaşıyor. Profesyonel olarak finansla uğraşsa da kendi ev bütçesini yönetmek için basit bir araca ihtiyaç duyuyor. Birden fazla gelir kaynağı var ve bunları takip etmek istiyor.

**Hedefleri:**
- Aile tatili için ₺60.000 biriktirmek (12 ay içinde)
- Çocukların eğitim masraflarını planlamak
- Kira gelirinin toplam gelire katkısını görmek

**Acı Noktaları:**
- Eşiyle harcamalar konusunda ortak görünürlük yok
- Kredi kartı ekstreleri karmaşık
- Birden fazla gelir kaynağını tek yerde göremıyor

**Budgeify Kullanım Senaryosu:** Ahmet, ay başında maaş ve kira gelirini giriyor. Sistem otomatik olarak kira gelirinin toplam gelirin %12.3'ünü oluşturduğunu gösteriyor. Aile tatili hedefi için aylık ₺5.000 ayırması gerektiğini ve mevcut tasarruf oranıyla 14 ayda hedefe ulaşacağını öğreniyor.

---

## 4. User Stories

### 4.1 Gelir Yönetimi

| ID | User Story | Öncelik | Kabul Kriterleri |
|----|------------|---------|------------------|
| US-01 | Kullanıcı olarak, aylık maaşımı girebilmek istiyorum ki toplam gelirim görünür olsun. | P0 | Maaş girişi yapılabilir, değer kaydedilir ve ana ekranda gösterilir |
| US-02 | Kullanıcı olarak, maaşımı büyük ve belirgin bir blok olarak görmek istiyorum ki finansal durumum hemen anlaşılsın. | P0 | Maaş, ekranın üst kısmında prominent bir card içinde gösterilir |
| US-03 | Kullanıcı olarak, ek gelirlerimi (kira, freelance vb.) ekleyebilmek istiyorum ki toplam gelirim doğru hesaplansın. | P1 | Ek gelir eklenebilir, farklı renkte gösterilir |
| US-04 | Kullanıcı olarak, her ek gelirin toplam gelire yüzdelik katkısını görmek istiyorum ki gelir dağılımımı anlayayım. | P1 | Her ek gelirin yanında %X şeklinde katkı oranı gösterilir |

### 4.2 Harcama Yönetimi

| ID | User Story | Öncelik | Kabul Kriterleri |
|----|------------|---------|------------------|
| US-05 | Kullanıcı olarak, harcama kategorisi ve tutarı girebilmek istiyorum ki harcamalarım kayıt altına alınsın. | P0 | Kategori + tutar girişi yapılabilir ve liste halinde gösterilir |
| US-06 | Kullanıcı olarak, kategori ararken akıllı autocomplete kullanmak istiyorum ki hızlıca seçim yapabileyim. | P0 | Yazılan metne göre kategoriler filtrelenir |
| US-07 | Kullanıcı olarak, her kategorinin yanında emoji görmek istiyorum ki görsel olarak ayırt edebileyim. | P1 | Her kategori yanında ilgili emoji gösterilir |
| US-08 | Kullanıcı olarak, harcamalarımı düzenleyebilmek istiyorum ki yanlış girişleri düzelteyim. | P0 | Var olan harcama düzenlenebilir |
| US-09 | Kullanıcı olarak, harcamalarımı silebilmek istiyorum ki hatalı kayıtları kaldırabileyim. | P0 | Harcama silinebilir, onay istenir |

### 4.3 Analiz & Geri Bildirim

| ID | User Story | Öncelik | Kabul Kriterleri |
|----|------------|---------|------------------|
| US-10 | Kullanıcı olarak, toplam gelir ve harcama özetini görmek istiyorum ki finansal durumumu anlayayım. | P0 | Özet kart: Toplam Gelir, Toplam Harcama, Kalan |
| US-11 | Kullanıcı olarak, kalan miktarı net şekilde görmek istiyorum ki bütçemi takip edeyim. | P0 | Kalan miktar büyük fontla, pozitif/negatife göre renkli gösterilir |
| US-12 | Kullanıcı olarak, harcama dağılımını grafik olarak görmek istiyorum ki kategorilerin oranını görsel anlayayım. | P1 | Pie chart veya bar chart ile kategori dağılımı gösterilir |
| US-13 | Kullanıcı olarak, bütçe aşımında akıllı öneriler almak istiyorum ki tasarruf yapabileyim. | P2 | "Kahve harcamanızı %20 azaltarak ayda X TL tasarruf edebilirsiniz" formatında öneriler |

### 4.4 Hedef & Planlama

| ID | User Story | Öncelik | Kabul Kriterleri |
|----|------------|---------|------------------|
| US-14 | Kullanıcı olarak, satın alma hedefi tanımlayabilmek istiyorum ki motivasyonumu artırabileyim. | P1 | Hedef adı + tutar girişi yapılabilir |
| US-15 | Kullanıcı olarak, hedefe kaç ayda ulaşacağımı görmek istiyorum ki plan yapabileyim. | P1 | Mevcut tasarruf oranıyla tahmini süre hesaplanır |
| US-16 | Kullanıcı olarak, hangi kategorilerden ne kadar kısarak hedefe daha hızlı ulaşacağımı görmek istiyorum. | P2 | "Eğlence harcamasını %30 azaltırsanız 2 ay erken ulaşırsınız" formatında öneriler |

---

## 5. Feature Specifications

### 5.1 Gelir Yönetimi Modülü

#### 5.1.1 Ana Maaş Girişi

**Amaç:** Kullanıcının aylık net maaşını sisteme tanımlaması

**Davranış:**
1. Kullanıcı "Gelir Ekle" butonuna tıklar
2. "Ana Maaş" veya "Ek Gelir" seçimi yapar
3. Tutar girer (sadece sayı, otomatik ₺ formatı)
4. Kaydet'e tıklar
5. Maaş, ana ekranda "Ana Para Bloğu" içinde gösterilir

**Ana Para Bloğu Özellikleri:**
- Ekranın üst 1/3'ünü kaplar
- Gradient arka plan (mavi tonları - referans görsele uygun)
- Büyük, bold tipografi (32-40px)
- Subtle shadow efekti
- Miktar animasyonlu şekilde güncellenir

**Validasyonlar:**
- Minimum değer: ₺1
- Maximum değer: ₺10.000.000
- Sadece pozitif sayılar kabul edilir

#### 5.1.2 Ek Gelir Yönetimi

**Amaç:** Maaş dışı gelirlerin (kira, freelance, ikramiye) takibi

**Ek Gelir Kategorileri:**
| Kategori | Emoji | Açıklama |
|----------|-------|----------|
| Kira Geliri | 🏠 | Gayrimenkul kira gelirleri |
| Freelance | 💼 | Serbest çalışma gelirleri |
| İkramiye | 🎁 | Prim, bonus ödemeleri |
| Yatırım Getirisi | 📈 | Faiz, temettü gelirleri |
| Diğer | 💰 | Kategorize edilemeyen gelirler |

**Görsel Farklılaştırma:**
- Ek gelirler ana maaştan farklı renkte gösterilir (mint yeşili)
- Her ek gelirin yanında toplam gelire katkı yüzdesi: `Kira Geliri: ₺12.000 (12.3%)`
- Ek gelirler ayrı bir "Ek Gelirler" kartında listelenir

---

### 5.2 Akıllı Harcama Giriş Sistemi

#### 5.2.1 Harcama Ekleme Formu

**UI Bileşenleri:**
1. **Tutar Girişi:** Numeric input, auto-format (1000 → ₺1.000)
2. **Kategori Seçici:** Akıllı autocomplete dropdown
3. **Not (opsiyonel):** Kısa açıklama alanı
4. **Tarih:** Default bugün, değiştirilebilir

#### 5.2.2 Akıllı Autocomplete Dropdown

**Davranış:**
1. Kullanıcı kategori alanına tıklar
2. Tüm kategoriler emoji ile listelenir
3. Kullanıcı yazmaya başladığında:
   - Sadece eşleşen kategoriler filtrelenir
   - Eşleşme başlangıçta veya kelime içinde olabilir
   - Örnek: "ye" yazıldığında → 🍕 Yemek, 🥗 Sağlıklı Yemek

**Varsayılan Kategoriler:**

| Kategori | Emoji | Örnek Harcamalar |
|----------|-------|------------------|
| Yemek | 🍕 | Restoran, market alışverişi |
| Kahve | ☕ | Kahve, kafe |
| Market | 🛒 | Günlük market alışverişi |
| Ulaşım | 🚗 | Benzin, toplu taşıma, taksi |
| Faturalar | 💡 | Elektrik, su, doğalgaz, internet |
| Kira | 🏠 | Ev kirası |
| Sağlık | 💊 | İlaç, hastane, sigorta |
| Eğlence | 🎬 | Sinema, konser, Netflix |
| Giyim | 👕 | Kıyafet, ayakkabı |
| Teknoloji | 💻 | Elektronik, yazılım |
| Kişisel Bakım | 🪒 | Kuaför, kozmetik |
| Eğitim | 📚 | Kurs, kitap |
| Kredi Kartı Borcu | 💳 | Kredi kartı ödemeleri |
| Kredi Borcu | 🏦 | Banka kredisi taksitleri |
| Hediye | 🎁 | Hediye alışverişleri |
| Spor | 🏋️ | Spor salonu, ekipman |
| Evcil Hayvan | 🐕 | Mama, veteriner |
| Diğer | 📦 | Kategorize edilemeyen |

**Özel Kategori Ekleme:**
- Listede olmayan kategori yazıldığında "Yeni kategori ekle: X" seçeneği görünür
- Kullanıcı emoji seçebilir veya varsayılan 📦 kullanılır

#### 5.2.3 Harcama Listesi

**Görünüm:**
- Tarih bazlı gruplandırma (Bugün, Dün, Bu Hafta, Bu Ay)
- Her harcama kartında: Emoji + Kategori + Tutar + Not (varsa)
- Swipe-to-edit ve swipe-to-delete (mobile)
- Hover menü (desktop)

**Düzenleme:**
- Tüm alanlar düzenlenebilir
- Düzenleme geçmişi tutulmaz (MVP)

**Silme:**
- Onay modalı: "Bu harcamayı silmek istediğinize emin misiniz?"
- Geri alma seçeneği (5 saniye içinde)

---

### 5.3 Finansal Analiz & Geri Bildirim Sayfası

#### 5.3.1 Özet Görünümü

**Ana Metrikler:**

```
┌─────────────────────────────────────────┐
│  💰 Toplam Gelir        ₺97.000        │
│  📉 Toplam Harcama      ₺62.350        │
│  ✅ Kalan               ₺34.650        │
│                                         │
│  [████████████░░░░] %64.3 harcandı     │
└─────────────────────────────────────────┘
```

**Renk Kodlaması:**
- Kalan pozitif → Yeşil
- Kalan < gelirin %10'u → Sarı (uyarı)
- Kalan negatif (bütçe aşımı) → Kırmızı

#### 5.3.2 Harcama Dağılımı Grafiği

**Grafik Türü:** Donut Chart (orta kısımda kalan miktar)

**Özellikler:**
- Top 5 kategori ayrı renklerde
- Diğer kategoriler "Diğer" altında gruplandırılır
- Dokunulduğunda/hover'da detay tooltip
- Animasyonlu geçişler

**Alternatif Görünüm:** Horizontal bar chart (kullanıcı tercihi)

#### 5.3.3 Akıllı Öneriler

**Tetikleme Koşulları:**
1. Bütçe aşımı veya %90+ harcama
2. Tek kategoride >%25 harcama
3. Önceki aya göre >%30 artış (ileride)

**Öneri Formatları:**

```
💡 Tasarruf Önerisi
Kahve harcamanız bu ay ₺2.400 (toplam harcamanın %3.8'i).
%20 azaltarak ayda ₺480 tasarruf edebilirsiniz.
[Detaylı Gör] [Kapat]
```

```
⚠️ Bütçe Uyarısı
Yemek kategorisinde bütçenin %28'ini harcadınız.
Haftada 2 gün ev yemeği ile ₺1.200 tasarruf mümkün.
[Hedef Belirle] [Kapat]
```

**Öneri Algoritması (Basit):**
1. En yüksek 3 kategoriyi bul
2. Her biri için %10, %20, %30 azaltım senaryoları hesapla
3. En etkili 2 öneriyi göster

---

### 5.4 Hedef & Planlama Modülü

#### 5.4.1 Hedef Tanımlama

**Giriş Alanları:**
- Hedef Adı (max 50 karakter)
- Hedef Tutarı (₺)
- Hedef Tarihi (opsiyonel)
- İkon seçimi (önceden tanımlı listeden)

**Örnek Hedefler:**
| İkon | Hedef | Tutar |
|------|-------|-------|
| 📱 | Yeni iPhone | ₺75.000 |
| ✈️ | Yaz Tatili | ₺40.000 |
| 🚗 | Araba Peşinatı | ₺150.000 |
| 💍 | Nişan | ₺50.000 |

#### 5.4.2 Otomatik Hesaplamalar

**Mevcut Tasarruf Oranı ile Tahmin:**
```
Mevcut aylık tasarruf: ₺34.650
Hedef: ₺75.000 (iPhone)
Tahmini süre: 2.2 ay (~3 ay)
```

**Alternatif Senaryolar:**

| Senaryo | Aylık Tasarruf | Süre | Kısıtlama |
|---------|----------------|------|-----------|
| Normal | ₺34.650 | 3 ay | - |
| Orta | ₺40.000 | 2 ay | Eğlence %50 ↓ |
| Agresif | ₺50.000 | 1.5 ay | Yemek %30 ↓, Kahve %50 ↓ |

#### 5.4.3 Hedef Takibi

**Progress Gösterimi:**
- Circular progress bar
- Yüzde + miktar gösterimi
- "Hedefe X gün/ay kaldı" bilgisi
- Motivasyonel mesajlar (%25, %50, %75, %90 aşıldığında)

---

## 6. Information Architecture

### 6.1 Sayfa Yapısı

```
Budgeify/
├── 🏠 Ana Sayfa (Dashboard)
│   ├── Ana Para Bloğu
│   ├── Hızlı Harcama Ekleme
│   ├── Son Harcamalar (5 adet)
│   └── Mini Özet Kartı
│
├── 💰 Gelir Sayfası
│   ├── Ana Maaş Düzenleme
│   ├── Ek Gelir Listesi
│   └── Gelir Dağılımı Grafiği
│
├── 📊 Harcamalar Sayfası
│   ├── Harcama Listesi (filtrelenebilir)
│   ├── Yeni Harcama Ekleme (modal/drawer)
│   └── Kategori Bazlı Görünüm
│
├── 📈 Analiz Sayfası
│   ├── Gelir vs Harcama Özeti
│   ├── Kategori Dağılımı Grafiği
│   ├── Akıllı Öneriler
│   └── Trend Grafikleri (ileride)
│
├── 🎯 Hedefler Sayfası
│   ├── Aktif Hedefler
│   ├── Yeni Hedef Ekleme
│   └── Senaryo Karşılaştırma
│
└── ⚙️ Ayarlar Sayfası
    ├── Profil (ileride)
    ├── Kategori Yönetimi
    ├── Veri Dışa Aktarma
    └── Tema (Light/Dark)
```

### 6.2 Navigasyon Akışı

**Bottom Navigation (Mobile):**
```
[🏠 Ana] [💰 Gelir] [➕] [📊 Analiz] [🎯 Hedef]
```

**Floating Action Button (FAB):**
- Ortadaki ➕ butonu harcama ekleme drawer'ını açar
- Her sayfada erişilebilir

**Side Navigation (Desktop):**
- Sol tarafta sabit navigasyon
- Hover'da tooltip ile açıklama

---

## 7. Wireframe Descriptions

### 7.1 Ana Sayfa (Dashboard)

```
┌─────────────────────────────────────────┐
│ [Logo] Budgeify              [⚙️]        │
├─────────────────────────────────────────┤
│ ╔═══════════════════════════════════╗   │
│ ║     💰 ANA PARA                   ║   │
│ ║                                   ║   │
│ ║        ₺97.000                    ║   │
│ ║                                   ║   │
│ ║  Gelir: ₺97.000  Harcama: ₺62K   ║   │
│ ╚═══════════════════════════════════╝   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ➕ Hızlı Harcama Ekle              │ │
│ │ [Kategori      ▼] [Tutar    ] [+]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Son Harcamalar            [Tümünü Gör] │
│ ┌─────────────────────────────────────┐ │
│ │ 🍕 Yemek         -₺450    Bugün    │ │
│ │ ☕ Kahve         -₺85     Bugün    │ │
│ │ 🚗 Ulaşım        -₺200    Dün      │ │
│ │ 💊 Sağlık        -₺1.250  Dün      │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ [🏠] [💰] [➕] [📊] [🎯]               │
└─────────────────────────────────────────┘
```

**Tasarım Notları:**
- Ana Para Bloğu: Referans görseldeki gradient kartlardan ilham alınır (koyu mavi → açık mavi)
- Kart köşeleri: 16px border-radius
- Gölge: `box-shadow: 0 4px 20px rgba(0,0,0,0.08)`
- Font: Inter veya SF Pro (sistem fontu)

### 7.2 Harcama Ekleme (Bottom Sheet / Drawer)

```
┌─────────────────────────────────────────┐
│         ━━━━━━━━                        │
│                                         │
│ Yeni Harcama Ekle                       │
│                                         │
│ Tutar                                   │
│ ┌─────────────────────────────────────┐ │
│ │ ₺                                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Kategori                                │
│ ┌─────────────────────────────────────┐ │
│ │ 🔍 Kategori ara...            ▼    │ │
│ ├─────────────────────────────────────┤ │
│ │ 🍕 Yemek                            │ │
│ │ ☕ Kahve                            │ │
│ │ 🛒 Market                           │ │
│ │ 🚗 Ulaşım                           │ │
│ │ ...                                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Not (opsiyonel)                         │
│ ┌─────────────────────────────────────┐ │
│ │ Açıklama ekle...                    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │           💾 KAYDET                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 7.3 Analiz Sayfası

```
┌─────────────────────────────────────────┐
│ ← Analiz                    📅 Ocak ▼  │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Gelir           Harcama    Kalan    │ │
│ │ ₺97.000        ₺62.350    ₺34.650  │ │
│ │                                     │ │
│ │ [████████████████░░░░░░░] %64.3    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Harcama Dağılımı                        │
│ ┌─────────────────────────────────────┐ │
│ │         ╭───────╮                   │ │
│ │       ╭─┤ %35   ├──╮                │ │
│ │      ╱  │ Yemek │  ╲                │ │
│ │     │%18├───────┤%22│               │ │
│ │     │Ula│₺34.650│Kir│               │ │
│ │      ╲  │ KALAN │  ╱                │ │
│ │       ╰─┤       ├──╯                │ │
│ │         ╰───────╯                   │ │
│ │      %15 Fatura  %10 Diğer          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 💡 Öneriler                             │
│ ┌─────────────────────────────────────┐ │
│ │ Yemek harcamanız toplam bütçenin    │ │
│ │ %35'ini oluşturuyor.                │ │
│ │                                     │ │
│ │ 💡 Haftada 2 gün ev yemeği ile      │ │
│ │    ₺2.800 tasarruf edebilirsiniz.   │ │
│ │                       [Detaylı Gör] │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ [🏠] [💰] [➕] [📊] [🎯]               │
└─────────────────────────────────────────┘
```

### 7.4 Hedefler Sayfası

```
┌─────────────────────────────────────────┐
│ ← Hedeflerim                    [+ Ekle]│
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📱 Yeni iPhone                      │ │
│ │                                     │ │
│ │     ╭────────────────────╮          │ │
│ │     │    ███████░░░      │          │ │
│ │     │      68%           │          │ │
│ │     ╰────────────────────╯          │ │
│ │                                     │ │
│ │ ₺51.000 / ₺75.000                   │ │
│ │ Tahmini: 1 ay kaldı                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✈️ Yaz Tatili                       │ │
│ │                                     │ │
│ │     ╭────────────────────╮          │ │
│ │     │    ██░░░░░░░░░     │          │ │
│ │     │      22%           │          │ │
│ │     ╰────────────────────╯          │ │
│ │                                     │ │
│ │ ₺8.800 / ₺40.000                    │ │
│ │ Tahmini: 5 ay kaldı                 │ │
│ │                                     │ │
│ │ 💡 Daha hızlı ulaşmak için:         │ │
│ │ • Normal: 5 ay                      │ │
│ │ • Eğlence %30↓: 4 ay                │ │
│ │ • Agresif: 3 ay              [Gör]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ [🏠] [💰] [💰] [📊] [🎯]               │
└─────────────────────────────────────────┘
```

---

## 8. Technical Architecture

### 8.1 Önerilen Tech Stack

| Katman | Teknoloji | Neden |
|--------|-----------|-------|
| **Frontend Framework** | React 18+ veya Next.js 14+ | Component-based, geniş ekosistem, PWA desteği |
| **State Management** | Zustand veya React Context | Lightweight, basit API, TypeScript uyumu |
| **Styling** | Tailwind CSS + Headless UI | Rapid development, responsive, accessible |
| **Grafikler** | Recharts veya Chart.js | React entegrasyonu, interaktif, customizable |
| **Icons** | Lucide React | Lightweight, consistent, MIT lisanslı |
| **Storage (MVP)** | LocalStorage / IndexedDB | Sunucu gerektirmez, offline çalışır |
| **Storage (Future)** | Supabase veya Firebase | Auth + realtime + database hepsi bir arada |
| **Build Tool** | Vite | Hızlı HMR, optimized build |
| **Deployment** | Vercel veya Netlify | Kolay deploy, preview environments |

### 8.2 Mimari Diyagram

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │Dashboard│ │ Income  │ │Expenses │ │Analytics│  ...       │
│  │  Page   │ │  Page   │ │  Page   │ │  Page   │           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│       │           │           │           │                  │
│  ┌────┴───────────┴───────────┴───────────┴────┐            │
│  │              COMPONENT LIBRARY               │            │
│  │  Button, Card, Input, Modal, Chart, etc.    │            │
│  └──────────────────────┬──────────────────────┘            │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                    STATE LAYER                               │
│  ┌──────────────────────┴──────────────────────┐            │
│  │               ZUSTAND STORE                  │            │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐       │            │
│  │  │ Income  │ │Expenses │ │ Goals   │  ...  │            │
│  │  │ Store   │ │  Store  │ │ Store   │       │            │
│  │  └─────────┘ └─────────┘ └─────────┘       │            │
│  └──────────────────────┬──────────────────────┘            │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────────────┴──────────────────────┐            │
│  │              STORAGE SERVICE                 │            │
│  │  ┌───────────────────────────────────────┐  │            │
│  │  │   MVP: LocalStorage / IndexedDB        │  │            │
│  │  │   Future: Supabase Client             │  │            │
│  │  └───────────────────────────────────────┘  │            │
│  └─────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Klasör Yapısı (Önerilen)

```
budgeify/
├── public/
│   ├── icons/
│   └── manifest.json          # PWA manifest
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Dashboard
│   │   ├── income/
│   │   ├── expenses/
│   │   ├── analytics/
│   │   ├── goals/
│   │   └── settings/
│   │
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── features/          # Feature-specific components
│   │   │   ├── income/
│   │   │   ├── expenses/
│   │   │   ├── analytics/
│   │   │   └── goals/
│   │   │
│   │   └── layout/            # Layout components
│   │       ├── Header.tsx
│   │       ├── BottomNav.tsx
│   │       └── Sidebar.tsx
│   │
│   ├── stores/                # Zustand stores
│   │   ├── incomeStore.ts
│   │   ├── expenseStore.ts
│   │   └── goalStore.ts
│   │
│   ├── services/              # Data services
│   │   ├── storage.ts
│   │   └── analytics.ts
│   │
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/                 # Utility functions
│   │   ├── formatters.ts
│   │   └── calculations.ts
│   │
│   └── constants/             # Constants
│       └── categories.ts
│
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### 8.4 PWA Gereksinimleri

**Manifest.json:**
```json
{
  "name": "Budgeify - Kişisel Finans",
  "short_name": "Budgeify",
  "description": "Akıllı bütçe yönetimi",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker:** Workbox kullanılarak cache stratejisi uygulanır

---

## 9. Data Model

### 9.1 JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    
    "Income": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid",
          "description": "Benzersiz gelir ID'si"
        },
        "type": {
          "type": "string",
          "enum": ["salary", "additional"],
          "description": "Gelir türü: ana maaş veya ek gelir"
        },
        "category": {
          "type": "string",
          "enum": ["salary", "rent", "freelance", "bonus", "investment", "other"],
          "description": "Gelir kategorisi"
        },
        "amount": {
          "type": "number",
          "minimum": 0,
          "description": "Gelir tutarı (TL)"
        },
        "description": {
          "type": "string",
          "maxLength": 100,
          "description": "Opsiyonel açıklama"
        },
        "isRecurring": {
          "type": "boolean",
          "default": true,
          "description": "Düzenli gelir mi?"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": ["id", "type", "amount", "createdAt"]
    },

    "Expense": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid",
          "description": "Benzersiz harcama ID'si"
        },
        "categoryId": {
          "type": "string",
          "description": "Kategori referansı"
        },
        "amount": {
          "type": "number",
          "minimum": 0,
          "description": "Harcama tutarı (TL)"
        },
        "note": {
          "type": "string",
          "maxLength": 200,
          "description": "Opsiyonel not"
        },
        "date": {
          "type": "string",
          "format": "date",
          "description": "Harcama tarihi"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": ["id", "categoryId", "amount", "date", "createdAt"]
    },

    "Category": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "Benzersiz kategori ID'si"
        },
        "name": {
          "type": "string",
          "maxLength": 50,
          "description": "Kategori adı"
        },
        "emoji": {
          "type": "string",
          "description": "Kategori emojisi"
        },
        "color": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Kategori rengi (hex)"
        },
        "isDefault": {
          "type": "boolean",
          "description": "Sistem tarafından tanımlı mı?"
        },
        "isActive": {
          "type": "boolean",
          "default": true
        }
      },
      "required": ["id", "name", "emoji"]
    },

    "Goal": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "name": {
          "type": "string",
          "maxLength": 50,
          "description": "Hedef adı"
        },
        "targetAmount": {
          "type": "number",
          "minimum": 0,
          "description": "Hedef tutar (TL)"
        },
        "currentAmount": {
          "type": "number",
          "minimum": 0,
          "default": 0,
          "description": "Mevcut birikim"
        },
        "icon": {
          "type": "string",
          "description": "Hedef ikonu (emoji)"
        },
        "targetDate": {
          "type": "string",
          "format": "date",
          "description": "Hedef tarihi (opsiyonel)"
        },
        "status": {
          "type": "string",
          "enum": ["active", "completed", "cancelled"],
          "default": "active"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": ["id", "name", "targetAmount", "createdAt"]
    },

    "UserPreferences": {
      "type": "object",
      "properties": {
        "currency": {
          "type": "string",
          "default": "TRY"
        },
        "theme": {
          "type": "string",
          "enum": ["light", "dark", "system"],
          "default": "system"
        },
        "language": {
          "type": "string",
          "default": "tr"
        },
        "notifications": {
          "type": "boolean",
          "default": true
        }
      }
    },

    "AppState": {
      "type": "object",
      "description": "LocalStorage'da saklanacak ana state",
      "properties": {
        "incomes": {
          "type": "array",
          "items": { "$ref": "#/definitions/Income" }
        },
        "expenses": {
          "type": "array",
          "items": { "$ref": "#/definitions/Expense" }
        },
        "categories": {
          "type": "array",
          "items": { "$ref": "#/definitions/Category" }
        },
        "goals": {
          "type": "array",
          "items": { "$ref": "#/definitions/Goal" }
        },
        "preferences": {
          "$ref": "#/definitions/UserPreferences"
        },
        "version": {
          "type": "string",
          "description": "Data schema versiyonu"
        },
        "lastUpdated": {
          "type": "string",
          "format": "date-time"
        }
      }
    }
  }
}
```

### 9.2 Örnek Veri

```json
{
  "incomes": [
    {
      "id": "inc_001",
      "type": "salary",
      "category": "salary",
      "amount": 85000,
      "description": "Net maaş",
      "isRecurring": true,
      "createdAt": "2026-01-01T00:00:00Z"
    },
    {
      "id": "inc_002",
      "type": "additional",
      "category": "rent",
      "amount": 12000,
      "description": "Kadıköy dairesi kirası",
      "isRecurring": true,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "expenses": [
    {
      "id": "exp_001",
      "categoryId": "cat_food",
      "amount": 450,
      "note": "Akşam yemeği - Kadıköy",
      "date": "2026-02-03",
      "createdAt": "2026-02-03T19:30:00Z"
    }
  ],
  "version": "1.0.0"
}
```

---

## 10. API Endpoints

> **Not:** MVP için LocalStorage kullanıldığından API gerekmez. Aşağıdaki endpoint'ler gelecekte backend eklendiğinde kullanılacak yapıyı gösterir.

### 10.1 RESTful API Tasarımı

**Base URL:** `https://api.budgeify.app/v1`

#### Gelir (Income) Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/incomes` | Tüm gelirleri listele |
| GET | `/incomes/:id` | Tek gelir detayı |
| POST | `/incomes` | Yeni gelir ekle |
| PUT | `/incomes/:id` | Gelir güncelle |
| DELETE | `/incomes/:id` | Gelir sil |

#### Harcama (Expense) Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/expenses` | Tüm harcamaları listele |
| GET | `/expenses?month=2026-02` | Ay bazlı filtre |
| GET | `/expenses?category=food` | Kategori bazlı filtre |
| POST | `/expenses` | Yeni harcama ekle |
| PUT | `/expenses/:id` | Harcama güncelle |
| DELETE | `/expenses/:id` | Harcama sil |

#### Kategori (Category) Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/categories` | Tüm kategorileri listele |
| POST | `/categories` | Özel kategori ekle |
| PUT | `/categories/:id` | Kategori güncelle |
| DELETE | `/categories/:id` | Kategori sil (custom only) |

#### Hedef (Goal) Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/goals` | Tüm hedefleri listele |
| POST | `/goals` | Yeni hedef ekle |
| PUT | `/goals/:id` | Hedef güncelle |
| DELETE | `/goals/:id` | Hedef sil |

#### Analitik Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/analytics/summary?month=2026-02` | Aylık özet |
| GET | `/analytics/distribution?month=2026-02` | Kategori dağılımı |
| GET | `/analytics/recommendations` | Akıllı öneriler |

### 10.2 Örnek Request/Response

**POST /expenses**

Request:
```json
{
  "categoryId": "cat_food",
  "amount": 450,
  "note": "Akşam yemeği",
  "date": "2026-02-03"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "exp_001",
    "categoryId": "cat_food",
    "amount": 450,
    "note": "Akşam yemeği",
    "date": "2026-02-03",
    "createdAt": "2026-02-03T19:30:00Z",
    "updatedAt": "2026-02-03T19:30:00Z"
  }
}
```

---

## 11. Success Metrics

### 11.1 Birincil KPI'lar

| Metrik | Hedef (3 Ay) | Ölçüm Yöntemi |
|--------|--------------|---------------|
| **MAU (Monthly Active Users)** | 5.000 | Analytics (unique visitors) |
| **DAU / MAU Oranı** | >30% | Günlük aktif / Aylık aktif |
| **Retention Rate (D7)** | >40% | 7. gün geri dönüş oranı |
| **Ortalama Session Süresi** | >3 dakika | Analytics |
| **Harcama Giriş Sayısı / Kullanıcı** | >15 / ay | In-app tracking |

### 11.2 İkincil KPI'lar

| Metrik | Hedef | Açıklama |
|--------|-------|----------|
| **PWA Install Rate** | >10% | Ana ekrana ekleme oranı |
| **Feature Adoption** | - | - |
| - Hedef oluşturma | >30% | Hedef kullananlar |
| - Analiz sayfası ziyareti | >50% | Analiz görüntüleyenler |
| **Error Rate** | <1% | JS hata oranı |
| **Page Load Time** | <2 saniye | Core Web Vitals |

### 11.3 Kullanıcı Memnuniyeti

| Metrik | Hedef | Yöntem |
|--------|-------|--------|
| **NPS Score** | >40 | In-app survey |
| **App Store Rating** | >4.5 | (PWA için N/A) |
| **Support Ticket Volume** | <50 / ay | Destek sistemi |

### 11.4 Başarı Kriterleri (MVP)

MVP'nin başarılı sayılması için 3 ay sonunda aşağıdaki kriterlerin sağlanması gerekir:

1. **Kullanım:** 1.000+ kayıtlı kullanıcı, 300+ haftalık aktif
2. **Engagement:** Kullanıcı başına ayda 10+ harcama girişi
3. **Retention:** D7 retention >35%
4. **Teknik:** Uptime >99.5%, sayfa yüklenme <3 saniye

---

## 12. MVP Scope

### 12.1 MVP (Faz 1) - 6-8 Hafta

**Dahil Olanlar:**

| Özellik | Detay |
|---------|-------|
| ✅ Ana Maaş Girişi | Tek maaş, düzenleme |
| ✅ Harcama Ekleme | Kategori + tutar + not |
| ✅ Akıllı Autocomplete | Varsayılan kategoriler, emoji |
| ✅ Harcama Listesi | Görüntüleme, düzenleme, silme |
| ✅ Basit Özet | Gelir - Harcama = Kalan |
| ✅ Kategori Grafiği | Pie/Donut chart |
| ✅ LocalStorage | Offline veri saklama |
| ✅ Responsive UI | Mobile + Tablet + Desktop |
| ✅ Türkçe Dil | Tüm metinler Türkçe |

**Hariç Tutulanlar (Faz 1):**
- ❌ Ek gelir yönetimi
- ❌ Hedef planlama
- ❌ Akıllı öneriler
- ❌ Dark mode
- ❌ Kullanıcı girişi / Auth
- ❌ Cloud sync
- ❌ Bildirimler

### 12.2 Faz 2 - 4-6 Hafta

| Özellik | Öncelik |
|---------|---------|
| Ek Gelir Yönetimi | P1 |
| Yüzdelik Katkı Gösterimi | P1 |
| Hedef Modülü (Basit) | P1 |
| Senaryo Hesaplamaları | P2 |
| Dark Mode | P2 |
| Özel Kategori Ekleme | P2 |

### 12.3 Faz 3 - 4-6 Hafta

| Özellik | Öncelik |
|---------|---------|
| Akıllı Öneriler (AI-lite) | P1 |
| Kullanıcı Auth (Opsiyonel) | P2 |
| Cloud Sync (Supabase) | P2 |
| Veri Export (CSV) | P2 |
| Trend Grafikleri | P3 |
| Push Notifications | P3 |

### 12.4 Gelecek Vizyon (Faz 4+)

- Banka entegrasyonu (Open Banking API)
- Aile/Ortak hesap
- Recurring harcama tanımlama
- Bütçe limitleri ve uyarılar
- AI destekli kategori tahmini
- Fatura OCR ile otomatik giriş
- Çoklu para birimi desteği

---

## 13. Risk Assessment

### 13.1 Teknik Riskler

| Risk | Olasılık | Etki | Azaltma Stratejisi |
|------|----------|------|---------------------|
| **LocalStorage limiti (5MB)** | Orta | Orta | IndexedDB'ye geçiş planı hazır, veri sıkıştırma |
| **Browser uyumluluk sorunları** | Düşük | Düşük | Modern browser hedefleme, polyfill kullanımı |
| **PWA cache sorunları** | Orta | Orta | Versiyonlama, cache invalidation stratejisi |
| **Performans sorunları (büyük veri)** | Düşük | Orta | Virtualization, lazy loading, pagination |

### 13.2 Ürün Riskleri

| Risk | Olasılık | Etki | Azaltma Stratejisi |
|------|----------|------|---------------------|
| **Düşük kullanıcı benimsemesi** | Orta | Yüksek | User testing, hızlı iterasyon, basitlik odağı |
| **Rakip uygulamalar** | Yüksek | Orta | Diferansiyasyon: Türkçe, yerel odak, basitlik |
| **Kullanıcı veri kaybı** | Orta | Yüksek | Export özelliği, cloud backup (Faz 2) |
| **Özellik karmaşıklığı** | Orta | Orta | MVP disiplini, kullanıcı feedback döngüsü |

### 13.3 İş Riskleri

| Risk | Olasılık | Etki | Azaltma Stratejisi |
|------|----------|------|---------------------|
| **Monetizasyon belirsizliği** | Yüksek | Orta | Freemium model planlaması, premium özellikler |
| **Yasal/KVKK gereksinimleri** | Düşük | Yüksek | Gizlilik politikası, veri minimizasyonu |
| **Kaynak kısıtı** | Orta | Orta | Önceliklendirme, MVP odağı |

### 13.4 Risk Matrisi

```
        │ Düşük Etki │ Orta Etki │ Yüksek Etki
────────┼────────────┼───────────┼─────────────
Yüksek  │            │ Rakipler  │
Olasılık│            │           │
────────┼────────────┼───────────┼─────────────
Orta    │ PWA Cache  │ LocalStg  │ Kullanıcı
Olasılık│            │ Performns │ Benimseme
────────┼────────────┼───────────┼─────────────
Düşük   │ Browser    │           │ KVKK
Olasılık│ Uyumluluk  │           │
```

---

## 14. Timeline Estimate

### 14.1 MVP Geliştirme Takvimi (8 Hafta)

```
Hafta 1-2: Temel Altyapı
├── Proje kurulumu (Next.js, Tailwind)
├── Klasör yapısı ve component library
├── LocalStorage service
├── Routing ve layout
└── CI/CD pipeline

Hafta 3-4: Gelir & Harcama Modülleri
├── Gelir girişi UI ve logic
├── Ana Para Bloğu tasarımı
├── Harcama ekleme formu
├── Akıllı autocomplete
└── Kategori sistemi

Hafta 5-6: Liste ve Analiz
├── Harcama listesi
├── Düzenleme ve silme
├── Özet kartları
├── Grafik entegrasyonu
└── Responsive düzenlemeler

Hafta 7: Polish & Test
├── UI/UX iyileştirmeleri
├── Animasyonlar
├── Error handling
├── Edge case testing
└── Performance optimization

Hafta 8: Launch Prep
├── PWA konfigürasyonu
├── Analytics entegrasyonu
├── Landing page
├── Documentation
└── Beta test ve feedback
```

### 14.2 Gantt Chart (Basitleştirilmiş)

```
                    Hafta
Görev               1  2  3  4  5  6  7  8
──────────────────────────────────────────
Altyapı            [████]
Gelir Modülü          [████]
Harcama Modülü           [████]
Analiz Modülü               [████]
UI Polish                      [████]
Testing                           [████]
Launch                               [██]
```

### 14.3 Milestone'lar

| Milestone | Tarih | Çıktı |
|-----------|-------|-------|
| **M1: Altyapı Tamamlandı** | Hafta 2 Sonu | Çalışan boilerplate, routing, storage |
| **M2: Core Features Hazır** | Hafta 4 Sonu | Gelir/harcama CRUD işlevsel |
| **M3: Analiz Hazır** | Hafta 6 Sonu | Grafikler ve özet çalışıyor |
| **M4: MVP Launch** | Hafta 8 Sonu | Production-ready uygulama |

### 14.4 Kaynak Planlaması

**Minimum Ekip (Önerilen):**

| Rol | Kişi | Sorumluluk |
|-----|------|------------|
| Full Stack Developer | 1-2 | Frontend + LocalStorage logic |
| UI/UX Designer | 0.5 | Tasarım sistemi, wireframe→visual |
| QA (Part-time) | 0.25 | Testing, bug tracking |

**Toplam Efor:** ~240-320 saat (1 FTE için 8 hafta)

---

## Ekler

### Ek A: Renk Paleti (Referans Görsele Uygun)

| Renk | Hex | Kullanım |
|------|-----|----------|
| Primary Blue | `#1E40AF` | Ana butonlar, vurgu |
| Light Blue | `#3B82F6` | Hover states |
| Accent Teal | `#14B8A6` | Ek gelir, pozitif |
| Success Green | `#22C55E` | Başarı, pozitif kalan |
| Warning Orange | `#F59E0B` | Uyarılar |
| Error Red | `#EF4444` | Hatalar, bütçe aşımı |
| Background | `#F8FAFC` | Ana arka plan |
| Card Background | `#FFFFFF` | Kart arka planı |
| Text Primary | `#1E293B` | Ana metin |
| Text Secondary | `#64748B` | İkincil metin |

### Ek B: Tipografi

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 (Ana Para) | Inter | 36-40px | 700 |
| H2 (Sayfa Başlıkları) | Inter | 24px | 600 |
| H3 (Kart Başlıkları) | Inter | 18px | 600 |
| Body | Inter | 16px | 400 |
| Small | Inter | 14px | 400 |
| Caption | Inter | 12px | 400 |

### Ek C: Varsayılan Kategori Listesi

```typescript
const DEFAULT_CATEGORIES = [
  { id: 'cat_food', name: 'Yemek', emoji: '🍕', color: '#EF4444' },
  { id: 'cat_coffee', name: 'Kahve', emoji: '☕', color: '#8B4513' },
  { id: 'cat_market', name: 'Market', emoji: '🛒', color: '#22C55E' },
  { id: 'cat_transport', name: 'Ulaşım', emoji: '🚗', color: '#3B82F6' },
  { id: 'cat_bills', name: 'Faturalar', emoji: '💡', color: '#F59E0B' },
  { id: 'cat_rent', name: 'Kira', emoji: '🏠', color: '#8B5CF6' },
  { id: 'cat_health', name: 'Sağlık', emoji: '💊', color: '#EC4899' },
  { id: 'cat_entertainment', name: 'Eğlence', emoji: '🎬', color: '#06B6D4' },
  { id: 'cat_clothing', name: 'Giyim', emoji: '👕', color: '#14B8A6' },
  { id: 'cat_tech', name: 'Teknoloji', emoji: '💻', color: '#6366F1' },
  { id: 'cat_personal', name: 'Kişisel Bakım', emoji: '🪒', color: '#F472B6' },
  { id: 'cat_education', name: 'Eğitim', emoji: '📚', color: '#10B981' },
  { id: 'cat_credit_card', name: 'Kredi Kartı Borcu', emoji: '💳', color: '#DC2626' },
  { id: 'cat_loan', name: 'Kredi Borcu', emoji: '🏦', color: '#7C3AED' },
  { id: 'cat_gift', name: 'Hediye', emoji: '🎁', color: '#F97316' },
  { id: 'cat_sports', name: 'Spor', emoji: '🏋️', color: '#059669' },
  { id: 'cat_pet', name: 'Evcil Hayvan', emoji: '🐕', color: '#D97706' },
  { id: 'cat_other', name: 'Diğer', emoji: '📦', color: '#6B7280' },
];
```

---

**Döküman Sonu**

*Bu PRD, Budgeify uygulamasının geliştirme sürecinde referans doküman olarak kullanılacaktır. Değişiklikler ve güncellemeler için versiyon kontrolü yapılması önerilir.*

---

**Versiyon Geçmişi:**

| Versiyon | Tarih | Değişiklik | Hazırlayan |
|----------|-------|------------|------------|
| 1.0 | 03.02.2026 | İlk sürüm | Product Team |
