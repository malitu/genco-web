import '../../globals.css';

import { ORG, PAGES, SITE_URL } from '../../../lib/seo';
import JsonLd from '../../../components/JsonLd';
import Analytics from '../../../components/Analytics';
import { schemaOrganization, schemaWebSite } from '../../../components/JsonLd';

/**
 * İNGİLİZCE kök düzeni (route group: app/(en)/en).
 * ---------------------------------------------------------------------------
 * Bu düzen /en/ altındaki tüm sayfaları kapsar. Route group sayesinde Türkçe
 * (/services) ve İngilizce (/en/services) ağaçları ayrı `<html lang>` değerine
 * sahip olur — İngilizce içeriğin doğru dilde indekslenmesi bunun sayesinde
 * gerçekleşir.
 *
 * Türkçe karşılık: src/app/(tr)/layout.jsx
 */

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: PAGES.home.titleEn,
    template: '%s | GENCO',
  },
  description: PAGES.home.descriptionEn,

  // İngilizce aramalarda hedeflenen anahtar kelimeler.
  keywords: [
    'import export company',
    'Turkey import export',
    'Izmir import export',
    'turnkey import',
    'HS code classification',
    'customs clearance',
    'export department',
    'steel import export',
    'medical devices import',
    'packaging design',
    'printing',
    'marine equipment',
    'seed trade',
    'femtech',
  ],
  authors: [{ name: ORG.legalNameEn }],
  creator: ORG.legalNameEn,
  publisher: ORG.legalNameEn,
  applicationName: 'GENCO',
  category: 'business',

  alternates: {
    canonical: '/en',
    languages: {
      'tr-TR': '/',
      'en-GB': '/en',
      'x-default': '/',
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_GB',
    alternateLocale: ['tr_TR'],
    url: `${SITE_URL}/en`,
    siteName: ORG.shortName,
    title: PAGES.home.titleEn,
    description: PAGES.home.descriptionEn,
    images: [
      {
        url: ORG.image,
        width: 1600,
        height: 1067,
        alt: 'GENCO — import and export operations',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: PAGES.home.titleEn,
    description: PAGES.home.descriptionEn,
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

export default function EnLayout({ children }) {
  const orgSchema = schemaOrganization();
  const siteSchema = schemaWebSite("EN");

  return (
    <html lang="en">
      <head>
        <JsonLd data={orgSchema} />
        <JsonLd data={siteSchema} />
      </head>
      <body>
        {children}
        {/* TR ağacıyla aynı ölçüm: iki dil tek mülkte toplanır. */}
        <Analytics />
      </body>
    </html>
  );
}