/* GENCO — /en/insights/teknik-sartnameyi-netlestirmek page (English).
   Turkish counterpart: src/app/(tr)/insights/teknik-sartnameyi-netlestirmek/page.jsx */

import LivePage from "../../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../../lib/seo";

export const metadata = pageMetadata("yaziSartname", "EN");

export default function PageEn() {
  return (
    <>
      <JsonLd data={schemaPage("yaziSartname", localePath("EN", "/insights/teknik-sartnameyi-netlestirmek"), "EN")} />
      <LivePage pageKey="yaziSartname" lang="EN" />
    </>
  );
}
