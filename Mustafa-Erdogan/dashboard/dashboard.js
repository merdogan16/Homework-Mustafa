/* =====================================================================
   VALEO · Hat Verimi & OEE Panosu — dashboard mantigi
   - Veri AYRIK katmandan okunur (window.VALEO_OEE_VERI); koda gomulu DEGIL.
   - OEE ham kolonlardan hesaplanir (Kullanilabilirlik x Performans x Kalite).
   - Inline stil/script yok; tum stil stil.css'ten gelir.
   - Bos / hata / yuklenme durumlari ele alinir.
   ===================================================================== */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  /* ---------------- Bicimlendirme (Kalici Talimat) ---------------- */
  // Binlik ayrac nokta; ondalik virgul (tr-TR).
  function sayi(n) {
    if (n == null || isNaN(n)) return "—";
    return Math.round(n).toLocaleString("tr-TR");
  }
  // Para: binlik nokta, ondaliksiz, sembol sonda -> "1.250.000 ₺"
  function tl(n) {
    if (n == null || isNaN(n)) return "—";
    return Math.round(n).toLocaleString("tr-TR") + " ₺";
  }
  // Yuzde: sembol onde, tek ondalik -> "%75,3"
  function yuzde(oran, ondalik) {
    if (oran == null || isNaN(oran)) return "—";
    var d = ondalik == null ? 1 : ondalik;
    return "%" + (oran * 100).toFixed(d).replace(".", ",");
  }
  function tarihTR(d) {
    if (!(d instanceof Date) || isNaN(d)) return "—";
    var g = String(d.getDate()).padStart(2, "0");
    var a = String(d.getMonth() + 1).padStart(2, "0");
    return g + "." + a + "." + d.getFullYear();
  }

  /* ---------------- DOM yardimcilari ---------------- */
  function el(id) { return document.getElementById(id); }
  function temizle(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function svg(tag, attrs) {
    var e = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    return e;
  }
  function ekle(parent, tag, sinif, metin) {
    var e = document.createElement(tag);
    if (sinif) e.className = sinif;
    if (metin != null) e.textContent = metin;
    parent.appendChild(e);
    return e;
  }

  /* ---------------- Sabitler ---------------- */
  var META = window.VALEO_OEE_META || {};
  var HEDEF = META.oeeHedef || 0.85;
  var MALIYET_DK = META.durusMaliyetiTLperDk || 0; // TL / durus dakikasi

  /* ---------------- Durum (state) ---------------- */
  var filtreler = { hat: "hepsi", vardiya: "hepsi", aralik: "30", test: "normal" };
  var aktifEkran = "e1";

  /* ---------------- Veri okuma + dogrulama ---------------- */
  // Demo/dogrulama icin veri senaryosu: normal / bos / bozuk (Dogrulama Senaryo #2)
  function hamVeri() {
    var kaynak = window.VALEO_OEE_VERI;
    if (!Array.isArray(kaynak)) return null; // hata
    if (filtreler.test === "bos") return [];
    if (filtreler.test === "bozuk") {
      // Gercek veriye birkac bozuk satir enjekte et — pano cokmemeli
      var bozuk = kaynak.slice(0, 20).map(function (r) { return r; });
      bozuk.push({ "Tarih": "", "Hat": null, "Vardiya": "Vardiya-1", "Planli Sure (dk)": 0,
        "Durus Suresi (dk)": "abc", "Durus Nedeni": "", "Uretim Adedi": null,
        "Hatali Adet": -5, "Cevrim Suresi (sn)": 0 });
      bozuk.push({ "Tarih": "GEÇERSIZ" });
      return bozuk;
    }
    return kaynak;
  }

  // Ham satiri normalize et + OEE bilesenlerini hesapla. Gecersizse null.
  function hesapla(r) {
    if (!r) return null;
    var planli = Number(r["Planli Sure (dk)"]);
    var durus = Number(r["Durus Suresi (dk)"]);
    var uretim = Number(r["Uretim Adedi"]);
    var hatali = Number(r["Hatali Adet"]);
    var cevrim = Number(r["Cevrim Suresi (sn)"]);
    var tarih = new Date(r["Tarih"]);

    // Dogrulama: gecersiz/eksik satirlari sessizce ele (pano cokmez)
    if (!r["Tarih"] || isNaN(tarih)) return null;
    if (!isFinite(planli) || planli <= 0) return null;
    if (!isFinite(durus) || durus < 0) durus = 0;
    if (durus > planli) durus = planli;
    if (!isFinite(uretim) || uretim < 0) uretim = 0;
    if (!isFinite(hatali) || hatali < 0) hatali = 0;
    if (hatali > uretim) hatali = uretim;
    if (!isFinite(cevrim) || cevrim <= 0) cevrim = NaN;

    var calismaDk = planli - durus;
    var calismaSn = calismaDk * 60;
    var kullanilabilirlik = planli > 0 ? calismaDk / planli : 0;
    var performans = (calismaSn > 0 && isFinite(cevrim)) ? Math.min((cevrim * uretim) / calismaSn, 1) : 0;
    var kalite = uretim > 0 ? (uretim - hatali) / uretim : 0;
    var oee = kullanilabilirlik * performans * kalite;

    return {
      tarih: tarih,
      hat: r["Hat"] || "—",
      vardiya: r["Vardiya"] || "—",
      planli: planli, durus: durus,
      neden: r["Durus Nedeni"] || "Diger",
      uretim: uretim, hatali: hatali, iyi: uretim - hatali, cevrim: cevrim,
      calismaDk: calismaDk,
      kullanilabilirlik: kullanilabilirlik,
      performans: performans,
      kalite: kalite,
      oee: oee,
      durusMaliyeti: durus * MALIYET_DK
    };
  }

  function tumKayitlar() {
    var ham = hamVeri();
    if (ham === null) return null; // veri katmani yok -> hata
    var out = [];
    for (var i = 0; i < ham.length; i++) {
      var h = hesapla(ham[i]);
      if (h) out.push(h);
    }
    return out;
  }

  /* ---------------- Donem dilimleme (mevcut vs onceki) ---------------- */
  function maksTarih(kayitlar) {
    var m = null;
    for (var i = 0; i < kayitlar.length; i++) {
      if (!m || kayitlar[i].tarih > m) m = kayitlar[i].tarih;
    }
    return m;
  }
  function gunFarki(a, b) { return Math.round((a - b) / 86400000); }

  // Hat/Vardiya filtresi uygula
  function alanFiltre(kayitlar) {
    return kayitlar.filter(function (k) {
      if (filtreler.hat !== "hepsi" && k.hat !== filtreler.hat) return false;
      if (filtreler.vardiya !== "hepsi" && k.vardiya !== filtreler.vardiya) return false;
      return true;
    });
  }

  // Mevcut ve onceki donem kayitlarini dondur
  function donemler(kayitlar) {
    var f = alanFiltre(kayitlar);
    if (filtreler.aralik === "tum" || f.length === 0) {
      return { mevcut: f, onceki: [], gun: null };
    }
    var n = parseInt(filtreler.aralik, 10);
    var son = maksTarih(f);
    var mevcut = [], onceki = [];
    for (var i = 0; i < f.length; i++) {
      var fark = gunFarki(son, f[i].tarih);
      if (fark >= 0 && fark < n) mevcut.push(f[i]);
      else if (fark >= n && fark < 2 * n) onceki.push(f[i]);
    }
    return { mevcut: mevcut, onceki: onceki, gun: n };
  }

  /* ---------------- Toplulastirma (dogru yontem: toplamlardan) ---------------- */
  function topla(kayitlar) {
    var t = { planli: 0, durus: 0, calismaDk: 0, uretim: 0, iyi: 0, calismaSnIdeal: 0, satir: kayitlar.length, maliyet: 0 };
    for (var i = 0; i < kayitlar.length; i++) {
      var k = kayitlar[i];
      t.planli += k.planli;
      t.durus += k.durus;
      t.calismaDk += k.calismaDk;
      t.uretim += k.uretim;
      t.iyi += k.iyi;
      t.maliyet += k.durusMaliyeti;
      if (isFinite(k.cevrim)) t.calismaSnIdeal += k.cevrim * k.uretim; // ideal uretim suresi (sn)
    }
    t.kullanilabilirlik = t.planli > 0 ? t.calismaDk / t.planli : 0;
    var calismaSn = t.calismaDk * 60;
    t.performans = calismaSn > 0 ? Math.min(t.calismaSnIdeal / calismaSn, 1) : 0;
    t.kalite = t.uretim > 0 ? t.iyi / t.uretim : 0;
    t.oee = t.kullanilabilirlik * t.performans * t.kalite;
    return t;
  }

  /* ---------------- Durum siniflandirma ---------------- */
  function oeeDurum(oee) {
    if (oee >= HEDEF) return { sinif: "iyi", etiket: "Hedef Üstü", ikon: "▲" };
    if (oee >= 0.65) return { sinif: "uyari", etiket: "İzlemede", ikon: "●" };
    return { sinif: "kotu", etiket: "Hedef Altı", ikon: "▼" };
  }

  /* ===================================================================
     E1 — Özet / KPI
     =================================================================== */
  function renderE1(d) {
    var govde = el("e1-govde");
    temizle(govde);
    if (d.mevcut.length === 0) { ekranBos(govde, "Seçilen filtre için veri yok."); return; }

    var izgara = ekle(govde, "div", "kpi-izgara");
    var m = topla(d.mevcut);
    var o = d.onceki.length ? topla(d.onceki) : null;

    function kart(baslik, deger, altMetin, oran, oncekiOran, durumSinifi, tersYon) {
      var durum = durumSinifi || (oran != null ? oeeDurum(oran).sinif : null);
      var k = ekle(izgara, "div", "kpi-kart" + (durum ? " " + durum : ""));
      ekle(k, "div", "kpi-baslik", baslik);
      ekle(k, "div", "kpi-deger", deger);
      if (altMetin) ekle(k, "div", "kpi-alt", altMetin);
      if (o && oncekiOran != null && oran != null) {
        var fark = (oran - oncekiOran) * 100;
        var yon = fark > 0.05 ? "arti" : (fark < -0.05 ? "eksi" : "notr");
        // Maliyet/duruslar icin artis KOTU -> renk yonunu ters cevir
        if (tersYon && yon !== "notr") yon = (yon === "arti" ? "eksi" : "arti");
        var ok = fark > 0.05 ? "▲" : (fark < -0.05 ? "▼" : "▬");
        ekle(k, "div", "kpi-delta " + yon,
          ok + " " + (fark >= 0 ? "+" : "") + fark.toFixed(1).replace(".", ",") + " puan (önceki döneme göre)");
      }
    }

    kart("OEE", yuzde(m.oee), "Hedef: " + yuzde(HEDEF, 0), m.oee, o ? o.oee : null);
    kart("Kullanılabilirlik", yuzde(m.kullanilabilirlik), "Çalışma / Planlı süre",
      m.kullanilabilirlik, o ? o.kullanilabilirlik : null, durumBandi(m.kullanilabilirlik, 0.90, 0.80));
    kart("Performans", yuzde(m.performans), "Çevrim hızı verimi",
      m.performans, o ? o.performans : null, durumBandi(m.performans, 0.90, 0.80));
    kart("Kalite", yuzde(m.kalite), "Sağlam / Toplam üretim",
      m.kalite, o ? o.kalite : null, durumBandi(m.kalite, 0.99, 0.97));
    // Duruş oranı: ARTIŞ kötü (tersYon) -> oran düşerse yeşil, yükselirse kırmızı
    kart("Toplam Duruş", sayi(m.durus) + " dk", sayi(m.satir) + " kayıt · " + sayi(m.uretim) + " adet üretim",
      o ? (m.durus / (m.planli || 1)) : null, o ? (o.durus / (o.planli || 1)) : null, "notr-kart", true);
    kart("Tahmini Duruş Maliyeti", tl(m.maliyet), "Varsayım: " + tl(MALIYET_DK) + " / duruş dk",
      null, null, "notr-kart");

    if (!o) {
      var not = ekle(govde, "div", "grafik-okuma");
      not.innerHTML = "Karşılaştırma için <strong>belirli bir dönem</strong> seçin (Son 7/14/30 gün). 'Tüm dönem'de önceki dönem yoktur.";
    }
  }
  // Banttan durum sinifi (>=iyiEsik iyi, >=uyariEsik uyari, alti kotu)
  function durumBandi(deger, iyiEsik, uyariEsik) {
    if (deger >= iyiEsik) return "iyi";
    if (deger >= uyariEsik) return "uyari";
    return "kotu";
  }

  /* ===================================================================
     E2 — Trend (zaman serisi; mavi = mevcut, gri = onceki donem)
     =================================================================== */
  function gunlukOEE(kayitlar) {
    // Gune gore topla -> [{tarih, oee}]
    var harita = {};
    for (var i = 0; i < kayitlar.length; i++) {
      var k = kayitlar[i];
      var anahtar = k.tarih.toISOString().slice(0, 10);
      (harita[anahtar] = harita[anahtar] || []).push(k);
    }
    var liste = Object.keys(harita).sort().map(function (g) {
      return { tarih: new Date(g), oee: topla(harita[g]).oee };
    });
    return liste;
  }

  function renderE2(d) {
    var tuval = el("e2-tuval");
    temizle(tuval);
    el("e2-okuma").textContent = "";
    if (d.mevcut.length === 0) { ekranBos(tuval, "Trend için veri yok."); return; }

    var mevcut = gunlukOEE(d.mevcut);
    var onceki = gunlukOEE(d.onceki);

    var W = 900, H = 380, sol = 48, sag = 16, ust = 16, alt = 40;
    var s = svg("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "none" });
    var ix = W - sol - sag, iy = H - ust - alt;

    function px(i, n) { return sol + (n <= 1 ? ix / 2 : (i / (n - 1)) * ix); }
    function py(v) { return ust + (1 - v) * iy; }

    // Y izgara + etiket (0..100%)
    for (var g = 0; g <= 4; g++) {
      var v = g / 4, y = py(v);
      s.appendChild(svg("line", { x1: sol, y1: y, x2: W - sag, y2: y, class: "izgara-cizgi" }));
      var ty = svg("text", { x: sol - 6, y: y + 3, "text-anchor": "end", class: "eksen-yazi" });
      ty.textContent = "%" + (v * 100).toFixed(0);
      s.appendChild(ty);
    }
    // Hedef cizgisi
    var hy = py(HEDEF);
    s.appendChild(svg("line", { x1: sol, y1: hy, x2: W - sag, y2: hy, class: "hedef-cizgi" }));
    var ht = svg("text", { x: W - sag, y: hy - 4, "text-anchor": "end", class: "hedef-yazi" });
    ht.textContent = "Hedef " + yuzde(HEDEF, 0);
    s.appendChild(ht);

    // X etiketleri (seyrek)
    var nmax = mevcut.length;
    var adim = Math.max(1, Math.floor(nmax / 6));
    for (var i = 0; i < nmax; i += adim) {
      var x = px(i, nmax);
      var tx = svg("text", { x: x, y: H - alt + 16, "text-anchor": "middle", class: "eksen-yazi" });
      tx.textContent = tarihTR(mevcut[i].tarih).slice(0, 5);
      s.appendChild(tx);
    }

    // Onceki donem (gri, kesikli) — gun indexine gore hizalanir
    if (onceki.length) {
      var po = onceki.map(function (p, i) { return px(i, Math.max(nmax, onceki.length)) + "," + py(p.oee); }).join(" ");
      s.appendChild(svg("polyline", { points: po, class: "cizgi-onceki" }));
    }

    // Mevcut donem alani + cizgi
    var ptsArr = mevcut.map(function (p, i) { return { x: px(i, nmax), y: py(p.oee) }; });
    var alanPts = ptsArr.map(function (p) { return p.x + "," + p.y; }).join(" ");
    var taban = py(0);
    s.appendChild(svg("polygon", {
      points: ptsArr[0].x + "," + taban + " " + alanPts + " " + ptsArr[ptsArr.length - 1].x + "," + taban,
      class: "alan-mevcut"
    }));
    s.appendChild(svg("polyline", { points: alanPts, class: "cizgi-mevcut" }));

    // Noktalar + hover okuma (konumlu tooltip yok)
    ptsArr.forEach(function (p, i) {
      var gor = svg("circle", { cx: p.x, cy: p.y, r: 2.5, class: "nokta-mevcut" });
      s.appendChild(gor);
      // Genis seffaf hedef (hover kolayligi)
      var hit = svg("circle", { cx: p.x, cy: p.y, r: 9, fill: "#ffffff", "fill-opacity": "0" });
      hit.addEventListener("mouseenter", (function (idx) {
        return function () {
          var nokta = mevcut[idx];
          el("e2-okuma").innerHTML = "<strong>" + tarihTR(nokta.tarih) + "</strong> — OEE: <strong>" +
            yuzde(nokta.oee) + "</strong>" + (nokta.oee < HEDEF ? " (hedefin altında)" : "");
        };
      })(i));
      s.appendChild(hit);
    });

    tuval.appendChild(s);
  }

  /* ===================================================================
     E3 — Kırılım / Pareto (durus nedeni) + Hat bazinda OEE
     =================================================================== */
  function renderE3(d) {
    paretoCiz(el("e3-pareto"), d.mevcut);
    hatCiz(el("e3-hat"), d.mevcut);
  }

  function paretoCiz(tuval, kayitlar) {
    temizle(tuval);
    if (kayitlar.length === 0) { ekranBos(tuval, "Pareto için veri yok."); return; }
    // Nedene gore durus dakikasi
    var harita = {};
    var toplam = 0;
    kayitlar.forEach(function (k) {
      if (k.durus > 0) { harita[k.neden] = (harita[k.neden] || 0) + k.durus; toplam += k.durus; }
    });
    var liste = Object.keys(harita).map(function (n) { return { ad: n, deger: harita[n] }; })
      .sort(function (a, b) { return b.deger - a.deger; });
    if (liste.length === 0 || toplam === 0) { ekranBos(tuval, "Bu dönemde duruş kaydı yok."); return; }

    var W = 560, H = 360, sol = 44, sag = 44, ust = 16, alt = 96;
    var s = svg("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "none" });
    var ix = W - sol - sag, iy = H - ust - alt;
    var maxDeger = liste[0].deger;
    var barGen = ix / liste.length * 0.6;
    var adim = ix / liste.length;

    // Sol Y (dakika) izgara
    for (var g = 0; g <= 4; g++) {
      var v = g / 4, y = ust + (1 - v) * iy;
      s.appendChild(svg("line", { x1: sol, y1: y, x2: W - sag, y2: y, class: "izgara-cizgi" }));
      var ty = svg("text", { x: sol - 6, y: y + 3, "text-anchor": "end", class: "eksen-yazi" });
      ty.textContent = sayi(maxDeger * v);
      s.appendChild(ty);
    }
    // %80 referans (sag eksen)
    var y80 = ust + (1 - 0.8) * iy;
    s.appendChild(svg("line", { x1: sol, y1: y80, x2: W - sag, y2: y80, class: "hedef-cizgi" }));
    var t80 = svg("text", { x: W - sag + 4, y: y80 + 3, "text-anchor": "start", class: "hedef-yazi" });
    t80.textContent = "%80";
    s.appendChild(t80);

    var kumulatif = 0;
    var kumNoktalar = [];
    liste.forEach(function (it, i) {
      var x = sol + i * adim + (adim - barGen) / 2;
      var h = (it.deger / maxDeger) * iy;
      var y = ust + iy - h;
      s.appendChild(svg("rect", { x: x, y: y, width: barGen, height: h, class: "bar-mevcut" }));
      // Deger etiketi
      var dv = svg("text", { x: x + barGen / 2, y: y - 4, "text-anchor": "middle", class: "bar-yazi" });
      dv.textContent = sayi(it.deger);
      s.appendChild(dv);
      // Kategori etiketi (dondurulmus)
      var lab = svg("text", { x: x + barGen / 2, y: ust + iy + 12, "text-anchor": "end", class: "eksen-yazi",
        transform: "rotate(-35 " + (x + barGen / 2) + " " + (ust + iy + 12) + ")" });
      lab.textContent = it.ad;
      s.appendChild(lab);
      // Kumulatif
      kumulatif += it.deger;
      var oran = kumulatif / toplam;
      kumNoktalar.push({ x: sol + i * adim + adim / 2, y: ust + (1 - oran) * iy, oran: oran });
    });

    // Kumulatif cizgi + noktalar
    s.appendChild(svg("polyline", { points: kumNoktalar.map(function (p) { return p.x + "," + p.y; }).join(" "), class: "kumulatif-cizgi" }));
    kumNoktalar.forEach(function (p, i) {
      s.appendChild(svg("circle", { cx: p.x, cy: p.y, r: 3, class: "kumulatif-nokta" }));
      var ct = svg("text", { x: p.x, y: p.y - 6, "text-anchor": "middle", class: "eksen-yazi" });
      ct.textContent = yuzde(p.oran, 0);
      s.appendChild(ct);
    });

    tuval.appendChild(s);

    // En etkili nedenler (80/20) — okuma satiri
    var esik = kumNoktalar.findIndex(function (p) { return p.oran >= 0.8; });
    var sayisi = esik < 0 ? liste.length : esik + 1;
    var enler = liste.slice(0, sayisi).map(function (x) { return x.ad; }).join(", ");
    el("e3-okuma").innerHTML = "Toplam duruşun <strong>%80</strong>'i ilk <strong>" + sayisi +
      "</strong> nedenden geliyor: <strong>" + enler + "</strong>. Aksiyon önceliği bunlar.";
  }

  function hatCiz(tuval, kayitlar) {
    temizle(tuval);
    if (kayitlar.length === 0) { ekranBos(tuval, "Hat kırılımı için veri yok."); return; }
    var hatlar = {};
    kayitlar.forEach(function (k) { (hatlar[k.hat] = hatlar[k.hat] || []).push(k); });
    var liste = Object.keys(hatlar).sort().map(function (h) { return { ad: h, oee: topla(hatlar[h]).oee }; });

    var W = 320, H = 360, sol = 40, sag = 16, ust = 16, alt = 40;
    var s = svg("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "none" });
    var ix = W - sol - sag, iy = H - ust - alt;
    var adim = ix / liste.length;
    var barGen = adim * 0.55;

    for (var g = 0; g <= 4; g++) {
      var v = g / 4, y = ust + (1 - v) * iy;
      s.appendChild(svg("line", { x1: sol, y1: y, x2: W - sag, y2: y, class: "izgara-cizgi" }));
      var ty = svg("text", { x: sol - 6, y: y + 3, "text-anchor": "end", class: "eksen-yazi" });
      ty.textContent = "%" + (v * 100).toFixed(0);
      s.appendChild(ty);
    }
    var hy = ust + (1 - HEDEF) * iy;
    s.appendChild(svg("line", { x1: sol, y1: hy, x2: W - sag, y2: hy, class: "hedef-cizgi" }));

    liste.forEach(function (it, i) {
      var x = sol + i * adim + (adim - barGen) / 2;
      var h = it.oee * iy;
      var y = ust + iy - h;
      var durum = oeeDurum(it.oee);
      s.appendChild(svg("rect", { x: x, y: y, width: barGen, height: h, class: "bar-" + durum.sinif }));
      var dv = svg("text", { x: x + barGen / 2, y: y - 4, "text-anchor": "middle", class: "bar-yazi" });
      dv.textContent = yuzde(it.oee, 0);
      s.appendChild(dv);
      var lab = svg("text", { x: x + barGen / 2, y: ust + iy + 16, "text-anchor": "middle", class: "eksen-yazi" });
      lab.textContent = it.ad;
      s.appendChild(lab);
    });
    tuval.appendChild(s);
  }

  /* ===================================================================
     E4 — Detay / Aksiyon (tablo)
     =================================================================== */
  function renderE4(d) {
    var govde = el("e4-govde");
    temizle(govde);
    if (d.mevcut.length === 0) { ekranBos(govde, "Detay için veri yok."); return; }

    var sarmal = ekle(govde, "div", "tablo-sarmal");
    var t = ekle(sarmal, "table");
    var thead = ekle(t, "thead");
    var tr = ekle(thead, "tr");
    var basliklar = ["Tarih", "Hat", "Vardiya", "OEE", "Kull.", "Perf.", "Kalite", "Duruş (dk)", "Duruş Nedeni", "Durum", "Aksiyon"];
    basliklar.forEach(function (b, i) {
      var th = ekle(tr, "th", i >= 3 && i <= 7 ? "sag" : null, b);
    });
    var tbody = ekle(t, "tbody");

    // Tarihe gore azalan; ayni gunde OEE artan (once kotuler)
    var satirlar = d.mevcut.slice().sort(function (a, b) {
      if (b.tarih - a.tarih !== 0) return b.tarih - a.tarih;
      return a.oee - b.oee;
    });

    satirlar.forEach(function (k) {
      var row = ekle(tbody, "tr");
      ekle(row, "td", null, tarihTR(k.tarih));
      ekle(row, "td", null, k.hat);
      ekle(row, "td", null, k.vardiya);
      ekle(row, "td", "sag", yuzde(k.oee));
      ekle(row, "td", "sag", yuzde(k.kullanilabilirlik));
      ekle(row, "td", "sag", yuzde(k.performans));
      ekle(row, "td", "sag", yuzde(k.kalite));
      ekle(row, "td", "sag", sayi(k.durus));
      ekle(row, "td", null, k.neden);
      var durum = oeeDurum(k.oee);
      var td = ekle(row, "td");
      var rozet = ekle(td, "span", "rozet " + durum.sinif);
      ekle(rozet, "span", "ikon", durum.ikon);
      rozet.appendChild(document.createTextNode(" " + durum.etiket));
      // Aksiyon: yalniz hedef alti satirlar icin
      var aks = k.oee < 0.65
        ? "Kök neden: " + k.neden + " → aksiyon planı aç"
        : (k.oee < HEDEF ? "İzle" : "—");
      ekle(row, "td", null, aks);
    });

    var ozet = ekle(govde, "div", "grafik-okuma");
    var kotuSayi = satirlar.filter(function (k) { return k.oee < 0.65; }).length;
    ozet.innerHTML = "<strong>" + sayi(satirlar.length) + "</strong> kayıt · Hedef altı (<%65): <strong>" +
      sayi(kotuSayi) + "</strong> · Hedef: " + yuzde(HEDEF, 0);
  }

  /* ---------------- Ekran ici bos durum ---------------- */
  function ekranBos(kap, mesaj) {
    var b = ekle(kap, "div", "ekran-bos");
    ekle(b, "div", "ikon-buyuk", "∅");
    ekle(b, "p", null, mesaj);
    ekle(b, "p", null, "Filtreleri gevşetin ya da 'Veri Senaryosu'nu Normal yapın.");
  }

  /* ---------------- Render orkestrasyonu ---------------- */
  function render() {
    var kayitlar = tumKayitlar();
    // Global hata durumu: veri katmani hic yok
    if (kayitlar === null) { durumGoster("hata"); return; }
    // Global bos durum: hic gecerli kayit yok (ornn. 'bos' senaryosu)
    if (kayitlar.length === 0) { durumGoster("bos"); return; }
    durumGoster(null);

    var d = donemler(kayitlar);
    renderE1(d);
    renderE2(d);
    renderE3(d);
    renderE4(d);

    // Son guncelleme + kapsam
    el("son-guncelleme").textContent = META.sonGuncelleme ? tarihTR(new Date(META.sonGuncelleme)) : "—";
    var kapsam = (filtreler.aralik === "tum" ? "Tüm dönem" : "Son " + filtreler.aralik + " gün") +
      " · Hat: " + (filtreler.hat === "hepsi" ? "Tümü" : filtreler.hat) +
      " · " + (filtreler.vardiya === "hepsi" ? "Tüm vardiyalar" : filtreler.vardiya);
    el("kapsam").textContent = kapsam;
  }

  function durumGoster(tip) {
    el("durum-yukleniyor").classList.add("gizli");
    el("durum-bos").classList.toggle("gizli", tip !== "bos");
    el("durum-hata").classList.toggle("gizli", tip !== "hata");
    el("ekran-kabi").classList.toggle("gizli", tip === "bos" || tip === "hata");
  }

  /* ---------------- Sekme gecisi ---------------- */
  function ekranGoster(id) {
    aktifEkran = id;
    ["e1", "e2", "e3", "e4"].forEach(function (e) {
      el("ekran-" + e).classList.toggle("gizli", e !== id);
      el("sekme-" + e).classList.toggle("aktif", e === id);
    });
  }

  /* ---------------- Filtre secenekleri + olaylar ---------------- */
  function filtreleriKur(kayitlar) {
    var hatlar = {}, vardiyalar = {};
    (kayitlar || []).forEach(function (k) { hatlar[k.hat] = 1; vardiyalar[k.vardiya] = 1; });
    secenekDoldur("f-hat", "Tüm hatlar", Object.keys(hatlar).sort());
    secenekDoldur("f-vardiya", "Tüm vardiyalar", Object.keys(vardiyalar).sort());
  }
  function secenekDoldur(id, hepsiEtiket, degerler) {
    var sel = el(id);
    temizle(sel);
    var o0 = ekle(sel, "option", null, hepsiEtiket); o0.value = "hepsi";
    degerler.forEach(function (v) { var o = ekle(sel, "option", null, v); o.value = v; });
  }

  function olaylariBagla() {
    el("f-hat").addEventListener("change", function (e) { filtreler.hat = e.target.value; render(); });
    el("f-vardiya").addEventListener("change", function (e) { filtreler.vardiya = e.target.value; render(); });
    el("f-aralik").addEventListener("change", function (e) { filtreler.aralik = e.target.value; render(); });
    el("f-test").addEventListener("change", function (e) { filtreler.test = e.target.value; render(); });
    ["e1", "e2", "e3", "e4"].forEach(function (id) {
      el("sekme-" + id).addEventListener("click", function () { ekranGoster(id); render(); });
    });
  }

  /* ---------------- Baslat ---------------- */
  function basla() {
    el("durum-yukleniyor").classList.remove("gizli");
    // Veri katmani yuklendi mi?
    var kayitlar = tumKayitlar();
    filtreleriKur(Array.isArray(window.VALEO_OEE_VERI) ? (kayitlar || []) : []);
    olaylariBagla();
    ekranGoster("e1");
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", basla);
  } else {
    basla();
  }
})();
