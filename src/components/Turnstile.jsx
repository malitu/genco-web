"use client";

/**
 * Cloudflare Turnstile — görünmez CAPTCHA
 * ---------------------------------------------------------------------------
 * "Ben robot değilim" kutusu yerine gerçek bir CAPTCHA. Turnstile, kullanıcı
 * güvenilir olduğunda kutuyu hiç göstermez; şüpheli trafikte soru sorar.
 * Ücretsizdir ve Google reCAPTCHA'nın görsel bulmaca sorularını içermez.
 *
 * Anahtar tanımlı değilse bile form çalışmaya devam eder (gizli bot tuzağı
 * devrede kalır); sadece CAPTCHA katmanı devre dışı olur.
 */

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

let turnstilePromise = null;

/** Turnstile betiğini bir kez yükler. */
function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstilePromise) return turnstilePromise;

  turnstilePromise = new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    el.async = true;
    el.defer = true;
    el.onload = () => resolve(window.turnstile);
    el.onerror = () => reject(new Error("CAPTCHA yüklenemedi"));
    document.head.appendChild(el);
  });

  return turnstilePromise;
}

/**
 * @param {Function} onToken  CAPTCHA geçilince token'ı verir (null = temizle)
 * @param {boolean}  disabled Gönderim sırasında kilitler
 */
export default function Turnstile({ onToken, disabled = false }) {
  const boxRef = useRef(null);
  const widgetRef = useRef(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    loadScript()
      .then((turnstile) => {
        if (cancelled || !boxRef.current) return;
        widgetRef.current = turnstile.render(boxRef.current, {
          sitekey: SITE_KEY,
          // Kullanıcı güvenilirse Turnstile hiçbir şey göstermez.
          appearance: "interaction-only",
          theme: "light",
          callback: (token) => onTokenRef.current?.(token),
          "expired-callback": () => onTokenRef.current?.(null),
          "error-callback": () => onTokenRef.current?.(null),
        });
      })
      .catch(() => {
        /* Betik yüklenemezse form yine de gönderilebilir kalır. */
      });

    return () => {
      cancelled = true;
      if (widgetRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetRef.current);
        } catch {
          /* yoksay */
        }
      }
    };
  }, []);

  // Gönderim sırasında widget'ı geçici olarak gizle
  useEffect(() => {
    if (!widgetRef.current || !window.turnstile) return;
    if (disabled) window.turnstile.hide(widgetRef.current);
    else window.turnstile.show(widgetRef.current);
  }, [disabled]);

  if (!SITE_KEY) return null;

  return <div ref={boxRef} className="min-h-[1px]" />;
}

export const turnstileEnabled = () => Boolean(SITE_KEY);