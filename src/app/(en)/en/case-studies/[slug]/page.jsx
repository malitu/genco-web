/* GENCO - /en/case-studies/<slug> page (English).
   --------------------------------------------------------------------------
   Turkish counterpart: src/app/(tr)/case-studies/[slug]/page.jsx
   Kayıtlar src/lib/vaka.js içinde tanımlıdır; iki dil aynı kaydı paylaşır,
   yalnızca gösterilen metin ve canonical/hreflang adresleri ayrılır. */

import { notFound } from "next/navigation";

import VakaSayfasi from "../../../../../components/VakaSayfasi";
import JsonLd, {
  schemaPage,
  schemaCaseStudy,
} from "../../../../../components/JsonLd";
import { VAKALAR, vakaBul, vakaEksikAlanlar } from "../../../../../lib/vaka";
import { pageMetadata, localePath } from "../../../../../lib/seo";

export function generateStaticParams() {
  return VAKALAR.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const vaka = vakaBul(slug);
  if (!vaka) return {};

  const baslik = (vaka.baslik?.en || vaka.sektor?.en || "Case Study").trim();
  const ozet =
    vaka.giris?.en ||
    [vaka.zorluk?.en, vaka.kapsam && vaka.kapsam[0]?.en]
      .filter(Boolean)
      .join(" ") ||
    "";

  return {
    ...pageMetadata("caseStudies", "EN"),
    // Kök düzen şablonu ('%s | GENCO') başlığa yeniden ekler. `absolute`
    // ile devre dışı bırakılır; aksi halde "… | GENCO | GENCO" oluşur.
    title: { absolute: `${baslik} | GENCO` },
    description: ozet.slice(0, 158),
    alternates: {
      canonical: `https://www.gencotr.com/en/case-studies/${slug}`,
      languages: {
        "tr-TR": `https://www.gencotr.com/case-studies/${slug}`,
        "en-GB": `https://www.gencotr.com/en/case-studies/${slug}`,
        "x-default": `https://www.gencotr.com/case-studies/${slug}`,
      },
    },
    openGraph: {
      ...(pageMetadata("caseStudies", "EN").openGraph || {}),
      title: `${baslik} | GENCO`,
      description: ozet.slice(0, 158),
      url: `https://www.gencotr.com/en/case-studies/${slug}`,
      locale: "en_GB",
    },
  };
}

export default async function VakaPageEn({ params }) {
  const { slug } = await params;
  const vaka = vakaBul(slug);

  if (!vaka) notFound();

  const eksik = vakaEksikAlanlar(vaka);
  if (eksik.length) notFound();

  const yol = localePath("EN", `/case-studies/${slug}`);

  return (
    <>
      <JsonLd data={schemaCaseStudy(yol, "EN", vaka)} />
      <JsonLd data={schemaPage("caseStudies", yol, "EN")} />
      <VakaSayfasi vaka={vaka} lang="EN" />
    </>
  );
}