/**
 * Özel (stüdyodan eklenen) sayfaların ortak mantığı.
 * ---------------------------------------------------------------------------
 * Hem Türkçe (/<slug>) hem İngilizce (/en/<slug>) rotaları bu doğrulamayı
 * kullanır. Ayrı iki kopya yazmak, iki dilin birbirinden ayrışmasına yol
 * açardı — biri 404 dönerken diğeri 200 dönerdi.
 *
 * Neden bu kadar titizlik: bilinmeyen bir adres 200 ile açılırsa arama
 * motorlarına "soft 404" sinyali verilir ve bu durum tüm domainin
 * indekslemesini zayıflatır.
 */

import { notFound } from "next/navigation";

/** Bir slug'ın doğrudan sayfa olarak açılamayacağı adlar. */
const SON_KISIMLAR = new Set([
  "en",
  "llms.txt",
  "sitemap.xml",
  "robots.txt",
  "favicon.ico",
  "admin",
]);

/** Slug biçimi: yalnızca küçük harf, rakam ve tire. */
const GECERLI = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PROJE = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "genco-platform";
const ANAHTAR = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

function dokumanUrls() {
  return `https://firestore.googleapis.com/v1/projects/${PROJE}/databases/(default)/documents/settings/genco_studio?key=${ANAHTAR}`;
}

/** Stüdyo dokümanını okur (2,5 sn zaman aşımlı). Hata toleranslı. */
async function dokumanOku({ zamanAsimi = 2500 } = {}) {
  if (!ANAHTAR) return null;
  try {
    const controller = new AbortController();
    const zaman = setTimeout(() => controller.abort(), zamanAsimi);
    const res = await fetch(firestoreBelgeUrl(), {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(zaman);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Slug gerçekten var mı?
 * @returns {Promise<boolean>}
 */
export async function sayfaVar(slug) {
  // Şablonu olan sayfalar (stüdyodan eklenmemiş olsalar da geçerlidir).
  const { getPageTemplate } = await import("../components/PageTemplates");
  if (getPageTemplate(slug).length) return true;

  const doc = await dokumanOku();
  const custom = doc?.fields?.customPages?.mapValue?.fields;
  return !!custom && Object.prototype.hasOwnProperty.call(custom, slug);
}

/** Slug geçerli değilse 404 fırlatır. */
export async function slugDogrula(slug) {
  if (!slug || typeof slug !== "string") notFound();
  if (SON_KISIMLAR.has(slug)) notFound();
  if (!GECERLI.test(slug)) notFound();
  if (!(await sayfaVar(slug))) notFound();
  return slug;
}

/** Stüdyodaki bir özel sayfanın başlık/açıklamasını dile göre döndürür. */
export async function ozelSayfaBilgi(slug, locale = "TR") {
  const doc = await dokumanOku();
  const alan = doc?.fields?.customPages?.mapValue?.fields?.[slug];
  if (!alan) return null;

  const oku = (v) => (v?.mapValue?.fields ? v.mapValue.fields : null);
  const al = (f) => {
    const m = oku(f);
    if (!m) return null;
    return locale === "EN"
      ? m.en?.stringValue || m.tr?.stringValue || null
      : m.tr?.stringValue || m.en?.stringValue || null;
  };

  const baslik = al(alan.baslik) || al(alan.title) || al(alan.label);
  const aciklama = al(alan.aciklama) || al(alan.description);

  return { title: baslik, description: aciklama };
}

/** Sitemap'in kullanacağı, stüdyoda tanımlı özel sayfa slug'ları. */
export async function ozelSayfaSluglari() {
  const doc = await dokumanOku();
  const custom = doc?.fields?.customPages?.mapValue?.fields;
  return custom ? Object.keys(custom) : [];
}