/* GENCO — /services sayfası (canlı).
   İçerik stüdyoda yayınlanmışsa Firestore'dan, yayınlanmamışsa
   src/components/PageTemplates.js içindeki şablondan gelir.

   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için).
   Asıl arayüz <LivePage /> içinde, istemci bileşeni olarak çalışır. */

import LivePage from "../../../components/LivePage";
import JsonLd, { schemaPage, schemaServices } from "../../../components/JsonLd";
import { PAGES, pageUrl, pageMetadata, localePath } from "../../../lib/seo";

export const metadata = pageMetadata("services", "TR");

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={schemaPage("services", "/services")} />
      <JsonLd data={schemaServices("/services")} />
      <LivePage pageKey="services" />
    </>
  );
}