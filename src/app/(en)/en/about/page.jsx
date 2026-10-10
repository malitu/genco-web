/* GENCO — /about (English) (canlı).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../../components/JsonLd";
import { PAGES, pageUrl, pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("about", "EN");

export default function AboutPage() {
  return (
    <>
      <JsonLd data={schemaPage("about", localePath("EN", "/about"), "EN")} />
      <LivePage pageKey="about" lang="EN" />
    </>
  );
}