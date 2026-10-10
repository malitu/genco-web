/* GENCO — /en/insights/uretici-seciminde-karsilastirilacak-basliklar page (English).
   Turkish counterpart: src/app/(tr)/insights/uretici-seciminde-karsilastirilacak-basliklar/page.jsx */

import LivePage from "../../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../../lib/seo";

export const metadata = pageMetadata("yaziUretici", "EN");

export default function PageEn() {
  return (
    <>
      <JsonLd data={schemaPage("yaziUretici", localePath("EN", "/insights/uretici-seciminde-karsilastirilacak-basliklar"), "EN")} />
      <LivePage pageKey="yaziUretici" lang="EN" />
    </>
  );
}
