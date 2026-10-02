"use client";

/**
 * GENCO — Alt Sayfa Bileşeni (Hizmetler, Sektörler, Vaka Analizleri, ...)
 * ---------------------------------------------------------------------------
 * Ana sayfada olduğu gibi bu bileşen de hem canlı site hem de stüdyo tuvali
 * tarafından kullanılır. Aynı render kullanıldığı için stüdyoda gördüğünüz
 * düzen, "Kaydet & Yayınla" sonrası canlı siteyle birebir aynıdır.
 *
 * Veri kaynağı
 *   blocks       → stüdyoda yayınlanmış bloklar (Firestore pagesContent.<key>)
 *   blocks boşsa → sayfanın kendi varsayılan şablonu (PAGE_TEMPLATES)
 */

import { useEffect, useState } from "react";
import GencoBlocks, {
  DEFAULT_SITE_BLOCKS,
  NAV_DEFAULTS,
  PAGE_HEADER_DEFAULTS,
  FOOTER_DEFAULTS,
  normaliseBlock,
} from "./GencoBlocks";
import { getPageTemplate } from "./PageTemplates";

/** Hiç şablonu ve yayınlanmış içeriği olmayan yeni sayfalar için iskelet. */
const EMPTY_PAGE = [NAV_DEFAULTS, PAGE_HEADER_DEFAULTS, FOOTER_DEFAULTS];

export default function SitePage({
  pageKey,
  blocks = [],
  mode = "live",
  lang: langProp,
  onLangChange: onLangChangeProp,
  selectedId = null,
  onSelect,
  onChange,
  onDelete,
  onMove,
  onDuplicate,
  onPickImage,
}) {
  const [ownLang, setOwnLang] = useState("TR");

  useEffect(() => {
    const saved = localStorage.getItem("genco_lang");
    if (saved === "TR" || saved === "EN") setOwnLang(saved);
  }, []);

  const controlled = typeof langProp === "string";
  const lang = controlled ? langProp : ownLang;

  const changeLang = (next) => {
    if (controlled) {
      onLangChangeProp?.(next);
      return;
    }
    setOwnLang(next);
    localStorage.setItem("genco_lang", next);
  };

  // Yayınlanmış blok yoksa sayfanın kendi şablonu kullanılır; site hiçbir
  // zaman boş kalmaz.
  const fallback =
    pageKey === "home"
      ? DEFAULT_SITE_BLOCKS
      : getPageTemplate(pageKey).length
        ? getPageTemplate(pageKey)
        : EMPTY_PAGE;
  const source = blocks && blocks.length ? blocks : fallback;
  const resolved = source.map((b, i) => normaliseBlock(b, i));

  return (
    <div
      className="bg-[#fafafa] text-[#1e293b] antialiased min-h-screen"
      data-lang={lang}
    >
      <GencoBlocks
        blocks={resolved}
        mode={mode}
        lang={lang}
        onLangChange={changeLang}
        selectedId={selectedId}
        onSelect={onSelect}
        onChange={onChange}
        onDelete={onDelete}
        onMove={onMove}
        onDuplicate={onDuplicate}
        onPickImage={onPickImage}
      />
    </div>
  );
}