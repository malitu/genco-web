import './globals.css';

import { ORG, PAGES, SITE_URL } from '../lib/seo';
import JsonLd from '../components/JsonLd';
import { schemaOrganization, schemaWebSite } from '../components/JsonLd';

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
      'en': '/?lang=en',
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
        width: 1600,
        height: 1067,
        alt: 'GENCO — ithalat ve ihracat operasyonları',
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
      </head>
      <body>{children}</body>
    </html>
  );
}