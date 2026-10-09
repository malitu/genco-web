/**
 * GENCO — Ana Sayfa (canlı) · sunucu bileşeni.
 * ---------------------------------------------------------------------------
 * Sayfaya özel title / description burada tanımlanır (Next.js'in metadata
 * export'unu yalnızca sunucu bileşenleri verebilir). Veri çekme ve tasarım
 * src/components/HomeClient.jsx içinde; tasarım src/components/HomePage.jsx.
 *
 * Stüdyoda hiç blok yayınlanmamışsa eski statik tasarım olduğu gibi korunur.
 */

import HomeClient from "../components/HomeClient";
import JsonLd, { schemaPage } from "../components/JsonLd";
import { PAGES, pageUrl } from "../lib/seo";

export const metadata = {
  title: PAGES.home.title,
  description: PAGES.home.description,
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: PAGES.home.title,
    description: PAGES.home.description,
    url: pageUrl("/"),
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={schemaPage("home", "/")} />
      <HomeClient />
    </>
  );
}