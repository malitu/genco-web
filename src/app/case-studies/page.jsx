"use client";
import { useState, useEffect } from "react";

export default function CaseStudies() {
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
      badge: "Sahadaki İcraatlarımız",
      title: "Ağırlıklı Çalıştığımız Sektörlerde Başarı Hikayeleri",
      sub: "Demir çelikten medikal malzemelere, denizcilikten femtech ve tarım teknolojilerine kadar uzmanlık alanlarımızda yürüttüğümüz stratejik operasyonları ve teknik çözümleri inceleyin.",
      c1num: "SEKTÖREL VAKA / 01", c1title: "Demir Çelik Çubuk Grubunda Avrupa Pazarı ve Tolerans Yönetimi", c1desc: "Karbon, alaşımlı, paslanmaz ve sementasyon çelik çubuk kategorisinde üreticilerimiz için Avrupa pazarında doğrudan karar vericilere ulaşıldı. EN ve ASTM alaşım standartlarına tam uyum sağlanarak inç/milimetre hassas boyut dönüşümleri ve tedarik zinciri süreçleri hatasız olarak yönetildi.", c1s1: "Demir Çelik", c1s2: "Alaşım & Tolerans", c1s3: "Distribütör Ağı", c1BoxTitle: "Uluslararası Standart Uyumu", c1BoxSub: "EN ve ASTM normlarına tam hakimiyetle, metalurjik gereksinimlerin küresel alıcı beklentileriyle kusursuz buluşması sağlandı.",
      c2num: "SEKTÖREL VAKA / 02", c2title: "Denizcilik Sektöründe Tekne ve Ekipman Tedariği", c2desc: "Denizcilik alanında faaliyet gösteren üreticilerimiz için tekne ve marine ekipmanlarının uluslararası sevkiyat süreçleri ele alındı. Ürünlerin Avrupa Birliği normlarına uygunluk beyanları (Declaration of Conformity) ve teknik dokümantasyon süreçleri titizlikle yönetilerek pazar engelleri ortadan kaldırıldı.", c2s1: "Denizcilik", c2s2: "Tekne & Donanım", c2s3: "CE & Mevzuat Uyumu", c2BoxTitle: "Regülasyon ve Sertifikasyon", c2BoxSub: "Tekne ve kritik marine ekipmanlarının uluslararası tescil gereksinimleri, CE ve gürültü emisyon belgeleri eksiksiz koordine edildi.",
      c3num: "SEKTÖREL VAKA / 03", c3title: "Tohumculuk ve Tarımsal Ticarette Küresel Ağ", c3desc: "Tarım ve tohumculuk endüstrisindeki üreticilerimizin küresel pazarlara açılması amacıyla hedef odaklı alıcı araştırmaları gerçekleştirildi. Lojistik ve iklimlendirme gereksinimlerine duyarlı dağıtım kanalları analiz edilerek uluslararası ticaret ortaklıkları tesis edildi.", c3s1: "Tohumculuk", c3s2: "Küresel Dağıtım", c3s3: "Stratejik Ortaklıklar", c3BoxTitle: "Tarımsal Lojistik", c3BoxSub: "Tohumculukta hassas taşıma ve depolama standartlarına uygun uluslararası alıcı eşleştirmeleri başarıyla tamamlandı.",
      c4num: "SEKTÖREL VAKA / 04", c4title: "Medikal Malzemeler ve Cerrahi Sarf Tedariği", c4desc: "Uluslararası sağlık sektörü alıcıları için medikal malzemeler, hastane donanımları ve cerrahi sarf ürünlerinde tedarik zinciri operasyonları yürütüldü. Yerel üretim tesislerinin kapasite ve kalite denetimleri yapılarak, uluslararası standartlara tam uyumlu sevkiyatlar güvence altına alındı.", c4s1: "Medikal & Sağlık", c4s2: "Cerrahi Sarf Ürünleri", c4s3: "Yerinde Denetim", c4BoxTitle: "Kritik Kalite", c4BoxSub: "Medikal malzemeler ve cerrahi sarf ürünlerinde üretim denetiminden nihai sevkiyata kadar tüm kalite güvence adımları yönetildi.",
      c5num: "SEKTÖREL VAKA / 05", c5title: "Otomotiv Yan Sanayi İçin OEM Eşleştirmeleri", c5desc: "Otomotiv yan sanayi üreticilerimizin küresel OEM ve aftermarket tedarik zincirlerine entegre olması için veri odaklı alıcı analizleri gerçekleştirildi. Yüksek kalite beklentilerine sahip uluslararası markalarla doğrudan köprü kurularak ticari müzakereler yönetildi.", c5s1: "Otomotiv", c5s2: "Yan Sanayi & OEM", c5s3: "Global Tedarik Ağı", c5BoxTitle: "Otomotiv Standartları", c5BoxSub: "Otomotiv sektörünün katı kalite ve teslimat zamanlaması kriterlerine uygun operasyonel altyapı kuruldu.",
      c6num: "SEKTÖREL VAKA / 06", c6title: "Femtech ve Sağlık Teknolojilerinde Büyüme", c6desc: "Femtech ve yenilikçi sağlık teknolojileri sektöründe faaliyet gösteren markaların uluslararası pazarlara giriş süreçleri koordine edildi. Doğru hedef kitle analizi ve niş distribütör ağları üzerinden markaların küresel ölçekte büyümesi desteklendi.", c6s1: "Femtech", c6s2: "Sağlık Teknolojileri", c6s3: "Uluslararası Büyüme", c6BoxTitle: "Yenilikçi Pazar", c6BoxSub: "Kadın sağlığı ve sağlık teknolojileri alanında yükselen trendlere uygun uluslararası iş geliştirme stratejileri hayata geçirildi.",
      ctaTitle: "Sektörünüzde Benzer Bir Başarı Hikayesi Yazalım", ctaSub: "Ürünlerinizi ve küresel ticaret hedeflerinizi görüşmek, operasyonel modelimizi birlikte planlamak için bizimle iletişime geçin.", ctaBtn: "İletişime Geçin",
      footerRights: "© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.",
      footerAddress: "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com"
    },
    EN: {
      services: "Services", industries: "Industries", caseStudies: "Case Studies", insights: "Trade Intelligence", about: "About Us", contact: "Contact",
      badge: "Our Field Execution",
      title: "Success Stories in Our Core Industries",
      sub: "Examine the strategic operations and technical solutions we execute across our core domains, ranging from steel to medical supplies, marine, femtech, and agricultural technologies.",
      c1num: "SECTORAL CASE / 01", c1title: "European Market & Tolerance Management in Steel Bar Groups", c1desc: "Direct decision-makers were reached in the European market for our manufacturers in carbon, alloy, stainless, and case-hardening steel bars. Full compliance with EN and ASTM standards was achieved, flawlessly managing inch/mm precise dimension conversions and supply chain processes.", c1s1: "Steel & Metals", c1s2: "Alloy & Tolerance", c1s3: "Distributor Network", c1BoxTitle: "International Standard Compliance", c1BoxSub: "With complete mastery of EN and ASTM norms, metallurgical requirements perfectly matched global buyer expectations.",
      c2num: "SECTORAL CASE / 02", c2title: "Boat and Equipment Sourcing in Marine Sector", c2desc: "International shipment processes for boats and marine equipment were managed for our manufacturers operating in the marine field. Market barriers were eliminated by meticulously governing EU Declaration of Conformity and technical documentation processes.", c2s1: "Marine", c2s2: "Boats & Equipment", c2s3: "CE & Regulatory Compliance", c2BoxTitle: "Regulation & Certification", c2BoxSub: "International registration requirements, CE, and noise emission documents for boats and critical marine equipment were fully coordinated.",
      c3num: "SECTORAL CASE / 03", c3title: "Global Network in Agriculture and Seed Trade", c3desc: "Targeted buyer research was carried out to expand our manufacturers in the agricultural and seed industries into global markets. International trade partnerships were established by analyzing distribution channels sensitive to logistics and climate control.", c3s1: "Agriculture", c3s2: "Global Distribution", c3s3: "Strategic Partnerships", c3BoxTitle: "Agricultural Logistics", c3BoxSub: "International buyer matchings meeting sensitive transport and storage standards in seeds were successfully completed.",
      c4num: "SECTORAL CASE / 04", c4title: "Medical Supplies & Surgical Consumables Sourcing", c4desc: "Supply chain operations were conducted for international healthcare buyers regarding medical supplies, hospital equipment, and surgical consumables. Capacity and quality audits of local manufacturing facilities ensured shipments fully compliant with international standards.", c4s1: "Medical & Health", c4s2: "Surgical Consumables", c4s3: "On-Site Auditing", c4BoxTitle: "Critical Quality", c4BoxSub: "All quality assurance steps from production audit to final shipment were managed for medical supplies and surgical consumables.",
      c5num: "SECTORAL CASE / 05", c5title: "OEM Matchmaking for Automotive Sub-Industry", c5desc: "Data-driven buyer analyses were executed to integrate our automotive sub-industry manufacturers into global OEM and aftermarket supply chains. Commercial negotiations were directed by building direct bridges with high-expectation international brands.", c5s1: "Automotive", c5s2: "Sub-Industry & OEM", c5s3: "Global Supply Network", c5BoxTitle: "Automotive Standards", c5BoxSub: "Operational infrastructure compliant with the strict quality and delivery timing criteria of the automotive sector was established.",
      c6num: "SECTORAL CASE / 06", c6title: "Growth in Femtech and Health Technologies", c6desc: "Market entry processes for brands operating in femtech and innovative health technologies were coordinated. Global scaling of brands was supported through precise target audience analysis and niche distributor networks.", c6s1: "Femtech", c6s2: "Health Technologies", c6s3: "International Growth", c6BoxTitle: "Niche Market", c6BoxSub: "International business development strategies aligned with rising trends in women's health and health technologies were brought to life.",
      ctaTitle: "Let's Write a Similar Success Story in Your Industry", ctaSub: "Contact us to discuss your products and global trade goals and plan our operational model together.", ctaBtn: "Get in Touch",
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
                <a href="/case-studies" className="text-[#f97316] font-bold">{current.caseStudies}</a>
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
              <div className="text-[#f97316] font-mono text-sm font-bold mb-2">{current.c1num}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{current.c1title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{current.c1desc}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6 text-xs font-semibold text-gray-700">
                <div><span className="text-gray-400 block mb-1">Sektör / Sector</span> {current.c1s1}</div>
                <div><span className="text-gray-400 block mb-1">Odak / Focus</span> {current.c1s2}</div>
                <div><span className="text-gray-400 block mb-1">Netice / Result</span> {current.c1s3}</div>
              </div>
            </div>
            <div className="lg:col-span-5 bg-[#0f172a] p-8 md:p-12 text-white flex flex-col justify-center h-full min-h-[280px] relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-bold mb-3">{current.c1BoxTitle}</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{current.c1BoxSub}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center hover:border-[#f97316] transition">
            <div className="lg:col-span-5 bg-[#0f172a] p-8 md:p-12 text-white flex flex-col justify-center h-full min-h-[280px] relative overflow-hidden order-2 lg:order-1">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-bold mb-3">{current.c2BoxTitle}</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{current.c2BoxSub}</p>
            </div>
            <div className="lg:col-span-7 p-8 md:p-12 order-1 lg:order-2">
              <div className="text-[#f97316] font-mono text-sm font-bold mb-2">{current.c2num}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{current.c2title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{current.c2desc}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6 text-xs font-semibold text-gray-700">
                <div><span className="text-gray-400 block mb-1">Sektör / Sector</span> {current.c2s1}</div>
                <div><span className="text-gray-400 block mb-1">Odak / Focus</span> {current.c2s2}</div>
                <div><span className="text-gray-400 block mb-1">Netice / Result</span> {current.c2s3}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center hover:border-[#f97316] transition">
            <div className="lg:col-span-7 p-8 md:p-12">
              <div className="text-[#f97316] font-mono text-sm font-bold mb-2">{current.c3num}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{current.c3title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{current.c3desc}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6 text-xs font-semibold text-gray-700">
                <div><span className="text-gray-400 block mb-1">Sektör / Sector</span> {current.c3s1}</div>
                <div><span className="text-gray-400 block mb-1">Odak / Focus</span> {current.c3s2}</div>
                <div><span className="text-gray-400 block mb-1">Netice / Result</span> {current.c3s3}</div>
              </div>
            </div>
            <div className="lg:col-span-5 bg-[#0f172a] p-8 md:p-12 text-white flex flex-col justify-center h-full min-h-[280px] relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-bold mb-3">{current.c3BoxTitle}</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{current.c3BoxSub}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center hover:border-[#f97316] transition">
            <div className="lg:col-span-5 bg-[#0f172a] p-8 md:p-12 text-white flex flex-col justify-center h-full min-h-[280px] relative overflow-hidden order-2 lg:order-1">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-bold mb-3">{current.c4BoxTitle}</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{current.c4BoxSub}</p>
            </div>
            <div className="lg:col-span-7 p-8 md:p-12 order-1 lg:order-2">
              <div className="text-[#f97316] font-mono text-sm font-bold mb-2">{current.c4num}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{current.c4title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{current.c4desc}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6 text-xs font-semibold text-gray-700">
                <div><span className="text-gray-400 block mb-1">Sektör / Sector</span> {current.c4s1}</div>
                <div><span className="text-gray-400 block mb-1">Odak / Focus</span> {current.c4s2}</div>
                <div><span className="text-gray-400 block mb-1">Netice / Result</span> {current.c4s3}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center hover:border-[#f97316] transition">
            <div className="lg:col-span-7 p-8 md:p-12">
              <div className="text-[#f97316] font-mono text-sm font-bold mb-2">{current.c5num}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{current.c5title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{current.c5desc}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6 text-xs font-semibold text-gray-700">
                <div><span className="text-gray-400 block mb-1">Sektör / Sector</span> {current.c5s1}</div>
                <div><span className="text-gray-400 block mb-1">Odak / Focus</span> {current.c5s2}</div>
                <div><span className="text-gray-400 block mb-1">Netice / Result</span> {current.c5s3}</div>
              </div>
            </div>
            <div className="lg:col-span-5 bg-[#0f172a] p-8 md:p-12 text-white flex flex-col justify-center h-full min-h-[280px] relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-bold mb-3">{current.c5BoxTitle}</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{current.c5BoxSub}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center hover:border-[#f97316] transition">
            <div className="lg:col-span-5 bg-[#0f172a] p-8 md:p-12 text-white flex flex-col justify-center h-full min-h-[280px] relative overflow-hidden order-2 lg:order-1">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-bold mb-3">{current.c6BoxTitle}</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{current.c6BoxSub}</p>
            </div>
            <div className="lg:col-span-7 p-8 md:p-12 order-1 lg:order-2">
              <div className="text-[#f97316] font-mono text-sm font-bold mb-2">{current.c6num}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{current.c6title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{current.c6desc}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6 text-xs font-semibold text-gray-700">
                <div><span className="text-gray-400 block mb-1">Sektör / Sector</span> {current.c6s1}</div>
                <div><span className="text-gray-400 block mb-1">Odak / Focus</span> {current.c6s2}</div>
                <div><span className="text-gray-400 block mb-1">Netice / Result</span> {current.c6s3}</div>
              </div>
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