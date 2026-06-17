# Yönetişim Mimarisi Diyagramı (ZORUNLU)

Bağlam / Kalıcı Talimat / Skill-Gem / Canlı Veri'nin nasıl birlikte çalıştığını gösterir.
(GitHub'da ve çoğu Markdown→PDF aracında otomatik render olur.)

```mermaid
flowchart TB
    U["👤 Üretim Müdürü\n(istem: 'OEE panosu üret')"] --> P

    subgraph P["🧩 Claude Project — Bağlam Kabı (kalıcı)"]
        direction TB
        R["📜 Kalıcı Talimat (Rule)\n₺ · Türkçe · veri gömme yok\ninline yok · erişilebilirlik · durumlar"]
        S["🎨 Skill — Üretim Standardı\ntasarım sistemi + ekran anatomisi\n+ grafik seçim kuralları"]
        K["📚 Project Bilgisi\nveri-sozlugu.md (veri sözleşmesi)\n(sohbete yapıştırılmaz)"]
    end

    subgraph V["🔌 Canlı Veri (Connector)"]
        G["📊 Google Sheet\n(sentetik OEE verisi)"]
    end

    P -->|standart + kurallar uygulanır| ENG["⚙️ Üretim\n(asistan çıktısı)"]
    G -->|canlı okuma, gömme yok| ENG
    ENG --> D["🖥️ Dashboard\n4 ekran · ayrık veri katmanı\ntek stil.css · durumlar"]

    CB["🧹 Context Yönetimi\nbilgi yükle · yeni sohbet · özetle"] -.->|bağlamı yalın tutar| P

    subgraph T["🔁 İki Tur Protokolü"]
        A["Tur A — Donatımsız\n(boş sohbet, kontrol)"]
        B["Tur B — Donatımlı\n(P + V ile)"]
    end
    A -. "sapar / tutarsız" .-> KARSILASTIR{{"Karşılaştırma:\ntutarlılık · kural · veri · tekrar"}}
    B -. "kararlı / standart" .-> KARSILASTIR
    D --> B
```

## Akışın Özeti
1. **Bağlam (Project)** kalıcı kabı taşır; içine **Kalıcı Talimat (Rule)**, **Skill (standart)** ve **veri sözleşmesi** yerleşir.
2. **Canlı Veri (Connector)** bağlı Google Sheet'ten **gömmeden** okunur.
3. Asistan, kurallar + standart altında **dashboard'u üretir** (ayrık veri katmanı, tek stil, durumlar).
4. **Context yönetimi** bağlamı yalın tutar (bilgi yükleme, yeni sohbet, özet).
5. **İki tur** (A donatımsız / B donatımlı) karşılaştırılır → kurumsallaşmanın değeri ölçülür.
