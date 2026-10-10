import './globals.css';

/**
 * GENCO — 404 sayfası.
 * ---------------------------------------------------------------------------
 * Sitenin iki kök düzeni vardır (app/(tr) ve app/(en)/en) ve /admin kendi
 * düzenine sahiptir. Bu dosya hiçbir route group'a girmeyen, eşleşmeyen
 * adresler için kullanılır.
 *
 * Neden önemli: bilinmeyen bir adres düzgün bir 404 sayfasıyla döndüğünde
 * arama motorlarına doğru "bu sayfa yok" sinyali verir. Çıplak bir hata
 * ekranı hem kullanıcıya kötü görünür hem de indekslemeyi zayıflatır.
 *
 * Türkçe adresler Türkçe, /en/... adresleri İngilizce metin gösterir.
 */

import Link from "next/link";

export const metadata = {
  title: "Sayfa bulunamadı — GENCO",
  robots: { index: false, follow: true },
};

function Icerik({ en }) {
  return en
    ? {
        kod: "404",
        baslik: "This page could not be found",
        metin:
          "The address you followed may be out of date or spelled differently. You can start from the home page or reach us directly.",
        ana: "Back to home",
        yardim: "Need help?",
      }
    : {
        kod: "404",
        baslik: "Aradığınız sayfa bulunamadı",
        metin:
          "Adres değişmiş, yazım hatalı olabilir ya da sayfa kaldırılmış olabilir. Ana sayfadan devam edebilir veya doğrudan bize ulaşabilirsiniz.",
        ana: "Ana sayfaya dön",
        yardim: "Yardım mı gerekiyor?",
      };
}

/**
 * @param {{ params: Promise<{ locale?: string }> }} props
 */
export default async function NotFound({ params }) {
  // Next.js en az Next 15'te params async'tir; güvenli tarafta kalmak için
  // yakalanır (params undefined gelirse sayfa yine de render edilir).
  let adres = "";
  try {
    const p = await params;
    adres = p?.locale || "";
  } catch {
    adres = "";
  }

  // /en/... ile başlayan adresler İngilizce karşılık gösterir.
  const en = typeof adres === "string" && adres.startsWith("en");
  const c = Icerik({ en });
  const anaSayfa = en ? "/en" : "/";

  return (
    <html lang={en ? "en" : "tr"}>
      <body className="bg-[#fafafa] text-[#1e293b] antialiased min-h-screen">
        <main className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-lg w-full text-center">
            <p className="text-[#f97316] font-bold text-xs uppercase tracking-widest mb-4">
              GENCO
            </p>
            <h1 className="text-6xl sm:text-7xl font-bold text-[#0f172a] leading-none mb-4">
              {c.kod}
            </h1>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-4">{c.baslik}</h2>
            <p className="text-[#475569] leading-relaxed mb-8">{c.metin}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={anaSayfa}
                className="inline-flex items-center justify-center bg-[#f97316] text-white px-6 py-3 text-sm font-bold rounded-lg hover:bg-orange-600 transition"
              >
                {c.ana}
              </Link>
              <Link
                href={en ? "/en/contact" : "/contact"}
                className="inline-flex items-center justify-center border border-[#0f172a] text-[#0f172a] px-6 py-3 text-sm font-bold rounded-lg hover:border-[#f97316] hover:text-[#f97316] transition"
              >
                {c.yardim}
              </Link>
            </div>

            <p className="mt-10 text-xs text-slate-400">
              info@gencotr.com · +90 505 926 12 51
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}