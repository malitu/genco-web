"use client";
import { useState, useEffect } from "react";

export default function Services() {
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
      badge: "Uçtan Uca Ticaret Yönetimi",
      title: "Aktif İş Geliştirme ve Operasyonel Çözümlerimiz",
      sub: "GENCO olarak şirketlere sadece dışarıdan tavsiye vermiyoruz; tescilli küresel ticaret istihbarat ağımız ve stratejik veritabanlarımızla doğrudan pazar açıyor, müzakereleri yürütüyor ve sevkiyat kapanışına kadar operasyonu bizzat yönetiyoruz.",
      s1num: "01 / OUTSOURCED EXPORT", s1title: "Dış Kaynaklı İhracat Departmanı", s1desc: "Kendi bünyenizde maliyetli bir ihracat departmanı kurma yüküne girmeden, küresel pazar dinamiklerine hakim profesyonel bir dış ticaret ekibiyle doğrudan çalışın. Ürünlerinizin hedef pazarlardaki en doğru alıcılara sunulmasını ve satış kapanışlarını üstleniyoruz.",
      s1l1: "Hedef Pazar & Rakip Analizi", s1l2: "C-Level Karar Verici Teması", s1l3: "Teklif & Sözleşme Yönetimi", s1l4: "Küresel Dağıtım Ağı Kurulumu", s1BoxTitle: "Sıfır Kurulum Maliyeti, Doğrudan Satış", s1BoxSub: "İzmir merkezli operasyon gücümüzle, markanızı uluslararası arenada aktif olarak temsil ediyor ve yeni pazarlara en kısa sürede giriş yapmanızı sağlıyoruz.",
      s2num: "02 / STRATEGIC SOURCING", s2title: "Nitelikli Tedarik ve Üretici Denetimi", s2desc: "Uluslararası alıcılar için Türkiye’den güvenli ve standartlara tam uyumlu tedarik zinciri kuruyoruz. Kritik mühendislik gereksinimlerinize eksiksiz uyan üreticileri buluyor, kapasite ve kalite denetimlerini yerinde gerçekleştiriyoruz.",
      s2l1: "Teknik Şartname Uyumluluğu", s2l2: "Fabrika Kapasite Denetimi", s2l3: "Numune & Pilot Üretim", s2l4: "Sevkiyat Kalite Kontrolü", s2BoxTitle: "Tolerans & Standart Uyumu", s2BoxSub: "Demir çelik alaşım standartlarından medikal polimerlere kadar kritik teknik şartnamelerin sahada eksiksiz uygulanmasını denetliyoruz.",
      s3num: "03 / B2B LEAD GENERATION", s3title: "Veri Odaklı Alıcı & Distribütör Bulma", s3desc: "Jenerik listelerle zaman kaybetmiyoruz. Küresel ticaret istihbarat ağları, tescilli veritabanları ve çok katmanlı araştırma metodolojimiz üzerinden doğrudan ithalatçıları tespit ederek nokta atışı outreach kampanyaları yürütüyoruz.",
      s3l1: "Doğrulanmış C-Level Veriler", s3l2: "Sektörel Outreach Stratejisi", s3l3: "Bölgesel Partner Eşleştirme", s3l4: "Aktif Dönüşüm Takibi", s3BoxTitle: "Nokta Atışı Karar Verici Erişimi", s3BoxSub: "Doğru kişiye, doğru zamanda ve doğru teknik argümanlarla ulaşarak satış döngülerini hızlandırıyoruz.",
      s4num: "04 / MARKET ENTRY", s4title: "Türkiye ve Avrupa Pazarına Giriş Stratejisi", s4desc: "Küresel markaların Türkiye pazarındaki yapılanmalarında ya da Türk üreticilerin Avrupa ağlarında büyümesinde regülasyon uyumu, gümrük süreçleri ve yerel bayi/distribütör yapılanmalarını koordine ediyoruz.",
      s4l1: "Regülasyon & Mevzuat Uyumu", s4l2: "Yerel Partner Eşleştirme", s4l3: "Operasyonel Süreç Kurulumu", s4l4: "Sürdürülebilir Büyüme Ağı", s4BoxTitle: "İzmir'den Küresel Pazarlara", s4BoxSub: "Yerel üretim gücü ile küresel standartlar arasında kusursuz bir ticari köprü kurarak operasyonel riskleri sıfıra indiriyoruz.",
      ctaTitle: "Ticari Operasyonunuzu Birlikte Tasarlayalım", ctaSub: "İhtiyacınıza uygun modeli belirlemek ve doğrudan sahada çalışmaya başlamak için bizimle iletişime geçin.", ctaBtn: "Projenizi Görüşelim",
      footerRights: "© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.",
      footerAddress: "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com"
    },
    EN: {
      services: "Services", industries: "Industries", caseStudies: "Case Studies", insights: "Trade Intelligence", about: "About Us", contact: "Contact",
      badge: "End-to-End Trade Management",
      title: "Active Business Development & Operational Solutions",
      sub: "As GENCO, we don't just offer external advice; using our proprietary global trade intelligence network and strategic databases, we directly open markets, conduct negotiations, and manage operations until shipment closure.",
      s1num: "01 / OUTSOURCED EXPORT", s1title: "Outsourced Export Department", s1desc: "Work directly with an expert foreign trade team specialized in global market dynamics without the burden of building an expensive internal export department. We ensure your products reach the right buyers and handle sales closures.",
      s1l1: "Target Market & Competitor Analysis", s1l2: "Direct C-Level Decision-Maker Access", s1l3: "Offer & Contract Management", s1l4: "Global Distribution Network Setup", s1BoxTitle: "Zero Setup Cost, Direct Sales", s1BoxSub: "With our Izmir-based operational strength, we actively represent your brand in the international arena and ensure rapid entry into new markets.",
      s2num: "02 / STRATEGIC SOURCING", s2title: "Qualified Sourcing & Manufacturer Audits", s2desc: "We build secure, fully compliant supply chains from Turkey for international buyers. We identify manufacturers matching your critical engineering specs and conduct on-site capacity and quality audits.",
      s2l1: "Technical Spec Compliance", s2l2: "Factory Capacity Audits", s2l3: "Sample & Pilot Production", s2l4: "Shipment Quality Control", s2BoxTitle: "Tolerance & Standard Compliance", s2BoxSub: "We ensure precise on-site execution of critical technical specifications ranging from steel alloy standards to medical polymers.",
      s3num: "03 / B2B LEAD GENERATION", s3title: "Data-Driven Buyer & Distributor Sourcing", s3desc: "We don't waste time with generic lists. Through global trade intelligence networks, proprietary databases, and multi-layered research methodologies, we pinpoint importers and execute laser-focused outreach campaigns.",
      s3l1: "Verified C-Level Data", s3l2: "Sectoral Outreach Strategy", s3l3: "Regional Partner Matching", s3l4: "Active Conversion Tracking", s3BoxTitle: "Laser-Focused Decision-Maker Access", s3BoxSub: "We accelerate sales cycles by reaching the right person at the right time with the right technical arguments.",
      s4num: "04 / MARKET ENTRY", s4title: "Turkey & European Market Entry Strategy", s4desc: "We coordinate regulatory compliance, customs procedures, and local dealer/distributor setups for global brands entering Turkey or Turkish producers growing in European networks.",
      s4l1: "Regulatory & Compliance Harmonization", s4l2: "Local Partner Matching", s4l3: "Operational Process Setup", s4l4: "Sustainable Growth Network", s4BoxTitle: "From Izmir to Global Markets", s4BoxSub: "We eliminate operational risks by establishing a seamless commercial bridge between local manufacturing power and global standards.",
      ctaTitle: "Let's Design Your Commercial Operation Together", ctaSub: "Contact us to determine the model suited to your needs and start working directly on the ground.", ctaBtn: "Discuss Your Project",
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
                <a href="/services" className="text-[#f97316] font-bold">{current.services}</a>
                <a href="/industries" className="hover:text-[#f97316] transition">{current.industries}</a>
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
        <div className="space-y-16">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center hover:border-[#f97316] transition">
            <div className="lg:col-span-7 p-8 md:p-12">
              <div className="text-[#f97316] font-mono text-sm font-bold mb-2">{current.s1num}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{current.s1title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{current.s1desc}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-gray-700 border-t border-gray-100 pt-6">
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s1l1}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s1l2}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s1l3}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s1l4}</li>
              </ul>
            </div>
            <div className="lg:col-span-5 bg-[#0f172a] p-8 md:p-12 text-white flex flex-col justify-center h-full min-h-[260px] relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-bold mb-3">{current.s1BoxTitle}</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{current.s1BoxSub}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center hover:border-[#f97316] transition">
            <div className="lg:col-span-5 bg-[#0f172a] p-8 md:p-12 text-white flex flex-col justify-center h-full min-h-[260px] relative overflow-hidden order-2 lg:order-1">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-bold mb-3">{current.s2BoxTitle}</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{current.s2BoxSub}</p>
            </div>
            <div className="lg:col-span-7 p-8 md:p-12 order-1 lg:order-2">
              <div className="text-[#f97316] font-mono text-sm font-bold mb-2">{current.s2num}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{current.s2title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{current.s2desc}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-gray-700 border-t border-gray-100 pt-6">
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s2l1}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s2l2}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s2l3}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s2l4}</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center hover:border-[#f97316] transition">
            <div className="lg:col-span-7 p-8 md:p-12">
              <div className="text-[#f97316] font-mono text-sm font-bold mb-2">{current.s3num}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{current.s3title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{current.s3desc}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-gray-700 border-t border-gray-100 pt-6">
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s3l1}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s3l2}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s3l3}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s3l4}</li>
              </ul>
            </div>
            <div className="lg:col-span-5 bg-[#0f172a] p-8 md:p-12 text-white flex flex-col justify-center h-full min-h-[260px] relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-bold mb-3">{current.s3BoxTitle}</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{current.s3BoxSub}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center hover:border-[#f97316] transition">
            <div className="lg:col-span-5 bg-[#0f172a] p-8 md:p-12 text-white flex flex-col justify-center h-full min-h-[260px] relative overflow-hidden order-2 lg:order-1">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-bold mb-3">{current.s4BoxTitle}</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{current.s4BoxSub}</p>
            </div>
            <div className="lg:col-span-7 p-8 md:p-12 order-1 lg:order-2">
              <div className="text-[#f97316] font-mono text-sm font-bold mb-2">{current.s4num}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{current.s4title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{current.s4desc}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-gray-700 border-t border-gray-100 pt-6">
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s4l1}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s4l2}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s4l3}</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mr-2"></span> {current.s4l4}</li>
              </ul>
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