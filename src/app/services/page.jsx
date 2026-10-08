/* GENCO — /services sayfası (canlı).
   İçerik stüdyoda yayınlanmışsa Firestore'dan, yayınlanmamışsa
   src/components/PageTemplates.js içindeki şablondan gelir.

   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için).
   Asıl arayüz <LivePage /> içinde, istemci bileşeni olarak çalışır. */

import LivePage from "../../components/LivePage";
import JsonLd, { schemaPage, schemaServices } from "../../components/JsonLd";
import { PAGES, pageUrl } from "../../lib/seo";

export const metadata = {
  title: PAGES.services.title,
  description: PAGES.services.description,
  alternates: {
    canonical: "/services",
    languages: { "tr-TR": "/services", "en": "/services?lang=en", "x-default": "/services" },
  },
  openGraph: {
    title: PAGES.services.title,
    description: PAGES.services.description,
    url: pageUrl("/services"),
  },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={schemaPage("services", "/services")} />
      <JsonLd data={schemaServices("/services")} />
      <LivePage pageKey="services" />
    </>
  );
}