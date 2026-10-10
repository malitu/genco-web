/* GENCO — /en/insights/uretici-seciminde-karsilastirilacak-basliklar page (English).
   Turkish counterpart: src/app/(tr)/insights/uretici-seciminde-karsilastirilacak-basliklar/page.jsx */

import LivePage from "../../../../../components/LivePage";
import JsonLd, { schemaPage, schemaArticle } from "../../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../../lib/seo";

export const metadata = pageMetadata("yaziUretici", "EN");

const YAZI = {
    title: "What to Look At Beyond Price When Choosing a Manufacturer",
    description: "",
    date: "2026-10-11",
  };

export default function PageEn() {
  return (
    <>
      <JsonLd data={schemaArticle(localePath("EN", "/insights/uretici-seciminde-karsilastirilacak-basliklar"), "EN", YAZI)} />
      <JsonLd data={schemaPage("yaziUretici", localePath("EN", "/insights/uretici-seciminde-karsilastirilacak-basliklar"), "EN")} />
      <LivePage pageKey="yaziUretici" lang="EN" />
    </>
  );
}
