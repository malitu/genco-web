/* GENCO — /insights sayfası (canlı).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../components/JsonLd";
import { PAGES, pageUrl, pageMetadata, localePath } from "../../../lib/seo";

export const metadata = pageMetadata("insights", "TR");

export default function InsightsPage() {
  return (
    <>
      <JsonLd data={schemaPage("insights", "/insights")} />
      <LivePage pageKey="insights" />
    </>
  );
}