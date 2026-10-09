/* GENCO — /about sayfası (canlı).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../components/LivePage";
import JsonLd, { schemaPage } from "../../components/JsonLd";
import { PAGES, pageUrl } from "../../lib/seo";

export const metadata = {
  title: PAGES.about.title,
  description: PAGES.about.description,
  alternates: {
    canonical: "/about",
    languages: { "tr-TR": "/about", "x-default": "/about" },
  },
  openGraph: {
    title: PAGES.about.title,
    description: PAGES.about.description,
    url: pageUrl("/about"),
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={schemaPage("about", "/about")} />
      <LivePage pageKey="about" />
    </>
  );
}