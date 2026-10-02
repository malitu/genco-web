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

/** Alanı yazar, diğer dili korur. */
export function mergeLang(current, lang, next) {
  if (current && typeof current === "object" && !Array.isArray(current)) {
    return { ...current, [lang]: next };
  }
  const other = lang === "en" ? "tr" : "en";
  return { [lang]: next, [other]: typeof current === "string" ? current : "" };
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
  { id: "lnk_insights", label: bi("Trade Intelligence", "Trade Intelligence"), href: "/insights" },
  { id: "lnk_about", label: bi("Hakkımızda", "About Us"), href: "/about" },
  { id: "lnk_contact", label: bi("İletişim", "Contact"), href: "/contact" },
];

export const NAV_DEFAULTS = {
  id: "seed_nav",
  type: "nav",
  logo: "/logo.png",
  links: NAV_LINKS,
};

export const HERO_DEFAULTS = {
  id: "seed_hero",
  type: "hero",
  badge: bi(
    "Uluslararası İş Geliştirme Ortağınız",
    "Your International Business Development Partner"
  ),
  title: bi(
    "Türkiye'deki Uluslararası Ticaret Ekibiniz",
    "Your International Trade Team in Turkey"
  ),
  subtitle: bi(
    "Sadece dış ticaret danışmanlığı sunmuyoruz. Fırsatları araştırıyor, doğru uluslararası partnerleri buluyor ve tüm ticari operasyonu sizin adınıza bizzat yönetiyoruz.",
    "We don't just offer foreign trade consultancy. We research opportunities, find the right international partners, and personally manage your entire commercial operation."
  ),
  primaryLabel: bi("Proje Başlatın", "Start a Project"),
  primaryHref: "/contact",
  secondaryLabel: bi("Hizmetlerimizi İnceleyin", "Inspect Our Services"),
  secondaryHref: "/services",
  image: "",
  boxBadge: bi("Aktif Ticaret Yönetimi", "Active Trade Management"),
  boxTitle: bi(
    "Masada ve Sahada Doğrudan Operasyon",
    "Direct Operation at the Table and in the Field"
  ),
  boxDesc: bi(
    "Jenerik pazar araştırmalarıyla vakit kaybetmiyoruz. Tescilli ticaret istihbarat altyapılarımızı kullanarak doğrudan karar vericilere ulaşıyor; demir çelikten medikal, denizcilik ve femtech projelerine kadar teknik standartları bizzat yönetiyoruz.",
    "We don't waste time with generic market research. Using our proprietary trade intelligence infrastructure, we reach decision-makers directly and manage technical standards from steel to medical, marine, and femtech projects."
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
  heading: bi(
    "Ağırlıklı Çalıştığımız Sektörler",
    "Industries We Focus On"
  ),
  description: bi(
    "Derinlemesine ağa ve teknik bilgiye sahip olduğumuz ana alanların yanı sıra, esnek metodolojimizle her sektörde uluslararası ticaret operasyonu yönetebiliyoruz.",
    "In addition to our core domains where we hold deep technical knowledge and networks, our flexible methodology allows us to manage trade operations in any sector."
  ),
  items: [
    { id: "ind_1", title: bi("Demir Çelik", "Steel & Metals") },
    { id: "ind_2", title: bi("Denizcilik", "Marine") },
    { id: "ind_3", title: bi("Tohumculuk", "Agriculture") },
    { id: "ind_4", title: bi("Medikal", "Medical") },
    { id: "ind_5", title: bi("Otomotiv", "Automotive") },
    { id: "ind_6", title: bi("Femtech", "Femtech") },
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
      link: bi("İhracat Modelini İncele →", "View Export Model →"),
    },
    {
      id: "card_2",
      badge: bi("Uluslararası Alıcılar İçin", "For International Buyers"),
      title: bi("Türkiye'den Güvenli Tedarik", "Secure Sourcing from Turkey"),
      desc: bi(
        "Doğru üreticiyi bulma, kapasite denetimi, fiyat teklifi koordinasyonu ve uluslararası standartlara uygunluk süreçlerini yönetiyoruz.",
        "We handle manufacturer discovery, capacity audits, quotation coordination, and international standards compliance."
      ),
      link: bi("Tedarik Süreçlerini Gör →", "View Sourcing Processes →"),
    },
    {
      id: "card_3",
      badge: bi("Global Markalar İçin", "For Global Brands"),
      title: bi("Türkiye Pazarına Giriş", "Market Entry to Turkey"),
      desc: bi(
        "Türkiye pazarını analiz etmek, yerel regülasyonlara uyum sağlamak ve güçlü bir distribütör veya bayi ağı kurarak ticari operasyon başlatmak.",
        "Analyzing the Turkish market, ensuring local regulatory compliance, and establishing strong distributor or dealer networks."
      ),
      link: bi("Pazara Giriş Stratejisi →", "Market Entry Strategy →"),
    },
  ],
};

export const METHOD_DEFAULTS = {
  id: "seed_method",
  type: "method",
  badge: bi("Farkımız", "Our Differentiator"),
  title1: bi("Analiz yön gösterir.", "Analysis guides."),
  title2: bi("İcraat ticaret yaratır.", "Execution creates trade."),
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
  items: [
    { id: "m_1", name: bi("Araştırma (Research)", "Research"), sub: bi("Veri Odaklı", "Data-Driven") },
    { id: "m_2", name: bi("İletişim (Connect)", "Connect"), sub: bi("Stratejik B2B", "Strategic B2B") },
    { id: "m_3", name: bi("İcraat (Execute)", "Execute"), sub: bi("Sahada Yönetim", "Field Management") },
    { id: "m_4", name: bi("Büyüme (Grow)", "Grow"), sub: bi("Sürdürülebilir Ağ", "Sustainable Network") },
  ],
};

export const FOOTER_DEFAULTS = {
  id: "seed_footer",
  type: "footer",
  rights: bi(
    "© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.",
    "© 2026 GENCO Imports & Exports LTD. All rights reserved."
  ),
  address: bi(
    "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com",
    "Meriç Mah. 5746/5 SK. No: 3 Inner Door No: Z1 Bornova/İzmir - TURKEY | Phone: +90 232 462 16 49 | info@gencotr.com"
  ),
};

/** Firestore'da hiç blok yoksa devreye giren tam sayfa şablonu. */
export const DEFAULT_SITE_BLOCKS = [
  NAV_DEFAULTS,
  HERO_DEFAULTS,
  INDUSTRIES_DEFAULTS,
  ROUTES_DEFAULTS,
  METHOD_DEFAULTS,
  FOOTER_DEFAULTS,
];

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
  { type: "hero", label: "Hero / Manşet", hint: "Manşet: büyük başlık, açıklama, butonlar ve sağdaki kutu.", accent: "#f97316", create: () => ({ ...HERO_DEFAULTS, id: uid() }) },
  { type: "industries", label: "Sektörler", hint: "6'lı sektör ızgarası.", accent: "#0ea5e9", create: () => ({ ...INDUSTRIES_DEFAULTS, id: uid() }) },
  { type: "routes", label: "Ticari Hedef Kartları", hint: "Başlık + 3 hedef kartı.", accent: "#22c55e", create: () => ({ ...ROUTES_DEFAULTS, id: uid() }) },
  { type: "method", label: "Farkımız / Method", hint: "Koyu bölüm: iki sütunlu fark anlatımı ve method listesi.", accent: "#8b5cf6", create: () => ({ ...METHOD_DEFAULTS, id: uid() }) },
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
  textBlock: TEXT_DEFAULTS,
  slider: SLIDER_DEFAULTS,
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
  }

  if (type === "industries") {
    const items = Array.isArray(raw?.items) ? raw.items : base.items;
    merged.items = base.items.map((b, i) => ({
      id: items?.[i]?.id || b.id,
      title: items?.[i]?.title ?? b.title,
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

  if (type === "slider") {
    merged.images = Array.isArray(raw?.images) ? raw.images.filter(Boolean) : [];
    merged.interval = Number(raw?.interval) > 0 ? Number(raw.interval) : 4;
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

function EditableText({
  value,
  onChange,
  as: Tag = "div",
  className = "",
  style,
  placeholder = "Yazmaya başlamak için tıklayın…",
  editable = false,
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
      <Tag className={className} style={style}>
        {safeValue}
      </Tag>
    );
  }

  return (
    <Tag
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
 *  Blok render'ları
 * ========================================================================== */

function NavBlock({ block, ctx }) {
  const { set, edit, lang, onLangChange, selected, id } = ctx;

  return (
    <nav className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            logo
          </span>
          <div
            className="w-40 h-10 rounded border border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center"
            onClick={(e) => {
              if (!edit) return;
              e.stopPropagation();
              const url = window.prompt("Logo dosya yolu (örn. /logo.png):", block.logo || "/logo.png");
              if (url) set("logo", url);
            }}
            title={edit ? "Logo yolunu değiştir" : ""}
          >
            <img src={block.logo || "/logo.png"} alt="GENCO" className="h-10 w-auto object-contain" />
          </div>
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
              className="hover:text-[#f97316] transition whitespace-nowrap"
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
  const { set, edit, lang } = ctx;
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

        {block.image ? (
          <div className="relative overflow-hidden rounded-lg shadow-xl border border-gray-200 bg-gray-100 aspect-[4/3]">
            <img src={block.image} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
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
        )}
      </div>
    </header>
  );
}

function IndustriesBlock({ block, ctx }) {
  const { set, edit, lang } = ctx;

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
            <div key={item.id} className="bg-[#fafafa] border border-gray-200 p-6 rounded-lg hover:border-[#f97316] transition">
              <div className="text-[#f97316] font-bold text-lg mb-1">{String(i + 1).padStart(2, "0")}</div>
              <EditableText as="h4" editable={edit} value={L(item.title, lang)}
                onChange={(v) => set("items", block.items.map((x) => (x.id === item.id ? { ...x, title: mergeLang(x.title, lang, v) } : x)))}
                className="font-bold text-[#0f172a]" placeholder="Sektör adı" />
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
  const { set, edit, lang } = ctx;

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
            <div key={card.id} className="bg-white border border-gray-200 p-8 hover:border-[#f97316] hover:shadow-xl transition flex flex-col justify-between rounded-lg">
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
                href={edit ? undefined : "/services"}
                onClick={(e) => edit && e.preventDefault()}
                className="text-[#0f172a] font-bold text-sm hover:text-[#f97316] flex items-center" placeholder="Bağlantı metni" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodBlock({ block, ctx }) {
  const { set, edit, lang } = ctx;

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
  return (
    <footer className="bg-white py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <EditableText as="div" editable={edit} value={L(block.rights, lang)}
          onChange={(v) => set("rights", mergeLang(block.rights, lang, v))} placeholder="Telif" />
        <EditableText as="div" editable={edit} value={L(block.address, lang)}
          onChange={(v) => set("address", mergeLang(block.address, lang, v))}
          className="mt-4 md:mt-0 text-center md:text-right" placeholder="Adres" />
      </div>
    </footer>
  );
}

const RENDERERS = {
  nav: NavBlock,
  hero: HeroBlock,
  industries: IndustriesBlock,
  routes: RoutesBlock,
  method: MethodBlock,
  textBlock: TextBlockView,
  slider: SliderBlock,
  footer: FooterBlock,
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
