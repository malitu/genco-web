"use client";

/**
 * Cloudflare Turnstile — görünmez CAPTCHA
 * ---------------------------------------------------------------------------
 * "Ben robot değilim" kutusu yerine gerçek bir CAPTCHA. Turnstile, kullanıcı
 * güvenilir olduğunda kutuyu hiç göstermez; şüpheli trafikte soru sorar.
 * Google reCAPTCHA'nın görsel bulmaca sorularını içermez, ücretsizdir.
 *
 * Betik `next/script` ile yüklenir; elle <script> eklemek yerine bunu
 * kullanıyoruz çünkü yükleme sırası ve tekrar çağırma Next.js tarafından
 * güvenli yönetiliyor.
 *
 * Site Key zaten tasarım olarak herkese açıktır (sayfa HTML'inde görünür),
 * bu yüzden değeri burada tutmak güvenlik riski oluşturmaz.
 *
 * NOT: Widget yalnızca Cloudflare'da tanımlı hostname'lerde çizilir. Yerelde
 * denemek için widget ayarlarına `localhost` de eklenmelidir.
 */

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAFMYYY_DdHhEpuSH";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * @param {Function} onToken  CAPTCHA geçilince token'ı verir (null = sıfırla)
 * @param {boolean}  disabled Gönderim sırasında geçici olarak gizler
 */
export default function Turnstile({ onToken, disabled = false }) {
  const boxRef = useRef(null);
  const widgetRef = useRef(null);
  const timerRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  onTokenRef.current = onToken;

  // Betik hazır olduğunda widget'ı çiz
  useEffect(() => {
    if (!ready || widgetRef.current) return;

    let cancelled = false;
    let tries = 0;

    /**
     * Betik etiketi yüklenmiş görünse de `window.turnstile` hemen hazır
     * olmayabiliyor (yavaş ağ, CDN gecikmesi). Bu yüzden kısa aralıklarla
     * yoklayıp hazır olduğunda çiziyoruz.
     */
    const tryRender = () => {
      if (cancelled || widgetRef.current) return;
      const turnstile = window.turnstile;

      if (!turnstile || typeof turnstile.render !== "function") {
        if (tries++ < 40) {
          timerRef.current = setTimeout(tryRender, 250);
        } else {
          console.warn(
            "CAPTCHA betiği zamanında yüklenmedi; form korumasız gönderilecek."
          );
          setFailed(true);
        }
        return;
      }

      try {
        widgetRef.current = turnstile.render(boxRef.current, {
          sitekey: SITE_KEY,
          // Kullanıcı güvenilirse Turnstile hiçbir şey göstermez.
          appearance: "interaction-only",
          theme: "light",
          callback: (token) => onTokenRef.current?.(token),
          "expired-callback": () => onTokenRef.current?.(null),
          "error-callback": () => {
            console.warn("Turnstile doğrulanamadı; CAPTCHA bu oturumda atlanıyor.");
            onTokenRef.current?.(null);
          },
        });
      } catch (e) {
        // Geçersiz site key ya da tanımlı olmayan hostname gibi durumlarda
        // ziyaretçiyi engellemiyoruz; gizli bot tuzağı devrede.
        console.warn("Turnstile çizilemedi:", e?.message || e);
        setFailed(true);
      }
    };

    if (!boxRef.current) return;
    tryRender();

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, [ready]);

  useEffect(() => {
    return () => {
      if (widgetRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetRef.current);
        } catch {
          /* yoksay */
        }
      }
      widgetRef.current = null;
    };
  }, []);

  // Gönderim sırasında widget'ı gizle
  useEffect(() => {
    if (!widgetRef.current || !window.turnstile) return;
    try {
      if (disabled) window.turnstile.hide(widgetRef.current);
      else window.turnstile.show(widgetRef.current);
    } catch {
      /* yoksay */
    }
  }, [disabled]);

  if (!SITE_KEY || failed) return null;

  return (
    <>
      <Script
        src={SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onError={() => {
          console.warn("CAPTCHA betiği yüklenemedi; form yine de çalışır.");
          setFailed(true);
        }}
      />
      <div ref={boxRef} className="min-h-[1px]" />
    </>
  );
}