"use client";

/* GENCO — /insights sayfası (canlı).
   İçerik stüdyoda yayınlanmışsa Firestore'dan, yayınlanmamışsa
   src/components/PageTemplates.js içindeki şablondan gelir. */

import LivePage from "../../components/LivePage";

export default function InsightsPage() {
  return <LivePage pageKey="insights" />;
}