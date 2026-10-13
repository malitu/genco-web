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
/**
 * `<head>` içine basılacak satır içi snippet.
 *
 * `gtag('config', ID)` çağrısı Google'ın kanonik biçimiyle BİREBİR aynı
 * olacak şekilde yazıldı: ek seçenek nesnesi verilmiyor. `anonymize_ip`
 * kaldırıldı — GA4'te IP maskelemesi varsayılandır ve bu seçenek ölü
 * koddu; ayrıca Google'ın etiket doğrulayıcısı `gtag('config', ID)`
 * biçimini bekliyor, sondaki `, { ... }` eklendiğinde eşleşmiyor.
 *
 * Not: Bu metin doğrudan HTML'e yazıldığı için kullanıcı girdisi içermez;
 * yalnızca derleme zamanında sabitlenmiş ölçüm kimliği geçer.
 */
export const GA_SNIPPET = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', ${JSON.stringify(VARSAYILAN)});
gtag('js', new Date());
gtag('config', '${GA_ID}');
`.trim();
/**
 * NOT - Google Tag Assistant ve `async=""` denemesi
 * ---------------------------------------------------------------------------
 * JSX icinde `<script async src={...}>` yazildiginda React, boolean `async`
 * ozniteligini `async=""` olarak serilestirir:
 *
 *     <script async="" src="https://www.googletagmanager.com/gtag/js?id=...">
 *
 * Bu HTML'de gecerlidir; tarayici etiketi sorunsuz yukler ve olcum calisir
 * (dogrulandi: gtag.js HTTP 200, /g/collect HTTP 204).
 *
 * Denedigimiz cozum: etiketi `dangerouslySetInnerHTML` ile ham metin olarak
 * basmak. CALISMADI. React, `<script>` ogesinin icerigini "script data"
 * olarak isler; icindeki `<script ...>` etiketi metne donusur:
 *
 *     <script><script async src="..."></script></script>
 *
 * Bu bicimde gtag.js HIC yuklenmedi (tarayicida olculdu). Bu yuzden geri
 * alindi; etiket JSX ogesi olarak basilir ve olculmus calisan hali budur.
 *
 * Sonuc: `async=""` bir hata degil, React'in dogal davranisi. Tag
 * Assistant'in "Test Et" dugmesi sunucu HTML'ini indirip taradigi icin
 * bazi kurgularda etiketi gormeyebilir; bu bir GORUNTULEME sorunudur,
 * olcum degildir. Etiket calistigini dogrulayan yer: canli sayfada
 * dataLayer'da `consent,default` -> `js` -> `config` sirasi ve
 * `/g/collect` istegi.
 */
