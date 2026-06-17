# Kurulum Rehberi — Claude'da Elle Yapılacaklar

Bu repodaki **dosya artefaktları hazır** (veri, dashboard, kalıcı talimat, üretim
standardı, rapor taslağı). Notun büyük kısmı **yönetişim katmanını gerçekten kurup
kullanmaktan** ve **gerçek kanıt** (transcript, paylaşım linki, ekran görüntüsü)
üretmekten gelir. Aşağıdaki adımları Claude'da **kendiniz** yapın — bunlar
otomatikleştirilemez ve uydurma kanıt cezalandırılır (Bölüm 9).

> 💡 En sağlam yol: aşağıdaki dosyaları **hedef/standart** olarak kullanın ve Tur B'de
> panoyu kendi Project'inizde **yeniden ürettirin**. Böylece hem öğrenir hem gerçek
> transcript elde edersiniz.

## 1) Google Sheet + veri (Canlı veri için)
1. `veri/veri.csv` dosyasını Google Sheets'e aktarın (Dosya → İçe aktar).
2. Sheet'i Claude'un erişebileceği Drive konumuna koyun.

## 2) Claude Connector (Google Drive/Sheets)
1. claude.ai → **Settings → Connectors** → Google Drive'ı bağlayın/yetkilendirin.
2. Bağlantıyı doğrulayın → ekran görüntüsü: `ekran-goruntuleri/03-connector-bagli.png`.

## 3) Project oluştur (Bağlam kabı)
1. claude.ai → **Projects → New Project**: "VALEO OEE Üretim Hattı".
2. **Custom instructions / Özel talimatlar** alanına `talimatlar/kalici-talimat.md`
   içeriğini yapıştırın → görüntü: `01-project-talimat.png`.
3. **Project bilgisine (knowledge)** yükleyin: `talimatlar/uretim-standardi.md` ve
   `veri/veri-sozlugu.md`. **Sohbete yapıştırmayın** — bilgi olarak yükleyin
   (Context bütçesi → `10-context-butce.png`).

## 4) Skill (üretim standardı)
- `uretim-standardi.md`'yi bir **Skill** olarak tanımlayın (yoksa Project bilgi
  dosyası olarak kullanın) → görüntü: `02-skill-standart.png`.

## 5) Tur A — Donatımsız (kontrol)
- **Boş** sohbet (Project dışı). `transcripts/tur-A.md` içindeki istemi çalıştırın.
- 2 kez üretip sapmayı gösterin. **Share** linkini README + tur-A.md'ye ekleyin.

## 6) Tur B — Donatımlı
- **Project içinde** `transcripts/tur-B.md` istemlerini çalıştırın (canlı Sheet'ten).
- 2 kez üretip kararlılığı gösterin. Share linklerini ekleyin.

## 7) Doğrulama (6 senaryo)
- `transcripts/dogrulama.md`'deki 6 senaryoyu çalıştırıp belgeleyin.
- Boş/bozuk veri için `dashboard/index.html` → "Veri Senaryosu" seçicisini kullanın.

## 8) Rapor
- **`rapor.pdf` zaten hazır** (üst klasörde; `rapor/rapor.html`'den üretildi — zorunlu
  mimari diyagram render edilmiş hâlde içinde).
- Kişiselleştirmek için `rapor/rapor.html` (veya `rapor/rapor.md`) içindeki turuncu
  `[…]` alanlarını doldurun (ekip adı, gözlemler, en etkili 5. prompt, 3. engel...).
- PDF'i yenilemek: `rapor/rapor.html`'i tarayıcıda aç → **Yazdır → "PDF olarak kaydet"**
  → `rapor.pdf` olarak üzerine yaz. (Diyagram inline SVG; her yerde render olur.)

## 9) Teslim (kupakoray/Homework-Uploads)
- `Mustafa-Erdogan/` klasörünün tamamını PDF Bölüm 7'deki adımlarla GitHub'a
  **sürükle-bırak** ile yükleyin. (Bu repo hazırlık içindir; teslim ayrı repoyadır.)
- **Dahil etmeyin:** şifre/anahtar, gerçek/gizli veri, gereksiz büyük dosyalar.

## (Bonus) Hook / Otomasyon
- İsterseniz bir Apps Script tetikleyicisi veya Claude Code `settings.json` hook'u
  kurup çalıştığını kanıtlayın (+5 puan, Bölüm 9.1).
