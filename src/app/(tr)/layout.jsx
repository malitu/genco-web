import '../globals.css';

import { ORG, PAGES, SITE_URL } from '../../lib/seo';
import JsonLd from '../../components/JsonLd';
import Analytics from '../../components/Analytics';
import CerezOnay from "../../components/CerezOnay";
import YukariCik from "../../components/YukariCik";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { schemaOrganization, schemaWebSite } from '../../components/JsonLd';
import { GA_ID, GA_SNIPPET } from "../../lib/gaOnay";

/**
 * Kök düzen.
 * ---------------------------------------------------------------------------
 * Burada tanımlanan değerler TÜM alt sayfalara miras geçer; sayfaya özel
 * title/description ise ilgili sayfanın kendi `metadata` export'u ile ezilir.
 *
 * Not: Tailwind şu an CDN üzerinden yükleniyor (aşaıdaki script). Üretim
 * (production) için bunun derleme zamanına taşınması gerekir — performans
 * notları docs klasöründeki SEO analizinde yer alıyor.
 */

export const metadata = {
  metadataBase: new URL(SITE_URL),

  // Sayfaya özel değerler burada; alt sayfalar kendi metadata'sıyla ezer.
  title: {
    default: PAGES.home.title,
    template: '%s | GENCO',
  },
  description: PAGES.home.description,

  keywords: [
    'ithalat',
    'ihracat',
    'dış ticaret',
    'İzmir ithalat ihracat',
    'anahtar teslim ithalat',
    'GTİP tespiti',
    'gümrükleme',
    'ihracat departmanı',
    'çelik ithalat ihracat',
    'medikal ithalat',
    'ambalaj tasarımı',
    'baskı',
    'denizcilik ekipmanları',
    'tohumculuk',
    'femtech',
  ],
  authors: [{ name: ORG.legalName }],
  creator: ORG.legalName,
  publisher: ORG.legalName,
  applicationName: 'GENCO',
  category: 'business',

  // Arama motoru yönlendirmeleri
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/',
      'x-default': '/',
    },
  },

  // Paylaşım önizlemesi (WhatsApp, LinkedIn, X, Facebook…)
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    siteName: ORG.shortName,
    title: PAGES.home.title,
    description: PAGES.home.description,
    images: [
      {
        url: ORG.image,
        width: 1200,
        height: 630,
        alt: ORG.imageAlt,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: PAGES.home.title,
    description: PAGES.home.description,
    images: [ORG.image],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // Search Console site dogrulamasi (https://gencotr.com).
  // Google etiketi dogruladiktan sonra kaldirilabilir.
  other: {
    "google-site-verification": "4Hy91J0hXM1Uz6tDQRBu1q2e6T_QK2RtSTEg9sQSc_w",
  },

  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },

  formatDetection: { telephone: true, email: true, address: false },
};

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  // Kuruluş ve sektör bilgisi AI aramaları için site genelinde şemada durur.
  const orgSchema = schemaOrganization();
  const siteSchema = schemaWebSite();

  return (
    <html lang="tr">
      <head>
        {/* Tailwind CSS artık derleme zamanında üretiliyor
            (postcss.config.js + @tailwindcss/postcss). Daha önce
            cdn.tailwindcss.com yükleniyordu; bu, tarayıcıda çalışma anında
            CSS üretildiği için ilk boyamayı geciktiriyor ve harici bir
            bağımlılık oluşturuyordu. */}
        <JsonLd data={orgSchema} />
        <JsonLd data={siteSchema} />

        {/* GA4 etiketi sunucu HTML'inde yer alir; Google'in istediği
            sıra: önce consent default (hepsi denied), sonra config.
            Ayrıntı src/lib/gaOnay.js. */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script dangerouslySetInnerHTML={{ __html: GA_SNIPPET }} />
          </>
        )}
      </head>
      <body>
        {children}
        {/* NEXT_PUBLIC_GA_ID tanımlıysa burada etkinleşir; değilse hiçbir
            şey basılmaz. Ayrıntı src/components/Analytics.jsx. */}
        <Analytics />

        {/* Çerez izni bandı: analiz yalnızca onaydan sonra yüklenir. */}

        <CerezOnay lang="TR" />
        {/* Kaydırınca beliren başa dön düğmesi. */}
        <YukariCik lang="TR" />
        {/* Vercel Web Analytics - çerezsiz; onay gerektirmez. */}
        <VercelAnalytics />
      </body>
    </html>
  );
}