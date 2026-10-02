"use client";

/**
 * GENCO — dinamik alt sayfa rotası
 * ---------------------------------------------------------------------------
 * Stüdyoda "Yeni Sayfa Ekle" ile oluşturulan her sayfa bu rota üzerinden
 * yayınlanır; ayrı dosya gerekmez.
 *
 *   /services, /industries, ...  → src/app/<slug>/page.jsx (statik rotalar)
 *   /yeni-sayfa                  → burası ([slug])
 *
 * İçerik stüdyoda yayınlanmışsa Firestore'dan, yoksa sayfanın şablonundan
 * gelir. Hiçbiri yoksa boş bir iskelet (menü + başlık + alt bilgi) gösterilir.
 */

import { useParams } from "next/navigation";
import LivePage from "../../components/LivePage";

export default function DynamicPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  return <LivePage pageKey={slug} />;
}