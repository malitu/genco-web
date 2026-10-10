/* GENCO — /insights/teknik-sartnameyi-netlestirmek (Türkçe).
   Sektör analizi yazısı. /insights indeks sayfasından bağlanır. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage, schemaArticle } from "../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("yaziSartname", "TR");

const YAZI = {
    title: "Teklif Öncesi Teknik Şartnameyi Netleştirmek",
    description: "",
    date: "2026-10-11",
  };

export default function Page() {
  return (
    <>
      <JsonLd data={schemaArticle(localePath("TR", "/insights/teknik-sartnameyi-netlestirmek"), "TR", YAZI)} />
      <JsonLd data={schemaPage("yaziSartname", localePath("TR", "/insights/teknik-sartnameyi-netlestirmek"), "TR")} />
      <LivePage pageKey="yaziSartname" lang="TR" />
    </>
  );
}
