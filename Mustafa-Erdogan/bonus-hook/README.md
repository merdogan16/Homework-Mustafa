# Bonus — Kural Denetleyici Hook (Governance Guard)

> Ödev Bölüm 3.7 / 9.1 **bonus** (+5 puan): *"Claude Code kullanarak yazdığınız gerçek
> bir settings.json hook'u. Kurduysanız çalıştığını kanıtlayın."*

## Ne yapar?
`Kalıcı Talimat` (`talimatlar/kalici-talimat.md`) kurallarını dashboard çıktısında
**otomatik** denetleyen bir **Claude Code `PostToolUse` hook'u**. `dashboard/` altında
bir dosya her Edit/Write edildiğinde tetiklenir ve kural ihlali bulursa **çıkış kodu 2**
ile üretimi **engeller** (Claude Code, kod 2'de `stderr`'i asistana geri verir → kural
fiilen, araç düzeyinde uygulanır).

Denetlenen kurallar:
- **R4** — inline CSS yasak (`style="..."` / `<style>`)
- **R4** — inline `<script>` yasak (yalnız `<script src=...>`)
- **R3** — veri koda gömülmez (tarihli kayıt yalnız ayrık katmanda)
- **R3** — ayrık veri katmanı (`veri-katmani.js`) var ve dashboard ondan okuyor
- **R2** — `<html lang="tr">`

## Dosyalar
- `dogrula-kurallar.py` — denetleyici (çıkış kodu 0 = geçti, 2 = ihlal/engelle)
- `settings.json` — Claude Code hook yapılandırması

## Kurulum (Claude Code)
1. `settings.json` içeriğini projenizin `.claude/settings.json` dosyasına koyun.
2. `dogrula-kurallar.py`'yi `bonus-hook/` altında tutun (yol `$CLAUDE_PROJECT_DIR` ile çözülür).
3. Artık `dashboard/` altında her düzenlemeden sonra hook otomatik çalışır.

Manuel çalıştırma: `python3 bonus-hook/dogrula-kurallar.py`

## Kanıt (çalışıyor)

### 1) Temiz dashboard → GEÇER (çıkış kodu 0)
```
== Kural Denetimi: .../dashboard ==
  ✓ R4: inline CSS yok (style=/<style> bulunamadi).
  ✓ R4: inline <script> yok (yalniz <script src=...>).
  ✓ R3: dashboard kodunda gomulu veri yok.
  ✓ R3: ayrik veri katmani var ve dashboard ondan okuyor.
  ✓ R2: <html lang="tr"> mevcut.

SONUC: Tum kurallar gecti. ✓
[cikis kodu: 0]
```

### 2) Kural ihlali enjekte edildi → ENGELLER (çıkış kodu 2)
`index.html`'e bilerek inline `style=`, inline `<script>` ve gömülü veri eklenince:
```
== Kural Denetimi: /tmp/bozuk-dash ==
  ✓ R3: ayrik veri katmani var ve dashboard ondan okuyor.
  ✓ R2: <html lang="tr"> mevcut.
  ✗ R4 ihlali: index.html icinde inline style="..." var.
  ✗ R4 ihlali: index.html icinde inline <script> var (src kullanin).
  ✗ R3 ihlali: veri index.html icine gomulmus (tarihli kayit).

SONUC: 3 kural ihlali. Uretim ENGELLENDI.
[cikis kodu: 2]
```

> Hook, kuralları yalnız "yazmakla" kalmayıp **araç düzeyinde dayatır**: kuralı ihlal eden
> bir çıktı commit/produce edilemez. Bu, ödevin "kural fiilen çalışıyor" beklentisinin
> otomasyonla güçlendirilmiş hâlidir.
