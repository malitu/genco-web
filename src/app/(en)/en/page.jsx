/**
 * GENCO — English home page (server component).
 * ---------------------------------------------------------------------------
 * Turkish counterpart: src/app/(tr)/page.jsx
 *
 * Content is read from Firestore ON THE SERVER (src/lib/studioData.js).
 * The client SDK read used to hang silently in production; the REST path is
 * reliable and also lets crawlers see the text without running JavaScript.
 */

import HomePage from "../../../components/HomePage";
import JsonLd, { schemaPage } from "../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../lib/seo";
import { yayinlananAnaSayfa } from "../../../lib/studioData";

export const metadata = pageMetadata("home", "EN");

export default async function HomeEn() {
  const blocks = await yayinlananAnaSayfa();

  return (
    <>
      <JsonLd data={schemaPage("home", localePath("EN", "/"), "EN")} />
      <HomePage blocks={blocks || []} mode="live" lang="EN" />
    </>
  );
}