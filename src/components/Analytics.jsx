import Script from "next/script";

/**
 * Google Analytics 4 - yayın ölçümü.
 * ---------------------------------------------------------------------------
 * İki kök düzen (app/(tr) ve app/(en)/en) var ve ikisi de aynı ölçümü yapar;
 * aksi halde İngilizce trafik raporda görünmez.
 *
 * NASIL AÇILIR:
 *   1. analytics.google.com -> Yönetici -> Mülk oluştur -> Web
 *   2. Mülk adı ve web sitesi adresi girin
 *   3. "Ölçüm Kimliği" (Measurement ID) kopyalayın; G-XXXXXXX biçimindedir
 *      (Dikkat: "Mülk Kimliği" (UA-…) değil, "Ölçüm Kimliği"dir.)
 *   4. Vercel -> proje -> Settings -> Environment Variables
 *      NEXT_PUBLIC_GA_ID = G-XXXXXXX   (Production ve Preview için ekleyin)
 *   5. Yeniden dağıtın. Ölçüm otomatik bağlanır.
 *
 * Değişken tanımlı değilse hiçbir şey basılmaz - site normal çalışır,
 * yalnızca trafiğin kaydı tutulmaz. Bu, "kod bozuk" riskini sıfırlar.
 *
 * Yönetim paneli (/admin) ve 404 sayfası bilerek ÖLÇÜLMEZ: panel trafiği
 * raporu kirlendirir, hata sayfası ise zaten tek seferlik bir görüntülemedir.
 *
 * Tek seferlik olaylar (ör. form gönderimi) bu dosyadan değil,
 * src/lib/olayGonder.js üzerinden gönderilir; oradaki gerekçe o fonksiyonun
 * yalnızca istemcide çalışabilmesiyle ilgilidir.
 */

/** Ölçüm kimliği. Tanımlı değilse bileşe hiçbir şey basmaz. */
const ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  if (!ID) return null;

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