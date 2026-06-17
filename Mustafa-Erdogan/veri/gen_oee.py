#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VALEO OEE (S1) sentetik veri ureticisi.
Cikti: veri.csv, veri.json (veri/ altinda) ve veri-katmani.js (dashboard/ altinda).
Sadece HAM kolonlar yazilir; OEE/Kullanilabilirlik/Performans/Kalite dashboard'da hesaplanir.
Deterministik (sabit tohum) -> tekrarlanabilir.
"""
import csv, json, random, os
from datetime import date, timedelta

random.seed(20260617)

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- Sabitler / sozlesme ---
HATLAR = {
    "Hat-1": {"cevrim_sn": 35, "ad": "Montaj"},
    "Hat-2": {"cevrim_sn": 50, "ad": "Pres"},
    "Hat-3": {"cevrim_sn": 28, "ad": "Kaynak"},
}
VARDIYALAR = ["Vardiya-1", "Vardiya-2"]  # Gunduz / Aksam

# Durus nedenleri ve Pareto agirliklari (3 neden ~ %80'i olusturur)
DURUS_NEDENLERI = [
    ("Ariza", 30),
    ("Malzeme Bekleme", 26),
    ("Kalip/Ayar Degisimi", 18),
    ("Planli Bakim", 10),
    ("Kalite Sorunu", 7),
    ("Vardiya Devri", 4),
    ("Enerji Kesintisi", 3),
    ("Diger", 2),
]
NEDEN_ADLAR = [n for n, _ in DURUS_NEDENLERI]
NEDEN_AGIRLIK = [w for _, w in DURUS_NEDENLERI]

BASLANGIC = date(2026, 4, 29)
GUN_SAYISI = 48  # 48 gun x 3 hat x 2 vardiya = 288 satir

# Surekli iyilesme: donem boyunca hedeflerin hafif yukselisi
def hedefler(t):  # t in [0,1]
    avail = 0.85 + 0.06 * t
    perf  = 0.88 + 0.05 * t
    qual  = 0.975 + 0.013 * t
    return avail, perf, qual

def clamp(x, lo, hi):
    return max(lo, min(hi, x))

# Onceden belirlenmis 2 "olay" gunu (buyuk ariza) -> Pareto/Detay zenginlesir
OLAY_GUNLERI = {BASLANGIC + timedelta(days=12), BASLANGIC + timedelta(days=33)}

rows = []
for d in range(GUN_SAYISI):
    gun = BASLANGIC + timedelta(days=d)
    t = d / (GUN_SAYISI - 1)
    pazar = (gun.weekday() == 6)  # Pazar -> planli bakim agirlikli, dusuk planli sure
    avail_t, perf_t, qual_t = hedefler(t)
    for hat, hcfg in HATLAR.items():
        cevrim = hcfg["cevrim_sn"]
        for vard in VARDIYALAR:
            planli = 360 if pazar else 480  # dakika
            # Hatta gore kucuk sapma
            hat_ofset = {"Hat-1": 0.00, "Hat-2": -0.02, "Hat-3": 0.015}[hat]

            olay = (gun in OLAY_GUNLERI and hat == "Hat-2" and vard == "Vardiya-1")
            if pazar:
                avail = clamp(random.gauss(0.70, 0.05) + hat_ofset, 0.50, 0.90)
                neden = "Planli Bakim" if random.random() < 0.75 else random.choices(NEDEN_ADLAR, NEDEN_AGIRLIK)[0]
            elif olay:
                avail = clamp(random.gauss(0.52, 0.04) + hat_ofset, 0.40, 0.65)
                neden = "Ariza"
            else:
                avail = clamp(random.gauss(avail_t + hat_ofset, 0.035), 0.60, 0.985)
                neden = random.choices(NEDEN_ADLAR, NEDEN_AGIRLIK)[0]

            durus = round(planli * (1 - avail))
            durus = max(0, min(durus, planli - 30))  # en az 30 dk uretim
            calisma_sn = (planli - durus) * 60

            perf = clamp(random.gauss(perf_t + hat_ofset, 0.03), 0.60, 0.99)
            uretim = int((perf * calisma_sn) / cevrim)

            qual = clamp(random.gauss(qual_t, 0.008), 0.90, 0.999)
            hatali = int(round(uretim * (1 - qual)))

            rows.append({
                "Tarih": gun.isoformat(),
                "Hat": hat,
                "Vardiya": vard,
                "Planli Sure (dk)": planli,
                "Durus Suresi (dk)": durus,
                "Durus Nedeni": neden,
                "Uretim Adedi": uretim,
                "Hatali Adet": hatali,
                "Cevrim Suresi (sn)": cevrim,
            })

# --- Yaz: CSV ---
os.makedirs(f"{BASE}/veri", exist_ok=True)
os.makedirs(f"{BASE}/dashboard", exist_ok=True)
alanlar = list(rows[0].keys())
with open(f"{BASE}/veri/veri.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=alanlar)
    w.writeheader()
    w.writerows(rows)

# --- Yaz: JSON ---
with open(f"{BASE}/veri/veri.json", "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=2)

# --- Yaz: dashboard/veri-katmani.js (AYRIK veri katmani; koda gomulu DEGIL) ---
son_guncelleme = (BASLANGIC + timedelta(days=GUN_SAYISI - 1)).isoformat()
meta = {
    "kaynak": "veri/veri.csv (sentetik)",
    "sonGuncelleme": son_guncelleme,
    "satirSayisi": len(rows),
    "parabirimi": "TRY",
    # Durus dakikasi basina tahmini kayip maliyet (sentetik varsayim) -> KPI'de TL formatlanir
    "durusMaliyetiTLperDk": 1500,
    "oeeHedef": 0.85,
    "kolonlar": alanlar,
}
with open(f"{BASE}/dashboard/veri-katmani.js", "w", encoding="utf-8") as f:
    f.write("// OTOMATIK URETILDI - veri/veri.csv'den (sentetik). Elle duzenlemeyin.\n")
    f.write("// AYRIK VERI KATMANI: dashboard mantigi bu veriyi calisma aninda okur; koda gomulu degildir.\n")
    f.write("window.VALEO_OEE_META = " + json.dumps(meta, ensure_ascii=False, indent=2) + ";\n\n")
    f.write("window.VALEO_OEE_VERI = " + json.dumps(rows, ensure_ascii=False, indent=2) + ";\n")

# --- Ozet (konsol) ---
def oee_of(r):
    planli = r["Planli Sure (dk)"]; durus = r["Durus Suresi (dk)"]
    calisma_sn = (planli - durus) * 60
    a = (planli - durus) / planli
    p = (r["Cevrim Suresi (sn)"] * r["Uretim Adedi"]) / calisma_sn if calisma_sn else 0
    q = (r["Uretim Adedi"] - r["Hatali Adet"]) / r["Uretim Adedi"] if r["Uretim Adedi"] else 0
    return a, min(p,1.0), q, a*min(p,1.0)*q

import statistics as st
oees = [oee_of(r)[3] for r in rows]
print(f"Satir: {len(rows)}  Tarih: {rows[0]['Tarih']}..{rows[-1]['Tarih']}")
print(f"OEE ort: {st.mean(oees):.3f}  min: {min(oees):.3f}  max: {max(oees):.3f}")
toplam_durus = sum(r["Durus Suresi (dk)"] for r in rows)
print(f"Toplam durus: {toplam_durus} dk  ~ Tahmini maliyet: {toplam_durus*1500:,} TL".replace(",", "."))
from collections import Counter
c = Counter();
for r in rows: c[r["Durus Nedeni"]] += r["Durus Suresi (dk)"]
print("Durus nedeni (dk):", dict(c.most_common()))
