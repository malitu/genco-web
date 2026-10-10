/**
 * GENCO — Ana sayfa (sunucu bileşeni).
 * ---------------------------------------------------------------------------
 * İçerik stüdyoda yayınlanmışsa Firestore'dan gelir; yayınlanmamışsa kod
 * içindeki varsayılan şablon kullanılır.
 *
 * ÖNEMLİ: Bu okuma SUNUCUDA yapılır. Önceden istemci SDK'sıyla okunuyordu ve
 * üretimde getDoc() hiç tamamlanmıyordu — sayfa sessizce eski içeriği
 * gösteriyordu. REST ucu ([slug] ve sitemap.js'in zaten kullandığı yol)
 * güvenilir çalışıyor ve metin botlara JavaScript çalıştırmadan gidiyor.
 * Ayrıntı: src/lib/studioData.js
 */

import HomePage from "../../components/HomePage";
import JsonLd, { schemaPage } from "../../components/JsonLd";
import { pageMetadata, localePath } from "../../lib/seo";
import { yayinlananAnaSayfa } from "../../lib/studioData";

export const metadata = pageMetadata("home", "TR");

export default async function Home() {
  const blocks = await yayinlananAnaSayfa();

  return (
    <>
      <JsonLd data={schemaPage("home", localePath("TR", "/"), "TR")} />
      <HomePage blocks={blocks || []} mode="live" lang="TR" />
    </>
  );
}