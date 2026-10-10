/**
 * Firebase yapılandırması — TEK doğruluk kaynağı (sunucu + istemci).
 * ---------------------------------------------------------------------------
 * Bu dosya daha önce src/lib/firebase.js içinde, istemciye özel olarak duruyordu.
 * Sunucu tarafı okuma katmanı (studioData.js, ozelSayfa.js, sitemap.js) aynı
 * API anahtarına ihtiyaç duyuyordu ama anahtar ortam değişkeninde tanımlı
 * DEĞİLDİ. Sonuç: ana sayfa, özel sayfalar ve sitemap sessizce boş dönüyordu —
 * hata yok, sadece içerik gelmiyordu.
 *
 * Çözüm: anahtar burada sabit tanımlı, her yer buradan içe aktarıyor.
 * Ortam değişkeni tanımlıysa o önceliklidir.
 *
 * Not: Bu bir Firebase Web API anahtarıdır; tarayıcıya açık olması normaldir.
 * Asıl koruma Firestore güvenlik kurallarıdır. (Kuralların herkese açık olması
 * ayrı bir konu — docs/dogrulanmis-sirket-bilgileri.md'de kayıtlı.)
 */

export const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyAnAih19--l7BLzm8mHQSyKQetIZJiSX1M";

export const FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "genco-platform";

export const FIREBASE_DATABASE_ID = "(default)";

/** Firestore REST okuma ucu. */
export function firestoreBelgeUrl(yol = "settings/genco_studio") {
  return (
    `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}` +
    `/databases/${FIREBASE_DATABASE_ID}/documents/${yol}` +
    `?key=${FIREBASE_API_KEY}`
  );
}