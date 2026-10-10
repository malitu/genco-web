/* GENCO — /case-studies sayfası (canlı).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../components/JsonLd";
import { PAGES, pageUrl, pageMetadata, localePath } from "../../../lib/seo";

export const metadata = pageMetadata("caseStudies", "TR");

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={schemaPage("caseStudies", "/case-studies")} />
      <LivePage pageKey="caseStudies" />
    </>
  );
}