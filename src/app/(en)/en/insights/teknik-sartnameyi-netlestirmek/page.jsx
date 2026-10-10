/* GENCO — /en/insights/teknik-sartnameyi-netlestirmek page (English).
   Turkish counterpart: src/app/(tr)/insights/teknik-sartnameyi-netlestirmek/page.jsx */

import LivePage from "../../../../../components/LivePage";
import JsonLd, { schemaPage, schemaArticle } from "../../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../../lib/seo";

export const metadata = pageMetadata("yaziSartname", "EN");

const YAZI = {
    title: "Clarifying the Technical Specification Before Requesting Quotes",
    description: "",
    date: "2026-10-11",
  };

export default function PageEn() {
  return (
    <>
      <JsonLd data={schemaArticle(localePath("EN", "/insights/teknik-sartnameyi-netlestirmek"), "EN", YAZI)} />
      <JsonLd data={schemaPage("yaziSartname", localePath("EN", "/insights/teknik-sartnameyi-netlestirmek"), "EN")} />
      <LivePage pageKey="yaziSartname" lang="EN" />
    </>
  );
}
