"use client";

/* GENCO — /about sayfası (canlı).
   İçerik stüdyoda yayınlanmışsa Firestore'dan, yayınlanmamışsa
   src/components/PageTemplates.js içindeki şablondan gelir. */

import LivePage from "../../components/LivePage";

export default function AboutPage() {
  return <LivePage pageKey="about" />;
}