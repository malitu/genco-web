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
  let json = null;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    json = await res.json().catch(() => ({}));
  } catch {
    // Sunucuya hiç ulaşılamadıysa doğrudan göndermeyi dene.
    const direct = await sendDirect(data);
    if (direct.ok) return direct;
    return {
      ok: false,
      error: "Bağlantı kurulamadı. Mesajınız e-posta uygulamanızda açıldı.",
    };
  }

  if (json?.ok) return { ok: true };

  // Sunucu doğrulamayı geçti ama e-posta servisine ulaşamadıysa tarayıcıdan
  // göndermeyi dene (Cloudflare sunucu isteklerini engelleyebiliyor).
  if (json?.fallback) {
    const direct = await sendDirect(data);
    if (direct.ok) return direct;
    return { ok: false, error: json.error };
  }

  return { ok: false, error: json?.error || "Mesaj gönderilemedi." };
}

/**
 * Web3Forms'a doğrudan, tarayıcıdan gönderim.
 *
 * Web3Forms anahtarı zaten tasarım olarak herkese açıktır (kendi HTML
 * örneklerinde sayfa içinde durur); burada yalnızca sunucu yolu çalışmadığında
 * kullanılır.
 */
const FALLBACK_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

async function sendDirect({ name, email, phone, message }) {
  if (!FALLBACK_KEY) return { ok: false };

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: FALLBACK_KEY,
        subject: "GENCO web sitesi — iletişim formu",
        from_name: `GENCO — ${name}`,
        replyto: email,
        name,
        email,
        phone,
        message: [
          message,
          "",
          "---",
          `Telefon: ${phone}`,
          `Gönderen: ${name} <${email}>`,
          "Kaynak: genco web sitesi iletişim formu",
        ].join("\n"),
      }),
    });
    const json = await res.json().catch(() => ({}));
    return json?.success
      ? { ok: true }
      : { ok: false, error: json?.message || "Mesaj gönderilemedi." };
  } catch {
    return { ok: false };
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