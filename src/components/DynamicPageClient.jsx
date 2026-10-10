"use client";

/**
 * GENCO — dinamik sayfa istemci bileşeni.
 * ---------------------------------------------------------------------------
 * Sunucu bileşeni (src/app/(tr)/[slug]/page.jsx ve src/app/(en)/en/[slug]/page.jsx)
 * meta üretimi ve 404 doğrulaması için; asıl arayüz burada. Slug ve dil
 * sunucudan prop olarak gelir.
 */

import LivePage from "./LivePage";

export default function DynamicPageClient({ slug, lang = "TR" }) {
  return <LivePage pageKey={slug || ""} lang={lang} />;
}