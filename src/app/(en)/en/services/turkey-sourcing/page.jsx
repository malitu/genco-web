/* GENCO — /en/services/turkey-sourcing page (English).
   Turkish counterpart: src/app/(tr)/services/turkey-sourcing/page.jsx

   Türkiye'den tedarik — scope, deliverables and reporting are set out on this page. */

import LivePage from "../../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../../lib/seo";

export const metadata = pageMetadata("turkeySourcing", "EN");

export default function PageEn() {
  return (
    <>
      <JsonLd data={schemaPage("turkeySourcing", localePath("EN", "/services/turkey-sourcing"), "EN")} />
      <LivePage pageKey="turkeySourcing" lang="EN" />
    </>
  );
}
