/* GENCO — /insights/uretici-seciminde-karsilastirilacak-basliklar (Türkçe).
   Sektör analizi yazısı. /insights indeks sayfasından bağlanır. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("yaziUretici", "TR");

export default function Page() {
  return (
    <>
      <JsonLd data={schemaPage("yaziUretici", localePath("TR", "/insights/uretici-seciminde-karsilastirilacak-basliklar"), "TR")} />
      <LivePage pageKey="yaziUretici" lang="TR" />
    </>
  );
}
