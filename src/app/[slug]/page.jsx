import { notFound } from "next/navigation";
import DynamicPageClient from "../../components/DynamicPageClient";
import { pageUrl } from "../../lib/seo";

/**
 * Bu rota yalnızca stüdyodan eklenen özel sayfaları sunar.
 * ---------------------------------------------------------------------------
 * Bilinmeyen bir slug gelirse 404 döndürülür. Aksi halde her rastgele adres
 * 200 ile açılır ve arama motorlarına "soft 404" sinyali verilir; bu durum
 * tüm domainin indekslemesini zayıflatır.
 *
 * Statik rotalar (/services, /gizlilik, …) kendi klasörlerinden gelir ve
 * bu rotaya düşmez.
 */

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

/**
 * Sayfanın gerçekten var olduğunu doğrular.
 * @returns {Promise<boolean>}
 */
async function sayfaVar(slug) {
  // Şablonu olan sayfalar (stüdyodan eklenmemiş olsalar da geçerlidir).
  const { getPageTemplate } = await import("../../components/PageTemplates");
  if (getPageTemplate(slug).length) return true;

  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "genco-platform";
  if (!key) return false;

  try {
    const controller = new AbortController();
    const zamanAsimi = setTimeout(() => controller.abort(), 2500);

    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/settings/genco_studio?key=${key}`;
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(zamanAsimi);

    if (!res.ok) return false;

    const doc = await res.json();
    const custom = doc?.fields?.customPages?.mapValue?.fields;
    return !!custom && Object.prototype.hasOwnProperty.call(custom, slug);
  } catch {
    return false;
  }
}

/** Slug gerçekten var mı? Değilse 404 fırlatır. */
export async function slugDogrula(slug) {
  if (!slug || typeof slug !== "string") notFound();
  if (SON_KISIMLAR.has(slug)) notFound();
  if (!GECERLI.test(slug)) notFound();
  if (!(await sayfaVar(slug))) notFound();
  return slug;
}

/** Sayfa başlığı ve açıklaması (yoksa varsayılan). */
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

  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "genco-platform";

  let bilgi = null;
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/settings/genco_studio?key=${key}`;
    const doc = await (await fetch(url, { cache: "no-store" })).json();
    const alan = doc?.fields?.customPages?.mapValue?.fields?.[slug];
    const oku = (v) => (v?.mapValue?.fields ? v.mapValue.fields : null);
    const baslik = alan && (oku(alan.baslik) || oku(alan.title) || oku(alan.label));
    const aciklama = alan && (oku(alan.aciklama) || oku(alan.description));
    bilgi = {
      title: baslik?.tr?.stringValue || baslik?.en?.stringValue || null,
      description: aciklama?.tr?.stringValue || aciklama?.en?.stringValue || null,
    };
  } catch {
    bilgi = null;
  }

  const yol = `/${slug}`;

  return {
    title: bilgi?.title || slug,
    description: bilgi?.description || undefined,
    alternates: { canonical: yol },
    openGraph: {
      title: bilgi?.title || slug,
      description: bilgi?.description || undefined,
      url: pageUrl(yol),
    },
  };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const gecerli = await slugDogrula(slug);
  return <DynamicPageClient slug={gecerli} />;
}