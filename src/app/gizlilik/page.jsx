/* GENCO — /gizlilik sayfası (KVKK aydınlatma metni).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../components/LivePage";
import JsonLd, { schemaPage } from "../../components/JsonLd";
import { PAGES, pageUrl } from "../../lib/seo";

export const metadata = {
  title: PAGES.gizlilik.title,
  description: PAGES.gizlilik.description,
  alternates: {
    canonical: "/gizlilik",
    languages: {
      "tr-TR": "/gizlilik",
      "en": "/gizlilik?lang=en",
      "x-default": "/gizlilik",
    },
  },
  openGraph: {
    title: PAGES.gizlilik.title,
    description: PAGES.gizlilik.description,
    url: pageUrl("/gizlilik"),
  },
  // Hukuki metinlerde arama sonucu önizlemesi (snippet) kısa tutulur.
  robots: { index: true, follow: true, "max-snippet": -1 },
};

export default function GizlilikPage() {
  return (
    <>
      <JsonLd data={schemaPage("gizlilik", "/gizlilik")} />
      <LivePage pageKey="gizlilik" />
    </>
  );
}