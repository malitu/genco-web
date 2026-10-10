/* GENCO — /en/insights/distributor-listesinden-is-ortagi-secimine page (English).
   Turkish counterpart: src/app/(tr)/insights/distributor-listesinden-is-ortagi-secimine/page.jsx */

import LivePage from "../../../../../components/LivePage";
import JsonLd, { schemaPage, schemaArticle } from "../../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../../lib/seo";

export const metadata = pageMetadata("yaziDistributor", "EN");

const YAZI = {
    title: "From a Distributor List to Choosing a Business Partner",
    description: "",
    date: "2026-10-11",
  };

export default function PageEn() {
  return (
    <>
      <JsonLd data={schemaArticle(localePath("EN", "/insights/distributor-listesinden-is-ortagi-secimine"), "EN", YAZI)} />
      <JsonLd data={schemaPage("yaziDistributor", localePath("EN", "/insights/distributor-listesinden-is-ortagi-secimine"), "EN")} />
      <LivePage pageKey="yaziDistributor" lang="EN" />
    </>
  );
}
