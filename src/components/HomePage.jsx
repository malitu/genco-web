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
  onPickImage,
}) {
  // Dil kaynağı URL'dir. Sayfa dosyası (sunucu bileşeni) /en/ öneki olup
  // olmadığına bakarak "TR" veya "EN" geçirir; böylece Türkçe bir adres
  // yalnızca Türkçe, /en/... adresi yalnızca İngilizce gösterir.
  //
  // Önceden dil localStorage'da tutuluyordu; bunun iki sakıncası vardı:
  //   1) /en/ adresi hiçbir zaman taranamıyordu (botlar JS çalıştırmaz).
  //   2) Aynı adres kullanıcıya göre iki farklı içerik gösteriyordu.
  // Artık böyle bir durum yok.
  const lang = typeof langProp === "string" ? langProp : "TR";

  // Canlı sitede langProp her zaman geçilir ve bu geri çağrı hiç çalışmaz:
  // dil değişimi bağlantıyla (URL) yapılır. Yalnızca stüdyo modunda, üstteki
  // "Dil" seçicisinin değerini günceller.
  const changeLang = (next) => {
    onLangChangeProp?.(next);
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
        onPickImage={onPickImage}
      />
    </div>
  );
}
