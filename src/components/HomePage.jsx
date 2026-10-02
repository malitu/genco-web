"use client";

/**
 * GENCO — Ortak Ana Sayfa Bileşeni
 * ---------------------------------------------------------------------------
 * Bu dosya hem canlı site (src/app/page.jsx) hem de stüdyo tuvali
 * (src/app/admin/page.jsx) tarafından kullanılır. Aynı bileşen kullanıldığı
 * için stüdyoda gördüğünüz tasarım, Yayınla'dan sonra canlıda açılan
 * tasarımla birebir aynıdır.
 *
 * İçerik modeli
 *   • Sayfadaki HER şey bir bloktur: menü, manşet, sektörler, ticari hedef
 *     kartları, farkımız, alt bilgi.
 *   • Her metin iki dildir (tr / en). TR/EN düğmesi tüm sayfayı çevirir.
 *   • Veritabanında blok yoksa DEFAULT_SITE_BLOCKS kullanılır; böylece site
 *     hiçbir zaman boş kalmaz ve eski görünüm korunur.
 */

import { useEffect, useState } from "react";
import GencoBlocks, { DEFAULT_SITE_BLOCKS, normaliseBlock } from "./GencoBlocks";

export default function HomePage({
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
}) {
  // Dil kaynağı tek yerden yönetilir:
  //   • Stüdyo modunda dil, üstteki "Dil" seçicisinden gelir (langProp).
  //   • Canlı sitede dil menünün TR/EN düğmesiyle değişir ve localStorage'da
  //     hatırlanır.
  // Böylece iki kontrol birbiriyle çakışmaz.
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

  // Veritabanında blok yoksa tam şablonu kullan.
  // Not: normaliseBlock, eski (tek dilli) kayıtları iki dillileştirir.
  const source = blocks && blocks.length ? blocks : DEFAULT_SITE_BLOCKS;
  const resolved = source.map((b, i) => normaliseBlock(b, i));

  return (
    <div className="bg-[#fafafa] text-[#1e293b] antialiased min-h-screen" data-lang={lang}>
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
      />
    </div>
  );
}
