import DynamicPageClient from "../../../../components/DynamicPageClient";
import { slugDogrula, ozelSayfaBilgi } from "../../../../lib/ozelSayfa";
import { localePath, pageUrl, localeHreflang } from "../../../../lib/seo";

/**
 * İngilizce özel sayfalar: /en/<slug>
 * ---------------------------------------------------------------------------
 * Türkçe karşılığın birebir aynısı; tek fark metadata'nın İngilizce alanlardan
 * üretilmesi ve canonical'ın /en/... olması.
 *
 * Doğrulama mantığı src/lib/ozelSayfa.js'te ortaktır — iki dil aynı sayfanın
 * var olup olmadığına aynı ölçütle karar verir.
 */

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    await slugDogrula(slug);
  } catch {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }

  const bilgi = await ozelSayfaBilgi(slug, "EN");
  const yol = localePath("EN", `/${slug}`);
  const trYol = localePath("TR", `/${slug}`);

  return {
    title: bilgi?.title || slug,
    description: bilgi?.description || undefined,
    alternates: {
      canonical: yol,
      languages: {
        [localeHreflang("TR")]: trYol,
        [localeHreflang("EN")]: yol,
        "x-default": trYol,
      },
    },
    openGraph: {
      title: bilgi?.title || slug,
      description: bilgi?.description || undefined,
      url: pageUrl(yol),
      locale: "en_GB",
    },
  };
}

export default async function DynamicPageEn({ params }) {
  const { slug } = await params;
  const gecerli = await slugDogrula(slug);
  return <DynamicPageClient slug={gecerli} lang="EN" />;
}