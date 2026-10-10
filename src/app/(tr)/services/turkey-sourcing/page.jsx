/* GENCO — /services/turkey-sourcing sayfası (Türkçe).
   İçerik stüdyoda yayınlanmışsa Firestore'dan, yayınlanmamışsa
   src/components/PageTemplates.js içindeki şablondan gelir.

   Türkiye'den tedarik — hizmetin kapsamı, çıktısı ve raporlama biçimi burada açıklanır. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("turkeySourcing", "TR");

export default function Page() {
  return (
    <>
      <JsonLd data={schemaPage("turkeySourcing", localePath("TR", "/services/turkey-sourcing"), "TR")} />
      <LivePage pageKey="turkeySourcing" lang="TR" />
    </>
  );
}
