/* GENCO — /gizlilik sayfası (KVKK aydınlatma metni).
   Bu dosya sunucu bileşenidir (metadata dışa aktarabilmek için). */

import LivePage from "../../../components/LivePage";
import JsonLd, { schemaPage } from "../../../components/JsonLd";
import { PAGES, pageUrl, pageMetadata, localePath } from "../../../lib/seo";

export const metadata = pageMetadata("gizlilik", "TR");

export const robots = {
  index: true,
  follow: true,
};

export default function GizlilikPage() {
  return (
    <>
      <JsonLd data={schemaPage("gizlilik", "/gizlilik")} />
      <LivePage pageKey="gizlilik" />
    </>
  );
}