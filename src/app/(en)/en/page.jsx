/**
 * GENCO — English home page (live) · server component.
 * ---------------------------------------------------------------------------
 * The language is defined by the URL: Turkish lives at `/`, English at `/en`.
 * Turkish counterpart: src/app/(tr)/page.jsx
 *
 * Page-level title / description come from the shared `pageMetadata()` helper
 * (src/lib/seo.js), so both languages are fed from a single source and can
 * never drift apart.
 *
 * Data fetching and rendering live in src/components/HomeClient.jsx.
 */

import HomeClient from "../../../components/HomeClient";
import JsonLd, { schemaPage } from "../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../lib/seo";

export const metadata = pageMetadata("home", "EN");

export default function HomeEn() {
  return (
    <>
      <JsonLd data={schemaPage("home", localePath("EN", "/"), "EN")} />
      <HomeClient lang="EN" />
    </>
  );
}