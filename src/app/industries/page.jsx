/* GENCO — /industries sayfası (canlı).
   İçerik stüdyoda yayınlanmışsa Firestore'dan, yayınlanmamışsa
   src/components/PageTemplates.js içindeki şablondan gelir.

   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../components/LivePage";
import JsonLd, { schemaPage, schemaSectorList } from "../../components/JsonLd";
import { PAGES, pageUrl } from "../../lib/seo";

export const metadata = {
  title: PAGES.industries.title,
  description: PAGES.industries.description,
  alternates: {
    canonical: "/industries",
    languages: {
      "tr-TR": "/industries",
      "x-default": "/industries",
    },
  },
  openGraph: {
    title: PAGES.industries.title,
    description: PAGES.industries.description,
    url: pageUrl("/industries"),
  },
};

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={schemaPage("industries", "/industries")} />
      <JsonLd data={schemaSectorList("/industries")} />
      <LivePage pageKey="industries" />
    </>
  );
}