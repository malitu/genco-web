"use client";

/**
 * GENCO — Ortak Ana Sayfa Bileşeni
 * ---------------------------------------------------------------------------
 * Bu dosya ana sayfanın TAMAMINI barındırır ve iki yerde kullanılır:
 *
 *   1) Canlı site   : src/app/page.jsx        -> mode="live"
 *   2) Stüdyo tuvali: src/app/admin/page.jsx  -> mode="edit"
 *
 * İkisi de aynı bileşeni kullandığı için stüdyoda gördüğüniz şey, "Kaydet &
 * Yayınla" dedikten sonra canlıda açılacak şeyin BİREBİR aynısıdır.
 *
 * Önceden canlı sayfa, stüdyoda blok varsa tüm statik içeriği silip yerine
 * sadece blokları koyuyordu. Bu yüzden stüdyoda görünen tasarım canlı siteyle
 * uyuşmuyordu. Artık bloklar içeriğin üst bölümüne eklenir, statik bölümler
 * her zaman korunur.
 */

import { useEffect, useState } from "react";
import GencoBlocks from "./GencoBlocks";

/* -------------------------------------------------------------------------- */
/*  Metinler (TR / EN)                                                         */
/* -------------------------------------------------------------------------- */

const TRANSLATIONS = {
  TR: {
    services: "Hizmetler",
    industries: "Sektörler",
    caseStudies: "Vaka Analizleri",
    insights: "Trade Intelligence",
    about: "Hakkımızda",
    contact: "İletişim",
    badge: "Uluslararası İş Geliştirme Ortağınız",
    heroTitle: "Türkiye'deki Uluslararası Ticaret Ekibiniz",
    heroSub: "Sadece dış ticaret danışmanlığı sunmuyoruz. Fırsatları araştırıyor, doğru uluslararası partnerleri buluyor ve tüm ticari operasyonu sizin adınıza bizzat yönetiyoruz.",
    startProject: "Proje Başlatın",
    inspectServices: "Hizmetlerimizi İnceleyin",
    activeMgmt: "Aktif Ticaret Yönetimi",
    mgmtTitle: "Masada ve Sahada Doğrudan Operasyon",
    mgmtDesc: "Jenerik pazar araştırmalarıyla vakit kaybetmiyoruz. Tescilli ticaret istihbarat altyapılarımızı kullanarak doğrudan karar vericilere ulaşıyor; demir çelikten medikal, denizcilik ve femtech projelerine kadar teknik standartları bizzat yönetiyoruz.",
    check1: "✓ Doğrudan C-Level Erişim",
    check2: "✓ Teknik Şartname Uyumu",
    check3: "✓ Geniş Sektörel Esneklik",
    check4: "✓ Numune & Sevkiyat Takibi",
    indBadge: "Sektörel Yetkinlik",
    indTitle: "Ağırlıklı Çalıştığımız Sektörler",
    indDesc: "Derinlemesine ağa ve teknik bilgiye sahip olduğumuz ana alanların yanı sıra, esnek metodolojimizle her sektörde uluslararası ticaret operasyonu yönetebiliyoruz.",
    ind1: "Demir Çelik",
    ind2: "Denizcilik",
    ind3: "Tohumculuk",
    ind4: "Medikal",
    ind5: "Otomotiv",
    ind6: "Femtech",
    indNote: "* Uzmanlık alanlarımız haricinde, talebe göre her sektörde özel pazar araştırması ve operasyon yönetimi sağlanmaktadır.",
    routeTitle: "Ticari Hedefinizi Seçin",
    routeSub: "İster küresel pazarlarda büyümek isteyen bir üretici, ister Türkiye'den nitelikli tedarik arayan bir marka olun; operasyonunuzu uçtan uca yönetiyoruz.",
    r1Badge: "Yerli Üreticiler İçin",
    r1Title: "İhracat Pazarınızı Büyütelim",
    r1Desc: "Şirket içi ihracat departmanı kurma maliyetine katlanmadan, dışarıdan uluslararası satış ekibiniz olarak küresel alıcılara ulaşıyoruz.",
    r1Link: "İhracat Modelini İncele →",
    r2Badge: "Uluslararası Alıcılar İçin",
    r2Title: "Türkiye'den Güvenli Tedarik",
    r2Desc: "Doğru üreticiyi bulma, kapasite denetimi, fiyat teklifi koordinasyonu ve uluslararası standartlara uygunluk süreçlerini yönetiyoruz.",
    r2Link: "Tedarik Süreçlerini Gör →",
    r3Badge: "Global Markalar İçin",
    r3Title: "Türkiye Pazarına Giriş",
    r3Desc: "Türkiye pazarını analiz etmek, yerel regülasyonlara uyum sağlamak ve güçlü bir distribütör veya bayi ağı kurarak ticari operasyon başlatmak.",
    r3Link: "Pazara Giriş Stratejisi →",
    diffBadge: "Farkımız",
    diffTitle1: "Analiz yön gösterir.",
    diffTitle2: "İcraat ticaret yaratır.",
    diffDesc: "Pek çok kurum sadece rapor sunar ve çekilir; GENCO ise masada sizinle birlikte oturur, müzakereleri yürütür ve siparişin kapanışına kadar sahada yer alır.",
    d1: "Demir Çelik ve endüstriyel metallerde tolerans ve alaşım standardı uzmanlığı.",
    d2: "Medikal, Femtech, Tohumculuk, Denizcilik ve Otomotiv sektörlerinde tecrübe.",
    mTitle: "The GENCO Method",
    m1: "Araştırma (Research)",
    m1Sub: "Veri Odaklı",
    m2: "İletişim (Connect)",
    m2Sub: "Stratejik B2B",
    m3: "İcraat (Execute)",
    m3Sub: "Sahada Yönetim",
    m4: "Büyüme (Grow)",
    m4Sub: "Sürdürülebilir Ağ",
    mLink: "Metodolojimizin detaylarını inceleyin →",
    footerRights: "© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.",
    footerAddress:
      "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com",
  },
  EN: {
    services: "Services",
    industries: "Industries",
    caseStudies: "Case Studies",
    insights: "Trade Intelligence",
    about: "About Us",
    contact: "Contact",
    badge: "Your International Business Development Partner",
    heroTitle: "Your International Trade Team in Turkey",
    heroSub: "We don't just offer foreign trade consultancy. We research opportunities, find the right international partners, and personally manage your entire commercial operation.",
    startProject: "Start a Project",
    inspectServices: "Inspect Our Services",
    activeMgmt: "Active Trade Management",
    mgmtTitle: "Direct Operation at the Table and in the Field",
    mgmtDesc: "We don't waste time with generic market research. Using our proprietary trade intelligence infrastructure, we reach decision-makers directly and manage technical standards from steel to medical, marine, and femtech projects.",
    check1: "✓ Direct C-Level Access",
    check2: "✓ Technical Spec Compliance",
    check3: "✓ Wide Sectoral Flexibility",
    check4: "✓ Sample & Shipment Tracking",
    indBadge: "Sectoral Competence",
    indTitle: "Industries We Focus On",
    indDesc: "In addition to our core domains where we hold deep technical knowledge and networks, our flexible methodology allows us to manage trade operations in any sector.",
    ind1: "Steel & Metals",
    ind2: "Marine",
    ind3: "Agriculture",
    ind4: "Medical",
    ind5: "Automotive",
    ind6: "Femtech",
    indNote: "* Beyond our core specialties, bespoke market research and operation management are available for any sector upon request.",
    routeTitle: "Choose Your Commercial Goal",
    routeSub: "Whether you're a manufacturer expanding globally or a brand seeking reliable supply from Turkey, we manage your operations end-to-end.",
    r1Badge: "For Local Manufacturers",
    r1Title: "Scale Your Export Markets",
    r1Desc: "Without building an internal export department, we act as your outsourced international sales team reaching global buyers.",
    r1Link: "View Export Model →",
    r2Badge: "For International Buyers",
    r2Title: "Secure Sourcing from Turkey",
    r2Desc: "We handle manufacturer discovery, capacity audits, quotation coordination, and international standards compliance.",
    r2Link: "View Sourcing Processes →",
    r3Badge: "For Global Brands",
    r3Title: "Market Entry to Turkey",
    r3Desc: "Analyzing the Turkish market, ensuring local regulatory compliance, and establishing strong distributor or dealer networks.",
    r3Link: "Market Entry Strategy →",
    diffBadge: "Our Differentiator",
    diffTitle1: "Analysis guides.",
    diffTitle2: "Execution creates trade.",
    diffDesc: "Many firms hand over reports and walk away; GENCO sits at the table with you, leads negotiations, and stays on the ground until order closure.",
    d1: "Expertise in tolerance and alloy standards for steel and industrial metals.",
    d2: "Extensive experience across Medical, Femtech, Agriculture, Marine, and Automotive sectors.",
    mTitle: "The GENCO Method",
    m1: "Research",
    m1Sub: "Data-Driven",
    m2: "Connect",
    m2Sub: "Strategic B2B",
    m3: "Execute",
    m3Sub: "Field Management",
    m4: "Grow",
    m4Sub: "Sustainable Network",
    mLink: "Explore our methodology in detail →",
    footerRights: "© 2026 GENCO Imports & Exports LTD. All rights reserved.",
    footerAddress:
      "Meriç Mah. 5746/5 SK. No: 3 Inner Door No: Z1 Bornova/İzmir - TURKEY | Phone: +90 232 462 16 49 | info@gencotr.com",
  },
};

/* -------------------------------------------------------------------------- */
/*  Bileşen                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * @param {Array}   blocks     Stüdyodan gelen bloklar (canlıda "published", stüdyoda "draft")
 * @param {string}  mode       "live" | "edit"
 * @param {string}  selectedId Stüdyoda seçili bloğun id'si
 * @param {Function} onSelect / onChange / onDelete / onMove   yalnızca edit modunda
 */
export default function HomePage({
  blocks = [],
  mode = "live",
  selectedId = null,
  onSelect,
  onChange,
  onDelete,
  onMove,
  siteData = {},
}) {
  const [lang, setLang] = useState("TR");
  const editable = mode === "edit";

  useEffect(() => {
    const saved = localStorage.getItem("genco_lang");
    if (saved === "TR" || saved === "EN") setLang(saved);
  }, []);

  const changeLang = (next) => {
    setLang(next);
    localStorage.setItem("genco_lang", next);
  };

  const current = TRANSLATIONS[lang];

  // Stüdyoda navigasyon linkleri tıklanınca sayfadan çıkmasın.
  const navHref = (href) => (editable ? undefined : href);

  const stopNav = (e) => {
    if (editable) e.preventDefault();
  };

  return (
    <div className="bg-[#fafafa] text-[#1e293b] antialiased min-h-screen">
      {/* ---------------------------- NAV ---------------------------- */}
      <nav className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <a href={navHref("/")} onClick={stopNav}>
              <img
                src="/logo.png"
                alt="GENCO Imports & Exports"
                className="h-10 w-auto object-contain"
              />
            </a>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-600">
            <a href={navHref("/services")} onClick={stopNav} className="hover:text-[#f97316] transition">
              {current.services}
            </a>
            <a href={navHref("/industries")} onClick={stopNav} className="hover:text-[#f97316] transition">
              {current.industries}
            </a>
            <a href={navHref("/case-studies")} onClick={stopNav} className="hover:text-[#f97316] transition">
              {current.caseStudies}
            </a>
            <a href={navHref("/insights")} onClick={stopNav} className="hover:text-[#f97316] transition">
              {current.insights}
            </a>
            <a href={navHref("/about")} onClick={stopNav} className="hover:text-[#f97316] transition">
              {current.about}
            </a>
            <a href={navHref("/contact")} onClick={stopNav} className="hover:text-[#f97316] transition">
              {current.contact}
            </a>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => changeLang("TR")}
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
              onClick={() => changeLang("EN")}
              className={`px-2 py-1 rounded transition ${
                lang === "EN"
                  ? "bg-[#f97316] text-white"
                  : "text-gray-400 hover:text-[#f97316]"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </nav>

      {/* ------------------- STÜDYO BLOKLARI (varsa) ------------------- */}
      {blocks.length > 0 && (
        <GencoBlocks
          blocks={blocks}
          mode={editable ? "edit" : "live"}
          selectedId={selectedId}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
          onMove={onMove}
        />
      )}

      {/* ------------- Blok yoksa eski statik manşet gösterilir ------------- */}
      {blocks.length === 0 && (
        <header className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left">
              <span className="text-[#f97316] font-bold tracking-wider text-sm mb-4 uppercase">
                {current.badge}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-6">
                {siteData.heroTitle || current.heroTitle}
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {siteData.heroSub || current.heroSub}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a
                  href={navHref("/contact")}
                  onClick={stopNav}
                  className="bg-[#f97316] text-white px-8 py-4 text-center font-bold rounded hover:bg-orange-600 transition shadow-lg"
                >
                  {current.startProject}
                </a>
                <a
                  href={navHref("/services")}
                  onClick={stopNav}
                  className="border-2 border-[#0f172a] text-[#0f172a] px-8 py-4 text-center font-bold rounded hover:bg-[#0f172a] hover:text-white transition"
                >
                  {current.inspectServices}
                </a>
              </div>
            </div>

            <div className="relative bg-[#0f172a] p-8 rounded-lg text-white shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316] opacity-10 rounded-full blur-2xl" />
              <div className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-2">
                {current.activeMgmt}
              </div>
              <h3 className="text-2xl font-bold mb-4">{current.mgmtTitle}</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">{current.mgmtDesc}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800 text-xs text-gray-400">
                <div>{current.check1}</div>
                <div>{current.check2}</div>
                <div>{current.check3}</div>
                <div>{current.check4}</div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* --------------------------- SEKTÖRLER --------------------------- */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#f97316] font-bold text-xs uppercase tracking-widest">
              {current.indBadge}
            </span>
            <h2 className="text-3xl font-bold text-[#0f172a] mt-2 mb-4">{current.indTitle}</h2>
            <p className="text-gray-600">{current.indDesc}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              current.ind1,
              current.ind2,
              current.ind3,
              current.ind4,
              current.ind5,
              current.ind6,
            ].map((name, i) => (
              <div
                key={name}
                className="bg-[#fafafa] border border-gray-200 p-6 rounded-lg hover:border-[#f97316] transition"
              >
                <div className="text-[#f97316] font-bold text-lg mb-1">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="font-bold text-[#0f172a]">{name}</h4>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-sm text-gray-500 font-medium">{current.indNote}</div>
        </div>
      </section>

      {/* ------------------------- TİCARİ HEDEF ------------------------- */}
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">{current.routeTitle}</h2>
            <p className="text-gray-600">{current.routeSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              [current.r1Badge, current.r1Title, current.r1Desc, current.r1Link],
              [current.r2Badge, current.r2Title, current.r2Desc, current.r2Link],
              [current.r3Badge, current.r3Title, current.r3Desc, current.r3Link],
            ].map(([badge, title, desc, link]) => (
              <div
                key={title}
                className="bg-white border border-gray-200 p-8 hover:border-[#f97316] hover:shadow-xl transition flex flex-col justify-between rounded-lg"
              >
                <div>
                  <div className="text-[#f97316] font-bold text-xs mb-3 uppercase tracking-wider">
                    {badge}
                  </div>
                  <h3 className="text-xl font-bold text-[#1e293b] mb-3">{title}</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{desc}</p>
                </div>
                <a
                  href={navHref("/services")}
                  onClick={stopNav}
                  className="text-[#0f172a] font-bold text-sm hover:text-[#f97316] flex items-center"
                >
                  {link}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- FARKIMIZ ---------------------------- */}
      <section className="py-24 bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#f97316] font-bold text-sm uppercase tracking-wider">
              {current.diffBadge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              {current.diffTitle1} <br />
              <span className="text-[#f97316]">{current.diffTitle2}</span>
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">{current.diffDesc}</p>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-[#f97316] rounded-full mr-3" />
                {current.d1}
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-[#f97316] rounded-full mr-3" />
                {current.d2}
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-8 border border-gray-700 rounded-lg">
            <div className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-4">
              {current.mTitle}
            </div>
            <ul className="space-y-4 font-semibold text-lg">
              {[
                [current.m1, current.m1Sub],
                [current.m2, current.m2Sub],
                [current.m3, current.m3Sub],
                [current.m4, current.m4Sub],
              ].map(([name, sub], i) => (
                <li
                  key={name}
                  className={`flex items-center justify-between ${
                    i < 3 ? "border-b border-gray-700 pb-3" : "pt-1"
                  }`}
                >
                  <span className="flex items-center">
                    <span className="text-[#f97316] mr-4 font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>{" "}
                    {name}
                  </span>
                  <span className="text-xs text-gray-400">{sub}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href={navHref("/about")}
                onClick={stopNav}
                className="text-white text-sm font-bold hover:text-[#f97316] transition flex items-center"
              >
                {current.mLink}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- FOOTER ---------------------------- */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>{current.footerRights}</div>
          <div className="mt-4 md:mt-0 text-center md:text-right">{current.footerAddress}</div>
        </div>
      </footer>
    </div>
  );
}
