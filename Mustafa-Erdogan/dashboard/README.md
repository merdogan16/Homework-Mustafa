# Dashboard — Hat Verimi & OEE Panosu

Çok ekranlı (4 ekran) OEE panosu. Bağımlılık yok, derleme yok.

## Çalıştırma
`index.html` dosyasını bir tarayıcıda açın (çift tıklayın). Hepsi bu —
veri ayrık `veri-katmani.js` katmanından `<script>` ile yüklendiği için
yerel sunucuya gerek yoktur.

## Dosyalar
| Dosya | Görev |
|-------|-------|
| `index.html` | İskelet; yalnız `<script src>` ve `stil.css` bağlar (inline yok) |
| `stil.css` | **Tek** tasarım sistemi / stil dosyası |
| `dashboard.js` | OEE hesapları, filtreler, 4 ekran, SVG grafikler, boş/hata/yüklenme |
| `veri-katmani.js` | **Ayrık veri katmanı** (`veri/veri.csv`'den üretildi); koda gömülü değil |

## Ekranlar
- **E1 · Özet/KPI** — OEE, Kullanılabilirlik, Performans, Kalite, Toplam Duruş, Tahmini Duruş Maliyeti (₺); mevcut vs önceki dönem.
- **E2 · Trend** — günlük OEE çizgisi; mavi=mevcut, gri=önceki, hedef çizgisi.
- **E3 · Pareto/Kırılım** — duruş nedeni Pareto'su (%80 referans) + hat bazında OEE.
- **E4 · Detay/Aksiyon** — vardiya kayıtları tablosu; durum rozeti + aksiyon.

## Doğrulama testleri (gömülü)
Sağ üstteki **"Veri Senaryosu (doğrulama testi)"** seçicisi:
- **Boş veri** → boş-durum mesajı (pano çökmez).
- **Bozuk veri** → geçersiz satırlar elenir, pano çalışmaya devam eder.

Bu seçici, ödevin **Doğrulama Senaryo 2** (boş/bozuk veri) kanıtını ekran
görüntüsüyle almayı kolaylaştırır.

## Canlı veriye geçiş (Tur B)
`veri-katmani.js` yerine Claude Connector ile **bağlı Google Sheet** kullanılır;
asistana "bağlı Sheet'ten oku, gömme" denir. Statik teslimde ayrık katman aynı
sözleşmeyi (`veri-sozlugu.md`) izler; Sheet'teki bir hücre değişince pano tek
istekte güncellenir.
