"use client";

/**
 * GENCO Shared Block Engine
 * ---------------------------------------------------------------------------
 * This single component renders the page blocks for BOTH the admin studio
 * canvas and the live website. Because both surfaces use the same renderer,
 * what the user designs in the studio is exactly what gets published (WYSIWYG).
 *
 * Modes:
 *   mode="live"    -> pure read-only markup (no editing affordances)
 *   mode="edit"    -> click-to-edit inline text, selection outline, delete btn
 */

import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Block schema                                                              */
/* -------------------------------------------------------------------------- */

let idSeed = 0;
const uid = () =>
  `b_${Date.now().toString(36)}_${(idSeed++).toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;

const industryDefaults = () => [
  { title: "Demir Çelik" },
  { title: "Denizcilik" },
  { title: "Tohumculuk" },
  { title: "Medikal" },
  { title: "Otomotiv" },
  { title: "Femtech" },
];

export const BLOCK_LIBRARY = [
  {
    type: "hero",
    label: "Hero / Manşet",
    hint: "Büyük başlık, vurgu etiketi ve ana eylem butonları.",
    accent: "#f97316",
    create: () => ({
      id: uid(),
      type: "hero",
      badge: "Uluslararası İş Geliştirme Ortağınız",
      title: "Türkiye'deki Uluslararası Ticaret Ekibiniz",
      subtitle:
        "Sadece dış ticaret danışmanlığı sunmuyoruz. Fırsatları araştırıyor ve tüm ticari operasyonu sizin adınıza bizzat yönetiyoruz.",
      image: "",
      primaryLabel: "Proje Başlatın",
      primaryHref: "/contact",
      secondaryLabel: "Hizmetlerimizi İnceleyin",
      secondaryHref: "/services",
    }),
  },
  {
    type: "industries",
    label: "Sektörler",
    hint: "6'lı sektör ızgarası; altyapıdaki canlı site ile birebir uyumlu.",
    accent: "#0ea5e9",
    create: () => ({
      id: uid(),
      type: "industries",
      badge: "Sektörel Yetkinlik",
      heading: "Ağırlıklı Çalıştığımız Sektörler",
      description:
        "Derinlemesine ağa ve teknik bilgiye sahip olduğumuz ana alanların yanı sıra, esnek metodolojimizle her sektörde uluslararası ticaret operasyonu yönetebiliyoruz.",
      items: industryDefaults(),
      note: "* Uzmanlık alanlarımız haricinde, talebe göre her sektörde özel pazar araştırması ve operasyon yönetimi sağlanmaktadır.",
    }),
  },
  {
    type: "textBlock",
    label: "Özel Metin / İçerik",
    hint: "Serbest başlık ve açıklama bloğu.",
    accent: "#64748b",
    create: () => ({
      id: uid(),
      type: "textBlock",
      heading: "Bölüm Başlığı",
      content:
        "Buraya detaylı içerik metninizi yazabilirsiniz. Bu alan tıkladığınızda doğrudan düzenlenebilir.",
    }),
  },
  {
    type: "slider",
    label: "Galeri / Slider",
    hint: "Sıralanabilir görsel galerisi ve otomatik geçiş.",
    accent: "#8b5cf6",
    create: () => ({
      id: uid(),
      type: "slider",
      heading: "Küresel Operasyonel Görsellerimiz",
      images: [],
      interval: 4,
    }),
  },
];

export const getBlockDef = (type) =>
  BLOCK_LIBRARY.find((b) => b.type === type) || null;

/** Normalises blocks coming from Firestore so missing fields never crash a render. */
export function normaliseBlock(raw, index = 0) {
  const type = raw?.type || "textBlock";
  const def = getBlockDef(type);
  const base = def ? def.create() : BLOCK_LIBRARY[2].create();
  const merged = { ...base, ...(raw || {}), id: raw?.id || base.id, type };
  if (type === "industries") {
    const items = Array.isArray(raw?.items) ? raw.items : base.items;
    merged.items = Array.from({ length: 6 }, (_, i) => ({
      title: items?.[i]?.title || "",
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

/* -------------------------------------------------------------------------- */
/*  Inline editing primitive                                                  */
/* -------------------------------------------------------------------------- */

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

  // Keep the DOM in sync only while the user is NOT typing, otherwise the
  // caret would jump to the start on every keystroke.
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

/* -------------------------------------------------------------------------- */
/*  Block renderer                                                            */
/* -------------------------------------------------------------------------- */

function HeroBlock({ block, set, editable }) {
  return (
    <header className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div className="flex flex-col items-start text-left">
          <EditableText
            as="span"
            editable={editable}
            value={block.badge}
            onChange={(v) => set("badge", v)}
            className="text-genco-flame font-bold tracking-wider text-sm mb-4 uppercase"
            placeholder="Üst etiket"
          />
          <EditableText
            as="h1"
            editable={editable}
            value={block.title}
            onChange={(v) => set("title", v)}
            className="text-3xl md:text-5xl font-bold text-genco-ink leading-tight mb-6"
            placeholder="Ana başlık"
          />
          <EditableText
            as="p"
            editable={editable}
            value={block.subtitle}
            onChange={(v) => set("subtitle", v)}
            className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed"
            placeholder="Açıklama metni"
          />
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={block.primaryHref || "/contact"}
              onClick={(e) => editable && e.preventDefault()}
              className="bg-genco-flame text-white px-8 py-4 text-center font-bold rounded hover:bg-orange-600 transition shadow-lg"
            >
              <EditableText
                as="span"
                editable={editable}
                value={block.primaryLabel}
                onChange={(v) => set("primaryLabel", v)}
                placeholder="Buton metni"
              />
            </a>
            <a
              href={block.secondaryHref || "/services"}
              onClick={(e) => editable && e.preventDefault()}
              className="border-2 border-genco-ink text-genco-ink px-8 py-4 text-center font-bold rounded hover:bg-genco-ink hover:text-white transition"
            >
              <EditableText
                as="span"
                editable={editable}
                value={block.secondaryLabel}
                onChange={(v) => set("secondaryLabel", v)}
                placeholder="Buton metni"
              />
            </a>
          </div>
        </div>

        {block.image ? (
          <div className="relative overflow-hidden rounded-lg shadow-xl border border-gray-200 bg-gray-100 aspect-[4/3]">
            <img
              src={block.image}
              alt={block.title || ""}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="relative bg-genco-ink p-8 rounded-lg text-white shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-genco-flame opacity-10 rounded-full blur-2xl" />
            <div className="text-genco-flame font-bold text-sm uppercase tracking-widest mb-2">
              Aktif Ticaret Yönetimi
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Masada ve Sahada Doğrudan Operasyon
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Jenerik pazar araştırmalarıyla vakit kaybetmiyoruz. Doğrudan karar
              vericilere ulaşıyor ve teknik standartları bizzat yönetiyoruz.
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

function IndustriesBlock({ block, set, editable }) {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <EditableText
            as="span"
            editable={editable}
            value={block.badge}
            onChange={(v) => set("badge", v)}
            className="text-genco-flame font-bold text-xs uppercase tracking-widest"
            placeholder="Küçük etiket"
          />
          <EditableText
            as="h2"
            editable={editable}
            value={block.heading}
            onChange={(v) => set("heading", v)}
            className="text-2xl md:text-3xl font-bold text-genco-ink mt-2 mb-4"
            placeholder="Bölüm başlığı"
          />
          <EditableText
            as="p"
            editable={editable}
            value={block.description}
            onChange={(v) => set("description", v)}
            className="text-gray-600"
            placeholder="Açıklama"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {(block.items || []).map((item, i) => (
            <div
              key={i}
              className="bg-genco-paper border border-gray-200 p-6 rounded-lg hover:border-genco-flame transition"
            >
              <div className="text-genco-flame font-bold text-lg mb-1">
                {String(i + 1).padStart(2, "0")}
              </div>
              <EditableText
                as="h4"
                editable={editable}
                value={item.title}
                onChange={(v) => {
                  const items = (block.items || []).map((x, xi) =>
                    xi === i ? { ...x, title: v } : x
                  );
                  set("items", items);
                }}
                className="font-bold text-genco-ink"
                placeholder={`Sektör ${i + 1}`}
              />
            </div>
          ))}
        </div>

        {block.note ? (
          <EditableText
            as="div"
            editable={editable}
            value={block.note}
            onChange={(v) => set("note", v)}
            className="text-center mt-8 text-sm text-gray-500 font-medium"
            placeholder="Alt not"
          />
        ) : null}
      </div>
    </section>
  );
}

function TextBlock({ block, set, editable }) {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-genco-paper border border-gray-200 p-8 md:p-12 rounded-2xl shadow-sm">
          <EditableText
            as="h2"
            editable={editable}
            value={block.heading}
            onChange={(v) => set("heading", v)}
            className="text-2xl md:text-3xl font-bold text-genco-ink mb-4"
            placeholder="Bölüm başlığı"
          />
          <EditableText
            as="p"
            editable={editable}
            value={block.content}
            onChange={(v) => set("content", v)}
            className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap"
            placeholder="İçerik metni"
          />
        </div>
      </div>
    </section>
  );
}

function SliderBlock({ block, set, editable }) {
  const images = block.images || [];
  const [slide, setSlide] = useState(0);
  const timer = useRef(null);

  // Auto-advance only in live mode (the studio canvas stays still so the user
  // can click the block without it sliding away).
  useEffect(() => {
    if (editable || images.length < 2) return;
    const ms = Math.max(1, Number(block.interval) || 4) * 1000;
    timer.current = setInterval(
      () => setSlide((s) => (s + 1) % images.length),
      ms
    );
    return () => clearInterval(timer.current);
  }, [editable, images.length, block.interval, images]);

  useEffect(() => {
    if (slide >= images.length) setSlide(0);
  }, [images.length, slide]);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <EditableText
          as="h2"
          editable={editable}
          value={block.heading}
          onChange={(v) => set("heading", v)}
          className="text-2xl md:text-3xl font-bold text-genco-ink mb-6"
          placeholder="Galeri başlığı"
        />
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100 h-[280px] sm:h-[420px] lg:h-[500px]">
          {images.length > 0 ? (
            <>
              <img
                src={images[Math.min(slide, images.length - 1)]}
                alt={block.heading || "Galeri"}
                className="w-full h-full object-cover transition-all duration-700"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Görsel ${i + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlide(i);
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === slide
                          ? "bg-genco-flame w-6"
                          : "bg-white/70 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              Bu galeriye henüz görsel eklenmedi.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const RENDERERS = {
  hero: HeroBlock,
  industries: IndustriesBlock,
  textBlock: TextBlock,
  slider: SliderBlock,
};

/* -------------------------------------------------------------------------- */
/*  Public API                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Renders an array of blocks.
 *
 * @param {Array}  blocks      raw or normalised blocks
 * @param {string} mode        "live" | "edit"
 * @param {string} selectedId  id of the block that should show the edit chrome
 * @param {Function} onSelect  (id) => void          [edit mode]
 * @param {Function} onChange  (id, field, value) => void [edit mode]
 * @param {Function} onDelete  (id) => void          [edit mode]
 * @param {Function} onMove    (id, dir) => void     [edit mode, dir = -1|1]
 */
export default function GencoBlocks({
  blocks = [],
  mode = "live",
  selectedId = null,
  onSelect,
  onChange,
  onDelete,
  onMove,
}) {
  const editable = mode === "edit";

  if (!blocks.length) {
    return (
      <div className="py-20 text-center text-gray-400 text-sm">
        Bu sayfada henüz blok yok. Soldaki araç çubuğundan yeni bir blok
        ekleyerek başlayın.
      </div>
    );
  }

  return (
    <div className="w-full">
      {blocks.map((raw, i) => {
        const block = raw.__index !== undefined ? raw : normaliseBlock(raw, i);
        const Renderer = RENDERERS[block.type] || TextBlock;
        const isSelected = editable && block.id === selectedId;

        const set = (field, value) => {
          if (editable && onChange) onChange(block.id, field, value);
        };

        return (
          <div
            key={block.id}
            className={
              editable
                ? `relative transition ${
                    isSelected
                      ? "ring-2 ring-genco-flame ring-offset-2 z-20"
                      : "hover:ring-1 hover:ring-slate-300 hover:ring-offset-1 z-10"
                  }`
                : ""
            }
            onClick={editable ? () => onSelect && onSelect(block.id) : undefined}
          >
            {editable && (
              <div className="absolute top-2 left-2 z-30 flex items-center gap-1">
                <span className="bg-genco-ink text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {getBlockDef(block.type)?.label || block.type}
                </span>
                <button
                  type="button"
                  title="Yukarı taşı"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove && onMove(block.id, -1);
                  }}
                  className="bg-white text-slate-600 border border-slate-300 text-[10px] font-bold w-6 h-6 rounded hover:bg-slate-100"
                >
                  ↑
                </button>
                <button
                  type="button"
                  title="Aşağı taşı"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove && onMove(block.id, 1);
                  }}
                  className="bg-white text-slate-600 border border-slate-300 text-[10px] font-bold w-6 h-6 rounded hover:bg-slate-100"
                >
                  ↓
                </button>
              </div>
            )}

            {editable && isSelected && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(block.id);
                }}
                className="absolute top-2 right-2 z-30 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-lg"
              >
                Blok Sil
              </button>
            )}

            <Renderer block={block} set={set} editable={editable} />
          </div>
        );
      })}
    </div>
  );
}
