/* GENCO — /insights/uretici-seciminde-karsilastirilacak-basliklar (Türkçe).
   Sektör analizi yazısı. /insights indeks sayfasından bağlanır. */

import LivePage from "../../../../components/LivePage";
import JsonLd, { schemaPage, schemaArticle } from "../../../../components/JsonLd";
import { pageMetadata, localePath } from "../../../../lib/seo";

export const metadata = pageMetadata("yaziUretici", "TR");

const YAZI = {
    title: "Üretici Seçiminde Fiyatın Yanında Neye Bakılmalı?",
    description: "",
    date: "2026-10-11",
  };

export default function Page() {
  return (
    <>
      <JsonLd data={schemaArticle(localePath("TR", "/insights/uretici-seciminde-karsilastirilacak-basliklar"), "TR", YAZI)} />
      <JsonLd data={schemaPage("yaziUretici", localePath("TR", "/insights/uretici-seciminde-karsilastirilacak-basliklar"), "TR")} />
      <LivePage pageKey="yaziUretici" lang="TR" />
    </>
  );
}
