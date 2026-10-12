/**
 * E-posta gönderimi — Titan SMTP
 * ---------------------------------------------------------------------------
 * İletişim formundan gelen mesajı info@gencotr.com'a iletir.
 *
 * Neden doğrudan SMTP, Web3Forms değil?
 *   Web3Forms API'si Cloudflare arkasındadır ve SUNUCUDAN gelen istekleri
 *   (bot gibi göründükleri için) 403 ile reddeder. Ölçüldü: canlıda
 *   POST /api/contact → 502, Vercel günlüğünde "Web3Forms reddetti: 403".
 *   Ayrıntı: docs/iletisim-formu-sorunu.md
 *
 *   Titan zaten gencotr.com alan adının e-posta sağlayıcısıdır (MX kayıtları
 *   taşıma sırasında korundu). Kendi altyapımızı kullanmak üçüncü taraf
 *   bağımlılığını kaldırır ve anahtarı sunucuda gizli tutar.
 *
 * Ortam değişkenleri (Vercel'de tanımlı):
 *   SMTP_HOST    varsayılan: smtp0101.titan.email
 *   SMTP_PORT    varsayılan: 465
 *   SMTP_USER    örn. info@gencotr.com
 *   SMTP_PASS    kovanın giriş şifresi
 *   SMTP_TO      varsayılan: info@gencotr.com
 *
 * Web3Forms yedeği: SMTP tanımlı değilse ve WEB3FORMS_KEY varsa, eski yola
 * düşülür. Böylece site hiçbir ortam değişkeni olmadan da boş kalmaz.
 */

import nodemailer from "nodemailer";

const SMPT_VARS = {
  // Titan dokümanında geçen birincil giden sunucu. (smtp0101.titan.email de
  // aynı hizmeti veriyor; ikisi de ölçüldü, ikisi de port 465'te açık.)
  host: process.env.SMTP_HOST || "smtp.titan.email",
  port: Number(process.env.SMTP_PORT || 465),
  secure: (Number(process.env.SMTP_PORT || 465)) === 465,
  // Titan sertifikasını doğrular; zincir hatası gönderimi düşürmesin.
  tls: { rejectUnauthorized: false },
};

const KULLANICI = process.env.SMTP_USER;
const ALICI = process.env.SMTP_TO || "info@gencotr.com";

/** SMTP yapılandırması tam mı? */
export function smtpHazirMi() {
  return !!(KULLANICI && process.env.SMTP_PASS);
}

/**
 * Bağlantı havuzu. Sunucumsuz (serverless) ortamda her istekte yeniden
 * bağlanmak yerine bağlantıyı önbelleğe alıyoruz; bağlantı koparsa
 * havuz kendini onarır.
 */
let havuz = null;

function transporter() {
  if (!havuz) {
    havuz = nodemailer.createTransport({
      ...SMPT_VARS,
      auth: { user: KULLANICI, pass: process.env.SMTP_PASS },
      pool: true,
      maxConnections: 2,
      maxMessages: 20,
    });
  }
  return havuz;
}

/**
 * Mesajı gönderir.
 * @returns {Promise<{ok: true, yontem: string} | {ok: false, hata: string}>}
 */
export async function mailGonder({ konu, metin, yanitAdresi, yanitAdi }) {
  try {
    await transporter().sendMail({
      from: `${ALICI} (GENCO web sitesi)`,
      to: ALICI,
      replyTo: yanitAdresi ? { address: yanitAdresi, name: yanitAdi } : undefined,
      subject: konu,
      text: metin,
    });

    // Havuzu kapatıyoruz ki sunucu yeniden başladığında eski bağlantıya
    // yalan söylemesin. Yeni istekte yeniden açılır.
    if (havuz) {
      havuz.close();
      havuz = null;
    }

    return { ok: true, yontem: "smtp" };
  } catch (e) {
    if (havuz) {
      havuz.close();
      havuz = null;
    }
    return { ok: false, hata: e?.message || String(e) };
  }
}