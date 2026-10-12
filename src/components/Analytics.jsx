"use client";

/**
 * Google Analytics 4 - yayın ölçümü (çerez iznine bağlı).
 * ---------------------------------------------------------------------------
 * İki kök düzen (app/(tr) ve app/(en)/en) var ve ikisi de aynı ölçümü yapar;
 * aksi halde İngilizce trafik raporda görünmez.
 *
 * ÖNEMLİ — ölçüm, ziyaretçinin çerez iznine bağlıdır:
 *   Betik, izin "kabul" edilene kadar HİÇ yüklenmez. Türkiye Avrupa Ekonomik
 *   Alanı içindedir ve Google, onaysız mülklerde veri toplamayı kısıtlar.
 *   Ölçüm: onay yokken istek gidiyordu (HTTP 204) ama rapor "veri yok"
 *   gösteriyordu. İzin gelince doğru şekilde işlemeye başlar.
 *   İzin reddedilirse ölçüm hiç kurulmaz; site tamamen çalışmaya devam eder.
 *
 * NASIL AÇILIR:
 *   1. analytics.google.com -> Yönetici -> Mülk oluştur -> Web
 *   2. Mülk adı ve web sitesi adresi girin
 *   3. "Ölçüm Kimliği" (Measurement ID) kopyalayın; G-XXXXXXX biçimindedir
 *      (Dikkat: "Mülk Kimliği" (UA-…) değil, "Ölçüm Kimliği"dir.)
 *   4. Vercel -> proje -> Settings -> Environment Variables
 *      NEXT_PUBLIC_GA_ID = G-XXXXXXX   (Production ve Preview için ekleyin)
 *   5. Yeniden dağıtın.
 *
 * Yönetim paneli (/admin) ve 404 sayfası bilerek ÖLÇÜLMEZ: panel trafiği
 * raporu kirlendirir, hata sayfası ise tek seferlik bir görüntülemedir.
 *
 * Tek seferlik olaylar (ör. form gönderimi) src/lib/olayGonder.js üzerinden
 * gönderilir; oradaki gerekçe o fonksiyonun yalnızca istemcide çalışmasıyla
 * ilgilidir.
 */

import { useEffect, useState } from "react";
import Script from "next/script";
import { izinVar, IZIN_DEGISTI } from "../lib/ceerez";

/** Ölçüm kimliği. Tanımlı değilse bileşe hiçbir şey basmaz. */
const ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  // null = henüz bilinmiyor (sunucu ve ilk render). false = izin yok.
  const [izin, setIzin] = useState(null);

  useEffect(() => {
    if (!ID) return;

    const uygula = () => setIzin(izinVar());
    uygula();

    // Onay bandında karar verildiğinde anında yüklemeye başla; kullanıcı
    // sayfayı yenilemek zorunda kalmasın.
    window.addEventListener(IZIN_DEGISTI, uygula);
    window.addEventListener("storage", uygula);
    return () => {
      window.removeEventListener(IZIN_DEGISTI, uygula);
      window.removeEventListener("storage", uygula);
    };
  }, []);

  if (!ID) return null;
  if (izin !== true) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ID}`}
        strategy="afterInteractive"
      />
      <Script id="genco-ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}