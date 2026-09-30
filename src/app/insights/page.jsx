"use client";
import { useState, useEffect } from "react";

export default function TradeIntelligence() {
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
      badge: "Sektörel Analiz & İçgörüler",
      title: "Trade Intelligence: Sahadan ve Veriden Notlar",
      sub: "Demir çelik toleranslarından medikal tedarik zincirlerine, denizcilik regülasyonlarından niş pazar dinamiklerine kadar uluslararası ticarette bizzat deneyimlediğimiz stratejik içgörüleri paylaşıyoruz.",
      footerRights: "© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.",
      footerAddress: "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com"
    },
    EN: {
      services: "Services", industries: "Industries", caseStudies: "Case Studies", insights: "Trade Intelligence", about: "About Us", contact: "Contact",
      badge: "Sectoral Analysis & Insights",
      title: "Trade Intelligence: Notes from the Field and Data",
      sub: "We share the strategic insights we personally experience in international trade, ranging from steel tolerances to medical supply chains, marine regulations to niche market dynamics.",
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
                <a href="/industries" className="hover:text-[#f97316] transition">{current.industries}</a>
                <a href="/case-studies" className="hover:text-[#f97316] transition">{current.caseStudies}</a>
                <a href="/insights" className="text-[#f97316] font-bold">{current.insights}</a>
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
        <div className="space-y-16">
          <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 shadow-sm hover:border-[#f97316] transition">
            <div className="flex justify-between items-center text-xs text-gray-400 font-mono mb-4">
              <span className="text-[#f97316] font-bold text-sm tracking-wider">01 / DEMİR ÇELİK & METALLER</span>
              <span>TEKNİK & STRATEJİK ANALİZ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-6">Çelik Çubuk İhracatında EN ve ASTM Standartları Neden Kritik?</h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed mb-8">
              <p>Karbon, alaşımlı, paslanmaz ve sementasyon çelik çubuk ticaretinde küresel alıcıların en hassas olduğu konuların başında uluslararası standart uyumu gelmektedir. Üreticilerin sahip olduğu yerel normlar ile hedef pazardaki EN veya ASTM standartları arasındaki uyumsuzluk, sevkiyatların gümrükte kalmasına yol açabilir.</p>
              <p>GENCO olarak inç ve milimetre hassas tolerans dönüşümlerini laboratuvar seviyesinde koordine ediyor; ısıl işlem, çekme mukavemeti ve yüzey kalitesi gibi kritik metalurjik özellikleri teknik dosyayla alıcıya sunarak güven tesis ediyoruz.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 shadow-sm hover:border-[#f97316] transition">
            <div className="flex justify-between items-center text-xs text-gray-400 font-mono mb-4">
              <span className="text-[#f97316] font-bold text-sm tracking-wider">02 / MEDİKAL & SAĞLIK</span>
              <span>TEDARİK ZİNCİRİ & DENETİM</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-6">Cerrahi Sarf Malzemeleri Tedariğinde Yerinde Denetimin Önemi</h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed mb-8">
              <p>Medikal ve cerrahi sarf malzemeleri ticaretinde hata payı sıfırdır. Standart bobin ürünler yerine belirli uzunluklarda boyutlandırılmış ve uçları sertleştirilmiş cerrahi iplikler gibi kritik ürünlerde üreticinin kapasitesi hayati önem taşır.</p>
              <p>GENCO, alıcı adına yerel üretim tesislerini bizzat yerinde denetler; sterilizasyon koşullarından hammadde izlenebilirliğine kadar tüm aşamaları sahada yöneterek operasyonel riskleri ortadan kaldırır.</p>
            </div>
          </div>
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