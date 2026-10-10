/* GENCO — /contact (English) (canlı).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../components/JsonLd";
import { ORG, PAGES, pageUrl, pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("contact", "EN");

export default function ContactPage() {
  return (
    <>
      <JsonLd data={schemaPage("contact", localePath("EN", "/contact"), "EN")} />
      <LivePage pageKey="contact" lang="EN" />
    </>
  );
}