"use client";

/**
 * Hareketli sayaç — görüntü alındığında sayı yukarı doğru akar.
 * ---------------------------------------------------------------------------
 * Amaç: rakamları sonuna kadar değil, ara noktalarda göstermek. Dikkat
 * çeker ve "ölçek duygusu" verir; sitedeki rakamlar zaten panelden
 * düzenlenebilir.
 *
 * ---------------------------------------------------------------------------
 * KAYNAK METİN NEDEN AYNI KALIYOR
 * ---------------------------------------------------------------------------
 * Sunucu HTML'i sayının SON değerini yazar (React state'i başta hedefe
 * eşit kurulur), animasyon yalnızca görüntülenip JavaScript çalıştığında
 * devreye girer. Bunun iki nedeni var:
 *   1. Google boş sayaç görmez — sayıyı indeksler.
 *   2. JavaScript çalışmazsa (JS hatası, erken çıkış) sayı yine durur.
 * Phoenix Group'un sayfası da aynı yaklaşımı kullanıyor: rakam HTML'de
 * düz metin olarak durur, girişte animasyon JS ile devreye girer.
 *
 * ---------------------------------------------------------------------------
 * HAREKET AZALTMA
 * ---------------------------------------------------------------------------
 * `prefers-reduced-motion: reduce` tercih eden kullanıcılar için animasyon
 * hiç başlamaz, sayı doğrudan hedefte durur. Bu bir erişilebilirlik
 * gerekliliğidir; sadece tercih değil.
 */

import { useEffect, useRef, useState } from "react";

/**
 * @param {string} value      Panelden gelen metin; "1000+", "48+" gibi.
 *                            Rakam içermiyorsa animasyon yapılmaz.
 * @param {number} sure       Animasyon süresi (ms). Varsayılan 1400.
 */
export default function HareketliSayaci({ value, sure = 1400 }) {
  const [gosterilen, setGosterilen] = useState(value);
  const kutuRef = useRef(null);

  // "1000+" -> { hedef: 1000, onek: "", sonek: "+", ondalik: 0 }
  const ayristir = (metin) => {
    const s = String(metin ?? "");
    const sayi = s.match(/\d+/);
    if (!sayi) return null;
    const bas = s.indexOf(sayi[0]);
    return {
      onek: s.slice(0, bas),
      sonek: s.slice(bas + sayi[0].length),
      hedef: parseInt(sayi[0], 10),
      // 1.234 gibi yazılanlarda nokta varsa ondalık basamak sayılır.
      ondalik: /[.,]/.test(sayi[0]) ? (sayi[0].length - sayi[0].replace(/[^.,]/g, "").length + 1) : 0,
      grupla: /[.,]/.test(sayi[0]),
    };
  };

  useEffect(() => {
    const cozumlenmis = ayristir(value);
    if (!cozumlenmis || cozumlenmis.hedef === 0) {
      setGosterilen(value);
      return;
    }

    const el = kutuRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setGosterilen(value);
      return;
    }

    // Hareket azaltma tercihi: animasyon yok, doğrudan hedef.
    const azalt = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (azalt?.matches) {
      setGosterilen(value);
      return;
    }

    let animId = null;
    let baslangic = null;

    const ciz = (zaman) => {
      if (baslangic === null) baslangic = zaman;
      const gecen = zaman - baslangic;
      const oran = Math.min(1, gecen / sure);
      // Yumuşak bitiş: hızlanan değil, yavaşlayan animasyon.
      const yumusak = 1 - Math.pow(1 - oran, 3);
      const an = Math.round(cozumlenmis.hedef * yumusak);
      setGosterilen(
        cozumlenmis.onek +
          (cozumlenmis.grupla ? an.toLocaleString("tr-TR") : String(an)) +
          cozumlenmis.sonek
      );
      if (oran < 1) animId = requestAnimationFrame(ciz);
    };

    const gozlemci = new IntersectionObserver(
      (girisler) => {
        girisler.forEach((g) => {
          if (g.isIntersecting) {
            animId = requestAnimationFrame(ciz);
            gozlemci.disconnect(); // bir kez çalışsın
          }
        });
      },
      { threshold: 0.35 }
    );
    gozlemci.observe(el);

    return () => {
      gozlemci.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, sure]);

  return (
    <span ref={kutuRef} className="tabular-nums">
      {gosterilen}
    </span>
  );
}
