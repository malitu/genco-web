/**
 * Çerez izni — ortak durum yönetimi.
 * ---------------------------------------------------------------------------
 * Tek doğruluk kaynağı burasıdır; hem onay bandı hem analiz bileşeni aynı
 * fonksiyonları kullanır, böylece "bant var ama analiz yine yükleniyor"
 * gibi bir tutarsızlık oluşamaz.
 *
 * Neden gerekli:
 *   1. KVKK — analiz çerezleri kişisel veri sayılır; ziyaretçinin onayı
 *      olmadan toplanamaz. Türkiye, Google'ın onay zorunluluğu getirdiği
 *      Avrupa Ekonomik Alanı'nın içindedir; onay olmadan GA4 sessizce
 *      veriyi düşüyordu (ölçüldü: istek gidiyor, raporda "veri yok").
 *   2. Şeffaflık — ziyaretçi ne ölçtüğümüzü görebilmeli.
 *
 * Depolama: localStorage (çerez değil, yerel tercih). Ziyaretçi tarayıcı
 * verisini silerse bir daha sorulur.
 *
 * Durum değerleri:
 *   null    → henüz karar verilmemiş (band görünür)
 *   "kabul" → analiz yüklenir
 *   "red"   → analik hiç yüklenmez
 */

const ANAHTAR = "genco-ceerez-onayi";

/** Onay durumu değişince yayınlanan olay adı. */
export const IZIN_DEGISTI = "genco:izin-degisti";

/** @returns {"kabul"|"red"|null} */
export function izinOku() {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(ANAHTAR);
    return v === "kabul" || v === "red" ? v : null;
  } catch {
    // Gizli sekmede localStorage erişimi engelliyse kararsız sayılır.
    return null;
  }
}

/** Analiz çerezleri kullanılabilir mi? */
export function izinVar() {
  return izinOku() === "kabul";
}

function kaydet(deger) {
  try {
    window.localStorage.setItem(ANAHTAR, deger);
  } catch {
    /* yazılamıyorsa da band kapatılır, oturum boyunca geçerli sayılır */
  }
  window.dispatchEvent(new CustomEvent(IZIN_DEGISTI, { detail: deger }));
}

/** Ziyaretçi analiz çerezlerini kabul etti. */
export function izinVer() {
  kaydet("kabul");
}

/** Ziyaretçi analiz çerezlerini reddetti. */
export function izinReddet() {
  kaydet("red");
}

/** Geçmiş seçimi temizler (band bir daha görünür). */
export function izinSifirla() {
  try {
    window.localStorage.removeItem(ANAHTAR);
  } catch {
    /* yok sayılır */
  }
  window.dispatchEvent(new CustomEvent(IZIN_DEGISTI, { detail: null }));
}