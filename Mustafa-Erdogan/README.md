# Ödev #1 — Yönetişimli Dashboard Üretim Hattı

**AdAstra × VALEO · Kurumsal Yapay Zekâ Yetkinlik Programı**

| Alan | Değer |
|------|-------|
| **Ad-Soyad** | Mustafa Erdoğan |
| **Ekip** | _(Ar-Ge / Tasarım / After-Market — kendi ekibinizi yazın)_ |
| **Seçilen Araç** | **Claude** (claude.ai) |
| **Senaryo** | **S1 — Hat Verimi & OEE Panosu** |
| **Persona** | **Üretim Müdürü** |
| **Pano kararı** | "Hangi hat/vardiya hedefin altında ve **neden**? Hangi duruşa önce müdahale edilmeli? Trend iyileşiyor mu?" |

> ⚠️ **Veri sentetiktir.** Gerçek/gizli VALEO verisi içermez.

## 🔗 Paylaşılan Sohbet Linkleri (Claude "Share")

> **DOLDURULACAK** — Claude'da her sohbeti **Share** ile paylaşıp linki buraya yapıştırın.
> Linkler erişime açık olmalı; yoksa ilgili feature "kullanılmamış" sayılır (Bölüm 5).

| Tur / Senaryo | Paylaşım Linki |
|---------------|----------------|
| Tur A — Donatımsız | `https://claude.ai/share/…` |
| Tur B — Donatılmış (1. üretim) | `https://claude.ai/share/…` |
| Tur B — Donatılmış (2. üretim, tekrarlanabilirlik) | `https://claude.ai/share/…` |
| Doğrulama senaryoları | `https://claude.ai/share/…` |

## 📁 Klasör İçeriği

```
Mustafa-Erdogan/
├─ README.md                      ← bu dosya
├─ KURULUM-REHBERI.md             ← Claude'da elle yapılacak adımlar (Project/Connector/turlar)
├─ bonus-hook/                    ← (Bonus +5) kuralları otomatik dayatan Claude Code hook'u
│  ├─ dogrula-kurallar.py         ← kural denetleyici (kod 0=geçer, 2=engeller)
│  └─ settings.json  README.md    ← hook yapılandırması + çalıştığının kanıtı
├─ talimatlar/
│  ├─ kalici-talimat.md           ← Project özel talimatları (Rule'lar, test edilebilir)
│  └─ uretim-standardi.md         ← Skill / üretim standardı (tasarım + anatomi + grafik)
├─ veri/
│  ├─ veri.csv                    ← sentetik veri (Sheets'e de yüklenir)
│  ├─ veri.json
│  └─ veri-sozlugu.md             ← veri sözleşmesi (kolon/birim)
├─ dashboard/                     ← üretilen çıktı (index.html'i tarayıcıda açın)
│  ├─ index.html  stil.css  dashboard.js  veri-katmani.js
│  └─ README.md
├─ transcripts/
│  ├─ tur-A.md  tur-B.md  dogrulama.md   ← gerçek, kesintisiz oturum kayıtları (DOLDURULACAK)
├─ ekran-goruntuleri/             ← Connector, talimat, standart uygulanışı (DOLDURULACAK)
│  └─ OKUBENI.md
├─ rapor.pdf                      ← Bölüm 8 raporu (rapor/rapor.html'den ÜRETİLDİ; teslimde zorunlu)
└─ rapor/
   ├─ rapor.md                    ← rapor kaynağı (Markdown, kişiselleştir)
   ├─ rapor.html                  ← baskıya hazır sürüm (Yazdır→PDF ile rapor.pdf yenilenir)
   └─ diyagram.md                 ← yönetişim mimarisi diyagramı (mermaid, zorunlu)
```

## ✅ Kanıt Haritası (Bölüm 5)

| Kanıt | Nerede | Nasıl görünür |
|-------|--------|----------------|
| Standart uygulandı | `transcripts/tur-B.md` | Tur B çıktısı Skill standardına (renk/anatomi/grafik) uyuyor |
| Kural etkin | `transcripts/dogrulama.md` (Sn.3) | Veri gömme isteği talimatla reddedildi/düzeltildi |
| Canlı veri | `ekran-goruntuleri/` + `tur-B.md` | Connector bağlı; Sheet'ten canlı okuma |
| Bağlam yalın | `rapor/rapor.md` (Context notu) | Standart/şema Project bilgisine yüklendi, sohbete yapıştırılmadı |
| Tekrar kararlı | `transcripts/dogrulama.md` (Sn.1) | Tur B iki kez üretildi, çıktı kararlı |
| Paylaşılan sohbet | bu README | Claude Share linkleri çalışıyor |

## 🚀 Hızlı Başlangıç
1. `dashboard/index.html` → tarayıcıda aç (çalışan çıktı; veri ayrık katmandan).
2. `KURULUM-REHBERI.md` → Claude'da Project + Skill + Connector kurulum adımları.
3. `transcripts/*` ve `ekran-goruntuleri/*` → kendi gerçek oturum kayıt/görüntülerinle doldur.
4. `rapor.pdf` hazır (rapor/rapor.html'den üretildi). Kişiselleştirirsen `rapor/rapor.html`'i güncelleyip tarayıcıda **Yazdır → PDF olarak kaydet** ile yenile.
