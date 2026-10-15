/**
 * Stüdyo dokümanını SUNUCU tarafında okuma (src/lib/studioData.js)
 * ---------------------------------------------------------------------------
 * Neden bu dosya var:
 *
 * Ana sayfanın içeriği Firestore'da yayınlanır ve istemci SDK'sıyla okunuyordu.
 * Bu yol üretimde "sessizce bozuldu": getDoc() hata vermiyor, Promise hiç
 * tamamlanmıyor ve sayfa kod varsayılanlarına düşüyordu. Kullanıcı yeni içerik
 * yazıyor, Yayınla'ya basıyor, site eskisini göstermeye devam ediyordu.
 *
 * REST ucu (aşağıda) aynı veriyi sorunsuz döndürüyor; [slug] sayfası ve
 * sitemap.js zaten baştan beri bu yolu kullanıyor. Ana sayfayı da taşıyoruz.
 *
 * Yan fayda: içerik sunucuda render edildiği için arama motorları botu
 * JavaScript çalıştırmadan metni görüyor.
 *
 * DÖNÜŞÜM: Firestore REST, veriyi "tel" biçiminde verir
 * ({ stringValue, mapValue, arrayValue }). Blok motoru düz JavaScript bekler.
 * `coz()` bu çeviriyi yapar.
 */

import { FIREBASE_API_KEY, FIREBASE_PROJECT_ID, firestoreBelgeUrl } from "./firebaseConfig";

/** Firestore tel biçimini düz JavaScript'e çevirir. */
export function coz(deger) {
  if (deger === null || deger === undefined) return null;
  if (typeof deger !== "object") return deger;

  if ("stringValue" in deger) return deger.stringValue;
  if ("booleanValue" in deger) return deger.booleanValue;
  if ("integerValue" in deger) return Number(deger.integerValue);
  if ("doubleValue" in deger) return deger.doubleValue;
  if ("timestampValue" in deger) return deger.timestampValue;
  if ("nullValue" in deger) return null;

  if ("arrayValue" in deger) {
    return (deger.arrayValue.values || []).map(coz);
  }

  if ("mapValue" in deger) {
    const cikti = {};
    for (const [anahtar, alt] of Object.entries(deger.mapValue.fields || {})) {
      cikti[anahtar] = coz(alt);
    }
    return cikti;
  }

  return null;
}

/**
 * Firestore okumasının beklemesi gereken en uzun süre.
 *
 * Search Console uyarısı: "The page response time of 0,51 seconds is longer
 * than the recommended limit of 0,4 seconds."
 *
 * Ölçülen: Firestore REST çağrısı 260–1200 ms sürüyor ve `cache: "no-store"`
 * ile HER istekte tekrarlanıyordu. Ana sayfanın ilk baytı bu yüzden
 * 0,51–0,80 saniye çıkıyordu; statik sayfalar 0,35 saniyede.
 *
 * Çözüm: kısa süreli önbellek. Yayınlanan içerik 30 saniye içinde yine
 * görünür — panele girip yayınladıktan hemen sonra bakıldığında fark
 * edilmez. Ziyaretçi ise her istekte Firestore'a gitmez.
 */
const ONBELLEK_SURESI = 30;

/** Süre dolmadan yeniden okunacak son başarılı yanıt ve zamanı. */
let onbellek = null;
let onbellekZamani = 0;

/**
 * Ana dokümanı okur.
 * @returns {Promise<object|null>} null ise sayfa kendi kod şablonunu kullanır.
 */
export async function studioBelge() {
  // Önbellek taze ise ağa hiç gidilmez.
  if (onbellek && Date.now() - onbellekZamani < ONBELLEK_SURESI * 1000) {
    return onbellek;
  }

  try {
    const controller = new AbortController();
    const zamanAsimi = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(firestoreBelgeUrl(), {
      signal: controller.signal,
      // Next.js veri önbelleği: istek aynı anda birleştirilir, kısa süre
      // sunucu tarafında saklanır. `no-store` bunu tamamen kapatıyordu.
      next: { revalidate: ONBELLEK_SURESI },
    });
    clearTimeout(zamanAsimi);

    if (!res.ok) return null;

    // Dikkat (iki katmanlı tuzak):
    //  1) Firestore REST, belgenin alanlarını `fields` içinde döndürür —
    //     belge nesnesinin kendisi değil, `.fields` kullanılır.
    //  2) `fields` bir {mapValue:{fields}} sarmalı DEĞİLDİR; alan adı →
    //     değer olan düz bir haritadır. O yüzden elle gezilir. Alt değerler
    //     zaten sarmallıdır ve coz() onları doğru çözer.
    //
    // Bu iki noktayı atlamak, ana sayfanın hata vermeden boş dönmesine
    // yol açmıştı: site eski içeriği göstermeye devam ediyordu.
    const yanit = await res.json();
    const cikti = {};
    for (const [ad, deger] of Object.entries(yanit.fields || {})) {
      cikti[ad] = coz(deger);
    }

    // Başarılı okuma önbelleğe alınır. Hata durumunda ALINMAZ; yoksa
    // geçici bir ağ hatası 30 saniye boyunca boş sayfa üretir.
    onbellek = cikti;
    onbellekZamani = Date.now();
    return cikti;
  } catch {
    // Ağ hatası / zaman aşımı: sayfa kod şablonuyla devam eder.
    return null;
  }
}

/**
 * Yayınlanmış ana sayfa bloklarını döndürür.
 * @returns {Promise<Array|null>}
 */
export async function yayinlananAnaSayfa() {
  const belge = await studioBelge();
  const bloklar = belge?.pagesContent?.home;
  return Array.isArray(bloklar) && bloklar.length ? bloklar : null;
}