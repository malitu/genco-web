"use client";
import { useState, useEffect } from "react";

export default function Industries() {
  const [lang, setLang] = useState("TR");

  useEffect(() => {
    const savedLang = localStorage.getItem("genco_lang");
    if (savedLang) setLang(savedLang);
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("genco_lang", newLang);
  };

  const t = {
    TR: {
      services: "Hizmetler", industries: "Sektörler", caseStudies: "Vaka Analizleri", insights: "Trade Intelligence", about: "Hakkımızda", contact: "İletişim",
      badge: "Sektörel Yetkinlik ve Uzmanlık",
      title: "Derinlemesine Hakim Olduğumuz Alanlar ve Esnek Çözüm Ağımız",
      sub: "GENCO olarak kritik endüstriyel dikey sektörlerde tescilli teknik bilgiye ve küresel alıcı ağlarına sahibiz. Sınırlarımızı bu alanlarla sınırlamayarak, esnek metodolojimizle her sektörde uluslararası ticaret operasyonu yönetebiliyoruz.",
      i1t: "Demir Çelik & Metaller", i1d: "Karbon, alaşımlı, paslanmaz ve sementasyon çelik çubuk gruplarında uluslararası standartlara (EN, ASTM) tam hakimiyet. İnç/milimetre tolerans dönüşümleri ve Avrupa pazarında sürdürülebilir distribütör ağı yönetimi.", i1f: "✓ Alaşım Standartları & Tolerans Uzmanlığı",
      i2t: "Denizcilik (Marine)", i2d: "Tekne, deniz araçları ve kritik marine ekipmanlarının uluslararası ticareti, tescil regülasyonları, CE ve gürültü emisyon uyumluluk belgeleri ile küresel tedarik zinciri yönetimi.", i2f: "✓ Tekne & Marine Ekipmanları Tedariği",
      i3t: "Tohumculuk & Tarım", i3d: "Tohumculuk endüstrisinde küresel pazar araştırmaları, uluslararası dağıtım kanalları ve tarımsal ticaret operasyonlarında güvenilir iş geliştirme ve tedarikçi koordine etme kabiliyeti.", i3f: "✓ Küresel Tarım Ağı & Dağıtım",
      i4t: "Medikal & Sağlık", i4d: "Medikal malzemeler, cerrahi sarf malzemeleri, hastane donanımları ve uluslararası sağlık sektörü standartlarına tam uyumlu tedarikçi ağları ile global distribütör eşleştirme operasyonları.", i4f: "✓ Medikal Malzemeler & Cerrahi Sarflar",
      i5t: "Otomotiv & Yan Sanayi", i5d: "Otomotiv endüstrisi için talep edilen yüksek kalite standartlarına uygun parça tedariği, üretici kapasite denetimleri ve uluslararası OEM/Aftermarket alıcılarıyla stratejik buluşturma operasyonları.", i5f: "✓ OEM & Yan Sanayi Buluşturma",
      i6t: "Femtech & Sağlık Teknolojileri", i6d: "Kadın sağlığı ve yenilikçi sağlık teknolojileri alanında yükselen pazar trendleri, uluslararası ürün konumlandırma ve bu niş pazarda büyüme gösteren markalar için stratejik iş geliştirme desteği.", i6f: "✓ Niş Pazar ve Büyüme Stratejisi",
      flexBadge: "Sınırsız Operasyonel Esneklik", flexTitle: "Uzmanlık Alanlarımız Dışında Mısınız?", flexDesc: "GENCO'nun tescilli pazar araştırma ve aktif dış ticaret metodolojisi, sektörel ayrıcalık gözetmeksizin her türlü endüstriyel ürüne ve hammaddeye uyarlanabilir. Hangi sektörde olursanız olun, küresel ticari hedeflerinizi sahada gerçeğe dönüştürüyoruz.", flexBtn: "Sektörünüzü Görüşelim",
      footerRights: "© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.",
      footerAddress: "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com"
    },
    EN: {
      services: "Services", industries: "Industries", caseStudies: "Case Studies", insights: "Trade Intelligence", about: "About Us", contact: "Contact",
      badge: "Sectoral Competence & Expertise",
      title: "Our Core Domains and Flexible Solution Network",
      sub: "As GENCO, we possess proprietary technical knowledge and global buyer networks across critical industrial vertical sectors. Beyond these core domains, our flexible methodology enables us to manage international trade operations in any sector.",
      i1t: "Steel & Metals", i1d: "Full mastery of international standards (EN, ASTM) in carbon, alloy, stainless, and case-hardening steel bar groups. Inch/mm tolerance conversions and sustainable European distributor network management.", i1f: "✓ Alloy Standards & Tolerance Expertise",
      i2t: "Marine", i2d: "International trade, registration regulations, CE and noise emission compliance documentation for boats, watercraft, and critical marine equipment.", i2f: "✓ Boat & Marine Equipment Sourcing",
      i3t: "Agriculture & Seeds", i3d: "Global market research in the seed industry, international distribution channels, and reliable business development and supplier coordination in agricultural trade.", i3f: "✓ Global Agriculture Network & Distribution",
      i4t: "Medical & Healthcare", i4d: "Global distributor matching operations with medical supplies, surgical consumables, hospital equipment, and supplier networks fully compliant with international health sector standards.", i4f: "✓ Medical Supplies & Surgical Consumables",
      i5t: "Automotive & Supply Chain", i5d: "Part procurement meeting high quality standards required for the automotive industry, manufacturer capacity audits, and strategic matchmaking with international OEM/Aftermarket buyers.", i5f: "✓ OEM & Aftermarket Matchmaking",
      i6t: "Femtech & Health Tech", i6d: "Strategic business development support for rising market trends in women's health and innovative health technologies, international product positioning, and growth in this niche market.", i6f: "✓ Niche Market & Growth Strategy",
      flexBadge: "Unlimited Operational Flexibility", flexTitle: "Outside Our Core Fields?", flexDesc: "GENCO's proprietary market research and active foreign trade methodology can adapt to any industrial product and raw material without sectoral limitations. No matter your industry, we turn your global trade goals into reality on the ground.", flexBtn: "Discuss Your Industry",
      footerRights: "© 2026 GENCO Imports & Exports LTD. All rights reserved.",
      footerAddress: "Meriç Mah. 5746/5 SK. No: 3 Inner Door No: Z1 Bornova/İzmir - TURKEY | Phone: +90 232 462 16 49 | info@gencotr.com"
    }
  };

  const current = t[lang];

  return (
    <div className="bg-[#fafafa] text-[#1e293b] antialiased min-h-screen">
      <nav className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
                <a href="/">
                  <img src="/logo.png" alt="GENCO Imports & Exports" className="h-10 w-auto object-contain" />
                </a>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-600">
                <a href="/services" className="hover:text-[#f97316] transition">{current.services}</a>
                <a href="/industries" className="text-[#f97316] font-bold">{current.industries}</a>
                <a href="/case-studies" className="hover:text-[#f97316] transition">{current.caseStudies}</a>
                <a href="/insights" className="hover:text-[#f97316] transition">{current.insights}</a>
                <a href="/about" className="hover:text-[#f97316] transition">{current.about}</a>
                <a href="/contact" className="hover:text-[#f97316] transition">{current.contact}</a>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold">
                <button onClick={() => changeLang("TR")} className={`px-2 py-1 rounded transition ${lang === "TR" ? "bg-[#f97316] text-white" : "text-gray-800 hover:text-[#f97316]"}`}>TR</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => changeLang("EN")} className={`px-2 py-1 rounded transition ${lang === "EN" ? "bg-[#f97316] text-white" : "text-gray-400 hover:text-[#f97316]"}`}>EN</button>
            </div>
        </div>
      </nav>

      <header className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-[#f97316] font-bold tracking-wider text-sm mb-3 uppercase">{current.badge}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-6">{current.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">{current.sub}</p>
        </div>
      </header>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:border-[#f97316] transition flex flex-col justify-between">
            <div><div className="text-[#f97316] font-mono text-sm font-bold mb-2">01 / SECTOR</div><h3 className="text-2xl font-bold text-[#0f172a] mb-3">{current.i1t}</h3><p className="text-gray-600 text-sm leading-relaxed mb-6">{current.i1d}</p></div>
            <div className="border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">{current.i1f}</div>
          </div>
          <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:border-[#f97316] transition flex flex-col justify-between">
            <div><div className="text-[#f97316] font-mono text-sm font-bold mb-2">02 / SECTOR</div><h3 className="text-2xl font-bold text-[#0f172a] mb-3">{current.i2t}</h3><p className="text-gray-600 text-sm leading-relaxed mb-6">{current.i2d}</p></div>
            <div className="border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">{current.i2f}</div>
          </div>
          <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:border-[#f97316] transition flex flex-col justify-between">
            <div><div className="text-[#f97316] font-mono text-sm font-bold mb-2">03 / SECTOR</div><h3 className="text-2xl font-bold text-[#0f172a] mb-3">{current.i3t}</h3><p className="text-gray-600 text-sm leading-relaxed mb-6">{current.i3d}</p></div>
            <div className="border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">{current.i3f}</div>
          </div>
          <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:border-[#f97316] transition flex flex-col justify-between">
            <div><div className="text-[#f97316] font-mono text-sm font-bold mb-2">04 / SECTOR</div><h3 className="text-2xl font-bold text-[#0f172a] mb-3">{current.i4t}</h3><p className="text-gray-600 text-sm leading-relaxed mb-6">{current.i4d}</p></div>
            <div className="border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">{current.i4f}</div>
          </div>
          <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:border-[#f97316] transition flex flex-col justify-between">
            <div><div className="text-[#f97316] font-mono text-sm font-bold mb-2">05 / SECTOR</div><h3 className="text-2xl font-bold text-[#0f172a] mb-3">{current.i5t}</h3><p className="text-gray-600 text-sm leading-relaxed mb-6">{current.i5d}</p></div>
            <div className="border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">{current.i5f}</div>
          </div>
          <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:border-[#f97316] transition flex flex-col justify-between">
            <div><div className="text-[#f97316] font-mono text-sm font-bold mb-2">06 / SECTOR</div><h3 className="text-2xl font-bold text-[#0f172a] mb-3">{current.i6t}</h3><p className="text-gray-600 text-sm leading-relaxed mb-6">{current.i6d}</p></div>
            <div className="border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">{current.i6f}</div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0f172a] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-[#f97316] font-mono text-xs uppercase tracking-widest mb-3 block">{current.flexBadge}</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{current.flexTitle}</h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">{current.flexDesc}</p>
          <a href="/contact" className="bg-[#f97316] text-white px-8 py-4 font-bold rounded hover:bg-orange-600 transition inline-block">{current.flexBtn}</a>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div>{current.footerRights}</div>
            <div className="mt-4 md:mt-0 text-center md:text-right">{current.footerAddress}</div>
        </div>
      </footer>
    </div>
  );
}