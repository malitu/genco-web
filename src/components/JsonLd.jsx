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

import { ORG, PAGES, SECTORS, SERVICES, fullAddress, pageUrl } from "../lib/seo";

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

/** Site geneli WebSite + arama kutusu. */
export function schemaWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${ORG.url}/#website`,
    url: ORG.url,
    name: ORG.shortName,
    legalName: ORG.legalName,
    description: ORG.description,
    inLanguage: ["tr-TR", "en"],
    publisher: { "@id": `${ORG.url}/#organization` },
  };
}

/** Sektör listesi — /industries sayfası. */
export function schemaSectorList(pathname = "/industries") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl(pathname)}#sectors`,
    name: "Çalıştığımız sektörler",
    numberOfItems: SECTORS.length,
    itemListElement: SECTORS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.tr,
      alternateName: s.en,
    })),
  };
}

/** Hizmet listesi — /services sayfası. */
export function schemaServices(pathname = "/services") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl(pathname)}#services`,
    name: "Hizmetlerimiz",
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.tr,
        alternateName: s.en,
        description: s.desc,
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

/** Sayfa meta verisi için yol haritası (breadcrumb) şeması. */
export function schemaBreadcrumb(pathname = "/") {
  const map = {
    "/": "Ana Sayfa",
    "/services": "Hizmetler",
    "/industries": "Sektörler",
    "/case-studies": "Vaka Analizleri",
    "/insights": "Sektör Analizleri",
    "/about": "Hakkımızda",
    "/contact": "İletişim",
    "/gizlilik": "Gizlilik Politikası",
  };

  const items = [
    { name: "Ana Sayfa", path: "/" },
    ...(pathname !== "/" && map[pathname]
      ? [{ name: map[pathname], path: pathname }]
      : pathname !== "/"
        ? [{ name: pathname, path: pathname }]
        : []),
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
 */
export function schemaPage(key, pathname) {
  const p = PAGES[key];
  const parts = [schemaBreadcrumb(pathname)];
  if (key === "services") parts.push(schemaServices(pathname));
  if (key === "industries") parts.push(schemaSectorList(pathname));
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl(pathname)}#webpage`,
    url: pageUrl(pathname),
    name: p?.title,
    description: p?.description,
    isPartOf: { "@id": `${ORG.url}/#website` },
    about: { "@id": `${ORG.url}/#organization` },
    inLanguage: "tr-TR",
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