/* GENCO — /industries (English) (canlı).
   İçerik stüdyoda yayınlanmışsa Firestore'dan, yayınlanmamışsa
   src/components/PageTemplates.js içindeki şablondan gelir.

   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage, schemaSectorList } from "../../../../components/JsonLd";
import { PAGES, pageUrl, pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("industries", "EN");

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={schemaPage("industries", localePath("EN", "/industries"), "EN")} />
      <JsonLd data={schemaSectorList(localePath("EN", "/industries"), "EN")} />
      <LivePage pageKey="industries" lang="EN" />
    </>
  );
}