import Script from 'next/script';

/**
 * Google Analytics 4 (GA4) — yayın öncesi ölçüm.
 * ---------------------------------------------------------------------------
 * Neden bu dosya var: Analitik kodu doğrudan layout'a yazmak yerine tek bir
 * yerden yönetiliyor. İki kök düzeni (app/(tr) ve app/(en)/en) var ve ikisi de
 * aynı ölçümü yapmalı; aksi halde EN trafiği raporda görünmez.
 *
 * NASIL AÇILIR (5 dakika, ücretsiz):
 *   1. analytics.google.com -> Yönetici -> Mülk oluştur -> Web
 *   2. Mülk adı ve web sitesi adresi girin
 *   3. "Ölçüm Kimliği" (Measurement ID) kopyalayın; G-XXXXXXX biçimindedir
 *   4. Vercel -> proje -> Settings -> Environment Variables
 *      NEXT_PUBLIC_GA_ID = G-XXXXXXX   (Production ve Preview için ekleyin)
 *   5. Yeniden dağıtın. Ölçüm otomatik başlar.
 *
 * Değişken tanımlı değilse bileşek hiçbir şey basmaz — site normal çalışır,
 * yalnızca trafiğin kaydı tutulmaz. Bu, "kod bozuk" riskini sıfırlar.
 *
 * Yönetim paneli (/admin) ve 404 sayfası bilerek ÖLÇÜLMEZ: panel trafiği
 * raporu kirlendirir, hata sayfası ise zaten tek seferlik bir görüntülenmedir.
 */

export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="genco-ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}