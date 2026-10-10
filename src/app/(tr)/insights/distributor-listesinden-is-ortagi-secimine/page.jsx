/* GENCO — /insights/distributor-listesinden-is-ortagi-secimine (Türkçe).
   Sektör analizi yazısı. /insights indeks sayfasından bağlanır. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage, schemaArticle } from "../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("yaziDistributor", "TR");

const YAZI = {
    title: "Distribütör Listesinden İş Ortağı Seçimine",
    description: "",
    date: "2026-10-11",
  };

export default function Page() {
  return (
    <>
      <JsonLd data={schemaArticle(localePath("TR", "/insights/distributor-listesinden-is-ortagi-secimine"), "TR", YAZI)} />
      <JsonLd data={schemaPage("yaziDistributor", localePath("TR", "/insights/distributor-listesinden-is-ortagi-secimine"), "TR")} />
      <LivePage pageKey="yaziDistributor" lang="TR" />
    </>
  );
}
