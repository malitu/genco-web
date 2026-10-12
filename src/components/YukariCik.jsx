"use client";

/**
 * Başa dön düğmesi
 * ---------------------------------------------------------------------------
 * Sayfa aşağı kaydırıldığında sağ altta belirir; tıklanınca yumuşak biçimde
 * en üste döner.
 *
 * Neden istemci bileşeni: kaydırma konumu yalnızca tarayıcıda bilinir. Sunucu
 * tarafında "kaydırılmış mı" sorusu sorulamaz; bu yüzden ilk render'da düğme
 * gizli basılır ve etkileşim başlayınca görünür olur.
 *
 * Erişilebilirlik:
 *   • Gerçek bir <button> — klavyeyle odaklanabilir, Enter/Space çalışır
 *   • aria-label iki dilli (TR/EN)
 *   • Görünürlük durumu aria-hidden ile bildirilmez; düğme DOM'da kalır ama
 *     opacity-0 + pointer-events-none ile etkileşime kapalı olur, bu yüzden
 *     ekran okuyucu onu "duyulabilir ama kullanılamaz" olarak doğru okur
 *   • prefers-reduced-motion tercihine saygı gösterilir: hareketi azaltmış
 *     kullanıcılar için anında üste atlanır
 */

import { useEffect, useState } from "react";

/** Düğmenin görünmesi için gereken kaydırma mesafesi (piksel). */
const ESIK = 400;

export default function YukariCik({ lang = "TR" }) {
  const [gorunur, setGorunur] = useState(false);

  useEffect(() => {
    const kontrol = () => {
      // iOS'ta kaydırma sırasında konum geçici olarak 0 dönebilir; bu yüzden
      // "şu anda en üstte miyiz" sorusuna bakıyoruz.
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setGorunur(y > ESIK);
    };

    kontrol();
    // passive: true -> kaydırmayı yavaşlatmaz, sadece okuma yapar
    window.addEventListener("scroll", kontrol, { passive: true });
    window.addEventListener("resize", kontrol);
    return () => {
      window.removeEventListener("scroll", kontrol);
      window.removeEventListener("resize", kontrol);
    };
  }, []);

  function tıkla() {
    const hareketAzaltilmis = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({ top: 0, behavior: hareketAzaltilmis ? "auto" : "smooth" });

    // Klavyeyle gelen kullanıcı için düğmenin kaybolmasını beklemeyelim:
    // odak sayfa başına taşınır, en üstteki içerik okunabilir olur.
    document.body.focus?.({ preventScroll: true });
  }

  const etiket = lang === "EN" ? "Back to top" : "Başa dön";

  return (
    <button
      type="button"
      onClick={tıkla}
      aria-label={etiket}
      title={etiket}
      data-testid="yukari-cik"
      className={[
        "fixed bottom-6 right-4 sm:right-6 z-[60]",
        "inline-flex h-12 w-12 items-center justify-center rounded-full",
        "bg-slate-900 text-white shadow-lg",
        "transition-all duration-300 ease-out",
        "hover:bg-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]",
        "focus-visible:ring-offset-2 focus-visible:outline-none",
        gorunur
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "pointer-events-none translate-y-3 opacity-0",
      ].join(" ")}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}