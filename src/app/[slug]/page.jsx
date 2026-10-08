/**
 * GENCO — dinamik alt sayfa rotası · sunucu bileşeni.
 * ---------------------------------------------------------------------------
 * Stüdyoda "Yeni Sayfa Ekle" ile oluşturulan her sayfa bu rota üzerinden
 * yayınlanır; ayrı dosya gerekmez.
 *
 *   /services, /industries, ...  →  src/app/<slug>/page.jsx (statik rotalar)
 *   /yeni-sayfa                  →  burası ([slug])
 *
 * İçerik stüdyoda yayınlanmışsa Firestore'dan, yoksa sayfanın şablonundan
 * gelir. Hiçbiri yoksa boş bir iskelet (menü + başlık + alt bilgi) gösterilir.
 *
 * Ayrıldı çünkü `generateMetadata` yalnızca sunucu bileşenlerinde çalışır.
 * Stüdyodan eklenen sayfalar için başlık/açıklama Firestore'dan okunur.
 */

import DynamicPageClient from "../../components/DynamicPageClient";
import { pageUrl } from "../../lib/seo";

/** Firestore'dan sayfanın TR/EN başlık ve açıklamasını okur. */
async function sayfaBilgisi(slug) {
  // Bilinmeyen sayfalar için gereksiz istek atılır.
  const statik = {
    gizlilik: true,
  };
  if (statik[slug]) return null;

  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "genco-platform";

  if (!key) return null;

  try {
    const controller = new AbortController();
    const zamanAsimi = setTimeout(() => controller.abort(), 2500);

    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/settings/genco_studio?key=${key}`;
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(zamanAsimi);

    if (!res.ok) return null;

    const doc = await res.json();
    const custom = doc?.fields?.customPages?.mapValue?.fields;

    // customPages alanı: { slug: { label: {tr,en}, ... } }
    if (!custom) return null;

    const Alan = custom[slug];
    if (!Alan) return null;

    const oku = (v) => (v?.mapValue?.fields ? v.mapValue.fields : null);

    const baslik = oku(Alan.baslik) || oku(Alan.title) || oku(Alan.label);
    const aciklama = oku(Alan.aciklama) || oku(Alan.description);

    return {
      title: baslik?.tr?.stringValue || baslik?.en?.stringValue || null,
      description: aciklama?.tr?.stringValue || aciklama?.en?.stringValue || null,
    };
  } catch {
    // Ağ hatası / zaman aşımı: sayfa yine de çalışır, sadece meta üretilmez.
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const bilgi = await sayfaBilgisi(slug);
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
  return <DynamicPageClient slug={slug} />;
}