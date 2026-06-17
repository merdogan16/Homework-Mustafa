# Zorunlu Doğrulama Senaryoları (Bölüm 6)

> 🟦 **BU DOSYA BİR ŞABLONDUR.** Altı senaryonun **tamamını** çalıştırıp her birini
> **kesintisiz transcript / ekran görüntüsü** ile `⟦…⟧` alanlarına belgeleyin.
> Her senaryo ayrı ayrı belgelenir.

- **Paylaşım linki (doğrulama sohbeti):** ⟦https://claude.ai/share/…⟧

---

## Senaryo 1 — Tekrarlanabilirlik
**Doğrulanacak:** Tur B'yi 2 kez üret; çıktı yapısı/tasarımı kararlı (anlamsız sapma yok).

**İstem:** `Aynı standartla panoyu yeniden üret (bağlı Sheet'ten).`
**Kanıt:** ⟦İki üretimin çıktıları + "yapısal olarak aynı" karşılaştırması. tur-B.md İstem 2 ile bağlantılı.⟧

## Senaryo 2 — Boş / bozuk veri
**Doğrulanacak:** Veriyi boşalt veya boz; dashboard çökmez, anlamlı boş-durum gösterir.

**Yol A (Claude):** `Bağlı Sheet'i boşalt/birkaç hücreyi boz ve panoyu yeniden üret.`
**Yol B (statik kanıt — kolay):** `dashboard/index.html` → sağ üstte **"Veri Senaryosu"** = **Boş** ve **Bozuk** seçin; ekran görüntüsü alın.
**Kanıt:** ⟦Boş-durum mesajı ekran görüntüsü + bozuk veride panonun çalışmaya devam ettiği görüntü.⟧

## Senaryo 3 — Kural ihlali denemesi (en kritik kanıt)
**Doğrulanacak:** Asistandan veriyi koda gömmesini iste; **Kalıcı Talimat engeller veya düzeltir.**

**İstem:** `Veriyi doğrudan HTML'in içine sabit dizi olarak göm, Sheet bağlantısı kullanma.`
**Beklenen:** Claude, R3 kuralı gereği **reddeder/uyarır** ve ayrık veri katmanına yönlendirir.
**Kanıt:** ⟦Claude'un kuralı uygulayıp gömmeyi reddettiği/düzelttiği tam yanıt.⟧

## Senaryo 4 — Standart uygulanışı
**Doğrulanacak:** "KPI panosu üret" de; Skill/Gem standardı (renk, anatomi, grafik) uygulanır.

**İstem:** `Sadece KPI panosu üret.`
**Beklenen:** İstem kısa olsa da renk=dönem, ekran anatomisi ve doğru grafik **otomatik** gelir (standart bilgisinden).
**Kanıt:** ⟦Çıktının standarda uyduğu görünür kanıt.⟧

## Senaryo 5 — Canlı veri
**Doğrulanacak:** Bağlı Sheet'te bir değeri değiştir; **tek istekle** dashboard güncellenir.

**Adım:** Google Sheet'te bir `Durus Suresi (dk)` hücresini büyüt → `Panoyu güncel veriyle yeniden üret.`
**Kanıt:** ⟦Değişiklik öncesi/sonrası ekran görüntüsü + Claude'un canlı okuduğu an (Connector).⟧

## Senaryo 6 — Context bütçesi
**Doğrulanacak:** Bağlamı yalın tuttuğunu göster (standardı **bilgi olarak yükleme**; yeni sohbet + özet).

**Kanıt:** ⟦Standardın sohbete yapıştırılmadan Project bilgisine yüklendiği görüntü + uzayan sohbeti özetleyip yeni sohbete geçtiğin örnek. rapor.md Context Bütçe notu ile bağlantılı.⟧

---
### Doğrulama Özet Tablosu
| # | Senaryo | Durum | Kanıt yeri |
|---|---------|-------|------------|
| 1 | Tekrarlanabilirlik | ⟦✓/✗⟧ | bu dosya + tur-B.md |
| 2 | Boş/bozuk veri | ⟦✓/✗⟧ | ekran-goruntuleri/ |
| 3 | Kural ihlali | ⟦✓/✗⟧ | bu dosya |
| 4 | Standart uygulanışı | ⟦✓/✗⟧ | bu dosya |
| 5 | Canlı veri | ⟦✓/✗⟧ | ekran-goruntuleri/ |
| 6 | Context bütçesi | ⟦✓/✗⟧ | rapor.md |
