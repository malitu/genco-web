/* GENCO — /insights/teknik-sartnameyi-netlestirmek (Türkçe).
   Sektör analizi yazısı. /insights indeks sayfasından bağlanır. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("yaziSartname", "TR");

export default function Page() {
  return (
    <>
      <JsonLd data={schemaPage("yaziSartname", localePath("TR", "/insights/teknik-sartnameyi-netlestirmek"), "TR")} />
      <LivePage pageKey="yaziSartname" lang="TR" />
    </>
  );
}
