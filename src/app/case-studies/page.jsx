/* GENCO — /case-studies sayfası (canlı).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../components/LivePage";
import JsonLd, { schemaPage } from "../../components/JsonLd";
import { PAGES, pageUrl } from "../../lib/seo";

export const metadata = {
  title: PAGES.caseStudies.title,
  description: PAGES.caseStudies.description,
  alternates: {
    canonical: "/case-studies",
    languages: {
      "tr-TR": "/case-studies",
      "en": "/case-studies?lang=en",
      "x-default": "/case-studies",
    },
  },
  openGraph: {
    title: PAGES.caseStudies.title,
    description: PAGES.caseStudies.description,
    url: pageUrl("/case-studies"),
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={schemaPage("caseStudies", "/case-studies")} />
      <LivePage pageKey="caseStudies" />
    </>
  );
}