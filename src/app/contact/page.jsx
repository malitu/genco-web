/* GENCO — /contact sayfası (canlı).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../components/LivePage";
import JsonLd, { schemaPage } from "../../components/JsonLd";
import { ORG, PAGES, pageUrl } from "../../lib/seo";

export const metadata = {
  title: PAGES.contact.title,
  description: PAGES.contact.description,
  alternates: {
    canonical: "/contact",
    languages: {
      "tr-TR": "/contact",
      "en": "/contact?lang=en",
      "x-default": "/contact",
    },
  },
  openGraph: {
    title: PAGES.contact.title,
    description: PAGES.contact.description,
    url: pageUrl("/contact"),
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={schemaPage("contact", "/contact")} />
      <LivePage pageKey="contact" />
    </>
  );
}