/* GENCO — /en/insights/distributor-listesinden-is-ortagi-secimine page (English).
   Turkish counterpart: src/app/(tr)/insights/distributor-listesinden-is-ortagi-secimine/page.jsx */

import LivePage from "../../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../../lib/seo";

export const metadata = pageMetadata("yaziDistributor", "EN");

export default function PageEn() {
  return (
    <>
      <JsonLd data={schemaPage("yaziDistributor", localePath("EN", "/insights/distributor-listesinden-is-ortagi-secimine"), "EN")} />
      <LivePage pageKey="yaziDistributor" lang="EN" />
    </>
  );
}
