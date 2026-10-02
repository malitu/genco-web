/**
 * GENCO — İletişim formu gönderimi
 * ---------------------------------------------------------------------------
 * Form verisini e-posta olarak info@gencotr.com'a iletir.
 *
 * Neden doğrudan Firebase ile göndermiyoruz?
 *   Firebase projesi ücretsiz planda (Spark) olduğu için Cloud Functions ve
 *   "Trigger Email" eklentisi kullanılamıyor. Bu yüzden form, Web3Forms
 *   adlı form gönderim servisine post edilir; servis e-postayı bizim
 *   belirlediğimiz adrese iletir.
 *
 * ACCESS_KEY nasıl alınır?
 *   1. https://web3forms.com adresine ücretsiz kayıt olun.
 *   2. Dashboard'da "Access Key" bölümündeki anahtarı kopyalayın.
 *   3. Aşağıdaki ACCESS_KEY sabitini kendi anahtarınızla değiştirin.
 *   Anahtar boşsa form mailto: yedeğine düşer (kullanıcının mail uygulaması
 *   açılır) — hâlâ mesaj kaybolmaz, ama otomatik gönderim olmaz.
 */

/** info@gencotr.com adresine gönderir. */
const CONTACT_EMAIL = "info@gencotr.com";

/**
 * Web3Forms erişim anahtarı.
 *
 * Sıra: önce NEXT_PUBLIC_WEB3FORMS_KEY ortam değişkeni, yoksa aşağıdaki
 * sabit. Boş bırakılırsa form mailto: yedeğine düşer (kullanıcının mail
 * uygulaması açılır) — mesaj yine kaybolmaz, ama otomatik gönderim olmaz.
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

/** Konu satırı — gelen kutusunda kolay ayırt etmek için. */
const SUBJECT = "GENCO web sitesi — iletişim formu";

/**
 * Formu Web3Forms'a gönderir.
 *
 * @param {object} data  { name, email, phone, message, botcheck }
 * @returns {Promise<{ok: boolean, message: string}>}
 */
export async function sendContactMessage(data) {
  const { name, email, phone, message, botcheck } = data;

  // Tarayıcıda doğrulama (sunucu yok, form kendi kontrolünü yapar)
  if (!ACCESS_KEY) {
    return { ok: false, code: "NO_KEY", message: "E-posta anahtarı tanımlı değil." };
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: SUBJECT,
        from_name: `GENCO — ${name}`,
        replyto: email,
        name,
        email,
        phone,
        message,
        // Web3Forms spam tuzağı: insan doldurmaz, botlar doldurur.
        botcheck: botcheck || "",
      }),
    });

    const json = await res.json().catch(() => ({}));

    if (json?.success) {
      return { ok: true, message: "Mesajınız iletildi." };
    }
    return {
      ok: false,
      code: json?.message || "UNKNOWN",
      message: json?.message || "Mesaj gönderilemedi.",
    };
  } catch (err) {
    return {
      ok: false,
      code: "NETWORK",
      message: "Bağlantı kurulamadı.",
    };
  }
}

/**
 * Yedek yöntem: kullanıcının kendi e-posta uygulamasını açar, mesaj hazır
 * yazılı gelir. Web3Forms anahtarı yoksa veya gönderim başarısız olduğunda
 * çağrılır — böylece mesaj hiçbir koşulda kaybolmaz.
 */
export function openMailFallback({ name, email, phone, message }) {
  const body = [
    `Ad Soyad: ${name}`,
    `E-posta: ${email}`,
    `Telefon: ${phone || "-"}`,
    "",
    "Mesaj:",
    message,
    "",
    "--",
    "Bu mesaj GENCO web sitesindeki iletişim formundan gönderilmiştir.",
  ].join("\n");

  const href =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(SUBJECT)}` +
    `&body=${encodeURIComponent(body)}`;

  window.location.href = href;
}

export const contactEmail = CONTACT_EMAIL;