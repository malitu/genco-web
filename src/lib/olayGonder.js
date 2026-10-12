/**
 * GA4 olay gönderimi (istemci tarafı yardımcı).
 * ---------------------------------------------------------------------------
 * Bu dosya ayrı tutuldu çünkü "use client" işareti olmayan bir dosyadan
 * window'a erişen bir fonksiyon export edersek, sunucu tarafında da
 * derlenip hata verir (bkz. ilk deneme: Vercel build'i /en/about'ta
 * başarısız oldu).
 *
 * Kullanım:
 *   import { olayGonder } from "../lib/olayGonder";
 *   olayGonder("generate_lead", { hizmet: "..." });
 *
 * Ölçüm kimliği (NEXT_PUBLIC_GA_ID) tanımlı değilse veya reklam engelleyici
 * gtag'ı engellediyse sessizce vazgeçer — form çalışmaya devam eder.
 */

import { izinVar } from "./ceerez";

/** Ölçüm kimliği. Tanımlı değilse hiçbir şey gönderilmez. */
const ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Tek seferlik olay bildirir.
 *
 * Neden gerekli: varsayılan GA4 yalnızca sayfa görüntülemelerini ölçer.
 * B2B bir sitede en önemli soru "kaç teklif talebi geldi" sorusudur ve bu
 * sayfa görüntülemesinden anlaşılmaz. Bu olay raporda "generate_lead"
 * (potansiyel müşteri) adıyla görünür ve dönüşüm olarak işaretlenebilir.
 *
 * @param {string} olay   olay adı (örn. "generate_lead")
 * @param {object} detay  ek parametreler (örn. { hizmet: "..." })
 */
export function olayGonder(olay, detay = {}) {
  if (typeof window === "undefined") return;
  if (!ID) return;
  if (typeof window.gtag !== "function") return;
  // Onay verilmeden olay gönderilmez; GA4 yine de boş ping yollar, veri tutmaz.
  if (!izinVar()) return;
  window.gtag("event", olay, detay);
}