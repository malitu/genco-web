"use client";

/**
 * GENCO Ortak Blok Motoru (iki dilli)
 * ---------------------------------------------------------------------------
 * Bu bileşen hem canlı site hem de stüdyo tuvali tarafından kullanılır.
 * İki yüz de aynı render'ı kullandığı için stüdyoda görülen tasarım,
 * "Kaydet & Yayınla" sonrası canlıda açılan tasarımla birebir aynıdır.
 *
 * İKİ DİLLİ ALANLAR
 *   Metin alanları  { tr: "…", en: "…" }  biçiminde saklanır.
 *   Tek dilli eski kayıtlar (düz metin) sorunsuz okunmaya devam eder.
 *
 * Modlar
 *   mode="live"  → salt okunur, TR/EN düğmesi çalışır
 *   mode="edit"  → tıkla-yaz düzenleme, blok sil/taşı, dil değiştirici
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { sendContactMessage, openMailFallback } from "../lib/contact";
import Turnstile from "./Turnstile";

/* ========================================================================== *
 *  Dil yardımcıları
 * ========================================================================== */

/**
 * Alanı okur: nesne ise o dili, düz metinse metni döner.
 *
 * Dikkat: lang değerleri büyük harfle gelir ("TR" / "EN") ama veri alanları
 * küçük harfli anahtarları kullanır ({ tr, en }). Bu yüzden önce küçük harfe
 * çevrilir; aksi halde her zaman Türkçe döner.
 */
export function L(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value !== "object" || Array.isArray(value)) return "";

  const key = typeof lang === "string" ? lang.toLowerCase() : lang;
  const picked = value[key];
  if (typeof picked === "string" && picked.length) return picked;

  const tr = value.tr;
  if (typeof tr === "string" && tr.length) return tr;
  const en = value.en;
  return typeof en === "string" ? en : "";
}

/**
 * Alanı yazar, diğer dili korur.
 *
 * Dikkat: lang büyük harfle gelir ("TR"/"EN") ama veri alanları küçük
 * harfli anahtarlar kullanır (tr/en). Bu yüzden anahtar küçük harfe
 * çevrilir; aksi halde veri içinde "TR"/"EN" diye ayrı alanlar birikir ve
 * dil değiştirme bozulur.
 */
export function mergeLang(current, lang, next) {
  const key = typeof lang === "string" ? lang.toLowerCase() : lang;
  if (current && typeof current === "object" && !Array.isArray(current)) {
    return { ...current, [key]: next };
  }
  const other = key === "en" ? "tr" : "en";
  return { [key]: next, [other]: typeof current === "string" ? current : "" };
}

/* ========================================================================== *
 *  Yardımcılar
 * ========================================================================== */

let idSeed = 0;
const uid = () =>
  `b_${Date.now().toString(36)}_${(idSeed++).toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;

const bi = (tr, en) => ({ tr, en });

/* ========================================================================== *
 *  Varsayılan içerik — canlı sitenin bugünkü metinleri
 * ========================================================================== */

export const NAV_LINKS = [
  { id: "lnk_services", label: bi("Hizmetler", "Services"), href: "/services" },
  { id: "lnk_industries", label: bi("Sektörler", "Industries"), href: "/industries" },
  { id: "lnk_cases", label: bi("Vaka Analizleri", "Case Studies"), href: "/case-studies" },
  { id: "lnk_insights", label: bi("Sektör Analizleri", "Sector Insights"), href: "/insights" },
  { id: "lnk_about", label: bi("Hakkımızda", "About Us"), href: "/about" },
  { id: "lnk_contact", label: bi("İletişim", "Contact"), href: "/contact" },
];

export const NAV_DEFAULTS = {
  id: "seed_nav",
  type: "nav",
  logo: "/logo.png",
  phone: "+90 232 462 16 49",
  links: NAV_LINKS,
};

export const HERO_DEFAULTS = {
  id: "seed_hero",
  type: "hero",
  badge: bi(
    "Uluslararası İş Geliştirme Ortağınız",
    "Your International Business Development Partner"
  ),
  tagline: bi("Rotanızı dünyaya çevirin, biz pusulanız olalım.", "Take your business around the world — we'll be your compass."),
  title: bi(
    "Türkiye'deki Uluslararası Ticaret Ekibiniz",
    "Your International Trade Team in Turkey"
  ),
  subtitle: bi(
    "Ürününüz hazır, doğru alıcıya ulaşacak kanalınız yok. Tescilli ticaret istihbarat ağımızla doğru pazardaki karar vericileri tespit ediyor, müzakereleri yürütüyor ve sevkiyat kapanışına kadar operasyonu sizin adınıza yönetiyoruz.",
    "Your product is ready; what you lack is a channel to the right buyers. Through our proprietary trade intelligence network we identify decision-makers in the right markets, run the negotiations, and manage the operation on your behalf until the shipment closes."
  ),
  primaryLabel: bi("Görüşelim", "Let's Talk"),
  primaryHref: "/contact",
  secondaryLabel: bi("Hizmetlerimizi Keşfedin", "Explore Our Services"),
  secondaryHref: "/services",
  image: "",
  boxBadge: bi("Aktif Ticaret Yönetimi", "Active Trade Management"),
  boxTitle: bi("Rapordan çok, sonuç", "Deliverables, Not Reports"),
  boxDesc: bi(
    "Doğru karar vericilere doğrudan ulaşıyor, teknik şartname uyumunu sahada denetliyor ve sevkiyat kapanışına kadar süreci birlikte yönetiyoruz.",
    "We reach the right decision-makers directly, verify technical specification compliance on site, and run the process with you until the shipment closes."
  ),
  check1: bi("✓ Doğrudan C-Level Erişim", "✓ Direct C-Level Access"),
  check2: bi("✓ Teknik Şartname Uyumu", "✓ Technical Spec Compliance"),
  check3: bi("✓ Geniş Sektörel Esneklik", "✓ Wide Sectoral Flexibility"),
  check4: bi("✓ Numune & Sevkiyat Takibi", "✓ Sample & Shipment Tracking"),
};

export const INDUSTRIES_DEFAULTS = {
  id: "seed_industries",
  type: "industries",
  badge: bi("Sektörel Yetkinlik", "Sectoral Competence"),
  heading: bi("Uzmanlaştığımız sektörler", "Industries We Specialise In"),
  description: bi(
    "Bu alanlarda tescilli teknik bilgiye ve yerleşik alıcı ağlarına sahibiz. Dışındaki tüm sektörler için de aynı metodolojiyle pazar araştırması ve operasyon yönetimi yapıyoruz.",
    "In these sectors we hold proprietary technical knowledge and established buyer networks. For any other sector we apply the same methodology: market research and operational management."
  ),
  items: [
    { id: "ind_1", title: bi("Vasıflı Çelik", "Engineering Steel"), image: "/img/sector-steel.svg" },
    { id: "ind_2", title: bi("Yatçılık & Marine", "Yachting & Marine"), image: "/img/sector-marine.svg" },
    { id: "ind_3", title: bi("Tohumculuk", "Seed Trade"), image: "/img/sector-seeds.svg" },
    { id: "ind_4", title: bi("Medikal", "Medical"), image: "/img/sector-medical.svg" },
    { id: "ind_5", title: bi("Otomotiv", "Automotive"), image: "/img/sector-automotive.svg" },
    { id: "ind_6", title: bi("Femtech", "Femtech"), image: "/img/sector-healthtech.svg" },
  ],
  note: bi(
    "* Uzmanlık alanlarımız haricinde, talebe göre her sektörde özel pazar araştırması ve operasyon yönetimi sağlanmaktadır.",
    "* Beyond our core specialties, bespoke market research and operation management are available for any sector upon request."
  ),
};

export const ROUTES_DEFAULTS = {
  id: "seed_routes",
  type: "routes",
  heading: bi("Ticari Hedefinizi Seçin", "Choose Your Commercial Goal"),
  subheading: bi(
    "İster küresel pazarlarda büyümek isteyen bir üretici, ister Türkiye'den nitelikli tedarik arayan bir marka olun; operasyonunuzu uçtan uca yönetiyoruz.",
    "Whether you're a manufacturer expanding globally or a brand seeking reliable supply from Turkey, we manage your operations end-to-end."
  ),
  cards: [
    {
      id: "card_1",
      badge: bi("Yerli Üreticiler İçin", "For Local Manufacturers"),
      title: bi("İhracat Pazarınızı Büyütelim", "Scale Your Export Markets"),
      desc: bi(
        "Şirket içi ihracat departmanı kurma maliyetine katlanmadan, dışarıdan uluslararası satış ekibiniz olarak küresel alıcılara ulaşıyoruz.",
        "Without building an internal export department, we act as your outsourced international sales team reaching global buyers."
      ),
      link: bi("İhracat Modelini İncele →", "View Export Model →"), href: "/services", image: "/img/route-export.svg",
    },
    {
      id: "card_2",
      badge: bi("Uluslararası Alıcılar İçin", "For International Buyers"),
      title: bi("Türkiye'den Güvenli Tedarik", "Secure Sourcing from Turkey"),
      desc: bi(
        "Doğru üreticiyi bulma, kapasite denetimi, fiyat teklifi koordinasyonu ve uluslararası standartlara uygunluk süreçlerini yönetiyoruz.",
        "We handle manufacturer discovery, capacity audits, quotation coordination, and international standards compliance."
      ),
      link: bi("Tedarik Süreçlerimiz →", "See Our Sourcing Process →"), href: "/services", image: "/img/route-sourcing.svg",
    },
    {
      id: "card_3",
      badge: bi("Global Markalar İçin", "For Global Brands"),
      title: bi("Türkiye Pazarına Giriş", "Market Entry to Turkey"),
      desc: bi(
        "Türkiye pazarını analiz etmek, yerel regülasyonlara uyum sağlamak ve güçlü bir distribütör veya bayi ağı kurarak ticari operasyon başlatmak.",
        "Analyzing the Turkish market, ensuring local regulatory compliance, and establishing strong distributor or dealer networks."
      ),
      link: bi("Pazara Giriş Stratejisi →", "Market Entry Strategy →"), href: "/contact", image: "/img/route-entry.svg",
    },
  ],
};

export const METHOD_DEFAULTS = {
  id: "seed_method",
  type: "method",
  badge: bi("Farkımız", "Our Differentiator"),
  title1: bi("Analiz yön gösterir.", "Analysis guides."),
  title2: bi("Uygulama ticareti büyütür.", "Execution grows trade."),
  desc: bi(
    "Pek çok kurum sadece rapor sunar ve çekilir; GENCO ise masada sizinle birlikte oturur, müzakereleri yürütür ve siparişin kapanışına kadar sahada yer alır.",
    "Many firms hand over reports and walk away; GENCO sits at the table with you, leads negotiations, and stays on the ground until order closure."
  ),
  d1: bi(
    "Demir Çelik ve endüstriyel metallerde tolerans ve alaşım standardı uzmanlığı.",
    "Expertise in tolerance and alloy standards for steel and industrial metals."
  ),
  d2: bi(
    "Medikal, Femtech, Tohumculuk, Denizcilik ve Otomotiv sektörlerinde tecrübe.",
    "Extensive experience across Medical, Femtech, Agriculture, Marine, and Automotive sectors."
  ),
  methodTitle: bi("The GENCO Method", "The GENCO Method"),
  image: "",
  items: [
    { id: "m_1", name: bi("Araştırma (Research)", "Research"), sub: bi("Veri Odaklı", "Data-Driven") },
    { id: "m_2", name: bi("İletişim (Connect)", "Connect"), sub: bi("Stratejik B2B", "Strategic B2B") },
    { id: "m_3", name: bi("İcraat (Execute)", "Execute"), sub: bi("Sahada Yönetim", "Field Management") },
    { id: "m_4", name: bi("Büyüme (Grow)", "Grow"), sub: bi("Sürdürülebilir Ağ", "Sustainable Network") },
  ],
};

/* --- Görsel ve Video bloğu ------------------------------------------------ *
 * Sayfayı zenginleştirmek için serbest kullanılır. İçeriğin yerini almaz,
 * yanına eklenir; bu yüzden sayfa yapısını bozmaz.
 * Yerleşimler:
 *   split     → solda metin, sağda tek görsel/video
 *   row       → ortalanmış başlık + yan yana 2-3 görsel
 *   spotlight → ortalanmış büyük tek görsel + başlık
 * -------------------------------------------------------------------------- */

export const MEDIA_LAYOUTS = [
  { id: "split", label: "Metin + Görsel (yan yana)" },
  { id: "row", label: "Sıra halinde görseller" },
  { id: "spotlight", label: "Tek büyük görsel" },
];

const emptyItem = (kind = "image") => ({
  id: `mi_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
  kind,
  url: "",
  caption: bi("", ""),
});

export const MEDIA_DEFAULTS = {
  id: "seed_media",
  type: "media",
  layout: "split",
  align: "left",
  // captionPosition: "overlay" → yazı görselin üstüne, "below" → altına
  captionPosition: "overlay",
  // videoAutoplay: false → video otomatik oynamaz
  videoAutoplay: true,
  heading: bi("Görsel Başlığı", "Image Title"),
  body: bi(
    "Bu alan metinlerinizi destekleyen bir açıklamadır. Sitenin görünümünü zenginleştirmek için görsel veya video kullanabilirsiniz.",
    "This is a supporting description for your text. Use an image or video to enrich the look of your site."
  ),
  items: [emptyItem()],
};

/** YouTube / Vimeo bağlantısını gömülebilir oynatıcı adresine çevirir. */
export function toEmbedUrl(url) {
  if (!url || typeof url !== "string") return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

/** Doğrudan video dosyası (.mp4/.webm) mı? */
function isDirectVideo(url) {
  return typeof url === "string" && /\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(url);
}

/**
 * Büyük görsel penceresi (lightbox).
 * Görsele tıklanınca tam ekranda açılır; Esc veya arka plana tıklayınca
 * kapanır. Portal ile document.body'ye basıldığı için stüdyo tuvalindeki
 * kırpma (overflow) ve dönüşümlerden etkilenmez.
 */
function Lightbox({ src, caption, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20"
        aria-label="Kapat"
      >
        ✕
      </button>
      <figure
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full max-w-6xl flex-col items-center gap-3"
      >
        <img
          src={src}
          alt={caption || ""}
          className="max-h-[82vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
        />
        {caption && (
          <figcaption className="text-center text-sm text-slate-300">{caption}</figcaption>
        )}
      </figure>
    </div>,
    document.body
  );
}

function MediaItem({ block, item, ctx, index, total }) {
  const { set, edit, lang, pick } = ctx;
  const [lightbox, setLightbox] = useState(false);

  const update = (patch) =>
    set("items", block.items.map((x) => (x.id === item.id ? { ...x, ...patch } : x)));

  const addAfter = () => {
    const copy = [...block.items];
    copy.splice(index + 1, 0, emptyItem());
    set("items", copy);
  };

  const remove = () => set("items", block.items.filter((x) => x.id !== item.id));

  const embed = toEmbedUrl(item.url);
  const isVideo = item.kind === "video" || !!embed || isDirectVideo(item.url);
  const caption = L(item.caption, lang);
  const overlay = block.captionPosition === "overlay" && caption;
  const autoplay = block.videoAutoplay !== false;

  return (
    <div className="relative group">
      {edit && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {index + 1}/{total}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              update({ kind: "image" });
            }}
            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
              item.kind !== "video"
                ? "bg-[#f97316] text-white"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            Görsel
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              update({ kind: "video" });
            }}
            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
              item.kind === "video"
                ? "bg-[#f97316] text-white"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            Video
          </button>
          <div className="ml-auto flex gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addAfter();
              }}
              className="rounded border border-slate-300 bg-white px-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
              title="Altına ekle"
            >
              +
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove();
              }}
              className="rounded bg-red-600 px-1.5 text-[10px] font-bold text-white hover:bg-red-700"
              title="Kaldır"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* --- içerik --- */}
      {!item.url ? (
        edit ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (item.kind === "video") {
                  const url = window.prompt(
                    "Video bağlantısı (YouTube veya Vimeo):",
                    item.url
                  );
                  if (url) update({ url });
                } else {
                  pick(`media:${item.id}`);
                }
              }}
              className="grid w-full place-items-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-10 text-[11px] font-semibold text-slate-400 hover:border-[#f97316] hover:text-[#f97316] transition"
            >
              <span className="text-lg leading-none">+</span>
              {item.kind === "video" ? "Video bağlantısı ekle" : "Görsel ekle"}
            </button>
            {item.kind === "video" && (
              <p className="text-[10px] text-slate-400 text-center">
                YouTube veya Vimeo linkini yapıştırın.
              </p>
            )}
          </div>
        ) : null
      ) : isVideo ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900 border border-slate-200">
          {embed ? (
            <iframe
              src={autoplay ? `${embed}?autoplay=1&mute=1&loop=1&playlist=${embed.split("/").pop()}` : `${embed}?rel=0`}
              title={caption || "video"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : isDirectVideo(item.url) ? (
            <video
              src={item.url}
              className="h-full w-full"
              controls
              muted={autoplay}
              autoPlay={autoplay}
              loop={autoplay}
              playsInline
              preload="metadata"
            />
          ) : (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="grid h-full w-full place-items-center text-xs font-bold text-white"
            >
              Videoyu aç
            </a>
          )}
          {edit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                update({ url: "" });
              }}
              className="absolute right-2 top-2 rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold text-white"
            >
              Kaldır
            </button>
          )}
        </div>
      ) : (
        <div
          className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
          onClick={(e) => {
            // Stüdyoda tıklama blok seçimine gider; canlı sitede büyütür.
            if (edit) return;
            e.stopPropagation();
            setLightbox(true);
          }}
        >
          <img
            src={item.url}
            alt={caption || ""}
            className={`w-full object-cover ${
              // Sıra halinde dizilince tüm görseller aynı yükseklikte
              // dursun; aksi halde farklı en-boy oranları hizayı bozar.
              block.layout === "row" ? "aspect-[3/2]" : ""
            } ${edit ? "" : "cursor-zoom-in"}`}
            draggable={false}
          />

          {/* Görselin üstüne yazı */}
          {overlay && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3">
              {edit ? (
                <EditableText
                  as="div"
                  editable={edit}
                  value={caption}
                  onChange={(v) => update({ caption: mergeLang(item.caption, lang, v) })}
                  className="text-center text-xs font-medium text-white"
                  placeholder="Görsel üstü yazı"
                />
              ) : (
                <div className="text-center text-xs font-medium text-white">{caption}</div>
              )}
            </div>
          )}

          {!edit && (
            <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-black/45 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">
              Büyüt
            </span>
          )}

          {edit && (
            <div className="absolute right-2 top-2 flex gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  pick(`media:${item.id}`);
                }}
                className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-white"
              >
                Değiştir
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  update({ url: "" });
                }}
                className="rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-red-700"
              >
                Kaldır
              </button>
            </div>
          )}
        </div>
      )}

      {/* Büyük görsel penceresi (yalnızca canlı sitede) */}
      {!edit && lightbox && !isVideo && (
        <Lightbox src={item.url} caption={caption} onClose={() => setLightbox(false)} />
      )}

      {/* Alt yazı — yalnızca "altında" seçildiyse */}
      {block.captionPosition !== "overlay" && (edit || caption) && (
        <div className="mt-2">
          <EditableText
            as="div"
            editable={edit}
            value={caption}
            onChange={(v) => update({ caption: mergeLang(item.caption, lang, v) })}
            className="text-center text-[11px] text-slate-500"
            placeholder="Görsel alt yazısı (isteğe bağlı)"
          />
        </div>
      )}
    </div>
  );
}

function MediaBlock({ block, ctx }) {
  const { set, edit, lang } = ctx;
  const items = block.items || [];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Yerleşim ve davranış ayarları (yalnızca stüdyoda) */}
        {edit && (
          <div className="mb-8 space-y-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Yerleşim
              </span>
              {MEDIA_LAYOUTS.map((lo) => (
                <button
                  key={lo.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    set("layout", lo.id);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                    block.layout === lo.id
                      ? "bg-[#f97316] text-white"
                      : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {lo.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Altyazı
              </span>
              {[
                { id: "overlay", label: "Görselin üstüne" },
                { id: "below", label: "Görselin altına" },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    set("captionPosition", o.id);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                    (block.captionPosition || "overlay") === o.id
                      ? "bg-[#f97316] text-white"
                      : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {o.label}
                </button>
              ))}

              <span className="ml-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Video
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  set("videoAutoplay", block.videoAutoplay === false);
                }}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                  block.videoAutoplay === false
                    ? "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                    : "bg-[#f97316] text-white"
                }`}
              >
                {block.videoAutoplay === false ? "Otomatik oynatma: Kapalı" : "Otomatik oynatma: Açık"}
              </button>
            </div>

            <p className="pt-1 text-[10px] text-slate-500">
              Görsele tıklanınca büyük ekranda açılır (Esc ile kapanır). Video
              otomatik oynarsa sessiz başlar; oynatıcıdan sesi açabilirsiniz.
            </p>
          </div>
        )}

        {block.layout === "split" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className={block.align === "right" ? "lg:order-2" : ""}>
              <EditableText as="h2" editable={edit} value={L(block.heading, lang)}
                onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
                className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4" placeholder="Başlık" />
              <span className="block h-1 w-16 rounded mb-5" style={{ background: "#f97316" }} />
              <EditableText as="p" editable={edit} value={L(block.body, lang)}
                onChange={(v) => set("body", mergeLang(block.body, lang, v))}
                className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap" placeholder="Açıklama" />
            </div>
            <div className={block.align === "right" ? "lg:order-1" : ""}>
              {items.map((item, i) => (
                <MediaItem key={item.id} block={block} item={item} ctx={ctx} index={i} total={items.length} />
              ))}
              {edit && items.length === 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    set("items", [emptyItem()]);
                  }}
                  className="w-full rounded-lg border-2 border-dashed border-slate-300 py-10 text-xs font-semibold text-slate-400 hover:border-[#f97316]"
                >
                  + Görsel ekle
                </button>
              )}
            </div>
          </div>
        ) : block.layout === "row" ? (
          <div>
            {(edit || L(block.heading, lang)) && (
              <EditableText as="h2" editable={edit} value={L(block.heading, lang)}
                onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
                className="text-2xl md:text-3xl font-bold text-[#0f172a] text-center mb-10" placeholder="Başlık" />
            )}
            <div
              className={`grid grid-cols-1 gap-6 ${
                // Sütun sayısı görsel adedine göre: 2 fotoğraf için 2 sütun
                // kullanılır, yoksa üçüncü sütun boş kalır.
                items.length <= 1
                  ? ""
                  : items.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {items.map((item, i) => (
                <MediaItem key={item.id} block={block} item={item} ctx={ctx} index={i} total={items.length} />
              ))}
              {edit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    set("items", [...items, emptyItem()]);
                  }}
                  className="grid place-items-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-10 text-[11px] font-semibold text-slate-400 hover:border-[#f97316] hover:text-[#f97316] transition"
                >
                  <span className="text-lg leading-none">+</span>Görsel ekle
                </button>
              )}
            </div>
          </div>
        ) : (
          /* spotlight */
          <div className="mx-auto max-w-4xl">
            {(edit || L(block.heading, lang)) && (
              <EditableText as="h2" editable={edit} value={L(block.heading, lang)}
                onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
                className="text-2xl md:text-3xl font-bold text-[#0f172a] text-center mb-4" placeholder="Başlık" />
            )}
            {(edit || L(block.body, lang)) && (
              <EditableText as="p" editable={edit} value={L(block.body, lang)}
                onChange={(v) => set("body", mergeLang(block.body, lang, v))}
                className="text-gray-600 text-center max-w-2xl mx-auto mb-10 leading-relaxed" placeholder="Açıklama" />
            )}
            {items.map((item, i) => (
              <MediaItem key={item.id} block={block} item={item} ctx={ctx} index={i} total={items.length} />
            ))}
            {edit && items.length === 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  set("items", [emptyItem()]);
                }}
                className="w-full rounded-lg border-2 border-dashed border-slate-300 py-12 text-xs font-semibold text-slate-400 hover:border-[#f97316]"
              >
                + Görsel ekle
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ========================================================================== *
 *  Alt sayfa blokları
 * ---------------------------------------------------------------------------
 *  Alt sayfalar (Hizmetler, Sektörler, Vaka Analizleri, Trade Intelligence,
 *  Hakkımızda, İletişim) aşağıdaki genel bloklardan kurulur. Böylece her
 *  sayfa ana sayfayla aynı mantıkla düzenlenebilir olur.
 * ========================================================================== */

/** Sayfa başlığı: turuncu üst etiket + büyük başlık + açıklama. */
export const PAGE_HEADER_DEFAULTS = {
  id: "seed_pageHeader",
  type: "pageHeader",
  badge: bi("Bölüm", "Section"),
  heading: bi("Sayfa Başlığı", "Page Title"),
  sub: bi("Bu alana sayfanın kısa açıklamasını yazın.", "Add a short description here."),
};

/** Kart ızgarası — sektör, hizmet ve vaka analizi listelerinde kullanılır. */
export const CARD_GRID_DEFAULTS = {
  id: "seed_cardGrid",
  type: "cardGrid",
  heading: bi("", ""),
  sub: bi("", ""),
  columns: 3,
  cards: [
    {
      id: "cg_1",
      eyebrow: bi("01", "01"),
      title: bi("Kart Başlığı", "Card Title"),
      desc: bi("Kart açıklaması buraya yazılır.", "Card description goes here."),
      note: bi("✓ Alt not", "✓ Footer note"),
      image: "",
    },
  ],
};

/** Özellik bloğu — hizmetler sayfasındaki "adım + özellik listesi + kutu" düzeni. */
export const FEATURE_BLOCK_DEFAULTS = {
  id: "seed_feature",
  type: "featureBlock",
  eyebrow: bi("01 / ADIM", "01 / STEP"),
  // Vaka analizlerinde "kapsam" satırı: sektör + pazar + yapılan iş.
  // Boş bırakılırsa hiçbir yerde görünmez.
  scope: bi("", ""),
  heading: bi("Bölüm Başlığı", "Section Title"),
  desc: bi("Açıklama metni.", "Description text."),
  items: [
    { id: "fb_1", title: bi("Özellik 1", "Feature 1") },
    { id: "fb_2", title: bi("Özellik 2", "Feature 2") },
    { id: "fb_3", title: bi("Özellik 3", "Feature 3") },
    { id: "fb_4", title: bi("Özellik 4", "Feature 4") },
  ],
  boxTitle: bi("Kutu Başlığı", "Box Title"),
  boxSub: bi("Kutu açıklaması.", "Box description."),
};

/** Makale listesi — Trade Intelligence sayfasındaki uzun içerikler. */
export const ARTICLE_LIST_DEFAULTS = {
  id: "seed_articles",
  type: "articleList",
  heading: bi("", ""),
  articles: [
    {
      id: "al_1",
      eyebrow: bi("01 / KONU", "01 / TOPIC"),
      category: bi("ANALİZ", "ANALYSIS"),
      date: bi("", ""),
      author: bi("", ""),
      title: bi("Makale Başlığı", "Article Title"),
      body: bi("Makale metni.", "Article body text."),
    },
  ],
};

/** Sıkça sorulan sorular — satış öncesi tereddütleri kapatır, SEO kazandırır. */
export const FAQ_DEFAULTS = {
  id: "seed_faq",
  type: "faq",
  heading: bi("Sıkça Sorulan Sorular", "Frequently Asked Questions"),
  sub: bi(
    "Aşağıdaki sorular en çok merak edilen konuları özetler. Yanıtını bulamazsanız iletişim formundan yazabilirsiniz.",
    "The questions below cover the topics we are asked about most. If your answer is not here, feel free to contact us."
  ),
  items: [
    {
      id: "fq_1",
      question: bi("Sorunuz burada", "Your question here"),
      answer: bi("Yanıtınız burada.", "Your answer here."),
    },
  ],
};

/** Koyu renkli eylem çağrısı şeridi. */
export const CTA_BAND_DEFAULTS = {
  id: "seed_cta",
  type: "ctaBand",
  badge: bi("BİZİMLE ÇALIŞIN", "WORK WITH US"),
  heading: bi("Başlık", "Call to Action"),
  sub: bi("Destek metni.", "Supporting text."),
  buttonLabel: bi("Bize Ulaşın", "Contact Us"),
  buttonHref: "/contact",
  image: "",
};

/**
 * İletişim bloğu — solda mesaj formu, sağda koyu renkli iletişim bilgileri
 * kutusu ve altında harita. Form içeriği panelden düzenlenebilir.
 */
export const CONTACT_DEFAULTS = {
  id: "seed_contact",
  type: "contact",
  formTitle: bi("Doğrudan Mesaj Gönderin", "Send a Direct Message"),
  successMsg: bi(
    "Mesajınız başarıyla alınmıştır. En kısa sürede dönüş yapacağız.",
    "Your message has been received. We will get back to you shortly."
  ),
  nameLabel: bi("Ad Soyad / İsim", "Full Name"),
  emailLabel: bi("Kurumsal E-Posta", "Corporate Email"),
  phoneLabel: bi("Telefon Numarası", "Phone Number"),
  messageLabel: bi("Proje Detayları ve Talebiniz", "Project Details & Inquiry"),
  submitLabel: bi("Mesajı Gönder", "Send Message"),
  // KVKK aydınlatma metni: form gönderilmeden önce onay zorunludur.
  consent: bi(
    "Kişisel verilerimin, talebimin değerlendirilmesi amacıyla işlenmesini ve tarafıma dönüş yapılmasını kabul ediyorum.",
    "I consent to the processing of my personal data for the purpose of evaluating my request and for GENCO to contact me."
  ),
  /* Gönderim başarısız olursa kullanıcıya gösterilen not. */
  fallbackNote: bi(
    "Mesajınız e-posta uygulamanızda hazır metin olarak açıldı — oradan göndermek için onaylayın.",
    "Your message has been opened in your email app as a prepared draft — confirm there to send it."
  ),
  // Gönderim durumu
  sendingLabel: bi("Gönderiliyor…", "Sending…"),
  sendErrorLabel: bi(
    "Mesaj gönderilemedi. Lütfen info@gencotr.com adresine yazın veya bizi telefonla arayın.",
    "The message could not be sent. Please email info@gencotr.com or call us."
  ),
  privacyLabel: bi("Gizlilik Politikası", "Privacy Policy"),
  privacyHref: "/gizlilik",
  infoTitle: bi("İletişim Bilgilerimiz", "Our Contact Information"),
  addressLabel: bi("Merkez Adres", "Headquarters"),
  addressVal: bi(
    "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE",
    "Meriç Mah. 5746/5 SK. No: 3 Inner Door No: Z1 Bornova/İzmir - TURKEY"
  ),
  phoneVal: bi("+90 232 462 16 49", "+90 232 462 16 49"),
  emailVal: bi("info@gencotr.com", "info@gencotr.com"),
  targetEmail: "info@gencotr.com",
  mapUrl: bi(
    "https://www.google.com/maps?q=Bornova%2C%20%C4%B0zmir%2C%20T%C3%BCrkiye&z=13&output=embed",
    "https://www.google.com/maps?q=Bornova%2C%20Izmir%2C%20Turkey&z=13&output=embed"
  ),
};

/**
 * Sayaç şeridi.
 *
 * ÖNEMLİ: Sayılar BİLEREK boş bırakıldı. Bu blok şablon olarak eklendiğinde
 * uydurma rakamlar ("18+ yıl", "1200+ sevkiyat" gibi) siteye yayılabilirdi;
 * bu tür iddialar ancak doğrulanabilir verilerle kullanılmalı. Panelde gerçek
 * rakamlar girilene kadar boş kalır ve uyarı gösterilir.
 */
export const STATS_BAND_DEFAULTS = {
  id: "seed_stats",
  type: "statsBand",
  heading: bi("", ""),
  items: [
    { id: "st_1", value: bi("", ""), label: bi("Yıllık deneyim", "Years of experience") },
    { id: "st_2", value: bi("", ""), label: bi("İhracat yapılan ülke", "Export destinations") },
    { id: "st_3", value: bi("", ""), label: bi("Tamamlanan sevkiyat", "Completed shipments") },
    { id: "st_4", value: bi("", ""), label: bi("Zamanında teslim", "On-time delivery") },
  ],
};

export const FOOTER_DEFAULTS = {
  id: "seed_footer",
  type: "footer",
  rights: bi(
    "© 2026 Genco İthalat İhracat Medikal Ürün San. Tic. Ltd. Şti. Tüm hakları saklıdır.",
    "© 2026 Genco İthalat İhracat Medikal Ürün San. Tic. Ltd. Şti. All rights reserved."
  ),
  address: bi(
    "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com",
    "Meriç Mah. 5746/5 SK. No: 3 Inner Door No: Z1 Bornova/İzmir - TURKEY | Phone: +90 232 462 16 49 | info@gencotr.com"
  ),
  // Yasal ve yardımcı bağlantılar (menüde değil, alt bilgide görünür).
  links: [{ id: "fl_privacy", label: bi("Gizlilik Politikası", "Privacy Policy"), href: "/gizlilik" }],
};

/**
 * Ana sayfa sayaç şeridi — şirketin doğrulanmış rakamları.
 * GENCO tarafından teyit edilmiştir (2008 kuruluş).
 */
const GENCO_STATS = {
  id: "seed_stats_home",
  type: "statsBand",
  heading: bi("", ""),
  items: [
    { id: "st_1", value: bi("2008", "2008"), label: bi("Kuruluş yılı", "Founded") },
    { id: "st_2", value: bi("18", "18"), label: bi("Yıllık deneyim", "Years of experience") },
    { id: "st_3", value: bi("48+", "48+"), label: bi("Aktif pazar", "Active markets") },
    { id: "st_4", value: bi("1000+", "1000+"), label: bi("Tamamlanan proje", "Completed projects") },
  ],
};

/** Firestore'da hiç blok yoksa devreye giren tam sayfa şablonu. */
export const DEFAULT_SITE_BLOCKS = [
  NAV_DEFAULTS,
  HERO_DEFAULTS,
  INDUSTRIES_DEFAULTS,
  ROUTES_DEFAULTS,
  METHOD_DEFAULTS,
  GENCO_STATS,
  FOOTER_DEFAULTS,
];

/** Firestore'da hiç blok yoksa devreye giren tam sayfa şablonu. */

/* ========================================================================== *
 *  Blok kütüphanesi
 * ========================================================================== */

const TEXT_DEFAULTS = {
  id: "seed_text",
  type: "textBlock",
  heading: bi("Bölüm Başlığı", "Section Title"),
  content: bi(
    "Buraya detaylı içerik metninizi yazabilirsiniz. Bu alan tıkladığınızda doğrudan düzenlenebilir.",
    "Write your content here. Click this area to edit it directly."
  ),
};

const SLIDER_DEFAULTS = {
  id: "seed_slider",
  type: "slider",
  heading: bi("Küresel Operasyonel Görsellerimiz", "Our Global Operational Visuals"),
  images: [],
  interval: 4,
};

export const BLOCK_LIBRARY = [
  { type: "faq", label: "Sıkça Sorulan Sorular", hint: "Açılır-kapanır soru/yanıt listesi. Satış öncesi tereddütleri kapatır.", accent: "#6366f1", create: () => ({ ...FAQ_DEFAULTS, id: uid(), items: FAQ_DEFAULTS.items.map((i) => ({ ...i, id: uid() })) }) },
  { type: "contact", label: "İletişim Formu + Harita", hint: "Mesaj formu, koyu bilgi kutusu ve gömülü harita.", accent: "#0f172a", create: () => ({ ...CONTACT_DEFAULTS, id: uid() }) },
  { type: "pageHeader", label: "Sayfa Başlığı", hint: "Üst etiket + büyük başlık + açıklama (alt sayfaların tepesi).", accent: "#f97316", create: () => ({ ...PAGE_HEADER_DEFAULTS, id: uid() }) },
  { type: "cardGrid", label: "Kart Izgarası", hint: "Sütun sayısı seçilebilir, her kartta başlık/açıklama/alt not ve görsel.", accent: "#0ea5e9", create: () => ({ ...CARD_GRID_DEFAULTS, id: uid(), cards: CARD_GRID_DEFAULTS.cards.map((c) => ({ ...c, id: uid() })) }) },
  { type: "featureBlock", label: "Özellik + Kutu", hint: "Solda başlık ve kontrol listesi, sağda koyu kutu.", accent: "#22c55e", create: () => ({ ...FEATURE_BLOCK_DEFAULTS, id: uid(), items: FEATURE_BLOCK_DEFAULTS.items.map((i) => ({ ...i, id: uid() })) }) },
  { type: "articleList", label: "Makale / İçerik Listesi", hint: "Üstü etiketli, başlıklı uzun metin kartları.", accent: "#8b5cf6", create: () => ({ ...ARTICLE_LIST_DEFAULTS, id: uid(), articles: ARTICLE_LIST_DEFAULTS.articles.map((a) => ({ ...a, id: uid() })) }) },
  { type: "ctaBand", label: "Eylem Çağrısı (Koyu Şerit)", hint: "Koyu zeminli büyük çağrı bölümü, isteğe bağlı arka plan görseli.", accent: "#14b8a6", create: () => ({ ...CTA_BAND_DEFAULTS, id: uid() }) },
  { type: "statsBand", label: "Sayaçlar", hint: "Koyu zeminde sayı + açıklama şeridi.", accent: "#f59e0b", create: () => ({ ...STATS_BAND_DEFAULTS, id: uid(), items: STATS_BAND_DEFAULTS.items.map((i) => ({ ...i, id: uid() })) }) },
  { type: "hero", label: "Hero / Manşet", hint: "Manşet: büyük başlık, açıklama, butonlar ve sağdaki kutu.", accent: "#f97316", create: () => ({ ...HERO_DEFAULTS, id: uid() }) },
  { type: "industries", label: "Sektörler", hint: "6'lı sektör ızgarası.", accent: "#0ea5e9", create: () => ({ ...INDUSTRIES_DEFAULTS, id: uid() }) },
  { type: "routes", label: "Ticari Hedef Kartları", hint: "Başlık + 3 hedef kartı.", accent: "#22c55e", create: () => ({ ...ROUTES_DEFAULTS, id: uid() }) },
  { type: "method", label: "Farkımız / Method", hint: "Koyu bölüm: iki sütunlu fark anlatımı ve method listesi.", accent: "#8b5cf6", create: () => ({ ...METHOD_DEFAULTS, id: uid() }) },
  { type: "media", label: "Görsel ve Video", hint: "Metinlerin yanına görsel/video; 3 yerleşim seçeneği.", accent: "#14b8a6", create: () => ({ ...MEDIA_DEFAULTS, id: uid(), items: [emptyItem()] }) },
  { type: "nav", label: "Menü (Navigasyon)", hint: "Logo ve menü linkleri.", accent: "#0f172a", create: () => ({ ...NAV_DEFAULTS, id: uid() }) },
  { type: "footer", label: "Alt Bilgi (Footer)", hint: "Telif ve adres satırı.", accent: "#64748b", create: () => ({ ...FOOTER_DEFAULTS, id: uid() }) },
  { type: "textBlock", label: "Özel Metin / İçerik", hint: "Serbest başlık ve açıklama bloğu.", accent: "#64748b", create: () => ({ ...TEXT_DEFAULTS, id: uid() }) },
  { type: "slider", label: "Galeri / Slider", hint: "Sıralanabilir görsel galerisi ve otomatik geçiş.", accent: "#a855f7", create: () => ({ ...SLIDER_DEFAULTS, id: uid() }) },
];

export const getBlockDef = (type) => BLOCK_LIBRARY.find((b) => b.type === type) || null;

const DEFAULTS_BY_TYPE = {
  nav: NAV_DEFAULTS,
  hero: HERO_DEFAULTS,
  industries: INDUSTRIES_DEFAULTS,
  routes: ROUTES_DEFAULTS,
  method: METHOD_DEFAULTS,
  footer: FOOTER_DEFAULTS,
  media: MEDIA_DEFAULTS,
  textBlock: TEXT_DEFAULTS,
  slider: SLIDER_DEFAULTS,
  contact: CONTACT_DEFAULTS,
  faq: FAQ_DEFAULTS,
  pageHeader: PAGE_HEADER_DEFAULTS,
  cardGrid: CARD_GRID_DEFAULTS,
  featureBlock: FEATURE_BLOCK_DEFAULTS,
  articleList: ARTICLE_LIST_DEFAULTS,
  ctaBand: CTA_BAND_DEFAULTS,
  statsBand: STATS_BAND_DEFAULTS,
};

/** Eksik alanları güvenle tamamlar; eski tek dilli kayıtları korur. */
export function normaliseBlock(raw, index = 0) {
  const type = raw?.type || "textBlock";
  const base = DEFAULTS_BY_TYPE[type] || TEXT_DEFAULTS;
  const merged = { ...base, ...(raw || {}), id: raw?.id || base.id, type };

  // Eski (tek dilli) kayıtlarda metinler düz string olarak durur. Böyle bir
  // alanı, şablondaki TR/EN karşılıklarıyla iki dillileştiririz:
  //   { tr: eski düz metin, en: şablondaki İngilizce }
  // Böylece geçmişte kaydedilmiş Türkçe içerik korunur ve dil değiştirme
  // düğmesi de doğru çalışır.
  const bilingualise = (target, template) => {
    for (const key of Object.keys(template)) {
      const tplVal = template[key];
      if (!tplVal || typeof tplVal !== "object" || Array.isArray(tplVal)) continue;
      const val = target[key];
      if (typeof val === "string" && val.trim()) {
        target[key] = { tr: val, en: tplVal.en ?? tplVal.tr ?? "" };
      } else if (val && typeof val === "object" && !Array.isArray(val)) {
        // İç içe nesneler (ör. kart listesi) de tek tek ele alınır.
        bilingualise(val, tplVal);
      }
    }
  };

  for (const key of Object.keys(base)) {
    if (key === "id" || key === "type") continue;
    const tplVal = base[key];
    const val = merged[key];

    if (Array.isArray(tplVal)) {
      if (!Array.isArray(val)) continue;
      // Dizi elemanlarının içindeki düz metinleri iki dillileştir.
      val.forEach((item, i) => {
        const tplItem = tplVal[i];
        if (item && tplItem && typeof item === "object" && !Array.isArray(item)) {
          bilingualise(item, tplItem);
        }
      });
      continue;
    }

    if (!tplVal || typeof tplVal !== "object") continue;
    if (typeof val === "string" && val.trim()) {
      merged[key] = { tr: val, en: tplVal.en ?? tplVal.tr ?? "" };
    }
  }

  if (type === "nav") {
    const links = Array.isArray(raw?.links) ? raw.links : base.links;
    merged.links = links.map((l, i) => ({
      id: l?.id || `lnk_${i}`,
      label: l?.label ?? bi("", ""),
      href: typeof l?.href === "string" && l.href ? l.href : "#",
    }));
    merged.logo = typeof raw?.logo === "string" ? raw.logo : base.logo;
    merged.phone = typeof raw?.phone === "string" ? raw.phone : base.phone;
  }

  if (type === "footer") {
    const links = Array.isArray(raw?.links) ? raw.links : base.links;
    merged.links = links.map((l, i) => ({
      id: l?.id || `fl_${i}`,
      label: l?.label ?? bi("", ""),
      href: typeof l?.href === "string" && l.href ? l.href : "#",
    }));
  }

  if (type === "industries") {
    const items = Array.isArray(raw?.items) ? raw.items : base.items;
    merged.items = base.items.map((b, i) => ({
      id: items?.[i]?.id || b.id,
      title: items?.[i]?.title ?? b.title,
      image: typeof items?.[i]?.image === "string" ? items[i].image : "",
    }));
  }

  if (type === "routes") {
    const cards = Array.isArray(raw?.cards) ? raw.cards : base.cards;
    merged.cards = base.cards.map((b, i) => ({
      id: cards?.[i]?.id || b.id,
      badge: cards?.[i]?.badge ?? b.badge,
      title: cards?.[i]?.title ?? b.title,
      desc: cards?.[i]?.desc ?? b.desc,
      link: cards?.[i]?.link ?? b.link,
      href:
        typeof cards?.[i]?.href === "string" && cards[i].href
          ? cards[i].href
          : b.href || "/services",
      image: typeof cards?.[i]?.image === "string" ? cards[i].image : "",
    }));
  }

  if (type === "method") {
    const items = Array.isArray(raw?.items) ? raw.items : base.items;
    merged.items = base.items.map((b, i) => ({
      id: items?.[i]?.id || b.id,
      name: items?.[i]?.name ?? b.name,
      sub: items?.[i]?.sub ?? b.sub,
    }));
  }

  if (type === "media") {
    const items = Array.isArray(raw?.items) ? raw.items : base.items;
    merged.items = items.map((it, i) => ({
      id: it?.id || `mi_${i}`,
      kind: it?.kind === "video" ? "video" : "image",
      url: typeof it?.url === "string" ? it.url : "",
      caption: it?.caption ?? bi("", ""),
    }));
    if (!merged.items.length) merged.items = [emptyItem()];
    if (!MEDIA_LAYOUTS.some((l) => l.id === merged.layout)) merged.layout = "split";
    if (merged.captionPosition !== "below") merged.captionPosition = "overlay";
    if (typeof merged.videoAutoplay !== "boolean") merged.videoAutoplay = true;
  }

  if (type === "slider") {
    merged.images = Array.isArray(raw?.images) ? raw.images.filter(Boolean) : [];
    merged.interval = Number(raw?.interval) > 0 ? Number(raw.interval) : 4;
  }

  if (type === "cardGrid") {
    const cards = Array.isArray(raw?.cards) ? raw.cards : base.cards;
    merged.columns = [2, 3, 4].includes(Number(raw?.columns)) ? Number(raw.columns) : 3;
    merged.cards = cards.map((c, i) => ({
      id: c?.id || `cg_${i}`,
      eyebrow: c?.eyebrow ?? bi("01", "01"),
      title: c?.title ?? bi("", ""),
      desc: c?.desc ?? bi("", ""),
      note: c?.note ?? bi("", ""),
      image: typeof c?.image === "string" ? c.image : "",
    }));
  }

  if (type === "featureBlock") {
    const items = Array.isArray(raw?.items) ? raw.items : base.items;
    merged.items = items.map((it, i) => ({
      id: it?.id || `fb_${i}`,
      title: it?.title ?? bi("", ""),
    }));
  }

  if (type === "articleList") {
    const articles = Array.isArray(raw?.articles) ? raw.articles : base.articles;
    merged.articles = articles.map((a, i) => ({
      id: a?.id || `al_${i}`,
      eyebrow: a?.eyebrow ?? bi("", ""),
      category: a?.category ?? bi("", ""),
      date: a?.date ?? bi("", ""),
      author: a?.author ?? bi("", ""),
      title: a?.title ?? bi("", ""),
      body: a?.body ?? bi("", ""),
    }));
  }

  if (type === "statsBand") {
    const items = Array.isArray(raw?.items) ? raw.items : base.items;
    merged.items = items.map((it, i) => ({
      id: it?.id || `st_${i}`,
      value: it?.value ?? bi("", ""),
      label: it?.label ?? bi("", ""),
    }));
  }

  if (type === "faq") {
    const items = Array.isArray(raw?.items) ? raw.items : base.items;
    merged.items = items.map((it, i) => ({
      id: it?.id || `fq_${i}`,
      question: it?.question ?? bi("", ""),
      answer: it?.answer ?? bi("", ""),
    }));
  }

  if (type === "ctaBand") {
    merged.image = typeof raw?.image === "string" ? raw.image : "";
    merged.buttonHref = typeof raw?.buttonHref === "string" && raw.buttonHref ? raw.buttonHref : "#";
  }

  if (type === "hero") {
    merged.image = typeof raw?.image === "string" ? raw.image : "";
  }

  merged.__index = index;
  return merged;
}

/* ========================================================================== *
 *  Yerinde düzenleme
 * ========================================================================== */

/**
 * Tıkla-yaz düzenlenebilir metin.
 *
 * ÖNEMLİ: as="a" ile kullanıldığında href, target, rel, aria-* gibi tüm
 * özellikler etikete aktarılır. Daha önce yalnızca className/style
 * aktarıldığı için canlı sitedeki menü ve kart linkleri hrefsiz <a> olarak
 * çiziliyor, yani tıklanamıyordu.
 *
 * Stüdyo modunda içerik tıklanabilir olduğu için düzenleme sırasında link
 * takibi yapılmaz (href yine de undefined gelir, ayrıca onClick de engeller).
 */
function EditableText({
  value,
  onChange,
  as: Tag = "div",
  className = "",
  style,
  placeholder = "Yazmaya başlamak için tıklayın…",
  editable = false,
  ...rest
}) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const safeValue = typeof value === "string" ? value : "";

  useEffect(() => {
    const el = ref.current;
    if (!el || active) return;
    if (el.textContent !== safeValue) el.textContent = safeValue;
  }, [safeValue, active]);

  if (!editable) {
    return (
      <Tag className={className} style={style} {...rest}>
        {safeValue}
      </Tag>
    );
  }

  return (
    <Tag
      {...rest}
      ref={ref}
      className={`${className} genco-editable${active ? " is-active" : ""}`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-ph={placeholder}
      onClick={() => setActive(true)}
      onInput={(e) => onChange(e.currentTarget.textContent)}
      onBlur={() => setActive(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          if (ref.current) {
            ref.current.textContent = safeValue;
            ref.current.blur();
          }
          setActive(false);
        }
      }}
    >
      {safeValue}
    </Tag>
  );
}

/* ========================================================================== *
 *  Görsel alanı — stüdyoda tıklanınır, canlı sitede salt görsel
 * ========================================================================== */

/**
 * Bir bloğun görselini gösterir.
 *   • Canlı modda: yalnızca görsel.
 *   • Stüdyo modunda: tıklanınır; boşsa "+ Görsel Ekle", doluysa
 *     "Değiştir / Kaldır" düğmeleri çıkar.
 *
 * @param {string}   value   mevcut görsel yolu
 * @param {Function} onChange (yeniYol) => void
 * @param {Function} onPick   medya kütüphanesini açan geri çağrım
 * @param {string}   label    boşken gösterilen ipucu
 */
function ImageField({ value, onChange, onPick, edit, label = "Görsel Ekle", className = "", imgClass = "" }) {
  if (!edit) {
    if (!value) return null;
    return <img src={value} alt="" className={className || imgClass} draggable={false} />;
  }

  if (!value) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPick?.();
        }}
        className={`${className} group relative grid place-items-center border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-[#f97316] hover:text-[#f97316] transition`}
      >
        <span className="flex flex-col items-center gap-1 text-[11px] font-semibold">
          <span className="text-lg leading-none">+</span>
          {label}
        </span>
      </button>
    );
  }

  return (
    <div className={`${className} group relative overflow-hidden`}>
      <img src={value} alt="" className="h-full w-full object-cover" draggable={false} />
      <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-slate-900/55 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPick?.();
          }}
          className="rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-orange-50"
        >
          Değiştir
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          className="rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-red-700"
        >
          Kaldır
        </button>
      </div>
    </div>
  );
}

/* ========================================================================== *
 *  Blok render'ları
 * ========================================================================== */

function NavBlock({ block, ctx }) {
  const { set, edit, lang, onLangChange, selected, id } = ctx;
  // Bulunulan sayfa linki turuncu ve kalın gösterilir.
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 py-3 sm:py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo: canlı sitede ana sayfaya giden bağlantı, stüdyoda tıklanınır
            alan (görsel yolunu değiştirmek için). */}
        <div className="flex items-center -ml-1 sm:ml-0">
          {edit ? (
            <div
              className="rounded border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center px-3 cursor-pointer hover:border-[#f97316]"
              onClick={(e) => {
                e.stopPropagation();
                const url = window.prompt(
                  "Logo dosya yolu (örn. /logo.png):",
                  block.logo || "/logo.png"
                );
                if (url) set("logo", url);
              }}
              title="Logo yolunu değiştir"
            >
              <img
                src={block.logo || "/logo.png"}
                alt="GENCO"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
          ) : (
            <a
              href="/"
              aria-label="GENCO — ana sayfa"
              title="Ana sayfa"
              className="flex items-center rounded px-1 transition hover:opacity-80"
            >
              <img
                src={block.logo || "/logo.png"}
                alt="Genco İthalat İhracat"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </a>
          )}
        </div>

        {/* Telefon numarası: B2B'de en değerli eylem çağrısı. Bilerek
            menünün sağında, TR/EN düğmesinin hemen solunda duruyor. */}
        <div className="hidden xl:flex items-center">
          <EditableText
            as="a"
            editable={edit}
            value={block.phone || ""}
            onChange={(v) => set("phone", v)}
            href={edit || !block.phone ? undefined : `tel:${String(block.phone).replace(/\s/g, "")}`}
            onClick={(e) => edit && e.preventDefault()}
            className="text-[13px] font-bold text-[#0f172a] hover:text-[#f97316] transition whitespace-nowrap"
            placeholder="Telefon numarası"
          />
        </div>

        <div className="hidden md:flex space-x-6 text-sm font-semibold text-gray-600">
          {(block.links || []).map((link) => (
            <EditableText
              key={link.id}
              as="a"
              editable={edit}
              value={L(link.label, lang)}
              onChange={(v) =>
                set(
                  "links",
                  (block.links || []).map((l) =>
                    l.id === link.id ? { ...l, label: mergeLang(l.label, lang, v) } : l
                  )
                )
              }
              href={edit ? undefined : link.href}
              onClick={(e) => edit && e.preventDefault()}
              className={`transition whitespace-nowrap ${
                !edit && pathname === link.href
                  ? "text-[#f97316] font-bold"
                  : "hover:text-[#f97316]"
              }`}
              placeholder="Menü adı"
            />
          ))}
        </div>

        {/* Canlı sitede menünün kendi TR/EN düğmesi çalışır. Stüdyo
            modunda dil üstteki "Dil" seçicisiyle belirlenir; buradaki
            düğmeler karışmasın diye gizlenir. */}
        {!edit && (
          <div className="flex items-center space-x-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => onLangChange?.("TR")}
              className={`px-2 py-1 rounded transition ${
                lang === "TR"
                  ? "bg-[#f97316] text-white"
                  : "text-gray-800 hover:text-[#f97316]"
              }`}
            >
              TR
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => onLangChange?.("EN")}
              className={`px-2 py-1 rounded transition ${
                lang === "EN"
                  ? "bg-[#f97316] text-white"
                  : "text-gray-400 hover:text-[#f97316]"
              }`}
            >
              EN
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function HeroBlock({ block, ctx }) {
  const { set, edit, lang, pick } = ctx;
  const E = (field, Tag, cls, placeholder) => (
    <EditableText
      as={Tag}
      editable={edit}
      value={L(block[field], lang)}
      onChange={(v) => set(field, mergeLang(block[field], lang, v))}
      className={cls}
      placeholder={placeholder}
    />
  );

  return (
    <header className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start text-left">
          {E("badge", "span", "text-[#f97316] font-bold tracking-wider text-sm mb-4 uppercase", "Üst etiket")}
          {block.tagline && (
            <p className="text-lg md:text-xl font-semibold italic text-[#1e293b] border-l-4 border-[#f97316] pl-4 mb-5 max-w-xl leading-snug">
              “{L(block.tagline, lang)}”
            </p>
          )}
          {E("title", "h1", "text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-6", "Ana başlık")}
          {E("subtitle", "p", "text-lg text-gray-600 mb-8 leading-relaxed", "Açıklama")}

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={edit ? undefined : block.primaryHref}
              onClick={(e) => edit && e.preventDefault()}
              className="bg-[#f97316] text-white px-8 py-4 text-center font-bold rounded hover:bg-orange-600 transition shadow-lg"
            >
              {E("primaryLabel", "span", "", "Buton metni")}
            </a>
            <a
              href={edit ? undefined : block.secondaryHref}
              onClick={(e) => edit && e.preventDefault()}
              className="border-2 border-[#0f172a] text-[#0f172a] px-8 py-4 text-center font-bold rounded hover:bg-[#0f172a] hover:text-white transition"
            >
              {E("secondaryLabel", "span", "", "Buton metni")}
            </a>
          </div>
        </div>

        {/* Sağ sütun: operasyon bilgi kutusu. Sayfaya görsel eklemek için
            "Görsel ve Video" bloğunu kullanın; bu alan metin kutusu olarak
            kalır ve yerleşimi bozmaz. */}
        <div className="relative bg-[#0f172a] p-8 rounded-lg text-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316] opacity-10 rounded-full blur-2xl" />
          {E("boxBadge", "div", "text-[#f97316] font-bold text-sm uppercase tracking-widest mb-2", "Kutu etiketi")}
            {E("boxTitle", "h3", "text-2xl font-bold mb-4", "Kutu başlığı")}
            {E("boxDesc", "p", "text-gray-300 text-sm leading-relaxed mb-6", "Kutu açıklaması")}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800 text-xs text-gray-400">
              {E("check1", "div", "", "Kontrol 1")}
              {E("check2", "div", "", "Kontrol 2")}
              {E("check3", "div", "", "Kontrol 3")}
              {E("check4", "div", "", "Kontrol 4")}
            </div>
          </div>
      </div>
    </header>
  );
}

function IndustriesBlock({ block, ctx }) {
  const { set, edit, lang, pick } = ctx;

  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <EditableText as="span" editable={edit} value={L(block.badge, lang)}
            onChange={(v) => set("badge", mergeLang(block.badge, lang, v))}
            className="text-[#f97316] font-bold text-xs uppercase tracking-widest" placeholder="Etiket" />
          <EditableText as="h2" editable={edit} value={L(block.heading, lang)}
            onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
            className="text-3xl font-bold text-[#0f172a] mt-2 mb-4" placeholder="Bölüm başlığı" />
          <EditableText as="p" editable={edit} value={L(block.description, lang)}
            onChange={(v) => set("description", mergeLang(block.description, lang, v))}
            className="text-gray-600" placeholder="Açıklama" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {(block.items || []).map((item, i) => (
            <div
              key={item.id}
              className={`bg-[#fafafa] border border-gray-200 rounded-lg hover:border-[#f97316] transition overflow-hidden ${
                item.image ? "" : "p-6"
              }`}
            >
              {item.image ? (
                <>
                  <ImageField
                    value={item.image}
                    onChange={(v) =>
                      set("items", block.items.map((x) => (x.id === item.id ? { ...x, image: v } : x)))
                    }
                    onPick={() => pick(`item:${item.id}`)}
                    edit={edit}
                    label="Sektör görseli"
                    className="w-full h-36"
                  />
                  <div className="p-4 text-center">
                    <div className="text-[#f97316] font-bold text-lg mb-1">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <EditableText as="h4" editable={edit} value={L(item.title, lang)}
                      onChange={(v) => set("items", block.items.map((x) => (x.id === item.id ? { ...x, title: mergeLang(x.title, lang, v) } : x)))}
                      className="font-bold text-[#0f172a]" placeholder="Sektör adı" />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[#f97316] font-bold text-lg mb-1">{String(i + 1).padStart(2, "0")}</div>
                  <EditableText as="h4" editable={edit} value={L(item.title, lang)}
                    onChange={(v) => set("items", block.items.map((x) => (x.id === item.id ? { ...x, title: mergeLang(x.title, lang, v) } : x)))}
                    className="font-bold text-[#0f172a]" placeholder="Sektör adı" />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500 font-medium">
          <EditableText as="div" editable={edit} value={L(block.note, lang)}
            onChange={(v) => set("note", mergeLang(block.note, lang, v))}
            placeholder="Alt not" />
        </div>
      </div>
    </section>
  );
}

function RoutesBlock({ block, ctx }) {
  const { set, edit, lang, pick } = ctx;

  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <EditableText as="h2" editable={edit} value={L(block.heading, lang)}
            onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
            className="text-3xl font-bold text-[#0f172a] mb-4" placeholder="Bölüm başlığı" />
          <EditableText as="p" editable={edit} value={L(block.subheading, lang)}
            onChange={(v) => set("subheading", mergeLang(block.subheading, lang, v))}
            className="text-gray-600" placeholder="Açıklama" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(block.cards || []).map((card) => (
            <div
              key={card.id}
              className="bg-white border border-gray-200 hover:border-[#f97316] hover:shadow-xl transition flex flex-col rounded-lg overflow-hidden"
            >
              {edit ? (
                <ImageField
                  value={card.image || ""}
                  onChange={(v) =>
                    set("cards", block.cards.map((c) => (c.id === card.id ? { ...c, image: v } : c)))
                  }
                  onPick={() => pick(`card:${card.id}`)}
                  edit={edit}
                  label="Kart görseli"
                  className="w-full aspect-[3/2]"
                />
              ) : (
                card.image && (
                  <img src={card.image} alt="" className="w-full aspect-[3/2] object-cover" draggable={false} />
                )
              )}

              <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                  <EditableText as="div" editable={edit} value={L(card.badge, lang)}
                    onChange={(v) => set("cards", block.cards.map((c) => (c.id === card.id ? { ...c, badge: mergeLang(c.badge, lang, v) } : c)))}
                    className="text-[#f97316] font-bold text-xs mb-3 uppercase tracking-wider" placeholder="Etiket" />
                  <EditableText as="h3" editable={edit} value={L(card.title, lang)}
                    onChange={(v) => set("cards", block.cards.map((c) => (c.id === card.id ? { ...c, title: mergeLang(c.title, lang, v) } : c)))}
                    className="text-xl font-bold text-[#1e293b] mb-3" placeholder="Kart başlığı" />
                  <EditableText as="p" editable={edit} value={L(card.desc, lang)}
                    onChange={(v) => set("cards", block.cards.map((c) => (c.id === card.id ? { ...c, desc: mergeLang(c.desc, lang, v) } : c)))}
                    className="text-gray-600 text-sm mb-6 leading-relaxed" placeholder="Kart açıklaması" />
                </div>
                <EditableText as="a" editable={edit} value={L(card.link, lang)}
                  onChange={(v) => set("cards", block.cards.map((c) => (c.id === card.id ? { ...c, link: mergeLang(c.link, lang, v) } : c)))}
                  href={edit ? undefined : card.href || "/services"}
                  onClick={(e) => edit && e.preventDefault()}
                  className="text-[#0f172a] font-bold text-sm hover:text-[#f97316] flex items-center" placeholder="Bağlantı metni" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodBlock({ block, ctx }) {
  const { set, edit, lang, pick } = ctx;

  return (
    <section className="py-24 bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <EditableText as="span" editable={edit} value={L(block.badge, lang)}
            onChange={(v) => set("badge", mergeLang(block.badge, lang, v))}
            className="text-[#f97316] font-bold text-sm uppercase tracking-wider" placeholder="Etiket" />
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
            <EditableText as="div" editable={edit} value={L(block.title1, lang)}
              onChange={(v) => set("title1", mergeLang(block.title1, lang, v))} placeholder="Başlık 1" />
            <span className="text-[#f97316] block">
              <EditableText as="span" editable={edit} value={L(block.title2, lang)}
                onChange={(v) => set("title2", mergeLang(block.title2, lang, v))} placeholder="Başlık 2" />
            </span>
          </h2>
          <EditableText as="p" editable={edit} value={L(block.desc, lang)}
            onChange={(v) => set("desc", mergeLang(block.desc, lang, v))}
            className="text-gray-300 leading-relaxed mb-6" placeholder="Açıklama" />
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-[#f97316] rounded-full mr-3 shrink-0" />
              <EditableText as="div" editable={edit} value={L(block.d1, lang)}
                onChange={(v) => set("d1", mergeLang(block.d1, lang, v))} placeholder="Madde 1" />
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-[#f97316] rounded-full mr-3 shrink-0" />
              <EditableText as="div" editable={edit} value={L(block.d2, lang)}
                onChange={(v) => set("d2", mergeLang(block.d2, lang, v))} placeholder="Madde 2" />
            </div>
          </div>

          {/* Bölüm görseli — stüdyoda eklenebilir */}
          {edit ? (
            <div className="mt-8">
              <ImageField
                value={block.image || ""}
                onChange={(v) => set("image", v)}
                onPick={() => pick("image")}
                edit={edit}
                label="Bölüm görseli ekle"
                className="w-full h-56 rounded-lg"
              />
            </div>
          ) : (
            block.image && (
              <img
                src={block.image}
                alt=""
                className="mt-8 w-full h-56 object-cover rounded-lg"
                draggable={false}
              />
            )
          )}
        </div>

        <div className="bg-gray-800 p-8 border border-gray-700 rounded-lg">
          <EditableText as="div" editable={edit} value={L(block.methodTitle, lang)}
            onChange={(v) => set("methodTitle", mergeLang(block.methodTitle, lang, v))}
            className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-4" placeholder="Başlık" />
          <ul className="space-y-4 font-semibold text-lg">
            {(block.items || []).map((item, i) => (
              <li key={item.id} className={`flex items-center justify-between ${i < block.items.length - 1 ? "border-b border-gray-700 pb-3" : "pt-1"}`}>
                <span className="flex items-center">
                  <span className="text-[#f97316] mr-4 font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <EditableText as="span" editable={edit} value={L(item.name, lang)}
                    onChange={(v) => set("items", block.items.map((x) => (x.id === item.id ? { ...x, name: mergeLang(x.name, lang, v) } : x)))}
                    placeholder="Başlık" />
                </span>
                <EditableText as="span" editable={edit} value={L(item.sub, lang)}
                  onChange={(v) => set("items", block.items.map((x) => (x.id === item.id ? { ...x, sub: mergeLang(x.sub, lang, v) } : x)))}
                  className="text-xs text-gray-400" placeholder="Alt metin" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TextBlockView({ block, ctx }) {
  const { set, edit, lang } = ctx;
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#fafafa] border border-gray-200 p-8 md:p-12 rounded-2xl shadow-sm">
          <EditableText as="h2" editable={edit} value={L(block.heading, lang)}
            onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
            className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4" placeholder="Bölüm başlığı" />
          <EditableText as="p" editable={edit} value={L(block.content, lang)}
            onChange={(v) => set("content", mergeLang(block.content, lang, v))}
            className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap" placeholder="İçerik metni" />
        </div>
      </div>
    </section>
  );
}

function SliderBlock({ block, ctx }) {
  const { set, edit, lang } = ctx;
  const images = block.images || [];
  const [slide, setSlide] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (edit || images.length < 2) return;
    const ms = Math.max(1, Number(block.interval) || 4) * 1000;
    timer.current = setInterval(() => setSlide((s) => (s + 1) % images.length), ms);
    return () => clearInterval(timer.current);
  }, [edit, images.length, block.interval, images]);

  useEffect(() => {
    if (slide >= images.length) setSlide(0);
  }, [images.length, slide]);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <EditableText as="h2" editable={edit} value={L(block.heading, lang)}
          onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
          className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-6" placeholder="Galeri başlığı" />
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100 h-[280px] sm:h-[420px] lg:h-[500px]">
          {images.length > 0 ? (
            <>
              <img src={images[Math.min(slide, images.length - 1)]} alt="" className="w-full h-full object-cover transition-all duration-700" />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                  {images.map((_, i) => (
                    <button key={i} type="button" aria-label={`Görsel ${i + 1}`}
                      onClick={(e) => { e.stopPropagation(); setSlide(i); }}
                      className={`w-3 h-3 rounded-full transition-all ${i === slide ? "bg-[#f97316] w-6" : "bg-white/70 hover:bg-white"}`} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">Bu galeriye henüz görsel eklenmedi.</div>
          )}
        </div>
      </div>
    </section>
  );
}

function FooterBlock({ block, ctx }) {
  const { set, edit, lang } = ctx;
  const links = Array.isArray(block.links) ? block.links : [];

  return (
    <footer className="bg-white py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
        <EditableText as="div" editable={edit} value={L(block.rights, lang)}
          onChange={(v) => set("rights", mergeLang(block.rights, lang, v))} placeholder="Telif" />
        <div className="text-center md:text-right">
          <EditableText as="div" editable={edit} value={L(block.address, lang)}
            onChange={(v) => set("address", mergeLang(block.address, lang, v))}
            placeholder="Adres" />

          {/* Yasal / yardımcı bağlantılar (Gizlilik Politikası vb.). */}
          {(edit || links.length > 0) && (
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
              {links.map((l) => (
                <EditableText
                  key={l.id}
                  as="a"
                  editable={edit}
                  value={L(l.label, lang)}
                  onChange={(v) =>
                    set("links", links.map((x) => (x.id === l.id ? { ...x, label: mergeLang(x.label, lang, v) } : x)))
                  }
                  href={edit ? undefined : l.href || "#"}
                  onClick={(e) => edit && e.preventDefault()}
                  className="text-[12px] hover:text-[#f97316] transition"
                  placeholder="Bağlantı adı"
                />
              ))}
              {edit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    set("links", [
                      ...links,
                      {
                        id: `fl_${Math.random().toString(36).slice(2, 7)}`,
                        label: bi("Yeni bağlantı", "New link"),
                        href: "/",
                      },
                    ]);
                  }}
                  className="text-[11px] font-bold text-slate-400 hover:text-[#f97316]"
                >
                  + bağlantı ekle
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- *
 *  Alt sayfa bloklarının görünümleri
 * -------------------------------------------------------------------------- */

function PageHeaderBlock({ block, ctx }) {
  const { set, edit, lang } = ctx;
  return (
    <header className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <EditableText
          as="span"
          editable={edit}
          value={L(block.badge, lang)}
          onChange={(v) => set("badge", mergeLang(block.badge, lang, v))}
          className="text-[#f97316] font-bold tracking-wider text-sm mb-3 uppercase inline-block"
          placeholder="Üst etiket"
        />
        <EditableText
          as="h1"
          editable={edit}
          value={L(block.heading, lang)}
          onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
          className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-6"
          placeholder="Sayfa başlığı"
        />
        <EditableText
          as="p"
          editable={edit}
          value={L(block.sub, lang)}
          onChange={(v) => set("sub", mergeLang(block.sub, lang, v))}
          className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto"
          placeholder="Açıklama"
        />
      </div>
    </header>
  );
}

function CardGridBlock({ block, ctx }) {
  const { set, edit, lang, pick } = ctx;
  const cards = Array.isArray(block.cards) ? block.cards : [];
  const cols =
    block.columns === 2
      ? "md:grid-cols-2"
      : block.columns === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3";

  const update = (id, patch) =>
    set("cards", cards.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const addCard = () =>
    set("cards", [
      ...cards,
      {
        id: `cg_${Math.random().toString(36).slice(2, 8)}`,
        eyebrow: bi("Yeni", "New"),
        title: bi("Kart Başlığı", "Card Title"),
        desc: bi("Kart açıklaması buraya yazılır.", "Card description goes here."),
        note: bi("", ""),
        image: "",
      },
    ]);

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= cards.length) return;
    const list = [...cards];
    [list[i], list[j]] = [list[j], list[i]];
    set("cards", list);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EditableText
          as="h2"
          editable={edit}
          value={L(block.heading, lang)}
          onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
          className="text-2xl md:text-3xl font-bold text-[#0f172a] text-center mb-4"
          placeholder="Bölüm başlığı"
        />
        <EditableText
          as="p"
          editable={edit}
          value={L(block.sub, lang)}
          onChange={(v) => set("sub", mergeLang(block.sub, lang, v))}
          className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
          placeholder="Açıklama"
        />

        {edit && (
          <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Sütun
            </span>
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  set("columns", n);
                }}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                  block.columns === n
                    ? "bg-[#f97316] text-white"
                    : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="ml-auto text-[10px] text-slate-500">
              Kart sayısı: {cards.length}
            </span>
          </div>
        )}

        <div className={`grid grid-cols-1 gap-8 ${cols}`}>
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#f97316] transition flex flex-col overflow-hidden"
            >
              <ImageField
                value={card.image}
                edit={edit}
                onChange={(v) => update(card.id, { image: v })}
                onPick={() => pick(`card:${card.id}`)}
                label="Kart görseli"
                className="w-full h-40"
              />
              <div className="p-8 flex-1">
                <EditableText
                  as="div"
                  editable={edit}
                  value={L(card.eyebrow, lang)}
                  onChange={(v) => update(card.id, { eyebrow: mergeLang(card.eyebrow, lang, v) })}
                  className="text-[#f97316] font-mono text-sm font-bold mb-2"
                  placeholder="01 / KONU"
                />
                <EditableText
                  as="h3"
                  editable={edit}
                  value={L(card.title, lang)}
                  onChange={(v) => update(card.id, { title: mergeLang(card.title, lang, v) })}
                  className="text-2xl font-bold text-[#0f172a] mb-3"
                  placeholder="Kart başlığı"
                />
                <EditableText
                  as="p"
                  editable={edit}
                  value={L(card.desc, lang)}
                  onChange={(v) => update(card.id, { desc: mergeLang(card.desc, lang, v) })}
                  className="text-gray-600 text-sm leading-relaxed"
                  placeholder="Kart açıklaması"
                />
              </div>
              <div className="border-t border-gray-100 pt-4 px-8 pb-5 text-xs font-semibold text-gray-500">
                <EditableText
                  as="div"
                  editable={edit}
                  value={L(card.note, lang)}
                  onChange={(v) => update(card.id, { note: mergeLang(card.note, lang, v) })}
                  placeholder="Alt not"
                />
              </div>
              {edit && (
                <div className="flex gap-1 px-4 pb-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      move(i, -1);
                    }}
                    title="Önceki karta taşı"
                    className="grid h-6 w-6 place-items-center rounded bg-white border border-slate-300 text-[10px] font-bold text-slate-500 hover:bg-slate-100"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      move(i, 1);
                    }}
                    title="Sonraki karta taşı"
                    className="grid h-6 w-6 place-items-center rounded bg-white border border-slate-300 text-[10px] font-bold text-slate-500 hover:bg-slate-100"
                  >
                    →
                  </button>
                  <span className="flex-1" />
                  <button
                    type="button"
                    title="Kartı sil"
                    onClick={(e) => {
                      e.stopPropagation();
                      set("cards", cards.filter((c) => c.id !== card.id));
                    }}
                    className="grid h-6 w-6 place-items-center rounded bg-red-600 text-[10px] font-bold text-white hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}

          {edit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addCard();
              }}
              className="grid place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 text-[11px] font-semibold text-slate-400 hover:border-[#f97316] hover:text-[#f97316] transition"
            >
              <span className="text-lg leading-none">+</span>Kart ekle
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function FeatureBlockView({ block, ctx }) {
  const { set, edit, lang } = ctx;
  const items = Array.isArray(block.items) ? block.items : [];
  const updateItem = (id, patch) =>
    set("items", items.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <EditableText
            as="div"
            editable={edit}
            value={L(block.eyebrow, lang)}
            onChange={(v) => set("eyebrow", mergeLang(block.eyebrow, lang, v))}
            className="text-[#f97316] font-mono text-sm font-bold mb-3"
            placeholder="01 / ADIM"
          />
          {/* Kapsam satırı: sektör + pazar + yapılan iş. Boşsa gizlenir. */}
          {(edit || L(block.scope, lang)) && (
            <EditableText
              as="div"
              editable={edit}
              value={L(block.scope, lang)}
              onChange={(v) => set("scope", mergeLang(block.scope, lang, v))}
              className="text-[11px] font-mono uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4 inline-block"
              placeholder="Kapsam: sektör · pazar · yapılan iş"
            />
          )}
          <EditableText
            as="h2"
            editable={edit}
            value={L(block.heading, lang)}
            onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
            className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4"
            placeholder="Bölüm başlığı"
          />
          <EditableText
            as="p"
            editable={edit}
            value={L(block.desc, lang)}
            onChange={(v) => set("desc", mergeLang(block.desc, lang, v))}
            className="text-gray-600 leading-relaxed mb-6"
            placeholder="Açıklama"
          />
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((it) => (
              <li key={it.id} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#f97316] font-bold">✓</span>
                <span className="flex-1">
                  <EditableText
                    as="span"
                    editable={edit}
                    value={L(it.title, lang)}
                    onChange={(v) => updateItem(it.id, { title: mergeLang(it.title, lang, v) })}
                    placeholder="Özellik"
                  />
                </span>
                {edit && (
                  <button
                    type="button"
                    title="Sil"
                    onClick={(e) => {
                      e.stopPropagation();
                      set("items", items.filter((x) => x.id !== it.id));
                    }}
                    className="text-red-500 font-bold text-xs"
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
          {edit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                set("items", [
                  ...items,
                  {
                    id: `fb_${Math.random().toString(36).slice(2, 8)}`,
                    title: bi("Yeni özellik", "New feature"),
                  },
                ]);
              }}
              className="mt-4 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:border-[#f97316] hover:text-[#f97316]"
            >
              + Özellik ekle
            </button>
          )}
        </div>

        <div className="bg-[#0f172a] p-8 rounded-xl text-white shadow-lg">
          <EditableText
            as="h3"
            editable={edit}
            value={L(block.boxTitle, lang)}
            onChange={(v) => set("boxTitle", mergeLang(block.boxTitle, lang, v))}
            className="text-xl font-bold mb-3 text-[#f97316]"
            placeholder="Kutu başlığı"
          />
          <EditableText
            as="p"
            editable={edit}
            value={L(block.boxSub, lang)}
            onChange={(v) => set("boxSub", mergeLang(block.boxSub, lang, v))}
            className="text-gray-300 text-sm leading-relaxed"
            placeholder="Kutu açıklaması"
          />
        </div>
      </div>
    </section>
  );
}

function ArticleListBlock({ block, ctx }) {
  const { set, edit, lang } = ctx;
  const articles = Array.isArray(block.articles) ? block.articles : [];
  const update = (id, patch) =>
    set("articles", articles.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <EditableText
          as="h2"
          editable={edit}
          value={L(block.heading, lang)}
          onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
          className="text-2xl md:text-3xl font-bold text-[#0f172a] text-center mb-10"
          placeholder="Bölüm başlığı"
        />
        <div className="space-y-8">
          {articles.map((a) => (
            <article
              key={a.id}
              className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:border-[#f97316] transition relative"
            >
              {edit && (
                <button
                  type="button"
                  title="Makaleyi sil"
                  onClick={(e) => {
                    e.stopPropagation();
                    set("articles", articles.filter((x) => x.id !== a.id));
                  }}
                  className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded bg-red-600 text-white text-[10px] font-bold hover:bg-red-700"
                >
                  ✕
                </button>
              )}
              <div className="flex justify-between items-center text-xs text-gray-400 font-mono mb-4 pr-8">
                <EditableText
                  as="span"
                  editable={edit}
                  value={L(a.eyebrow, lang)}
                  onChange={(v) => update(a.id, { eyebrow: mergeLang(a.eyebrow, lang, v) })}
                  className="text-[#f97316] font-bold text-sm tracking-wider"
                  placeholder="01 / KONU"
                />
                <EditableText
                  as="span"
                  editable={edit}
                  value={L(a.category, lang)}
                  onChange={(v) => update(a.id, { category: mergeLang(a.category, lang, v) })}
                  placeholder="KATEGORİ"
                />
              </div>

              {/* Tarih ve yazar: yazıya uzmanlık ve tazelik sinyali verir.
                  Boş bırakılırsa satır hiç görünmez. */}
              {(edit || L(a.date, lang) || L(a.author, lang)) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 mb-4 pr-8">
                  <EditableText
                    as="span"
                    editable={edit}
                    value={L(a.date, lang)}
                    onChange={(v) => update(a.id, { date: mergeLang(a.date, lang, v) })}
                    placeholder="Tarih (örn. 12 Eylül 2026)"
                  />
                  <EditableText
                    as="span"
                    editable={edit}
                    value={L(a.author, lang)}
                    onChange={(v) => update(a.id, { author: mergeLang(a.author, lang, v) })}
                    placeholder="Yazar / ekip"
                  />
                </div>
              )}
              <EditableText
                as="h2"
                editable={edit}
                value={L(a.title, lang)}
                onChange={(v) => update(a.id, { title: mergeLang(a.title, lang, v) })}
                className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-5"
                placeholder="Makale başlığı"
              />
              <EditableText
                as="div"
                editable={edit}
                value={L(a.body, lang)}
                onChange={(v) => update(a.id, { body: mergeLang(a.body, lang, v) })}
                className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap"
                placeholder="Makale metni"
              />
            </article>
          ))}
          {edit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                set("articles", [
                  ...articles,
                  {
                    id: `al_${Math.random().toString(36).slice(2, 8)}`,
                    eyebrow: bi("Yeni", "New"),
                    category: bi("", ""),
                    title: bi("Makale Başlığı", "Article Title"),
                    body: bi("", ""),
                  },
                ]);
              }}
              className="w-full rounded-xl border-2 border-dashed border-slate-300 py-8 text-[11px] font-semibold text-slate-400 hover:border-[#f97316] hover:text-[#f97316] transition"
            >
              + Makale ekle
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function CtaBandBlock({ block, ctx }) {
  const { set, edit, lang, pick } = ctx;
  return (
    <section className="py-16 sm:py-20 text-white relative overflow-hidden bg-[#0f172a]">
      {block.image ? (
        <img src={block.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      ) : null}
      {edit && !block.image && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            pick("image");
          }}
          className="absolute right-3 top-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-orange-50"
        >
          Arka plan görseli ekle
        </button>
      )}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <EditableText
          as="span"
          editable={edit}
          value={L(block.badge, lang)}
          onChange={(v) => set("badge", mergeLang(block.badge, lang, v))}
          className="text-[#f97316] font-mono text-xs uppercase tracking-widest mb-3 block"
          placeholder="ÜST ETİKET"
        />
        <EditableText
          as="h2"
          editable={edit}
          value={L(block.heading, lang)}
          onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
          className="text-2xl md:text-3xl font-bold mb-4"
          placeholder="Başlık"
        />
        <EditableText
          as="p"
          editable={edit}
          value={L(block.sub, lang)}
          onChange={(v) => set("sub", mergeLang(block.sub, lang, v))}
          className="text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8"
          placeholder="Açıklama"
        />
        <a
          href={edit ? undefined : block.buttonHref || "#"}
          onClick={(e) => edit && e.preventDefault()}
          className="inline-block px-8 py-3.5 font-bold rounded bg-[#f97316] hover:opacity-90 transition"
        >
          <EditableText
            as="span"
            editable={edit}
            value={L(block.buttonLabel, lang)}
            onChange={(v) => set("buttonLabel", mergeLang(block.buttonLabel, lang, v))}
            placeholder="Buton metni"
          />
        </a>
      </div>
    </section>
  );
}

function StatsBandBlock({ block, ctx }) {
  const { set, edit, lang } = ctx;
  const items = Array.isArray(block.items) ? block.items : [];
  const update = (id, patch) =>
    set("items", items.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  // Doğrulanabilir veri olmadan sayı yayınlanmamalı. Boş sayılar stüdyoda
  // uyarı olarak görünür, canlı sitede ise o satır hiç çizilmez.
  const dolu = items.filter((it) => L(it.value, lang).trim());
  const eksik = items.length - dolu.length;

  if (!edit && !dolu.length) return null;

  return (
    <section className="py-14 text-white bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {edit && eksik > 0 && (
          <p className="mb-6 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-xs text-amber-200">
            <strong>Dikkat:</strong> {eksik} satırda sayı yok. Sadece gerçekten
            doğrulayabildiğiniz rakamları yazın — uydurma istatistik güveni
            sıfırlar ve yanlış beyan sayılabilir. Boş bırakılan satırlar
            canlı sitede görünmez.
          </p>
        )}
        <EditableText
          as="h2"
          editable={edit}
          value={L(block.heading, lang)}
          onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
          className="text-2xl font-bold text-center mb-10"
          placeholder="Başlık"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {items.map((it) =>
            !edit && !L(it.value, lang).trim() ? null : (
            <div key={it.id} className="relative">
              <div className="text-4xl font-extrabold text-[#f97316]">
                <EditableText
                  as="div"
                  editable={edit}
                  value={L(it.value, lang)}
                  onChange={(v) => update(it.id, { value: mergeLang(it.value, lang, v) })}
                  placeholder="00"
                />
              </div>
              <div className="mt-2 text-sm text-gray-300">
                <EditableText
                  as="div"
                  editable={edit}
                  value={L(it.label, lang)}
                  onChange={(v) => update(it.id, { label: mergeLang(it.label, lang, v) })}
                  placeholder="Açıklama"
                />
              </div>
              {edit && (
                <button
                  type="button"
                  title="Sil"
                  onClick={(e) => {
                    e.stopPropagation();
                    set("items", items.filter((x) => x.id !== it.id));
                  }}
                  className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded bg-red-600 text-[10px] font-bold text-white hover:bg-red-700"
                >
                  ✕
                </button>
              )}
            </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * İletişim bloğu — mesaj formu + iletişim bilgileri + harita.
 * Stüdyo modunda form alanları kapatılır (kullanıcı yanlışlıkla test mesajı
 * göndermesin); canlı sitede form gerçekten çalışır.
 */
function ContactBlock({ block, ctx }) {
  const { set, edit, lang } = ctx;
  // status: null | "sending" | "sent" | "error"
  const [status, setStatus] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);

  const E = (field, Tag, cls, placeholder) => (
    <EditableText
      as={Tag}
      editable={edit}
      value={L(block[field], lang)}
      onChange={(v) => set(field, mergeLang(block[field], lang, v))}
      className={cls}
      placeholder={placeholder}
    />
  );

  /**
   * Formu gönderir. Önce Web3Forms denenir; anahtar yoksa ya da gönderim
   * başarısız olursa mesaj kaybolmaması için kullanıcının mail uygulaması
   * hazır metinle açılır.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (edit || status === "sending") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      consent: fd.get("kvkk") === "on",
      // Gizli tuzak: botlar doldurur, insanlar göremez.
      website: String(fd.get("website") || ""),
      captchaToken: captchaToken || "",
    };

    setStatus("sending");
    setErrorText("");

    const result = await sendContactMessage(data);
    setCaptchaToken(null);

    if (result.ok) {
      setStatus("sent");
      form.reset();
      return;
    }

    // Gönderilemezse mesajın kaybolmaması için yedek yöntem.
    openMailFallback(data);
    setErrorText(
      `${result.error || "Mesaj gönderilemedi."} ${
        L(block.fallbackNote, lang) ||
        "Mesajınız e-posta uygulamanızda hazır metin olarak açıldı — oradan göndermek için onaylayın."
      }`
    );
    setStatus("error");
  };

  // Zorunlu alan ipucuları — sahte isim/adres gösterilmez, çünkü ziyaretçi
  // bunları gerçek bilgi sanabiliyor.
  const HINTS = {
    tr: {
      name: "Adınız ve soyadınız",
      email: "ornek@sirketiniz.com",
      phone: "Örn. +90 5XX XXX XX XX",
      message: "Talebinizi birkaç cümleyle özetleyin",
      required: "Zorunlu alan",
      sending: "Gönderiliyor…",
      send: L(block.submitLabel, lang),
    },
    en: {
      name: "Your full name",
      email: "you@company.com",
      phone: "e.g. +90 5XX XXX XX XX",
      message: "Briefly describe your request",
      required: "Required",
      sending: "Sending…",
      send: L(block.submitLabel, lang),
    },
  };
  const h = HINTS[(lang || "TR").toLowerCase()] || HINTS.tr;

  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* ---- Mesaj formu ---- */}
          <div className="bg-white border border-gray-200 p-8 md:p-12 rounded-xl shadow-sm">
            {E("formTitle", "h2", "text-2xl font-bold text-[#0f172a] mb-6", "Form başlığı")}

            {!edit && status === "sent" ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-sm font-medium">
                {L(block.successMsg, lang)}
              </div>
            ) : edit ? (
              <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-xs text-slate-500">
                Canlı sitede bu alanda ziyaretçi doldurulabilir bir iletişim
                formu görür. Stüdyo modunda form kapatılır.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  ["name", block.nameLabel, "text", h.name],
                  ["email", block.emailLabel, "email", h.email],
                  ["phone", block.phoneLabel, "tel", h.phone],
                ].map(([field, label, type, placeholder]) => (
                  <div key={field}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      {L(label, lang)}{" "}
                      <span className="text-[#f97316]" title={h.required}>
                        *
                      </span>
                    </label>
                    <input
                      type={type}
                      name={field}
                      required
                      autoComplete={field === "name" ? "name" : field === "email" ? "email" : "tel"}
                      placeholder={placeholder}
                      className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-[#f97316] text-sm"
                    />
                  </div>
                ))}

                {/* Gizli tuzak: botlar doldurur. Ekran dışında ve aria-hidden. */}
                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    {L(block.messageLabel, lang)}{" "}
                    <span className="text-[#f97316]" title={h.required}>
                      *
                    </span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder={h.message}
                    className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-[#f97316] text-sm"
                  />
                </div>

                {/* ---- CAPTCHA (Cloudflare Turnstile) ----
                     Kullanıcı güvenilirse hiçbir şey görünmez; şüpheli
                     trafikte Turnstile kendi sorusunu sorar. */}
                <Turnstile onToken={(t) => setCaptchaToken(t)} disabled={status === "sending"} />

                {/* ---- KVKK onayı: gönderim için zorunlu ---- */}
                <label className="flex items-start gap-2.5 text-[11px] leading-relaxed text-gray-600">
                  <input
                    type="checkbox"
                    name="kvkk"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#f97316]"
                  />
                  <span>
                    <EditableText
                      as="span"
                      editable={edit}
                      value={L(block.consent, lang)}
                      onChange={(v) => set("consent", mergeLang(block.consent, lang, v))}
                      placeholder="KVKK onay metni"
                    />{" "}
                    <EditableText
                      as="a"
                      editable={edit}
                      value={L(block.privacyLabel, lang)}
                      onChange={(v) =>
                        set("privacyLabel", mergeLang(block.privacyLabel, lang, v))
                      }
                      href={edit ? undefined : block.privacyHref || "#"}
                      onClick={(e) => edit && e.preventDefault()}
                      className="font-bold text-[#f97316] hover:underline"
                      placeholder="Gizlilik Politikası"
                    />
                    <span
                      role="textbox"
                      contentEditable={edit}
                      suppressContentEditableWarning
                      spellCheck={false}
                      className={edit ? "genco-editable inline" : "hidden"}
                      onClick={(e) => e.stopPropagation()}
                      onInput={(e) =>
                        set("privacyHref", e.currentTarget.textContent.trim() || "/gizlilik")
                      }
                    >
                      {block.privacyHref}
                    </span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-[#f97316] text-white p-4 font-bold rounded-lg hover:bg-orange-600 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? h.sending : h.send}
                </button>

                {status === "error" && (
                  <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-[12px] leading-relaxed text-amber-900">
                    {errorText}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* ---- İletişim bilgileri ---- */}
          <div className="bg-[#0f172a] p-8 md:p-12 rounded-xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl" />
            <div className="relative">
              {E("infoTitle", "h2", "text-2xl font-bold mb-8", "Bilgi başlığı")}
              <div className="space-y-6 text-sm text-gray-300">
                {[
                  ["addressLabel", "addressVal", "leading-relaxed text-gray-300"],
                  ["phoneLabel", "phoneVal", "font-bold text-white"],
                  ["emailLabel", "emailVal", "font-bold text-white"],
                ].map(([labelKey, valueKey, cls]) => (
                  <div key={valueKey}>
                    <EditableText
                      as="span"
                      editable={edit}
                      value={L(block[labelKey], lang)}
                      onChange={(v) => set(labelKey, mergeLang(block[labelKey], lang, v))}
                      className="text-[#f97316] font-mono text-xs uppercase tracking-widest block mb-1"
                      placeholder="ÜST ETİKET"
                    />
                    <EditableText
                      as="p"
                      editable={edit}
                      value={L(block[valueKey], lang)}
                      onChange={(v) => set(valueKey, mergeLang(block[valueKey], lang, v))}
                      className={cls}
                      placeholder="Değer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---- Harita ---- */}
        {edit ? (
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Harita bağlantısı (Google haritalar gömme adresi)
            </span>
            <EditableText
              as="div"
              editable
              value={L(block.mapUrl, lang)}
              onChange={(v) => set("mapUrl", mergeLang(block.mapUrl, lang, v))}
              className="text-[11px] font-mono text-slate-600 break-all"
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
        ) : L(block.mapUrl, lang) ? (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-4">
            <div className="w-full h-[400px] rounded-lg overflow-hidden">
              <iframe
                title="GENCO Location"
                src={L(block.mapUrl, lang)}
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Sıkça sorulan sorular bloğu.
 *
 * Canlı sitede ilk soru açık gelir, diğerleri tıklanınca açılır. Soru/yanıt
 * metinleri iki dildir; blok tamamen panelden düzenlenir.
 */
function FaqBlock({ block, ctx }) {
  const { set, edit, lang } = ctx;
  const items = Array.isArray(block.items) ? block.items : [];
  const [open, setOpen] = useState(0);
  const update = (id, patch) =>
    set("items", items.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <EditableText
          as="h2"
          editable={edit}
          value={L(block.heading, lang)}
          onChange={(v) => set("heading", mergeLang(block.heading, lang, v))}
          className="text-2xl md:text-3xl font-bold text-[#0f172a] text-center mb-4"
          placeholder="Bölüm başlığı"
        />
        <EditableText
          as="p"
          editable={edit}
          value={L(block.sub, lang)}
          onChange={(v) => set("sub", mergeLang(block.sub, lang, v))}
          className="text-gray-600 text-center mb-10"
          placeholder="Açıklama"
        />

        <div className="space-y-3">
          {items.map((it, i) => {
            const isOpen = edit || open === i;
            return (
              <div
                key={it.id}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(open === i ? -1 : i);
                  }}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                >
                  <EditableText
                    as="span"
                    editable={edit}
                    value={L(it.question, lang)}
                    onChange={(v) => update(it.id, { question: mergeLang(it.question, lang, v) })}
                    className="font-bold text-[#0f172a] text-[15px] flex-1"
                    placeholder="Soru"
                  />
                  <span className="text-[#f97316] font-bold text-lg leading-none shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <EditableText
                      as="div"
                      editable={edit}
                      value={L(it.answer, lang)}
                      onChange={(v) => update(it.id, { answer: mergeLang(it.answer, lang, v) })}
                      className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap"
                      placeholder="Yanıt"
                    />
                  </div>
                )}
                {edit && (
                  <div className="flex gap-1 px-4 pb-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        set("items", items.filter((x) => x.id !== it.id));
                      }}
                      className="grid h-6 w-6 place-items-center rounded bg-red-600 text-[10px] font-bold text-white"
                      title="Soruyu sil"
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const next = [...items];
                        const j = i - 1;
                        if (j < 0) return;
                        [next[i], next[j]] = [next[j], next[i]];
                        set("items", next);
                      }}
                      className="grid h-6 w-6 place-items-center rounded bg-white border border-slate-300 text-[10px] font-bold text-slate-500"
                      title="Yukarı taşı"
                    >
                      ↑
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {edit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              set("items", [
                ...items,
                {
                  id: `fq_${Math.random().toString(36).slice(2, 7)}`,
                  question: bi("Yeni soru", "New question"),
                  answer: bi("Yeni yanıt", "New answer"),
                },
              ]);
            }}
            className="mt-4 w-full rounded-xl border-2 border-dashed border-slate-300 py-4 text-[11px] font-semibold text-slate-400 hover:border-[#f97316] hover:text-[#f97316] transition"
          >
            + Soru ekle
          </button>
        )}
      </div>
    </section>
  );
}

const RENDERERS = {
  faq: FaqBlock,
  contact: ContactBlock,
  pageHeader: PageHeaderBlock,
  cardGrid: CardGridBlock,
  featureBlock: FeatureBlockView,
  articleList: ArticleListBlock,
  ctaBand: CtaBandBlock,
  statsBand: StatsBandBlock,
  nav: NavBlock,
  hero: HeroBlock,
  industries: IndustriesBlock,
  routes: RoutesBlock,
  method: MethodBlock,
  textBlock: TextBlockView,
  slider: SliderBlock,
  footer: FooterBlock,
  media: MediaBlock,
};

/* ========================================================================== *
 *  Genel API
 * ========================================================================== */

/**
 * @param {Array}    blocks
 * @param {string}   mode          "live" | "edit"
 * @param {string}   lang          "TR" | "EN"
 * @param {Function} onLangChange
 * @param {Function} onSelect / onChange / onDelete / onMove
 * @param {Function} onDuplicate
 * @param {string}   selectedId
 */
export default function GencoBlocks({
  blocks = [],
  mode = "live",
  lang = "TR",
  onLangChange,
  selectedId = null,
  onSelect,
  onChange,
  onDelete,
  onMove,
  onDuplicate,
  onPickImage,
}) {
  const editable = mode === "edit";

  if (!blocks.length) {
    return (
      <div className="py-20 text-center text-gray-400 text-sm bg-white">
        Bu sayfada henüz blok yok. Soldaki araç çubuğundan yeni bir blok
        ekleyerek başlayın.
      </div>
    );
  }

  return (
    <div className="w-full">
      {blocks.map((raw, i) => {
        const block = raw.__index !== undefined ? raw : normaliseBlock(raw, i);
        const Renderer = RENDERERS[block.type] || TextBlockView;
        const isSelected = editable && block.id === selectedId;

        const ctx = {
          set: (field, value) => {
            if (editable && onChange) onChange(block.id, field, value);
          },
          edit: editable,
          lang,
          onLangChange,
          selected: isSelected,
          id: block.id,
          // Görsel seçme: (blokId, alan) → medya kütüphanesi
          pick: (field) => onPickImage?.(block.id, field),
        };

        return (
          <div
            key={`${block.id}__${lang}`}
            className={
              editable
                ? `relative transition ${
                    isSelected
                      ? "ring-2 ring-[#f97316] ring-offset-2 z-20"
                      : "hover:ring-1 hover:ring-slate-300 hover:ring-offset-1 z-10"
                  }`
                : ""
            }
            onClick={editable ? () => onSelect && onSelect(block.id) : undefined}
          >
            {editable && (
              <div className="absolute top-2 left-2 z-30 flex items-center gap-1">
                <span className="bg-[#0f172a] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {getBlockDef(block.type)?.label || block.type}
                </span>
                <button type="button" title="Yukarı taşı"
                  onClick={(e) => { e.stopPropagation(); onMove && onMove(block.id, -1); }}
                  className="bg-white text-slate-600 border border-slate-300 text-[10px] font-bold w-6 h-6 rounded hover:bg-slate-100">↑</button>
                <button type="button" title="Aşağı taşı"
                  onClick={(e) => { e.stopPropagation(); onMove && onMove(block.id, 1); }}
                  className="bg-white text-slate-600 border border-slate-300 text-[10px] font-bold w-6 h-6 rounded hover:bg-slate-100">↓</button>
                {onDuplicate && (
                  <button type="button" title="Çoğalt"
                    onClick={(e) => { e.stopPropagation(); onDuplicate(block.id); }}
                    className="bg-white text-slate-600 border border-slate-300 text-[10px] font-bold px-2 rounded hover:bg-slate-100">⧉</button>
                )}
              </div>
            )}

            {editable && isSelected && (
              <button type="button"
                onClick={(e) => { e.stopPropagation(); onDelete && onDelete(block.id); }}
                className="absolute top-2 right-2 z-30 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-lg">
                Blok Sil
              </button>
            )}

            <Renderer block={block} ctx={ctx} />
          </div>
        );
      })}
    </div>
  );
}
