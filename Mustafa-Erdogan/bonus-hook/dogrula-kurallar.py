#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Kural Denetleyici (Governance Guard) — Bonus otomasyon.

Kalici Talimat (kalici-talimat.md) kurallarini dashboard ciktisinda OTOMATIK denetler.
Claude Code PostToolUse hook'u olarak calisir: dashboard/ altinda bir dosya her
Edit/Write edildiginde tetiklenir ve kural ihlali varsa cikis kodu 2 ile ENGELLER
(Claude Code, kod 2'de stderr'i asistana geri verir -> kural fiilen calisir).

Kullanim:
  python3 dogrula-kurallar.py [dashboard_dizini]
Varsayilan dizin: bu script'in yanindaki ../dashboard
"""
import os, re, sys

def dashboard_dizini():
    if len(sys.argv) > 1:
        return os.path.abspath(sys.argv[1])
    burada = os.path.dirname(os.path.abspath(__file__))
    return os.path.abspath(os.path.join(burada, "..", "dashboard"))

def oku(yol):
    try:
        with open(yol, encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return None

def denetle(dash):
    ihlaller = []
    gecenler = []

    index = oku(os.path.join(dash, "index.html"))
    dashjs = oku(os.path.join(dash, "dashboard.js"))
    veri = oku(os.path.join(dash, "veri-katmani.js"))

    if index is None:
        ihlaller.append("index.html bulunamadi: " + dash)
        return ihlaller, gecenler

    # --- R4: inline CSS yasak (style="..." veya <style> blogu) ---
    if re.search(r'style\s*=\s*"', index):
        ihlaller.append('R4 ihlali: index.html icinde inline style="..." var.')
    elif re.search(r'<style[\s>]', index):
        ihlaller.append("R4 ihlali: index.html icinde <style> blogu var.")
    else:
        gecenler.append("R4: inline CSS yok (style=/<style> bulunamadi).")

    # --- R4: inline <script> yasak (src'siz script) ---
    inline_scriptler = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>', index)
    if inline_scriptler:
        ihlaller.append("R4 ihlali: index.html icinde inline <script> var (src kullanin).")
    else:
        gecenler.append("R4: inline <script> yok (yalniz <script src=...>).")

    # --- R3: veri koda gomulmez (tarih degerli kayitlar yalniz veri katmaninda) ---
    gomulu_index = re.search(r'"Tarih"\s*:\s*"\d{4}-', index)
    gomulu_js = re.search(r'"Tarih"\s*:\s*"\d{4}-', dashjs or "")
    if gomulu_index or gomulu_js:
        nerede = "index.html" if gomulu_index else "dashboard.js"
        ihlaller.append("R3 ihlali: veri " + nerede + " icine gomulmus (tarihli kayit).")
    else:
        gecenler.append("R3: dashboard kodunda gomulu veri yok.")

    # --- R3 (pozitif): ayrik veri katmani var ve okunuyor ---
    if veri is None:
        ihlaller.append("R3 ihlali: ayrik veri katmani (veri-katmani.js) yok.")
    elif "VALEO_OEE_VERI" not in veri:
        ihlaller.append("R3 ihlali: veri-katmani.js icinde VALEO_OEE_VERI tanimi yok.")
    elif not dashjs or "VALEO_OEE_VERI" not in dashjs:
        ihlaller.append("R3 ihlali: dashboard.js veri katmanini (VALEO_OEE_VERI) okumuyor.")
    else:
        gecenler.append("R3: ayrik veri katmani var ve dashboard ondan okuyor.")

    # --- R2: Turkce dil etiketi ---
    if re.search(r'<html[^>]*\blang\s*=\s*"tr"', index):
        gecenler.append('R2: <html lang="tr"> mevcut.')
    else:
        ihlaller.append('R2 uyari: <html lang="tr"> yok.')

    return ihlaller, gecenler

def main():
    dash = dashboard_dizini()
    ihlaller, gecenler = denetle(dash)

    print("== Kural Denetimi: " + dash + " ==")
    for g in gecenler:
        print("  ✓ " + g)
    for i in ihlaller:
        print("  ✗ " + i, file=sys.stderr)

    if ihlaller:
        print("\nSONUC: %d kural ihlali. Uretim ENGELLENDI." % len(ihlaller), file=sys.stderr)
        sys.exit(2)  # Claude Code: kod 2 -> blokla + stderr'i asistana ilet
    print("\nSONUC: Tum kurallar gecti. ✓")
    sys.exit(0)

if __name__ == "__main__":
    main()
