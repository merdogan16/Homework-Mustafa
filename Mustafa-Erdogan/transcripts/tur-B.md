# Tur B — Donatımlı (Tam Yönetişim Katmanı)

> 🟩 **BU DOSYA BİR ŞABLONDUR.** Aşağıdaki istemleri, **kurduğunuz Project**
> (Kalıcı Talimat + Skill üretim standardı + Google Sheets Connector) içinde
> çalıştırın; **gerçek ve kesintisiz** çıktıyı `⟦…⟧` alanlarına yapıştırın.
> Standardın ve kuralların **fiilen uygulandığı** bu transcript'te görünmelidir
> (yoksa "dekoratif" sayılır — Bölüm 9).

- **Kurulum:** Project = `kalici-talimat.md` (özel talimatlar) + `uretim-standardi.md` (Skill/bilgi) + **Connector → Google Drive/Sheets** (bağlı `veri.csv`).
- **Tarih/saat:** ⟦GG.AA.YYYY SS:DD⟧
- **Paylaşım linki:** ⟦https://claude.ai/share/…⟧

---

## İstem 1 — Standartla üretim (canlı veriden)

```
OEE panosunu üretim standardımıza göre üret. Bağlı Google Sheet'teki veriyi CANLI oku,
veriyi koda GÖMME. 4 ekran olsun: E1 Özet/KPI, E2 Trend, E3 Pareto, E4 Detay/Aksiyon.
Tek stil.css, inline CSS/script yok; ₺ ve Türkçe biçim; renk=dönem (mavi=mevcut, gri=önceki);
Pareto'da %80 referans; her ekranda boş/hata/yüklenme durumu. Kurallar Project talimatında.
```

### Claude'un Çıktısı (gerçek, kesintisiz)
⟦Claude'un tam yanıtı: bağlı Sheet'i okuduğu an + ürettiği dashboard kodu/önizleme.⟧

### Standardın uygulandığının kanıtı
- [ ] 4 ekran (E1–E4) var · [ ] Renk = dönem (mavi/gri) · [ ] Pareto + %80 referans
- [ ] ₺ ve Türkçe biçim · [ ] Ayrık veri katmanı (gömülü değil) · [ ] Boş/hata/yüklenme
- [ ] Tek `stil.css`, inline yok

⟦Kısa not: hangi kural/standart çıktıda nasıl görünüyor?⟧

## İstem 2 — Tekrar üretim (tekrarlanabilirlik kanıtı)

> Aynı Project'te aynı istemi **2. kez** verin. Çıktı **yapı/tasarım olarak kararlı**
> olmalı (anlamsız sapma yok). Bu, `dogrulama.md` Senaryo 1'in de kanıtıdır.

```
Aynı standartla panoyu yeniden üret (bağlı Sheet'ten canlı). Önceki üretimle
yapısal olarak aynı olmalı.
```

⟦2. üretimin çıktısı + 1. üretimle aynı/kararlı olduğunun kısa karşılaştırması.⟧

## Tur A ↔ Tur B Farkı (kısa not)

| Eksen | Tur A (donatımsız) | Tur B (donatımlı) |
|-------|--------------------|--------------------|
| Tasarım tutarlılığı | ⟦…⟧ | ⟦…⟧ |
| Kural uyumu (₺/Türkçe/gömme) | ⟦…⟧ | ⟦…⟧ |
| Veri bağlama | kopyala-yapıştır/gömülü | canlı Sheet |
| Tekrarlanabilirlik | sapıyor | kararlı |
