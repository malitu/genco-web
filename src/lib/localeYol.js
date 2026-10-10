/**
 * Dil ↔ adres eşlemesi.
 * ---------------------------------------------------------------------------
 * Sunucu bileşenleri (metadata, sitemap) ve blok motoru (menü, dil düğmeleri)
 * aynı eşlemeyi kullanır. Ayrı iki kopya yazıldığında biri güncellenip diğeri
 * unutulur ve dil düğmesi 404'e düşer.
 *
 * Bağımlılığı yoktur; hem sunucu hem istemci tarafında kullanılabilir.
 */

/** Türkçe adresler. Ana sayfa "/" köktedir. */
export const TR_YOLLAR = {
  home: "/",
  services: "/services",
  outsourcedExport: "/services/outsourced-export",
  turkeySourcing: "/services/turkey-sourcing",
  distributorDevelopment: "/services/distributor-development",
  industries: "/industries",
  caseStudies: "/case-studies",
  insights: "/insights",
  yaziSartname: "/insights/teknik-sartnameyi-netlestirmek",
  yaziUretici: "/insights/uretici-seciminde-karsilastirilacak-basliklar",
  yaziDistributor: "/insights/distributor-listesinden-is-ortagi-secimine",
  about: "/about",
  contact: "/contact",
  gizlilik: "/gizlilik",
};

/**
 * İngilizce adresi Türkçe olmayan sayfalar.
 * /en/gizlilik yerine /en/privacy-policy yayınlanıyor; /en/gizlilik adresi
 * next.config.js'te buraya 308 yönlendirilir.
 */
export const EN_YOL_FARKLI = {
  gizlilik: "/en/privacy-policy",
};

/** Türkçe adrese karşılık gelen İngilizce adres. */
export function enYol(trYol) {
  let kok = trYol.startsWith("/") ? trYol : "/" + trYol;
  kok = kok.replace(/^\/en(?=\/|$)/, "") || "/";
  const anahtar = Object.keys(TR_YOLLAR).find((k) => TR_YOLLAR[k] === kok);
  if (anahtar && EN_YOL_FARKLI[anahtar]) return EN_YOL_FARKLI[anahtar];
  return kok === "/" ? "/en" : "/en" + kok;
}

/** İngilizce adrese karşılık gelen Türkçe adres. */
export function trYol(enAdres) {
  let p = enAdres.startsWith("/") ? enAdres : "/" + enAdres;
  p = p.replace(/^\/en(?=\/|$)/, "") || "/";
  // Ters eşleme: /en/privacy-policy -> /gizlilik
  for (const [anahtar, adres] of Object.entries(EN_YOL_FARKLI)) {
    if (adres === p || adres.replace(/^\/en/, "") === p) return TR_YOLLAR[anahtar];
  }
  return p;
}

/** Verilen adresi aktif dile göre yeniden adresler. */
export function dileGore(href, enMi) {
  if (!enMi) return trYol(href);
  return enYol(href);
}