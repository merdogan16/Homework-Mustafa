# Veri Sözleşmesi — OEE (S1)

Sentetik (yapay) veri. **Gerçek/gizli VALEO verisi içermez.** 288 satır
(48 gün × 3 hat × 2 vardiya), 29.04.2026–15.06.2026. Tekrarlanabilir
(`gen_oee.py`, sabit tohum). Dosyalar: `veri.csv`, `veri.json` ve dashboard'ın
okuduğu ayrık katman `../dashboard/veri-katmani.js`.

## Kolonlar (ham — OEE bu kolonlardan **hesaplanır**, veride OEE kolonu yoktur)

| Kolon | Tip | Birim | Açıklama |
|-------|-----|-------|----------|
| `Tarih` | tarih | ISO `YYYY-AA-GG` | Üretim günü |
| `Hat` | metin | — | `Hat-1` (Montaj), `Hat-2` (Pres), `Hat-3` (Kaynak) |
| `Vardiya` | metin | — | `Vardiya-1` (gündüz), `Vardiya-2` (akşam) |
| `Planli Sure (dk)` | tam sayı | dakika | Vardiyada planlanan üretim süresi (hafta içi 480, Pazar 360) |
| `Durus Suresi (dk)` | tam sayı | dakika | Toplam duruş süresi (planlı süreden düşülür) |
| `Durus Nedeni` | metin | — | Baskın duruş nedeni (Pareto kategorisi) |
| `Uretim Adedi` | tam sayı | adet | Toplam üretilen adet (sağlam + hatalı) |
| `Hatali Adet` | tam sayı | adet | Hatalı/ıskarta adet |
| `Cevrim Suresi (sn)` | tam sayı | saniye/adet | Standart (ideal) çevrim süresi; hat bazında sabit |

### Duruş Nedeni değerleri
`Ariza`, `Malzeme Bekleme`, `Kalip/Ayar Degisimi`, `Planli Bakim`,
`Kalite Sorunu`, `Vardiya Devri`, `Enerji Kesintisi`, `Diger`.

## Türetilen metrikler (dashboard hesaplar)

- **Kullanılabilirlik** = (Planlı − Duruş) / Planlı
- **Performans** = (Çevrim[sn] × Üretim Adedi) / ((Planlı − Duruş) × 60), üst sınır 1,0
- **Kalite** = (Üretim − Hatalı) / Üretim
- **OEE** = Kullanılabilirlik × Performans × Kalite
- **Tahmini Duruş Maliyeti** = Duruş (dk) × **1.500 ₺/dk** (sentetik varsayım; `veri-katmani.js` → `VALEO_OEE_META.durusMaliyetiTLperDk`)

## Tutarlılık notları

- Veri seti içinde **OEE/oran kolonu yoktur**; ham veriden hesaplanır (ham veri değişmez).
- Toplulaştırma **toplamlardan** yapılır (örn. Σçalışma/Σplanlı), oran ortalamasından değil.
- ~%75 ortalama OEE; iki "olay" gününde (Hat-2) büyük arıza → Pareto/Detay'ı zenginleştirir.
- Dönem boyunca hafif **sürekli iyileşme** trendi vardır (Tur A/B ve trend ekranı için).

## Canlı veri (Tur B) için

`veri.csv` Google Sheets'e aktarılır ve Claude Connector'a (Google Drive/Sheets)
açılır. Tur B'de "**bağlı Sheet'teki veriyi oku, gömme**" denir; bir hücre
değiştirilince pano tek istekle güncellenir (bkz. `dogrulama.md` Senaryo 5).
