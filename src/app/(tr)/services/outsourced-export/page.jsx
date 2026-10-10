/* GENCO — /services/outsourced-export sayfası (Türkçe).
   İçerik stüdyoda yayınlanmışsa Firestore'dan, yayınlanmamışsa
   src/components/PageTemplates.js içindeki şablondan gelir.

   Dış kaynaklı ihracat — hizmetin kapsamı, çıktısı ve raporlama biçimi burada açıklanır. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("outsourcedExport", "TR");

export default function Page() {
  return (
    <>
      <JsonLd data={schemaPage("outsourcedExport", localePath("TR", "/services/outsourced-export"), "TR")} />
      <LivePage pageKey="outsourcedExport" lang="TR" />
    </>
  );
}
