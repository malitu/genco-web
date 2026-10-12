"use client";

/**
 * Google Analytics 4 - yayın ölçümü (Google Consent Mode v2).
 * ---------------------------------------------------------------------------
 * İki kök düzen (app/(tr) ve app/(en)/en) var ve ikisi de aynı ölçümü yapar;
 * aksi halde İngilizce trafik raporda görünmez.
 *
 * ---------------------------------------------------------------------------
 * NEN SCRIPT KENDISI HER ZAMAN YUKLENIYOR (izne bagli degil)
 * ---------------------------------------------------------------------------
 * Google, Avrupa Ekonomik Alanı'ndaki mülklerde yalnızca "onay sinyali"
 * gönderilmiş veriyi kabul ediyor. Betik onaydan önce de yüklenir; ancak
 * hemen şu sinyal gönderilir:
 *
 *     gtag('consent','default', { analytics_storage: 'denied', ... })
 *
 * Ziyaretçi "Kabul et" derse:
 *
 *     gtag('consent','update', { analytics_storage: 'granted', ... })
 *
 * Ölçülen sorun: onay beklenirken betik hiç yüklenmiyordu; istekler gidiyor
 * (HTTP 204) ama rapor "veri yok" diyordu. Sebep, Google'ın EEA'da onay
 * sinyali olmayan veriyi işlememesiydi. Consent Mode ile sinyal gönderilir
 * ve veri işlenmeye başlar.
 *
 * "Reddet" seçilirse sinyal 'denied' kalır: yalnızca çerez tutulmaz,
 * boş ping gönderilir. Gizlilik açısından en doğru davranış budur.
 *
 * Bu davranış KVKK içindir: analiz çerezleri kişisel veridir ve onaysız
 * saklanamaz.
 *
 * ---------------------------------------------------------------------------
 * NASIL AÇILIR
 * ---------------------------------------------------------------------------
 *   1. analytics.google.com -> Yönetici -> Mülk oluştur -> Web
 *   2. "Ölçüm Kimliği" (Measurement ID) kopyalayın; G-XXXXXXX biçimindedir
 *      (Dikkat: "Mülk Kimliği" (UA-…) değil, "Ölçüm Kimliği"dir.)
 *   3. Vercel -> proje -> Settings -> Environment Variables
 *      NEXT_PUBLIC_GA_ID = G-XXXXXXX   (Production ve Preview için ekleyin)
 *   4. Yeniden dağıtın.
 *
 * Yönetim paneli (/admin) ve 404 sayfası bilerek ÖLÇÜLMEZ: panel trafiği
 * raporu kirlendirir, hata sayfası ise tek seferlik bir görüntülemedir.
 */

import { useEffect } from "react";
import Script from "next/script";
import { izinVar, izinDegisti } from "../lib/ceerez";

/** Ölçüm kimliği. Tanımlı değilse bileşe hiçbir şey basmaz. */
const ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Onay durumunun ilk değeri.
 *
 * Sunucuda localStorage okunamaz; ilk değer 'denied' olmak zorundayız
 * (aksi halde sunucu çiziminde izin varmış gibi görünür ve hydration
 * uyuşmazlığı olur). Gerçek değer useEffect içinde okunur.
 */
const VARSAYILAN = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "denied",
  security_storage: "granted", // güvenlik çerezi (CSRF vb.) gerekli değil ama izinsiz de sorun değil
  wait_for_update: 500,
};

export default function Analytics() {
  /* Google'a gönderilecek onay sinyali.
     'granted' = analiz açık, 'denied' = analiz kapalı. */
  useEffect(() => {
    if (!ID || typeof window === "undefined") return;
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

  if (!ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ID}`}
        strategy="afterInteractive"
      />
      <Script id="genco-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          // ÖNCE varsayılan onay sinyali: henüz izin verilmedi.
          gtag('consent', 'default', ${JSON.stringify(VARSAYILAN)});
          gtag('js', new Date());
          gtag('config', '${ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}