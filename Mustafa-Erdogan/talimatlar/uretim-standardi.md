# Üretim Standardı — Claude **Skill** / Project **bilgi dosyası**

> Bu paket, asistanın **her üretimde aynı standardı** uygulamasını sağlar. Claude'da
> iki şekilde kurulabilir: (a) bir **Skill** olarak, ya da (b) Project'e yüklenen bir
> **bilgi (knowledge) dosyası** olarak. Tercih: **Skill** (yeniden kullanılabilir,
> ada çağrılabilir). Standardın fiilen uygulandığı kanıt `transcripts/tur-B.md` ve
> `dogrulama.md` (Senaryo 4) içinde görünmelidir.

---

## 1. Tasarım Sistemi (design tokens)

Tüm renk/tipografi/boşluk değerleri **tek** `stil.css` dosyasındaki CSS değişkenlerinden
gelir; üretimde bu token'lar değişmez.

### Renk = Anlam
| Token | Renk | Anlam |
|-------|------|-------|
| `--renk-mavi` | `#1f5fd1` | **Mevcut dönem** (current) |
| `--renk-gri` | `#6b7787` | **Referans / önceki dönem** |
| `--renk-uyari` | `#9a6700` | **Hedef çizgisi** / izlemede |
| `--renk-iyi` | `#1a7f4b` | Hedef üstü |
| `--renk-kotu` | `#c0392b` | Hedef altı |

- **Kontrast WCAG AA.** Renk asla tek sinyal değildir → etiket + ikon eşlik eder.
- **Dekoratif yok:** gölge/3B/gradyan kullanılmaz; ayrım 1px kenarlık ve boşlukla.

### Tipografi & Boşluk
- Sistem font yığını; sabit ölçek: gövde 14px, KPI değeri 30px, küçük 12px.
- Boşluk ölçeği 4/8/12/16/24px; köşe yarıçapı 8px. Ölçek **sabittir**.

## 2. Ekran Anatomisi (her ekranda aynı)

```
┌──────────────────────────────────────────────┐
│ Başlık çubuğu: başlık + persona + son güncelleme│  ← her zaman
├──────────────────────────────────────────────┤
│ Filtre çubuğu: Hat · Vardiya · Dönem           │  ← global
├──────────────────────────────────────────────┤
│ Sekmeler: E1 · E2 · E3 · E4                     │
├──────────────────────────────────────────────┤
│ Ekran gövdesi (KPI / grafik / tablo)           │
├──────────────────────────────────────────────┤
│ Alt bilgi: veri kaynağı + kural notu           │
└──────────────────────────────────────────────┘
```

**'No-scroll' kuralı:** önemli bilgi tek ekranda görünür; uygulama çerçevesi
viewport'a sığar, yalnız detay tablosu kendi içinde kayar.

## 3. Ekranlar (en az 4)

| Ekran | İçerik | Grafik | İlke |
|-------|--------|--------|------|
| **E1 — Özet / KPI** | 6 kart: OEE, Kullanılabilirlik, Performans, Kalite, Toplam Duruş, Tahmini Duruş Maliyeti (₺). Mevcut vs önceki dönem deltası. | KPI kartı | Bilgi hiyerarşisi; ilk bakışta okunur |
| **E2 — Trend** | Günlük OEE zaman serisi; hedef çizgisi; mevcut vs önceki dönem. | **Çizgi** (renk = dönem) | Zaman → çizgi |
| **E3 — Kırılım / Pareto** | Duruş Nedeni Pareto'su (sütun + kümülatif %, %80 referans) + Hat bazında OEE. | **Sütun + Pareto** | Kategori kıyas → sütun |
| **E4 — Detay / Aksiyon** | Vardiya kayıtları tablosu; durum sütunu + aksiyon. | Tablo | Yoğunluk + okunabilirlik |

## 4. Grafik Seçim Kuralları

- **Zaman serisi → çizgi grafik.** (E2)
- **Kategori karşılaştırma / dağılım → sütun (bar).** (E3 Hat OEE)
- **Az nedenin çoğu açıklaması → Pareto** (sütun azalan + kümülatif çizgi, %80 referans). (E3)
- **Pasta grafik** yalnız 2–3 parçada; OEE panosunda **kullanılmaz** (çok kategori var).
- **Funnel/huni** dönüşüm/aşama akışında; bu senaryoda yok.
- Her grafikte: eksen etiketleri Türkçe, hedef çizgisi gri/uyarı, hover'da metin okuma.

## 5. Çıktı Kuralları (Kalıcı Talimat'la uyumlu)

1. **4 ekran** (E1–E4); sekme ile gezinme.
2. **Ayrık veri katmanı**: veri `veri-katmani.js` / bağlı Sheet'ten; koda gömülü değil.
3. **Tek stil dosyası** (`stil.css`); inline CSS/script yok.
4. **Durumlar zorunlu**: boş-veri, hata, yüklenme (her ekranda anlamlı).
5. **Para ₺ / Türkçe / OEE = K×P×Kalite**, toplamlardan toplulaştırma (bkz. `kalici-talimat.md`).
6. **Erişilebilirlik**: renk + etiket + ikon; WCAG AA kontrast.

## 6. Üretim İstemi (asistana standart çağrısı)

Tur B'de standardı çağırmak için tipik istem:

> "OEE panosunu **üretim standardımıza** göre üret: 4 ekran (E1 Özet, E2 Trend, E3 Pareto,
> E4 Detay), bağlı Sheet'ten canlı oku (veriyi **gömme**), tek `stil.css`, inline stil/script
> yok, ₺/Türkçe biçim, boş/hata/yüklenme durumları, renk=dönem (mavi/gri), Pareto'da %80 referans."

---
*Bu dosya hem teslimin parçasıdır hem de Claude'a Skill/bilgi dosyası olarak yüklenir.
Tanımlı olup uygulanmayan standart "dekoratif" sayılır ve puan getirmez; bu yüzden Tur B
çıktısında etkisi açıkça görülmelidir.*
