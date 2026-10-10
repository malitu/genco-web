/* GENCO — /en/services/distributor-development page (English).
   Turkish counterpart: src/app/(tr)/services/distributor-development/page.jsx

   Alıcı ve distribütör geliştirme — scope, deliverables and reporting are set out on this page. */

import LivePage from "../../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../../lib/seo";

export const metadata = pageMetadata("distributorDevelopment", "EN");

export default function PageEn() {
  return (
    <>
      <JsonLd data={schemaPage("distributorDevelopment", localePath("EN", "/services/distributor-development"), "EN")} />
      <LivePage pageKey="distributorDevelopment" lang="EN" />
    </>
  );
}
