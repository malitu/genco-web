/**
 * Vaka analizleri — veri modeli ve kayıt listesi.
 * ---------------------------------------------------------------------------
 * /case-studies indeks sayfasındaki içerik ile bu dosyadaki kayıtlar
 * birbirinden ayrıdır:
 *
 *   • İndeks sayfası, "bu alanda çalışıyoruz" anlatımı taşır. Bu bir
 *     hizmet tanımıdır, proje anlatımı değildir ve vaka diye sunulmaz.
 *   • Bu dosya, gerçekten yürütülmüş operasyonları taşır. Her kayıt kendi
 *     adresinde (/case-studies/<slug>) açılır ve ayrı bir JSON-LD şeması,
 *     sitemap kaydı ve iki dilli karşılık alır.
 *
 * Neden ayrı: geçmişte indeks sayfasındaki hizmet açıklamaları "VAKA / 01"
 * gibi etiketlenmişti. İçerik bir vaka olmadığı halde vaka gibi sunulması,
 * hem arama motorları hem de yapay zekâ asistanları önünde yanlış
 * sinyaldir. Artık etiket yalnızca burada, gerçek kayıt için kullanılır.
 *
 * ---------------------------------------------------------------------------
 * YENİ VAKA EKLENMESİ
 * ---------------------------------------------------------------------------
 * VAKALAR dizisine yeni bir nesne ekleyin. Zorunlu alanlar: slug, sektor,
 * urun, zorluk, kapsam, sonuc. Eksik alanı olan kayıt yayımlanmaz —
 * hem sayfa 404 döner hem sitemap'e girmez (bkz. vakaEksikAlanlar).
 *
 * Gizlilik: müşteri adı veya hacim yayımlanamıyorsa `anonim: true` yazın;
 * sayfada "firma adı paylaşılmamaktadır" notuna dönüşür. Alanı uydurmak
 * yerine bu bayrağı kullanmak, alıntılanabilir ama doğrulanabilir içerik
 * üretmenin yoludur.
 *
 * Örnek:
 *
 *   {
 *     slug: "celik-cubuk-ithalat",
 *     tarih: "2026-10-12",
 *     anonim: true,
 *     baslik:  { tr: "Çelik Çubuk İthalatında Teknik Uyum", en: "..." },
 *     giris:   { tr: "...", en: "..." },
 *     sektor:  { tr: "Vasıflı Çelik", en: "Engineering Steel" },
 *     urun:    { tr: "Çelik çubuk", en: "Steel bars" },
 *     ulke:    { tr: "ABD", en: "United States" },        // istege bagli
 *     zorluk:  { tr: "...", en: "..." },
 *     kapsam:  [{ tr: "...", en: "..." }, { tr: "...", en: "..." }],
 *     sonuc:   { tr: "...", en: "..." },
 *     etiketler: [{ tr: "EN 10204", en: "EN 10204" }],    // istege bagli
 *   }
 *
 * Yayım sonrası: `npm run dogrula` çalıştırılır.
 */

/** Slug biçimi: yalnızca küçük harf, rakam ve tire (URL'de görünür). */
const GECERLI = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Yayımlanmış vaka kayıtları.
 *
 * Şu an boştur: henüz yayımlanabilir, doğrulanabilir proje anlatımı
 * girilmedi. Dizi boşken /case-studies/<slug> adresleri 404 döner ve
 * sitemap'e kayıt girmez — yanlış bir vaka sayfası yayımlanmaz.
 */
export const VAKALAR = [];

export { GECERLI as VAKA_SLUG_GECERLI };

/** Slug'ı normalize eder (baştaki/sondaki tire ve boşluklar temizlenir). */
export function normalizeSlug(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Geçerli slug mı? */
export function gecerliSlug(s) {
  return GECERLI.test(s || "");
}

/** Tek bir vaka kaydını slug ile bulur. */
export function vakaBul(slug) {
  return VAKALAR.find((v) => v.slug === slug) || null;
}

/** Tüm kayıtların slug'ları (statik rota üretimi için). */
export function vakaSluglari() {
  return VAKALAR.map((v) => v.slug);
}

/**
 * Bir kaydın eksiksiz olduğunu doğrular. Eksik alanı olan kayıt
 * yanlışlıkla yayımlanmasın diye sayfa 404 döner ve sitemap'e girmez.
 *
 * Not: `kapsam` bir madde listesi olduğu için dizi olarak kabul edilir;
 * her maddenin iki dilli olması gerekir.
 */
export function vakaEksikAlanlar(vaka) {
  const zorunlu = ["slug", "sektor", "urun", "zorluk", "kapsam", "sonuc"];
  const eksik = [];
  for (const alan of zorunlu) {
    const v = vaka[alan];
    let dolu;
    if (typeof v === "string") {
      dolu = v.trim().length > 0;
    } else if (Array.isArray(v)) {
      dolu =
        v.length > 0 &&
        v.every((m) => typeof m === "string" || (m && m.tr && m.en));
    } else {
      dolu = !!(v && v.tr && v.en);
    }
    if (!dolu) eksik.push(alan);
  }
  if (!gecerliSlug(vaka.slug)) eksik.push("slug(geçersiz biçim)");
  return eksik;
}