"use client";
import { useState, useEffect } from "react";

export default function About() {
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
      badge: "Kurumsal Kimlik & Vizyon",
      title1: "Analiz Yön Gösterir.", title2: "İcraat Ticaret Yaratır.",
      sub: "GENCO Imports & Exports olarak şirketlere sadece dışarıdan rapor sunan pasif bir danışmanlık kurumu değiliz; küresel ticaret ağlarında sizin adınıza bizzat masaya oturan ve sahada operasyon yürüten aktif iş geliştirme ortağınızız.",
      boxBadge: "İzmir'den Küresel Arenaya", boxTitle: "Uluslararası Ticarette Operasyonel Güç ve Güven",
      p1: "İzmir Bornova merkezli kurulan GENCO, demir çelikten medikal malzemelere, denizcilikten tarım ve tohumculuğa, otomotivden yenilikçi femtech teknolojilerine kadar geniş bir dikey yelpazede tescilli teknik bilgiye ve küresel alıcı ağlarına sahiptir.",
      p2: "Geleneksel dış ticaret danışmanlık modellerinin ötesine geçerek; tescilli ticaret istihbarat altyapılarımız ve çok katmanlı araştırma ağlarımızla doğrudan C-level karar vericilere ulaşıyor, ürünlerinizin teknik şartnamelere tam uyumunu yerinde denetliyor ve sevkiyat kapanışına kadar tüm süreci yönetiyoruz.",
      activeBadge: "Aktif Saha Operasyonu",
      activeText: "Küresel ticarette başarı; jenerik pazar araştırmalarıyla vakit kaybetmek değil, doğru teknik standartları bilmek, doğrudan karar vericiyle temas kurmak ve operasyonun her aşamasında sahada var olmaktır.",
      mBadge: "Operasyonel Felsefemiz", mTitle: "The GENCO Method", mSub: "Uluslararası ticareti masada bırakmıyor; araştırmadan kapanışa kadar uçtan uca yönettiğimiz 4 aşamalı tescilli icraat metodolojimizle fark yaratıyoruz.",
      step1Title: "Araştırma & Hedef Pazar Analizi (Research)", step1Desc: "Jenerik listelerle vakit kaybetmiyoruz. Tescilli ticaret istihbarat ağlarımız üzerinden ürününüzün küresel pazardaki en doğru alıcılarını nokta atışı tespit ediyor; EN, ASTM ve sektörel teknik şartnameleri eksiksiz analiz ederek stratejimizi kuruyoruz.",
      step2Title: "Stratejik B2B İletişim (Connect)", step2Desc: "Aracıları ve alt kademeleri atlıyoruz. Doğrulanmış altyapılarımızla doğrudan C-level karar vericilere ulaşıyor; ürününüzün teknik avantajlarını ve tolerans üstünlüklerini en doğru dille doğrudan masaya taşıyoruz.",
      step3Title: "Sahada İcraat ve Müzakere (Execute)", step3Desc: "Rapor sunup çekilmiyoruz. Müzakerelerin yürütülmesi, ticari tekliflerin optimize edilmesi, üretim tesislerinde yerinde kapasite ve kalite denetimlerinin yapılması ile sevkiyat kapanışına kadar tüm operasyonel süreci bizzat yönetiyor, riski sıfırlıyoruz.",
      step4Title: "Sürdürülebilir Büyüme (Grow)", step4Desc: "Tek seferlik satışlar değil, küresel ölçekte kalıcı distribütörlükler ve güçlü bayi ağları kuruyoruz. Markanızın uluslararası pazarlarda uzun vadeli, karlı ve sürdürülebilir bir ticari hacme ulaşmasını sağlayarak köprü olmaya devam ediyoruz.",
      ctaTitle: "Küresel Ticarette Güçlü Bir Ortak Arıyorsanız", ctaSub: "İzmir Bornova merkezli operasyon gücümüzle tanışmak ve projelerinizi görüşmek için bizimle iletişime geçin.", ctaBtn: "İletişime Geçin",
      footerRights: "© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.",
      footerAddress: "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com"
    },
    EN: {
      services: "Services", industries: "Industries", caseStudies: "Case Studies", insights: "Trade Intelligence", about: "About Us", contact: "Contact",
      badge: "Corporate Identity & Vision",
      title1: "Analysis guides.", title2: "Execution creates trade.",
      sub: "As GENCO Imports & Exports, we are not a passive consultancy providing outside reports; we are your active business development partner sitting at the table on your behalf and running operations on the ground.",
      boxBadge: "From Izmir to the Global Arena", boxTitle: "Operational Strength and Trust in International Trade",
      p1: "Founded in Izmir Bornova, GENCO possesses proprietary technical knowledge and global buyer networks across a wide vertical spectrum ranging from steel and metals to medical supplies, marine, agriculture, automotive, and innovative femtech technologies.",
      p2: "Moving beyond traditional foreign trade consultancy models, through our proprietary trade intelligence infrastructure and multi-layered research networks, we reach C-level decision-makers directly, audit your products' compliance with technical specifications on-site, and manage the entire process until shipment closure.",
      activeBadge: "Active Field Operation",
      activeText: "Success in global trade is not about wasting time with generic market research; it is knowing the right technical standards, contacting decision-makers directly, and being present on the ground at every stage of the operation.",
      mBadge: "Our Operational Philosophy", mTitle: "The GENCO Method", mSub: "We don't leave international trade at the table; we make a difference with our 4-step proprietary execution methodology managed end-to-end from research to closure.",
      step1Title: "Research & Target Market Analysis", step1Desc: "We don't waste time with generic lists. Through our proprietary trade intelligence networks, we pinpoint the right buyers for your product in the global market and build our strategy by thoroughly analyzing EN, ASTM, and sectoral technical specs.",
      step2Title: "Strategic B2B Communication (Connect)", step2Desc: "We skip intermediaries and lower tiers. Using our verified infrastructure, we reach C-level decision-makers directly and bring your product's technical advantages and tolerance superiorities straight to the table.",
      step3Title: "Field Execution & Negotiation (Execute)", step3Desc: "We don't just deliver reports and walk away. We personally manage the entire operational process from conducting negotiations and optimizing commercial offers to on-site capacity and quality audits in manufacturing facilities until shipment closure, eliminating risk.",
      step4Title: "Sustainable Growth (Grow)", step4Desc: "We build permanent distributorships and strong dealer networks on a global scale, not just one-off sales. We continue to act as a bridge ensuring your brand reaches a long-term, profitable, and sustainable commercial volume in international markets.",
      ctaTitle: "Looking for a Strong Partner in Global Trade?", ctaSub: "Contact us to meet our Izmir Bornova-based operational strength and discuss your projects.", ctaBtn: "Get in Touch",
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
                <a href="/insights" className="hover:text-[#f97316] transition">{current.insights}</a>
                <a href="/about" className="text-[#f97316] font-bold">{current.about}</a>
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
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-6">{current.title1} <br /><span className="text-[#f97316]">{current.title2}</span></h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">{current.sub}</p>
        </div>
      </header>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#f97316] font-mono text-sm font-bold uppercase tracking-wider">{current.boxBadge}</span>
            <h2 className="text-3xl font-bold text-[#0f172a]">{current.boxTitle}</h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{current.p1}</p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{current.p2}</p>
          </div>
          
          <div className="lg:col-span-6 bg-[#0f172a] p-8 md:p-12 rounded-2xl text-white relative overflow-hidden shadow-xl">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
            <span className="text-[#f97316] text-xs font-mono uppercase tracking-widest mb-3 block">{current.activeBadge}</span>
            <p className="text-gray-200 text-base leading-relaxed">{current.activeText}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-16 shadow-sm">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#f97316] font-mono text-xs uppercase tracking-widest mb-2 block">{current.mBadge}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">{current.mTitle}</h2>
            <p className="text-gray-600 text-base leading-relaxed">{current.mSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#fafafa] border border-gray-200 p-8 rounded-xl hover:border-[#f97316] transition">
              <div className="flex items-center justify-between mb-4"><span className="text-[#f97316] font-mono text-3xl font-extrabold">01</span></div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">{current.step1Title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{current.step1Desc}</p>
            </div>
            <div className="bg-[#fafafa] border border-gray-200 p-8 rounded-xl hover:border-[#f97316] transition">
              <div className="flex items-center justify-between mb-4"><span className="text-[#f97316] font-mono text-3xl font-extrabold">02</span></div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">{current.step2Title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{current.step2Desc}</p>
            </div>
            <div className="bg-[#fafafa] border border-gray-200 p-8 rounded-xl hover:border-[#f97316] transition">
              <div className="flex items-center justify-between mb-4"><span className="text-[#f97316] font-mono text-3xl font-extrabold">03</span></div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">{current.step3Title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{current.step3Desc}</p>
            </div>
            <div className="bg-[#fafafa] border border-gray-200 p-8 rounded-xl hover:border-[#f97316] transition">
              <div className="flex items-center justify-between mb-4"><span className="text-[#f97316] font-mono text-3xl font-extrabold">04</span></div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">{current.step4Title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{current.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0f172a] text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">{current.ctaTitle}</h2>
          <p className="text-gray-300 mb-8">{current.ctaSub}</p>
          <a href="/contact" className="bg-[#f97316] text-white px-8 py-4 font-bold rounded hover:bg-orange-600 transition inline-block">{current.ctaBtn}</a>
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