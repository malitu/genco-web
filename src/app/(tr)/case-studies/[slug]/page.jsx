/* GENCO - /case-studies/<slug> (Türkçe).
   --------------------------------------------------------------------------
   Vaka analizi detay sayfası. Kayıtlar src/lib/vaka.js içinde tanımlıdır.

   Neden dinamik rota: vaka sayısı sabit değil; her yeni vaka için ayrı bir
   dizin ve page.jsx açmak yerine tek rota tüm kayıtları üretir. Yazı
   detay sayfaları ayrı dosya olarak yazılmıştı; bu desen burada
   genellenmiştir, ileride yazılara da taşınabilir.

   Kayıt listesi boşken bu rota hiçbir sayfa üretmez ve bilinmeyen bir slug
   için 404 döner — henüz yayımlanmayan bir vaka adresi oluşmaz. */

import { notFound } from "next/navigation";

import VakaSayfasi from "../../../../components/VakaSayfasi";
import JsonLd, {
  schemaPage,
  schemaCaseStudy,
} from "../../../../components/JsonLd";
import { VAKALAR, vakaBul, vakaEksikAlanlar } from "../../../../lib/vaka";
import { pageMetadata, localePath } from "../../../../lib/seo";

/** Build sırasında bilinen tüm vaka adresleri için statik sayfa üretilir. */
export function generateStaticParams() {
  return VAKALAR.map((v) => ({ slug: v.slug }));
}

/**
 * Vaka başlığı ve özeti iki dilli olduğundan metadata üretimi parametreye
 * bağlıdır; slug'a göre çözülür.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const vaka = vakaBul(slug);

  // Bilinmeyen vaka: sayfa 404 dönecek, metadata da bir şey bildirmesin.
  if (!vaka) return {};

  const baslik = (vaka.baslik?.tr || vaka.sektor?.tr || "Vaka Analizi").trim();
  const ozet =
    vaka.giris?.tr ||
    [vaka.zorluk?.tr, vaka.kapsam && vaka.kapsam[0]?.tr]
      .filter(Boolean)
      .join(" ") ||
    "";

  return {
    ...pageMetadata("caseStudies", "TR"),
    // Kök düzen şablonu ('%s | GENCO') başlığa yeniden ekler. `absolute`
    // ile devre dışı bırakılır; aksi halde "… | GENCO | GENCO" oluşur.
    title: { absolute: `${baslik} | GENCO` },
    description: ozet.slice(0, 158),
    alternates: {
      canonical: `https://www.gencotr.com/case-studies/${slug}`,
      languages: {
        "tr-TR": `https://www.gencotr.com/case-studies/${slug}`,
        "en-GB": `https://www.gencotr.com/en/case-studies/${slug}`,
        "x-default": `https://www.gencotr.com/case-studies/${slug}`,
      },
    },
    openGraph: {
      ...(pageMetadata("caseStudies", "TR").openGraph || {}),
      title: `${baslik} | GENCO`,
      description: ozet.slice(0, 158),
      url: `https://www.gencotr.com/case-studies/${slug}`,
      locale: "tr_TR",
    },
  };
}

export default async function VakaPage({ params }) {
  const { slug } = await params;
  const vaka = vakaBul(slug);

  // Yayımlanmamış vaka: gerçek 404. Bilinmeyen bir adresin 200 dönmesi
  // "soft 404" sinyalidir ve tüm domainin indekslenmesini zayıflatır.
  if (!vaka) notFound();

  // Eksik alanı olan kayıt yayımlanmaz: yarım bir vaka, eksik gösterilmemeli.
  const eksik = vakaEksikAlanlar(vaka);
  if (eksik.length) notFound();

  const yol = localePath("TR", `/case-studies/${slug}`);

  return (
    <>
      <JsonLd data={schemaCaseStudy(yol, "TR", vaka)} />
      <JsonLd data={schemaPage("caseStudies", yol, "TR")} />
      <VakaSayfasi vaka={vaka} lang="TR" />
    </>
  );
}