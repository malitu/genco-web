import { NextResponse } from "next/server";

/**
 * GENCO — İletişim formu alıcısı (sunucu tarafı)
 * ---------------------------------------------------------------------------
 * Tarayıcı buraya POST yapar. Burada:
 *   1. Alanlar doğrulanır (zorunluluk, e-posta biçimi, uzunluk).
 *   2. Cloudflare Turnstile CAPTCHA'sı sunucu tarafında doğrulanır.
 *      (Tarayıcıda doğrulama yapılsa botlar taklit edebilirdi.)
 *   3. Kaba kuvvet (rate limit) engellenir.
 *   4. Mesaj Web3Forms aracılığıyla info@gencotr.com adresine gönderilir.
 *
 * Gerekli ortam değişkenleri (Vercel → Settings → Environment Variables):
 *   WEB3FORMS_KEY           Web3Forms erişim anahtarı   (sunucuda gizli kalır)
 *   TURNSTILE_SECRET_KEY    Turnstile gizli anahtarı
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY  Turnstile site anahtarı (istemciye gider)
 *
 * CAPTCHA anahtarı tanımlı değilse doğrulama atlanır ve mesaj gönderilir;
 * yalnızca gizli bot tuzağı (honeypot) koruma sağlar.
 */

export const runtime = "nodejs";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAILTO = "mailto:info@gencotr.com";

/* --- Basit kaba kuvvet koruması -------------------------------------------
   Sunucusuz (serverless) ortamda bellek kısa ömürlüdür; yine de aynı IP'den
   gelen ani artışları yavaşlatır. Kalıcı koruma için Cloudflare kuralları
   kullanılmalıdır. */
const RATE_LIMIT = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip) {
  const now = Date.now();
  const hits = (RATE_LIMIT.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    RATE_LIMIT.set(ip, hits);
    return true;
  }
  hits.push(now);
  RATE_LIMIT.set(ip, hits);

  // Bellek taşmasını önlemek için eski kayıtları temizle
  if (RATE_LIMIT.size > 5000) {
    for (const [key, times] of RATE_LIMIT) {
      if (!times.some((t) => now - t < WINDOW_MS)) RATE_LIMIT.delete(key);
    }
  }
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Girdiyi düzleştirir ve makul uzunluğa kısar. */
const clean = (v, max = 2000) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";

export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "bilinmiyor";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }

  // Gizli bot tuzağı: ekranda yok, botlar doldurur
  if (clean(body.website, 100)) {
    // Bota başarı görüntüsü ver, e-posta gönderme
    return NextResponse.json({ ok: true });
  }

  const data = {
    name: clean(body.name, 120),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 40),
    message: clean(body.message, 4000),
    consent: body.consent === true,
    notRobot: body.notRobot === true,
    captchaToken: typeof body.captchaToken === "string" ? body.captchaToken : "",
  };

  if (!data.name || !data.email || !data.phone || !data.message) {
    return NextResponse.json(
      { ok: false, error: "Lütfen ad, e-posta, telefon ve mesaj alanlarını doldurun." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(data.email)) {
    return NextResponse.json(
      { ok: false, error: "E-posta adresi geçersiz görünüyor." },
      { status: 400 }
    );
  }
  if (!data.consent) {
    return NextResponse.json(
      { ok: false, error: "Devam etmek için gizlilik onayı gerekiyor." },
      { status: 400 }
    );
  }

  // --- CAPTCHA doğrulaması (sunucu tarafı) --------------------------------
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (secret) {
    if (!data.captchaToken) {
      return NextResponse.json(
        { ok: false, error: "CAPTCHA doğrulanamadı. Lütfen tekrar deneyin." },
        { status: 400 }
      );
    }
    try {
      const res = await fetch(TURNSTILE_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: data.captchaToken,
          remoteip: ip === "bilinmiyor" ? undefined : ip,
        }),
      });
      const result = await res.json();
      if (!result?.success) {
        return NextResponse.json(
          { ok: false, error: "CAPTCHA doğrulanamadı. Lütfen tekrar deneyin." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: "CAPTCHA servisine ulaşılamadı. Lütfen tekrar deneyin." },
        { status: 502 }
      );
    }
  }

  // --- E-posta gönderimi --------------------------------------------------
  const accessKey = process.env.WEB3FORMS_KEY;
  if (!accessKey) {
    console.error("WEB3FORMS_KEY tanımlı değil; mesaj gönderilemedi.");
    return NextResponse.json(
      {
        ok: false,
        fallback: true,
        error:
          "E-posta gönderimi şu an yapılandırılmamış. Lütfen info@gencotr.com adresine yazın.",
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Web3Forms önündeki Cloudflare, tarayıcı olmayan istekleri
        // (sunucu fonksiyonları dâhil) bot sanıp engelleyebiliyor. Tarayıcı
        // imzasına yakın başlıklar göndererek şansı artırıyoruz.
        "User-Agent":
          "Mozilla/5.0 (compatible; GENCOSite/1.0; +https://genco-web.vercel.app)",
        "Origin": "https://genco-web.vercel.app",
        "Referer": "https://genco-web.vercel.app/contact",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: "GENCO web sitesi — iletişim formu",
        from_name: `GENCO — ${data.name}`,
        // Gelen e-postada "Yanıtla" düğmesi ziyaretçiye gider.
        replyto: data.email,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: [
          data.message,
          "",
          "---",
          `Telefon: ${data.phone}`,
          `Gönderen: ${data.name} <${data.email}>`,
          "Kaynak: genco web sitesi iletişim formu",
        ].join("\n"),
        botcheck: "",
      }),
    });

    const json = await res.json().catch(() => ({}));

    if (json?.success) {
      return NextResponse.json({ ok: true });
    }

    console.error("Web3Forms reddetti:", json?.message || res.status);
    return NextResponse.json(
      {
        ok: false,
        fallback: true,
        error: "Mesaj gönderilemedi. Lütfen info@gencotr.com adresine yazın.",
      },
      { status: 502 }
    );
  } catch (e) {
    console.error("Gönderim hatası:", e);
    return NextResponse.json(
      {
        ok: false,
        fallback: true,
        error: "Mesaj gönderilemedi. Lütfen info@gencotr.com adresine yazın.",
      },
      { status: 502 }
    );
  }
}