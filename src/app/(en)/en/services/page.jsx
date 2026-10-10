/* GENCO — /en/services (English).
   Content comes from Firestore when published in the studio, otherwise from
   the template in src/components/PageTemplates.js.

   Server component so it can export metadata. The UI itself renders in the
   client component <LivePage />. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage, schemaServices } from "../../../../components/JsonLd";
import { PAGES, pageUrl, pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("services", "EN");

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={schemaPage("services", localePath("EN", "/services"), "EN")} />
      <JsonLd data={schemaServices(localePath("EN", "/services"), "EN")} />
      <LivePage pageKey="services" lang="EN" />
    </>
  );
}