"use client";

/**
 * Google Analytics 4 - onay durumu yönetimi (Google Consent Mode v2).
 * ---------------------------------------------------------------------------
 * Etiketin kendisi artık SUNUCUDA `<head>` içine yazılıyor
 * (bkz. src/lib/gaOnay.js ve iki kök düzen). Buradaki görev tek şey:
 * ziyaretçinin kararını Google'a bildirmek.
 *
 * ---------------------------------------------------------------------------
 * NEN YALNIZCA BU BİLEŞEN İŞ YAPIYOR
 * ---------------------------------------------------------------------------
 * Ölçülen sorun: `next/script` + `afterInteractive` ile basılan etiket
 * sunucu HTML'inde görünmüyordu, yalnızca çalışma anında DOM'a ekleniyordu.
 * Google Tag Assistant sayfayı indirip HTML'i taradığı için etiketi
 * "algılanmadı" diye bildiriyordu. Doğru çözüm, snippet'i doğrudan `<head>`
 * içine yazmaktı - etiket artık burada değil, orada.
 *
 * ---------------------------------------------------------------------------
 * AKIS
 * ---------------------------------------------------------------------------
 *   Sayfa yüklenir  → gtag('consent','default', { hepsi denied })
 *   Ziyaretçi izin verir → gtag('consent','update', { analytics_storage:'granted' })
 *   Ziyaretçi reddeder  → sinyaller 'denied' kalır
 *
 * Google, Avrupa Ekonomik Alanı'ndaki mülklerde yalnızca onay sinyali
 * gönderilmiş veriyi işler. Onay olmadan istekler gidebilir (HTTP 204)
 * ama raporda görünmez; ölçülen sorun buydu.
 *
 * Reddetmek analizi kapatır: çerez yazılmaz, yalnızca boş ping gider.
 * Gizlilik açısından en doğru davranıştır.
 *
 * Bu davranış KVKK içindir: analiz çerezleri kişisel veridir ve onaysız
 * saklanamaz.
 */

import { useEffect } from "react";
import { izinVar, izinDegisti } from "../lib/ceerez";
import { GA_ID } from "../lib/gaOnay";

export default function Analytics() {
  useEffect(() => {
    // Etiket `<head>`'de sunucu tarafında yüklendiği için window.gtag
    // burada hazır olmalıdır; yine de savunmacı kontrol yapılır.
    if (!GA_ID || typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;

    const sinyal = () => {
      window.gtag("consent", "update", {
        analytics_storage: izinVar() ? "granted" : "denied",
      });
    };

    sinyal();
    window.addEventListener(izinDegisti, sinyal);
    window.addEventListener("storage", sinyal);
    return () => {
      window.removeEventListener(izinDegisti, sinyal);
      window.removeEventListener("storage", sinyal);
    };
  }, []);

  // Görünür öğe basmaz: etiket zaten `<head>` içinde.
  return null;
}
