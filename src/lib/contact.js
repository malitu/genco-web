/**
 * GENCO — İletişim formu (istemci tarafı)
 * ---------------------------------------------------------------------------
 * Mesajı sunucudaki /api/contact rotasına gönderir. Orada CAPTCHA doğrulanır
 * ve e-posta info@gencotr.com'a iletilir.
 *
 * Neden sunucu üzerinden?
 *   • CAPTCHA'nın sunucu tarafında doğrulanabilmesi (tarayıcıda doğrulama
 *     sahte olur).
 *   • Web3Forms anahtarı istemci paketine gömülmez, yani sızamaz.
 *
 * Gönderim başarısız olursa mesaj kaybolmaz: kullanıcının e-posta
 * uygulaması hazır metinle açılır.
 */

const API_URL = "/api/contact";
export const CONTACT_EMAIL = "info@gencotr.com";

/**
 * @param {object} data { name, email, phone, message, consent, notRobot, captchaToken, website }
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function sendContactMessage(data) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));

    if (res.ok && json?.ok) return { ok: true };
    return { ok: false, error: json?.error || "Mesaj gönderilemedi." };
  } catch {
    return {
      ok: false,
      error: "Bağlantı kurulamadı. Mesajınız e-posta uygulamanızda açıldı.",
    };
  }
}

/**
 * Yedek yöntem: kullanıcının kendi e-posta uygulamasını açar, mesaj hazır
 * yazılı gelir. Böylece hiçbir koşulda talep kaybolmaz.
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

  window.location.href =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent("GENCO web sitesi — iletişim formu")}` +
    `&body=${encodeURIComponent(body)}`;
}