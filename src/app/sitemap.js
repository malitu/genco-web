import { SITE_URL, enPagePath, localeHreflang } from "../lib/seo";
import { ozelSayfaSluglari as ozelSluglari } from "../lib/ozelSayfa";
import { VAKALAR, vakaEksikAlanlar } from "../lib/vaka";

/**
 * Sitemap — arama motorlarına tüm sayfaları duyurur.
 * ---------------------------------------------------------------------------
 * Statik rotalar her zaman listelenir. Stüdyodan eklenen özel sayfalar
 * Firestore'dan okunur; okunamazsa yalnızca statik rotalar yayınlanır
 * (sayfa çökmez, sitemap eksik olur).
 *
 * Her Türkçe adresin İngilizce karşılığı da listelenir ve `alternates.languages`
 * ile birbirine bağlanır. Böylece arama motoru "aynı sayfanın iki dili"
 * olduğunu anlar ve her birini ayrı indeksler.
 *
 * Not: /en/gizlilik yerine /en/privacy-policy yayınlanır (İngilizce okuyucu
 * için anlamlı adres). next.config.js'de /en/gizlilis -> /en/privacy-policy
 * yönlendirmesi vardır.
 */

const STATIK = [
  { path: "/", key: "home", priority: 1.0, freq: "weekly" },
  { path: "/services", key: "services", priority: 0.9, freq: "monthly" },
  { path: "/services/outsourced-export", key: "outsourcedExport", priority: 0.8, freq: "monthly" },
  { path: "/services/turkey-sourcing", key: "turkeySourcing", priority: 0.8, freq: "monthly" },
  { path: "/services/distributor-development", key: "distributorDevelopment", priority: 0.8, freq: "monthly" },
  { path: "/industries", key: "industries", priority: 0.9, freq: "monthly" },
  { path: "/case-studies", key: "caseStudies", priority: 0.8, freq: "monthly" },
  { path: "/insights", key: "insights", priority: 0.8, freq: "weekly" },
  { path: "/insights/teknik-sartnameyi-netlestirmek", key: "yaziSartname", priority: 0.7, freq: "monthly" },
  { path: "/insights/uretici-seciminde-karsilastirilacak-basliklar", key: "yaziUretici", priority: 0.7, freq: "monthly" },
  { path: "/insights/distributor-listesinden-is-ortagi-secimine", key: "yaziDistributor", priority: 0.7, freq: "monthly" },
  { path: "/about", key: "about", priority: 0.7, freq: "monthly" },
  { path: "/contact", key: "contact", priority: 0.9, freq: "yearly" },
  { path: "/gizlilik", key: "gizlilik", priority: 0.3, freq: "yearly" },
];

const statikYollar = new Set(STATIK.map((r) => r.path));

/**
 * Vaka analizi detay sayfaları (/case-studies/<slug>).
 *
 * Kayıt listesi boşken hiçbir şey eklenmez — henüz yayımlanmamış bir vaka
 * adresi sitemap'e girmez. Eksik alanı olan kayıt da atlanır: yarım
 * kalmış bir vaka indekslenmemeli.
 *
 * `key` alanı önemlidir: yol üretimi `enPagePath(key)` ile yapılır ve
 * vaka anahtarı site haritasındaki karşılığı olmadığı için doğrudan
 * "/en" öneki eklenir.
 */
function vakaKayitlari() {
  return VAKALAR.filter((v) => vakaEksikAlanlar(v).length === 0).map((v) => ({
    path: `/case-studies/${v.slug}`,
    key: "",
    enYol: `/en/case-studies/${v.slug}`,
    priority: 0.7,
    freq: "monthly",
  }));
}

export default async function sitemap() {
  const sluglar = await ozelSluglari();

  const ozel = sluglar
    .filter((slug) => typeof slug === "string" && slug.length > 0 && !statikYollar.has(`/${slug}`))
    .map((slug) => ({ path: `/${slug}`, key: slug, priority: 0.6, freq: "monthly" }));

  const tumu = [...STATIK, ...ozel, ...vakaKayitlari()];

  // Sitemap çiftleri: her Türkçe adres için bir TR, bir EN kaydı.
  const kayitlar = [];

  for (const r of tumu) {
    const trYol = r.path;
    // Vaka kayıtlarında enYol doğrudan verilir; diğerlerinde anahtardan türetilir.
    const enYol = r.enYol ? r.enYol : r.key ? enPagePath(r.key) : enPagePath(r.path.slice(1));
    // hreflang değerleri MUTLAKA tam adres olmalı.
    //
    // Ölçülen hata: buraya çıplak yol ("/services") yazılınca Next.js bunu
    // `metadataBase` ile birleştirip sitemap'e göreli adres olarak yazıyordu:
    //
    //     <xhtml:link rel="alternate" hreflang="en-GB" href="/en/services" />
    //
    // Google göreli adresi çözemiyor ve her <url> bloğundaki 3 alternatifi
    // ayrı ayrı hata sayıyordu: 28 sayfa × 3 = 84 hata. Search Console'da
    // "84 hata" olarak görünen şey tam olarak buydu.
    //
    // Google'ın kuralı açık: xhtml:link/@href mutlak URL olmalıdır.
    // Aşağıdaki tam() yardımcısı bunu garanti eder.
    const tam = (yol) => `${SITE_URL}${yol === "/" ? "" : yol}`;

    const diller = {
      [localeHreflang("TR")]: tam(trYol),
      [localeHreflang("EN")]: tam(enYol),
      "x-default": tam(trYol),
    };

    kayitlar.push({
      url: tam(trYol),
      lastModified: new Date(),
      changeFrequency: r.freq,
      priority: r.priority,
      alternates: { languages: diller },
    });

    kayitlar.push({
      url: tam(enYol),
      lastModified: new Date(),
      changeFrequency: r.freq,
      priority: r.priority,
      alternates: { languages: diller },
    });
  }

  return kayitlar;
}