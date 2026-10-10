/* GENCO — /services/distributor-development sayfası (Türkçe).
   İçerik stüdyoda yayınlanmışsa Firestore'dan, yayınlanmamışsa
   src/components/PageTemplates.js içindeki şablondan gelir.

   Alıcı ve distribütör geliştirme — hizmetin kapsamı, çıktısı ve raporlama biçimi burada açıklanır. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("distributorDevelopment", "TR");

export default function Page() {
  return (
    <>
      <JsonLd data={schemaPage("distributorDevelopment", localePath("TR", "/services/distributor-development"), "TR")} />
      <LivePage pageKey="distributorDevelopment" lang="TR" />
    </>
  );
}
