/* GENCO — /insights sayfası (canlı).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../components/LivePage";
import JsonLd, { schemaPage } from "../../components/JsonLd";
import { PAGES, pageUrl } from "../../lib/seo";

export const metadata = {
  title: PAGES.insights.title,
  description: PAGES.insights.description,
  alternates: {
    canonical: "/insights",
    languages: {
      "tr-TR": "/insights",
      "en": "/insights?lang=en",
      "x-default": "/insights",
    },
  },
  openGraph: {
    title: PAGES.insights.title,
    description: PAGES.insights.description,
    url: pageUrl("/insights"),
  },
};

export default function InsightsPage() {
  return (
    <>
      <JsonLd data={schemaPage("insights", "/insights")} />
      <LivePage pageKey="insights" />
    </>
  );
}