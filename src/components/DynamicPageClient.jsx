"use client";

/**
 * GENCO — dinamik sayfa istemci bileşeni.
 * ---------------------------------------------------------------------------
 * src/app/[slug]/page.jsx sunucu bileşenidir (meta üretimi için); asıl
 * arayüz burada. Slug sunucudan prop olarak gelir.
 */

import LivePage from "./LivePage";

export default function DynamicPageClient({ slug }) {
  return <LivePage pageKey={slug || ""} />;
}