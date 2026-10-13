/**
 * Google Analytics 4 onay (consent) yapılandırması.
 * ---------------------------------------------------------------------------
 * Bu dosya SUNUCUDA çalışan tek doğruluk kaynağıdır: hem `<head>` içine
 * yazılacak snippet'i hem de istemci tarafındaki güncelleme mantığını üretir.
 *
 * Neden ayrı dosya:
 *   Etiket `<head>` içinde, sunucu HTML'inde bulunmalıdır. Google Tag
 *   Assistant ve bazı tarayıcı eklentileri sayfayı indirip HTML'i tarayarak
 *   etiketi arar; JavaScript çalıştırmadan bulamaz. Bu yüzden snippet
 *   `next/script` ile değil, doğrudan `<script>` etiketi olarak basılır.
 *
 * Sıralama kritiktir (Google'ın istediği):
 *   1. consent default  -> hepsi denied (izin henüz yok)
 *   2. js               -> zaman damgası
 *   3. config           -> olcum kimligi
 * Onay, ancak bundan sonra "consent update" ile verilir. Tersi sırada
 * olsaydı onaysız ziyaretçi verisi işlenmiş sayılırdı.
 */

/** Ölçüm kimliği. Tanımlı değilse snippet hiç basılmaz. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Onay verilmeden önce gönderilen varsayılan sinyaller.
 *
 * Türkiye, Google'ın onay zorunluluğu getirdiği Avrupa Ekonomik Alanı'nın
 * içindedir; onay olmadan analiz verisi işlenemez (KVKK).
 *
 * Reklam sinyalleri (ad_storage, ad_user_data, ad_personalization) bilinçli
 * olarak `denied` bırakılmıştır: reklam kampanyası çalıştırılmıyor, bu
 * sinyalleri açmak yalnızca gereksiz veri toplamak olurdu.
 */
export const VARSAYILAN = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "denied",
  security_storage: "granted", // CSRF gibi güvenlik amaçlı çerez onay gerektirmez
  wait_for_update: 500,
};

/**
 * `<head>` içine basılacak satır içi snippet.
 *
 * Not: Bu metin doğrudan HTML'e yazıldığı için kullanıcı girdisi içermez;
 * yalnızca derleme zamanında sabitlenmiş ölçüm kimliği geçer.
 */
export const GA_SNIPPET = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', ${JSON.stringify(VARSAYILAN)});
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });
`.trim();
