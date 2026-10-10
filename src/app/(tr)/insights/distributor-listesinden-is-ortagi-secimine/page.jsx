/* GENCO — /insights/distributor-listesinden-is-ortagi-secimine (Türkçe).
   Sektör analizi yazısı. /insights indeks sayfasından bağlanır. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("yaziDistributor", "TR");

export default function Page() {
  return (
    <>
      <JsonLd data={schemaPage("yaziDistributor", localePath("TR", "/insights/distributor-listesinden-is-ortagi-secimine"), "TR")} />
      <LivePage pageKey="yaziDistributor" lang="TR" />
    </>
  );
}
