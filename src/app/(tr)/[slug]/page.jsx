import DynamicPageClient from "../../../components/DynamicPageClient";
import { slugDogrula, ozelSayfaBilgi } from "../../../lib/ozelSayfa";
import { localePath, pageUrl, localeHreflang } from "../../../lib/seo";

/**
 * Türkçe özel sayfalar: /<slug>
 * ---------------------------------------------------------------------------
 * Yalnızca stüdyodan eklenen sayfaları sunar. Bilinmeyen slug gelirse 404
 * döner; aksi halde her rastgele adres 200 açılır ve arama motorlarına
 * "soft 404" sinyali verilir.
 *
 * İngilizce karşılık: src/app/(en)/en/[slug]/page.jsx — doğrulama ve
 * metadata mantığı src/lib/ozelSayfa.js'te ortaktır.
 *
 * Statik rotalar (/services, /gizlilik, …) kendi klasörlerinden gelir ve
 * bu rotaya düşmez.
 */

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // Tanımsız adresler için metadata üretmeyiz; 404 sayfası devreye girer.
  try {
    await slugDogrula(slug);
  } catch {
    return {
      title: "Sayfa bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  const bilgi = await ozelSayfaBilgi(slug, "TR");
  const yol = localePath("TR", `/${slug}`);
  const enYol = localePath("EN", `/${slug}`);

  return {
    title: bilgi?.title || slug,
    description: bilgi?.description || undefined,
    alternates: {
      canonical: yol,
      languages: {
        [localeHreflang("TR")]: yol,
        [localeHreflang("EN")]: enYol,
        "x-default": yol,
      },
    },
    openGraph: {
      title: bilgi?.title || slug,
      description: bilgi?.description || undefined,
      url: pageUrl(yol),
      locale: "tr_TR",
    },
  };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const gecerli = await slugDogrula(slug);
  return <DynamicPageClient slug={gecerli} lang="TR" />;
}