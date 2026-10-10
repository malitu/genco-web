import '../globals.css';

/**
 * GENCO Visual Studio — kök düzeni (yalnızca /admin/* rotaları için).
 * ---------------------------------------------------------------------------
 * Sitenin ana kök düzenleri route group'ların içindedir:
 *   • app/(tr)/layout.jsx  ->  Türkçe sayfalar
 *   • app/(en)/en/layout.jsx  ->  İngilizce sayfalar
 * Route group'lar dışında kalan rotalar (/admin) kendi kök düzenine sahip
 * olmak zorundadır; aksi halde <html>/<body> ve globals.css yüklenmez ve
 * sayfa stilleri olmadan (çıplak metin olarak) görünür.
 *
 * Burada bilerek site geneli SEO verisi (Organization şeması, canonical,
 * hreflang) YOKTUR: yönetim paneli arama motorlarına açık değildir ve
 * canlı sayfaların metadata'sını tekrarlamasına gerek yoktur.
 */

export const metadata = {
  title: "GENCO Visual Studio",
  // Yönetim paneli indekslenmesin.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}