"use client";

/**
 * Cloudflare Turnstile — görünmez CAPTCHA
 * ---------------------------------------------------------------------------
 * "Ben robot değilim" kutusu yerine gerçek bir CAPTCHA. Turnstile, kullanıcı
 * güvenilir olduğunda kutuyu hiç göstermez; şüpheli trafikte soru sorar.
 * Google reCAPTCHA'nın görsel bulmaca sorularını içermez, ücretsizdir.
 *
 * Neden elle yükleniyor?
 *   next/script ile denendi; /contact sayfasında hydration'ı bozduğu için
 *   sayfa etkileşimsiz kaldı (menü ve form çalışmıyordu). Bu yüzden betik
 *   doğrudan <head>'e ekleniyor ve window.turnstile hazır olana kadar yoklanıyor
 *   (CDN gecikmelerinde widget'ın hiç çizilmemesini önler).
 *
 * Site Key zaten tasarım olarak herkese açıktır (sayfa HTML'inde görünür),
 * bu yüzden değeri burada tutmak güvenlik riski oluşturmaz.
 *
 * NOT: Widget yalnızca Cloudflare'da tanımlı hostname'lerde çizilir. Yerelde
 * denemek için widget ayarlarına `localhost` de eklenmelidir.
 */

import { useEffect, useRef, useState } from "react";

const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAFMYYY_DdHhEpuSH";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Geçici kapatma anahtarı: "0" değerine alınınca CAPTCHA hiç yüklenmez. */
const ENABLED = process.env.NEXT_PUBLIC_TURNSTILE !== "0";

/** Betik yüklenirken widget'ın çizilmesini bekleme süresi (ms). */
const RENDER_TIMEOUT = 12000;

/**
 * @param {Function} onToken  CAPTCHA geçilince token'ı verir (null = sıfırla)
 * @param {boolean}  disabled Gönderim sırasında geçici olarak gizler
 */
export default function Turnstile({ onToken, disabled = false }) {
  const boxRef = useRef(null);
  const widgetRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const [failed, setFailed] = useState(false);

  onTokenRef.current = onToken;

  useEffect(() => {
    if (!ENABLED || !SITE_KEY) return;

    let cancelled = false;
    let timer = null;
    const startedAt = Date.now();

    /** Betiği <head>'e ekler (bir kez). */
    const injectScript = () => {
      if (document.querySelector(`script[src^="${SCRIPT_SRC}"]`)) return;
      const el = document.createElement("script");
      el.src = SCRIPT_SRC;
      el.async = true;
      el.defer = true;
      document.head.appendChild(el);
    };

    /**
     * Betik etiketi eklendi ama `window.turnstile` hemen hazır olmayabiliyor
     * (yavaş ağ, CDN gecikmesi). Bu yüzden hazır olana kadar kısa aralıklarla
     * yoklayıp widget'ı çiziyoruz.
     */
    const tryRender = () => {
      if (cancelled || widgetRef.current) return;

      const turnstile = window.turnstile;
      if (!turnstile || typeof turnstile.render !== "function") {
        if (Date.now() - startedAt < RENDER_TIMEOUT) {
          timer = setTimeout(tryRender, 250);
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

    injectScript();
    if (boxRef.current) tryRender();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Bileşen kalıcı olarak kapanmıyor; sadece çizim iptal ediliyor.
  useEffect(() => {
    if (!ENABLED) return;
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

  if (!ENABLED || !SITE_KEY || failed) return null;

  return <div ref={boxRef} className="min-h-[1px]" />;
}