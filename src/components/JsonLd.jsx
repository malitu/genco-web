/**
 * JSON-LD yapısal veri.
 * ---------------------------------------------------------------------------
 * Arama motorları ve AI asistanları (ChatGPT, Perplexity, Google AI Overviews,
 * Claude) bir sayfayı okuyup özetlerken bu blokları kullanır. Sitenin
 * "nedir / nerede / kim iletişime geçer / ne hizmet verir" sorularının
 * makine tarafından doğru anlaşılması bu veriye bağlıdır.
 *
 * Kullanım:
 *   <JsonLd data={schemaHolds("home", "/")} />
 */

import { ORG, PAGES, SECTORS, SERVICES, fullAddress, pageUrl, PAGE_PATHS } from "../lib/seo";

/**
 * Şema metinleri iki dilli tutulur. `PAGES` yalnızca meta başlık/açıklama
 * taşıdığı için görünen adlar burada ayrıca tanımlanır.
 */
const SAYFA_ADLARI = {
  home: { tr: "Ana Sayfa", en: "Home" },
  services: { tr: "Hizmetler", en: "Services" },
  industries: { tr: "Sektörler", en: "Sectors" },
  caseStudies: { tr: "Vaka Analizleri", en: "Case Studies" },
  insights: { tr: "Sektör Analizleri", en: "Sector Insights" },
  about: { tr: "Hakkımızda", en: "About Us" },
  contact: { tr: "İletişim", en: "Contact" },
  gizlilik: { tr: "Gizlilik Politikası", en: "Privacy Policy" },
};

const SEKTOR_LISTESI_ADI = { tr: "Çalıştığımız sektörler", en: "Sectors we operate in" };
const HIZMET_LISTESI_ADI = { tr: "Hizmetlerimiz", en: "Our services" };

/** "TR" | "EN" -> schema.org inLanguage. */
function inLang(locale) {
  return locale === "EN" ? "en-GB" : "tr-TR";
}

/** İki dilli alandan dile uygun olanı seçer. */
function pick(ad, locale) {
  if (!ad) return "";
  return locale === "EN" ? ad.en || ad.tr : ad.tr || ad.en;
}

/** LocalBusiness + Organization: en sık sorgulanan çekirdek bilgiler. */
export function schemaOrganization() {
  const postalAddress = {
    "@type": "PostalAddress",
    streetAddress: ORG.address.street,
    addressLocality: ORG.address.district,
    addressRegion: ORG.address.city,
    addressCountry: ORG.address.country,
  };

  const contactPoint = {
    "@type": "ContactPoint",
    telephone: ORG.phoneRaw,
    email: ORG.email,
    contactType: "sales",
    availableLanguage: ["Turkish", "English"],
    areaServed: ORG.areasServed,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${ORG.url}/#organization`,
        name: ORG.legalName,
        alternateName: ORG.legalNameEn,
        legalName: ORG.legalName,
        url: ORG.url,
        logo: ORG.logo,
        image: ORG.image,
        description: ORG.description,
        slogan: ORG.slogan,
        foundingDate: ORG.foundingDate,
        email: ORG.email,
        telephone: ORG.phoneRaw,
        address: postalAddress,
        contactPoint: [contactPoint],
        areaServed: ORG.areasServed,
        knowsLanguage: ["tr", "en"],
        sameAs: ORG.sameAs,
      },
      {
        "@type": "LocalBusiness",
        "@id": `${ORG.url}/#localbusiness`,
        name: ORG.shortName,
        legalName: ORG.legalName,
        url: ORG.url,
        image: ORG.image,
        logo: ORG.logo,
        description: ORG.description,
        foundingDate: ORG.foundingDate,
        telephone: ORG.phoneRaw,
        email: ORG.email,
        priceRange: "$$",
        address: postalAddress,
        geo: {
          "@type": "GeoCoordinates",
          // Bornova, İzmir merkezî konum (yaklaşık)
          latitude: 38.4622,
          longitude: 27.2163,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
            opens: "09:00",
            closes: "18:00",
          },
        ],
        parentOrganization: { "@id": `${ORG.url}/#organization` },
      },
    ],
  };
}

/**
 * Site geneli WebSite şeması.
 * @param {"TR"|"EN"} locale Hangi dil ağacında olduğumuz
 *
 * Önceden İngilizce içerik yalnızca istemci tarafında (localStorage) sunuluyordu
 * ve taranabilir bir adresi yoktu; bu yüzden burada ilan edilmiyordu. Artık
 * /en/ altında gerçek adresleri var.
 */
export function schemaWebSite(locale = "TR") {
  const en = locale === "EN";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${ORG.url}/#website`,
    url: en ? `${ORG.url}/en` : ORG.url,
    name: ORG.shortName,
    legalName: en ? ORG.legalNameEn : ORG.legalName,
    description: en ? ORG.descriptionEn : ORG.description,
    // Her iki dil de artık ayrı adrese sahip; ikisi de taranabilir.
    inLanguage: en ? ["en-GB", "tr-TR"] : ["tr-TR", "en-GB"],
    publisher: { "@id": `${ORG.url}/#organization` },
  };
}

/** Sektör listesi — /industries sayfası. */
export function schemaSectorList(pathname = "/industries", locale = "TR") {
  const en = locale === "EN";
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl(pathname)}#sectors`,
    name: pick(SEKTOR_LISTESI_ADI, locale),
    numberOfItems: SECTORS.length,
    itemListElement: SECTORS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: en ? s.en : s.tr,
      alternateName: en ? s.tr : s.en,
    })),
  };
}

/** Hizmet listesi — /services sayfası. */
export function schemaServices(pathname = "/services", locale = "TR") {
  const en = locale === "EN";
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl(pathname)}#services`,
    name: pick(HIZMET_LISTESI_ADI, locale),
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: en ? s.en : s.tr,
        alternateName: en ? s.tr : s.en,
        description: en ? s.descEn : s.desc,
        provider: { "@id": `${ORG.url}/#organization` },
        areaServed: ORG.areasServed,
      },
    })),
  };
}

/**
 * SSS şeması — sitede zaten soru-cevap metni var, makine okuyabilsin diye
 * etiketleniyor. Google artık genel SSS'ları zengin sonuç göstermese de
 * AI asistanları bu veriyi doğrudan kullanır.
 */
export function schemaFaq(questions, pathname = "/") {
  const list = (questions || [])
    .filter((q) => q?.q && q?.a)
    .map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    }));

  if (!list.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl(pathname)}#faq`,
    mainEntity: list,
  };
}

/**
 * Yazı şeması (Article) — /insights/* sayfaları.
 *
 * Yazının yazarı ve yayın tarihi burada bildirilir; arama motorları ve AI
 * asistanları içeriği kimin yazdığını ve ne zaman yayımlandığını görebilir.
 *
 * @param {string} pathname  Yazının adresi (/insights/...)
 * @param {"TR"|"EN"} locale
 * @param {{title:string, description:string, date:string}} bilgi
 */
export function schemaArticle(pathname, locale, bilgi) {
  const en = locale === "EN";
  const yazar = en ? ORG.shortName : ORG.legalName;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl(pathname)}#article`,
    url: pageUrl(pathname),
    headline: bilgi.title,
    description: bilgi.description || undefined,
    inLanguage: inLang(locale),
    datePublished: bilgi.date,
    dateModified: bilgi.date,
    author: {
      // Yazar kurum: GENCO. Kişisel isim kullanılmıyor çünkü doğrulanmış
      // bir kişi adı yok; kurum adı hem doğru hem savunulabilir.
      "@type": en ? "Organization" : "LocalBusiness",
      "@id": `${ORG.url}/#organization`,
      name: yazar,
    },
    publisher: { "@id": `${ORG.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl(pathname) },
  };
}

/**
 * Sayfa meta verisi için yol haritası (breadcrumb) şeması.
 * /en/... adreslerinde de Türkçe karşılığı gösterilir; böylece iki dil aynı
 * şirketin aynı bölümü olarak makine tarafından eşleşir.
 */
export function schemaBreadcrumb(pathname = "/", locale = "TR") {
  // /en/servis -> /services
  const kok = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const anahtar = Object.keys(SAYFA_ADLARI).find((k) => PAGE_PATHS[k] === kok);

  const ev = { name: pick(SAYFA_ADLARI.home, locale), path: locale === "EN" ? "/en" : "/" };

  const items =
    kok === "/"
      ? [ev]
      : [
          ev,
          {
            name: anahtar ? pick(SAYFA_ADLARI[anahtar], locale) : kok,
            path: pathname,
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl(pathname)}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: pageUrl(it.path),
    })),
  };
}

/**
 * Sayfa düzeyi şema seti.
 * @param {string} key PAGES anahtarı (home, services, ...)
 * @param {string} pathname Sayfanın gerçek adresi (EN sayfalarında /en/...)
 * @param {"TR"|"EN"} locale
 */
export function schemaPage(key, pathname, locale = "TR") {
  const p = PAGES[key];
  const en = locale === "EN";

  // Not: sektör/hizmet liste şemaları sayfa dosyalarında ayrı <JsonLd />
  // olarak basılır; burada yalnızca WebPage tanımlanır (çift kayıt olmasın).
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl(pathname)}#webpage`,
    url: pageUrl(pathname),
    name: en ? p?.titleEn : p?.title,
    description: en ? p?.descriptionEn : p?.description,
    isPartOf: { "@id": `${ORG.url}/#website` },
    about: { "@id": `${ORG.url}/#organization` },
    inLanguage: inLang(locale),
  };
}

/**
 * Şemaları tek <script> içinde @graph olarak birleştirir.
 * @param {object[]} list şema nesneleri
 */
export function mergeGraph(list) {
  const cleaned = list.filter(Boolean);
  if (!cleaned.length) return null;

  const graph = cleaned.flatMap((s) =>
    Array.isArray(s["@graph"]) ? s["@graph"] : [s],
  );

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Sayfaya basılacak tek JSON-LD <script> etiketi. */
export default function JsonLd({ data }) {
  const graph = mergeGraph([data]);
  if (!graph) return null;
  return (
    <script
      type="application/ld+json"
      // Yapısal veri kaynağı bizim; JSON.stringify ile güvenli hale geliyor.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}