/* GENCO — /en/services/outsourced-export page (English).
   Turkish counterpart: src/app/(tr)/services/outsourced-export/page.jsx

   Dış kaynaklı ihracat — scope, deliverables and reporting are set out on this page. */

import LivePage from "../../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../../lib/seo";

export const metadata = pageMetadata("outsourcedExport", "EN");

export default function PageEn() {
  return (
    <>
      <JsonLd data={schemaPage("outsourcedExport", localePath("EN", "/services/outsourced-export"), "EN")} />
      <LivePage pageKey="outsourcedExport" lang="EN" />
    </>
  );
}
