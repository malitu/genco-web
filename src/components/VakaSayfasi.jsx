"use client";

/**
 * GENCO - Vaka analizi detay sayfası (canlı görünüm).
 * ---------------------------------------------------------------------------
 * /case-studies/<slug> sayfasının gövdesini src/lib/vaka.js'deki tek bir kayıt
 * üzerinden kurar. Diğer alt sayfalarla aynı blok motorunu (GencoBlocks)
 * kullanır; görünüm ayrıcalığı oluşmaz.
 *
 * Neden istemci bileşeni:
 * Bloklar sunucuda üretilip SitePage'e geçirildiğinde "use client" sınırı
 * nedeniyle render sırasında tip alanı kayboluyor; nav/footer bloğu
 * featureBlock'a dönüşüp şablon yer tutucularını basıyordu
 * ("Bölüm Başlığı", "Açıklama metni."). Alt sayfaların hepsi bu yüzden
 * veriyi istemcide üretiyor (bkz. LivePage). Burada da aynı desen
 * uygulanır: veri sunucuda doğrulanır (404 kararı), bloklar burada kurulur.
 *
 * ---------------------------------------------------------------------------
 * İKİ KURAL — BUNLAR BOZULURSA YER TUTUCU METİN ÇIKAR
 * ---------------------------------------------------------------------------
 *
 * 1) Metinler daima İKİ DİLLİ NESNE olarak verilir ({ tr, en }).
 *    Render katmanı (normaliseBlock) tek dilli kayıtları iki dillileştirir;
 *    düz string verilirse sistem o metni İngilizce kabul edip Türkçe
 *    karşılığını şablondan alır. Sonuç: TR sayfasında yabancı metin,
 *    EN sayfasında boş alan.
 *
 * 2) Kullanılmayan alan İKİ DİLLİ BOŞ NESNE olarak verilir ({ tr:"", en:"" }).
 *    Alan hiç verilmezse featureBlock şablonunun örnek metinleri devreye
 *    girer ve sayfada "Bölüm Başlığı" / "Açıklama metni." görünür.
 *
 * Boş bırakılan içerik alanı (ülke, etiketler) sayfada hiç basılmaz —
 * yarım kalmış bir vaka eksik gösterilmez.
 *
 * Gizlilik: `anonim: true` ise müşteri adı yerine açıklayıcı bir not basılır.
 */

import { useMemo } from "react";

import GencoBlocks, { NAV_DEFAULTS, FOOTER_DEFAULTS } from "./GencoBlocks";

export default function VakaSayfasi({ vaka, lang = "TR" }) {
  const en = lang === "EN";

  const bloklar = useMemo(() => {
    /* Kayıt alanını iki dilli nesneye çevirir. */
    const cift = (b, varsayilanTr, varsayilanEn) => {
      if (b && typeof b === "object") {
        return { tr: b.tr || b.en || "", en: b.en || b.tr || "" };
      }
      if (typeof b === "string" && b.trim()) {
        return en ? { tr: "", en: b } : { tr: b, en: "" };
      }
      return { tr: varsayilanTr || "", en: varsayilanEn || "" };
    };

    /* Madde listesi (kapsam, etiketler) — her madde iki dilli nesne olmalı. */
    const maddeler = (liste) => {
      const arr = Array.isArray(liste) ? liste : liste ? [liste] : [];
      return arr.map((m) =>
        m && typeof m === "object"
          ? { title: { tr: m.tr || m.en || "", en: m.en || m.tr || "" } }
          : {
              title: {
                tr: typeof m === "string" ? m : "",
                en: typeof m === "string" ? m : "",
              },
            }
      );
    };

    const BOS = { tr: "", en: "" };

    const baslik = cift(vaka.baslik || vaka.urun);
    const sektor = cift(vaka.sektor);
    const urun = cift(vaka.urun);
    const zorluk = cift(vaka.zorluk);
    const sonuc = cift(vaka.sonuc);

    const ic = [];
    const slug = vaka.slug;
    const b = `vaka_${slug}`;

    /* 1) Başlık: vaka adı ve tek satır özet + gizlilik notu.
         Özet ve gizlilik cümlesi ayrı ayrı iki dilli tutulur; tek string
         içinde birleştirilirse EN sayfasına Türkçe metin sızar. */
    const giris = cift(vaka.giris);

    const subTr = [
      giris.tr,
      vaka.anonim
        ? "Müşteri adı ve hacim bilgileri talep üzerine paylaşılmamaktadır."
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const subEn = [
      giris.en,
      vaka.anonim
        ? "Client names and volume figures are not disclosed on request."
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    ic.push({
      type: "pageHeader",
      id: `${b}_head`,
      badge: { tr: "VAKA ANALİZİ", en: "CASE STUDY" },
      heading: baslik,
      sub: { tr: subTr, en: subEn },
    });

    /* 2) Künye — madde listesi olarak gösterilir. */
    const kunye = [
      { etiket: { tr: "Sektör", en: "Sector" }, deger: sektor },
      { etiket: { tr: "Ürün grubu", en: "Product group" }, deger: urun },
      vaka.ulke
        ? { etiket: { tr: "Pazar", en: "Market" }, deger: cift(vaka.ulke) }
        : null,
      vaka.tarih
        ? {
            etiket: { tr: "Dönem", en: "Period" },
            deger: {
              tr: new Date(vaka.tarih).getFullYear().toString(),
              en: new Date(vaka.tarih).getFullYear().toString(),
            },
          }
        : null,
    ].filter(Boolean);

    ic.push({
      type: "featureBlock",
      id: `${b}_meta`,
      eyebrow: { tr: "KÜNYE", en: "AT A GLANCE" },
      heading: BOS,
      desc: BOS,
      scope: BOS,
      boxTitle: BOS,
      boxSub: BOS,
      linkLabel: BOS,
      linkHref: "",
      items: kunye.map((k, i) => ({
        id: `${b}_meta_i${i}`,
        title: {
          tr: `${k.etiket.tr}: ${k.deger.tr || k.deger.en}`,
          en: `${k.etiket.en}: ${k.deger.en || k.deger.tr}`,
        },
      })),
    });

    /* 3) Zorluk → Sonuç. featureBlock'in kutu alanları bu iş için uygun:
          kutu başlığı "Sonuç", kutu metni sonucun anlatımı. */
    ic.push({
      type: "featureBlock",
      id: `${b}_challenge`,
      eyebrow: { tr: "ZORLUK", en: "THE CHALLENGE" },
      heading: cift(
        vaka.zorlukBaslik,
        "Başlangıçtaki engel",
        "Where the engagement started"
      ),
      desc: zorluk,
      scope: BOS,
      linkLabel: BOS,
      linkHref: "",
      items: [],
      boxTitle: { tr: "Sonuç", en: "Outcome" },
      boxSub: sonuc,
    });

    /* 4) Kapsam: yürüttüğümüz işler, madde madde */
    const kapsamMaddeleri = maddeler(vaka.kapsam);
    if (kapsamMaddeleri.length) {
      ic.push({
        type: "featureBlock",
        id: `${b}_scope`,
        eyebrow: { tr: "ÇALIŞMA KAPSAMI", en: "SCOPE OF WORK" },
        heading: cift(
          vaka.kapsamBaslik,
          "Bu proje için yürüttüğümüz işler",
          "What we handled on this engagement"
        ),
        desc: BOS,
        scope: BOS,
        boxTitle: BOS,
        boxSub: BOS,
        linkLabel: BOS,
        linkHref: "",
        items: kapsamMaddeleri.map((m, i) => ({
          id: `${b}_scope_i${i}`,
          title: m.title,
        })),
      });
    }

    /* 5) Etiketler — SSS değil, vakanın konu başlıkları. */
    const etiketler = maddeler(vaka.etiketler);
    if (etiketler.length) {
      ic.push({
        type: "featureBlock",
        id: `${b}_tags`,
        eyebrow: { tr: "KONU ETİKETLERİ", en: "TOPIC TAGS" },
        heading: {
          tr: "Bu vakada geçen başlıca kavramlar",
          en: "Key concepts in this case",
        },
        desc: BOS,
        scope: BOS,
        boxTitle: BOS,
        boxSub: BOS,
        linkLabel: BOS,
        linkHref: "",
        items: etiketler.map((m, i) => ({
          id: `${b}_tag_i${i}`,
          title: m.title,
        })),
      });
    }

    /* 6) Kapanış çağrısı */
    ic.push({
      type: "ctaBand",
      id: `${b}_cta`,
      badge: { tr: "BENZER BİR PROJE", en: "A SIMILAR PROJECT" },
      heading: cift(
        vaka.ctaBaslik,
        "Sizin sektörünüzde çalışalım",
        "Let's work on your sector"
      ),
      sub: cift(
        vaka.ctaMetin,
        "Ürününüzü ve hedef pazarınızı paylaşın; benzer bir kapsam için ne gerektiğini birlikte belirleyelim.",
        "Tell us about your product and target market; let’s define what a comparable scope requires."
      ),
      buttonLabel: { tr: "Bize Ulaşın", en: "Contact Us" },
      buttonHref: "/contact",
    });

    /* Menü ve alt bilgi en başta ve en sonda. */
    return [{ ...NAV_DEFAULTS, id: "vaka_nav" }, ...ic, { ...FOOTER_DEFAULTS, id: "vaka_footer" }];
  }, [vaka, en]);

  return (
    <div className="bg-[#fafafa] text-[#1e293b] antialiased min-h-screen" data-lang={lang}>
      <GencoBlocks blocks={bloklar} mode="live" lang={lang} />
    </div>
  );
}