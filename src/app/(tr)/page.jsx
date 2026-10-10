/**
 * GENCO — Türkçe ana sayfa (canlı) · sunucu bileşeni.
 * ---------------------------------------------------------------------------
 * Dil artık URL'e bağlıdır. Bu dosya yalnızca Türkçe karşılıktır; İngilizce
 * karşılık src/app/(en)/en/page.jsx'de aynı bileşenleri besler.
 *
 * Sayfaya özel title / description ortak `pageMetadata()` yardımcısından gelir
 * (src/lib/seo.js) — böylece TR ve EN sayfaları aynı kaynaktan beslenir ve
 * iki dil birbirinden ayrılamaz.
 *
 * Veri çekme ve tasarım src/components/HomeClient.jsx içinde.
 */

import HomeClient from "../../components/HomeClient";
import JsonLd, { schemaPage } from "../../components/JsonLd";
import { pageMetadata, localePath } from "../../lib/seo";

export const metadata = pageMetadata("home", "TR");

export default function Home() {
  return (
    <>
      <JsonLd data={schemaPage("home", localePath("TR", "/"), "TR")} />
      <HomeClient lang="TR" />
    </>
  );
}