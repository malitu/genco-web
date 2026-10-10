/* GENCO — /en/privacy-policy (English) — KVKK notice.
   Turkish counterpart: /gizlilik (src/app/(tr)/gizlilik/page.jsx).
   /en/gizlilik redirects here; see next.config.js. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("gizlilik", "EN");

export const robots = {
  index: true,
  follow: true,
};

export default function PrivacyPolicyEn() {
  return (
    <>
      <JsonLd data={schemaPage("gizlilik", localePath("EN", "/gizlilik"), "EN")} />
      <LivePage pageKey="gizlilik" lang="EN" />
    </>
  );
}