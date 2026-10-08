import { SITE_URL } from "../lib/seo";

/**
 * Sitemap — arama motorlarına tüm sayfaları duyurur.
 * ---------------------------------------------------------------------------
 * Statik rotalar her zaman listelenir. Stüdyodan eklenen özel sayfalar
 * Firestore'dan okunur; okunamazsa yalnızca statik rotalar yayınlanır
 * (sayfa çökmez, sitemap eksik olur).
 */

const STATIK = [
  { path: "/", priority: 1.0, freq: "weekly" },
  { path: "/services", priority: 0.9, freq: "monthly" },
  { path: "/industries", priority: 0.9, freq: "monthly" },
  { path: "/case-studies", priority: 0.8, freq: "monthly" },
  { path: "/insights", priority: 0.8, freq: "weekly" },
  { path: "/about", priority: 0.7, freq: "monthly" },
  { path: "/contact", priority: 0.9, freq: "yearly" },
  { path: "/gizlilik", priority: 0.3, freq: "yearly" },
];

const statikYollar = new Set(STATIK.map((r) => r.path));

/** Stüdyodan eklenen özel sayfaları (slug listesi) okur. */
async function ozelSayfaSluglari() {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "genco-platform";
  if (!key) return [];

  try {
    const controller = new AbortController();
    const zamanAsimi = setTimeout(() => controller.abort(), 2500);

    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/settings/genco_studio?key=${key}`;
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(zamanAsimi);

    if (!res.ok) return [];

    const doc = await res.json();
    const custom = doc?.fields?.customPages?.mapValue?.fields;
    if (!custom) return [];

    return Object.keys(custom).filter(
      (slug) => typeof slug === "string" && slug.length > 0 && !statikYollar.has(`/${slug}`)
    );
  } catch {
    // Ağ hatası / zaman aşımı: yalnızca statik rotalar yayınlanır.
    return [];
  }
}

export default async function sitemap() {
  const sluglar = await ozelSayfaSluglari();

  const ozel = sluglar.map((slug) => ({
    path: `/${slug}`,
    priority: 0.6,
    freq: "monthly",
  }));

  return [...STATIK, ...ozel].map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified: new Date(),
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}