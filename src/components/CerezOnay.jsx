"use client";

/**
 * Çerez onay bandı (KVKK / GDPR uyumlu).
 * ---------------------------------------------------------------------------
 * Alt tarafa sabitlenen küçük bir bant. Ziyaretçi iki seçenekten birini
 * seçer:
 *   • Kabul et  → analiz çerezleri etkinleşir (Google Analytics yüklenir)
 *   • Reddet     → analiz hiç yüklenmez, site tamamen çalışır
 *
 * Neden analiz "kabul" olmadan hiç yüklenmiyor:
 *   Google, Avrupa Ekonomik Alanı'ndaki mülklerde onaysız veri toplamayı
 *   kısıtlıyor. Ölçüm: istek gidiyor (HTTP 204) ama raporda "veri yok"
 *   görünüyordu. İzin gelene kadar betek hiç çağrılmıyor.
 *
 * Metin iki dildedir ve `lang` özelliğine göre seçilir; iki kök düzen
 * (app/(tr) ve app/(en)/en) aynı bileşeni kullanır.
 *
 * Karar localStorage'da saklanır; sayfa yeniden yüklenince bant bir daha
 * görünmez. "Tercihlerimi değiştir" bağlantısı kararı geri alabilir.
 */

import { useEffect, useState } from "react";
import {
  izinOku,
  izinVer,
  izinReddet,
  izinSifirla,
} from "../lib/ceerez";

const METIN = {
  TR: {
    baslik: "Çerez kullanımı",
    govde:
      "Hangi sayfaların okunduğunu anlamak için Google Analytics kullanıyoruz. " +
      "Bu çerezler yalnızca onay verirseniz çalışır; onay vermezseniz Google " +
      "Analytics veri toplamaz. Vercel Web Analytics ise çerezsiz çalışır, IP " +
      "adresi kısaltılır ve her zaman etkindir.",
    kabul: "Kabul et",
    reddet: "Reddet",
    degistir: "Çerez tercihlerimi değiştir",
    politika: "Gizlilik Politikası",
    /* Ekran okuyucu duyurusu: karar ne olursa olsun doğru cümleyi söylemeli.
       Ölçülen hata: "Reddet" seçildiğinde de "kabul edildi" deniyordu. */
    onayBildirimi: "Analytics çerezleri kabul edildi.",
    retBildirimi: "Analytics çerezleri reddedildi.",
  },
  EN: {
    baslik: "Cookie use",
    govde:
      "We use Google Analytics to understand which pages are read. These cookies " +
      "only work if you accept them; if you decline, Google Analytics collects " +
      "nothing. Vercel Web Analytics is cookieless, truncates the IP address and " +
      "is always active.",
    kabul: "Accept",
    reddet: "Decline",
    degistir: "Change cookie preferences",
    politika: "Privacy Policy",
    onayBildirimi: "Analytics cookies accepted.",
    retBildirimi: "Analytics cookies declined.",
  },
};

export default function CerezOnay({ lang = "TR" }) {
  const [durum, setDurum] = useState(null); // null = henüz bilinmiyor
  const [gizli, setGizli] = useState(true);
  const en = lang === "EN";
  const t = en ? METIN.EN : METIN.TR;
  const politikaYolu = en ? "/en/privacy-policy" : "/gizlilik";

  useEffect(() => {
    // İlk değer localStorage'dan; sunucuda render edilemez (hydration).
    const mevcut = izinOku();
    setDurum(mevcut);
    setGizli(mevcut !== null);
  }, []);

  function karar(eylem) {
    if (eylem === "kabul") izinVer();
    else if (eylem === "red") izinReddet();
    setDurum(eylem === "kabul" ? "kabul" : "red");
    setGizli(true);
  }

  function sifirla() {
    izinSifirla();
    setDurum(null);
    setGizli(false);
  }

  /* Karar verilmişse yalnızca ekran okuyucu duyurusu kalır.
     Duyuru, kararın kendisinden türetilir: "kabul" dışındaki her durum
     (yani "red") reddedildi olarak bildirilir. Ölçülen hata: "Reddet"
     seçildiğinde de "kabul edildi" yazıyordu. */
  if (durum !== null) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        {gizli ? (
          <div className="sr-only" aria-live="polite">
            {durum === "kabul" ? t.onayBildirimi : t.retBildirimi}
          </div>
        ) : null}
      </div>
    );
  }

  if (gizli) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="ceerez-baslik"
      aria-describedby="ceerez-aciklama"
      data-testid="ceerez-bandi"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-5">
        <div className="min-w-0">
          <h2 id="ceerez-baslik" className="text-sm font-bold text-slate-900">
            {t.baslik}
          </h2>
          <p id="ceerez-aciklama" className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {t.govde}{" "}
            <a
              href={politikaYolu}
              className="font-medium text-orange-600 underline underline-offset-2 hover:text-orange-700"
            >
              {t.politika}
            </a>
          </p>
        </div>

        <div className="flex shrink-0 flex-row gap-3">
          <button
            type="button"
            onClick={() => karar("red")}
            data-testid="ceerez-reddet"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:flex-none"
          >
            {t.reddet}
          </button>
          <button
            type="button"
            onClick={() => karar("kabul")}
            data-testid="ceerez-kabul"
            className="flex-1 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:flex-none"
          >
            {t.kabul}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Gizlilik sayfasındaki "tercihlerimi değiştir" bağlantısı için.
 *
 * Ölçülen hata: `onClick={sifirla}` yazılmıştı, ancak `sifirla` bir üst
 * bileşenin (CerezOnay) içinde tanımlıydı ve buraya kapsam dışıydı —
 * tıklandığında ReferenceError. Bu bileşen bağımsız olmalı: kararı
 * sıfırlar ve bandın yeniden görünmesi için sayfayı yeniler.
 */
export function CerezTercihBaglantisi({ lang = "TR" }) {
  const en = lang === "EN";
  const t = en ? METIN.EN : METIN.TR;
  return (
    <button
      type="button"
      onClick={() => {
        izinSifirla();
        // Bandın anında geri gelmesi için sayfayı yeniden çiz.
        window.location.reload();
      }}
      className="font-medium text-orange-600 underline underline-offset-2 hover:text-orange-700"
    >
      {t.degistir}
    </button>
  );
}