/* GENCO — /insights (English) (canlı).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../components/JsonLd";
import { PAGES, pageUrl, pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("insights", "EN");

export default function InsightsPage() {
  return (
    <>
      <JsonLd data={schemaPage("insights", localePath("EN", "/insights"), "EN")} />
      <LivePage pageKey="insights" lang="EN" />
    </>
  );
}