"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [lang, setLang] = useState("TR");
  const [siteData, setSiteData] = useState({
    heroTitle: "Türkiye'deki Uluslararası Ticaret Ekibiniz",
    heroSub: "Sadece dış ticaret danışmanlığı sunmuyoruz. Fırsatları araştırıyor, doğru uluslararası partnerleri buluyor ve tüm ticari operasyonu sizin adınıza bizzat yönetiyoruz.",
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("genco_lang");
    if (savedLang) setLang(savedLang);

    const fetchData = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().heroTitle) {
          setSiteData(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch(e) {
        console.log("Firebase verisi bekleniyor.");
      }
    };
    fetchData();
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("genco_lang", newLang);
  };

  const t = {
    TR: {
      services: "Hizmetler", industries: "Sektörler", caseStudies: "Vaka Analizleri", insights: "Trade Intelligence", about: "Hakkımızda", contact: "İletişim",
      badge: "Uluslararası İş Geliştirme Ortağınız",
      heroTitle: siteData.heroTitle,
      heroSub: siteData.heroSub,
      startProject: "Proje Başlatın", inspectServices: "Hizmetlerimizi İnceleyin",
      activeMgmt: "Aktif Ticaret Yönetimi",
      mgmtTitle: "Masada ve Sahada Doğrudan Operasyon",
      mgmtDesc: "Jenerik pazar araştırmalarıyla vakit kaybetmiyoruz. Tescilli ticaret istihbarat altyapılarımızı kullanarak doğrudan karar vericilere ulaşıyor; demir çelikten medikal, denizcilik ve femtech projelerine kadar teknik standartları bizzat yönetiyoruz.",
      check1: "✓ Doğrudan C-Level Erişim", check2: "✓ Teknik Şartname Uyumu", check3: "✓ Geniş Sektörel Esneklik", check4: "✓ Numune & Sevkiyat Takibi",
      indBadge: "Sektörel Yetkinlik",
      indTitle: "Ağırlıklı Çalıştığımız Sektörler",
      indDesc: "Derinlemesine ağa ve teknik bilgiye sahip olduğumuz ana alanların yanı sıra, esnek metodolojimizle her sektörde uluslararası ticaret operasyonu yönetebiliyoruz.",
      ind1: "Demir Çelik", ind2: "Denizcilik", ind3: "Tohumculuk", ind4: "Medikal", ind5: "Otomotiv", ind6: "Femtech",
      indNote: "* Uzmanlık alanlarımız haricinde, talebe göre her sektörde özel pazar araştırması ve operasyon yönetimi sağlanmaktadır.",
      routeTitle: "Ticari Hedefinizi Seçin",
      routeSub: "İster küresel pazarlarda büyümek isteyen bir üretici, ister Türkiye'den nitelikli tedarik arayan bir marka olun; operasyonunuzu uçtan uca yönetiyoruz.",
      r1Badge: "Yerli Üreticiler İçin", r1Title: "İhracat Pazarınızı Büyütelim", r1Desc: "Şirket içi ihracat departmanı kurma maliyetine katlanmadan, dışarıdan uluslararası satış ekibiniz olarak küresel alıcılara ulaşıyoruz.", r1Link: "İhracat Modelini İncele →",
      r2Badge: "Uluslararası Alıcılar İçin", r2Title: "Türkiye'den Güvenli Tedarik", r2Desc: "Doğru üreticiyi bulma, kapasite denetimi, fiyat teklifi koordinasyonu ve uluslararası standartlara uygunluk süreçlerini yönetiyoruz.", r2Link: "Tedarik Süreçlerini Gör →",
      r3Badge: "Global Markalar İçin", r3Title: "Türkiye Pazarına Giriş", r3Desc: "Türkiye pazarını analiz etmek, yerel regülasyonlara uyum sağlamak ve güçlü bir distribütör veya bayi ağı kurarak ticari operasyon başlatmak.", r3Link: "Pazara Giriş Stratejisi →",
      diffBadge: "Farkımız", diffTitle1: "Analiz yön gösterir.", diffTitle2: "İcraat ticaret yaratır.",
      diffDesc: "Pek çok kurum sadece rapor sunar ve çekilir; GENCO ise masada sizinle birlikte oturur, müzakereleri yürütür ve siparişin kapanışına kadar sahada yer alır.",
      d1: "Demir Çelik ve endüstriyel metallerde tolerans ve alaşım standardı uzmanlığı.",
      d2: "Medikal, Femtech, Tohumculuk, Denizcilik ve Otomotiv sektörlerinde tecrübe.",
      mTitle: "The GENCO Method", m1: "Araştırma (Research)", m1Sub: "Veri Odaklı", m2: "İletişim (Connect)", m2Sub: "Stratejik B2B", m3: "İcraat (Execute)", m3Sub: "Sahada Yönetim", m4: "Büyüme (Grow)", m4Sub: "Sürdürülebilir Ağ", mLink: "Metodolojimizin detaylarını inceleyin →",
      footerRights: "© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.",
      footerAddress: "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com"
    },
    EN: {
      services: "Services", industries: "Industries", caseStudies: "Case Studies", insights: "Trade Intelligence", about: "About Us", contact: "Contact",
      badge: "Your International Business Development Partner",
      heroTitle: "Your International Trade Team in Turkey",
      heroSub: "We don't just offer foreign trade consultancy. We research opportunities, find the right international partners, and personally manage your entire commercial operation.",
      startProject: "Start a Project", inspectServices: "Inspect Our Services",
      activeMgmt: "Active Trade Management",
      mgmtTitle: "Direct Operation at the Table and in the Field",
      mgmtDesc: "We don't waste time with generic market research. Using our proprietary trade intelligence infrastructure, we reach decision-makers directly and manage technical standards from steel to medical, marine, and femtech projects.",
      check1: "✓ Direct C-Level Access", check2: "✓ Technical Spec Compliance", check3: "✓ Wide Sectoral Flexibility", check4: "✓ Sample & Shipment Tracking",
      indBadge: "Sectoral Competence",
      indTitle: "Industries We Focus On",
      indDesc: "In addition to our core domains where we hold deep technical knowledge and networks, our flexible methodology allows us to manage trade operations in any sector.",
      ind1: "Steel & Metals", ind2: "Marine", ind3: "Agriculture", ind4: "Medical", ind5: "Automotive", ind6: "Femtech",
      indNote: "* Beyond our core specialties, bespoke market research and operation management are available for any sector upon request.",
      routeTitle: "Choose Your Commercial Goal",
      routeSub: "Whether you are a manufacturer expanding globally or a brand seeking reliable supply from Turkey, we manage your operations end-to-end.",
      r1Badge: "For Local Manufacturers", r1Title: "Scale Your Export Markets", r1Desc: "Without building an internal export department, we act as your outsourced international sales team reaching global buyers.", r1Link: "View Export Model →",
      r2Badge: "For International Buyers", r2Title: "Secure Sourcing from Turkey", r2Desc: "We handle manufacturer discovery, capacity audits, quotation coordination, and international standards compliance.", r2Link: "View Sourcing Processes →",
      r3Badge: "For Global Brands", r3Title: "Market Entry to Turkey", r3Desc: "Analyzing the Turkish market, ensuring local regulatory compliance, and establishing strong distributor or dealer networks.", r3Link: "Market Entry Strategy →",
      diffBadge: "Our Differentiator", diffTitle1: "Analysis guides.", diffTitle2: "Execution creates trade.",
      diffDesc: "Many firms hand over reports and walk away; GENCO sits at the table with you, leads negotiations, and stays on the ground until order closure.",
      d1: "Expertise in tolerance and alloy standards for steel and industrial metals.",
      d2: "Extensive experience across Medical, Femtech, Agriculture, Marine, and Automotive sectors.",
      mTitle: "The GENCO Method", m1: "Research", m1Sub: "Data-Driven", m2: "Connect", m2Sub: "Strategic B2B", m3: "Execute", m3Sub: "Field Management", m4: "Grow", m4Sub: "Sustainable Network", mLink: "Explore our methodology in detail →",
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left">
                <span className="text-[#f97316] font-bold tracking-wider text-sm mb-4 uppercase">{current.badge}</span>
                <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-6">{current.heroTitle}</h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{current.heroSub}</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <a href="/contact" className="bg-[#f97316] text-white px-8 py-4 text-center font-bold rounded hover:bg-orange-600 transition shadow-lg">{current.startProject}</a>
                    <a href="/services" className="border-2 border-[#0f172a] text-[#0f172a] px-8 py-4 text-center font-bold rounded hover:bg-[#0f172a] hover:text-white transition">{current.inspectServices}</a>
                </div>
            </div>
            
            <div className="relative bg-[#0f172a] p-8 rounded-lg text-white shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
                <div className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-2">{current.activeMgmt}</div>
                <h3 className="text-2xl font-bold mb-4">{current.mgmtTitle}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{current.mgmtDesc}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800 text-xs text-gray-400">
                    <div>{current.check1}</div><div>{current.check2}</div>
                    <div>{current.check3}</div><div>{current.check4}</div>
                </div>
            </div>
        </div>
      </header>

      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[#f97316] font-bold text-xs uppercase tracking-widest">{current.indBadge}</span>
                <h2 className="text-3xl font-bold text-[#0f172a] mt-2 mb-4">{current.indTitle}</h2>
                <p className="text-gray-600">{current.indDesc}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                <div className="bg-[#fafafa] border border-gray-200 p-6 rounded-lg hover:border-[#f97316] transition"><div className="text-[#f97316] font-bold text-lg mb-1">01</div><h4 className="font-bold text-[#0f172a]">{current.ind1}</h4></div>
                <div className="bg-[#fafafa] border border-gray-200 p-6 rounded-lg hover:border-[#f97316] transition"><div className="text-[#f97316] font-bold text-lg mb-1">02</div><h4 className="font-bold text-[#0f172a]">{current.ind2}</h4></div>
                <div className="bg-[#fafafa] border border-gray-200 p-6 rounded-lg hover:border-[#f97316] transition"><div className="text-[#f97316] font-bold text-lg mb-1">03</div><h4 className="font-bold text-[#0f172a]">{current.ind3}</h4></div>
                <div className="bg-[#fafafa] border border-gray-200 p-6 rounded-lg hover:border-[#f97316] transition"><div className="text-[#f97316] font-bold text-lg mb-1">04</div><h4 className="font-bold text-[#0f172a]">{current.ind4}</h4></div>
                <div className="bg-[#fafafa] border border-gray-200 p-6 rounded-lg hover:border-[#f97316] transition"><div className="text-[#f97316] font-bold text-lg mb-1">05</div><h4 className="font-bold text-[#0f172a]">{current.ind5}</h4></div>
                <div className="bg-[#fafafa] border border-gray-200 p-6 rounded-lg hover:border-[#f97316] transition"><div className="text-[#f97316] font-bold text-lg mb-1">06</div><h4 className="font-bold text-[#0f172a]">{current.ind6}</h4></div>
            </div>
            <div className="text-center mt-8 text-sm text-gray-500 font-medium">{current.indNote}</div>
        </div>
      </section>

      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-[#0f172a] mb-4">{current.routeTitle}</h2>
                <p className="text-gray-600">{current.routeSub}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border border-gray-200 p-8 hover:border-[#f97316] hover:shadow-xl transition flex flex-col justify-between rounded-lg">
                    <div><div className="text-[#f97316] font-bold text-xs mb-3 uppercase tracking-wider">{current.r1Badge}</div><h3 className="text-xl font-bold text-[#1e293b] mb-3">{current.r1Title}</h3><p className="text-gray-600 text-sm mb-6 leading-relaxed">{current.r1Desc}</p></div>
                    <a href="/services" className="text-[#0f172a] font-bold text-sm hover:text-[#f97316] flex items-center">{current.r1Link}</a>
                </div>
                <div className="bg-white border border-gray-200 p-8 hover:border-[#f97316] hover:shadow-xl transition flex flex-col justify-between rounded-lg">
                    <div><div className="text-[#f97316] font-bold text-xs mb-3 uppercase tracking-wider">{current.r2Badge}</div><h3 className="text-xl font-bold text-[#1e293b] mb-3">{current.r2Title}</h3><p className="text-gray-600 text-sm mb-6 leading-relaxed">{current.r2Desc}</p></div>
                    <a href="/services" className="text-[#0f172a] font-bold text-sm hover:text-[#f97316] flex items-center">{current.r2Link}</a>
                </div>
                <div className="bg-white border border-gray-200 p-8 hover:border-[#f97316] hover:shadow-xl transition flex flex-col justify-between rounded-lg">
                    <div><div className="text-[#f97316] font-bold text-xs mb-3 uppercase tracking-wider">{current.r3Badge}</div><h3 className="text-xl font-bold text-[#1e293b] mb-3">{current.r3Title}</h3><p className="text-gray-600 text-sm mb-6 leading-relaxed">{current.r3Desc}</p></div>
                    <a href="/services" className="text-[#0f172a] font-bold text-sm hover:text-[#f97316] flex items-center">{current.r3Link}</a>
                </div>
            </div>
        </div>
      </section>

      <section className="py-24 bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <span className="text-[#f97316] font-bold text-sm uppercase tracking-wider">{current.diffBadge}</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">{current.diffTitle1} <br /><span className="text-[#f97316]">{current.diffTitle2}</span></h2>
                <p className="text-gray-300 leading-relaxed mb-6">{current.diffDesc}</p>
                <div className="space-y-4 text-sm text-gray-300">
                    <div className="flex items-center"><span className="w-2 h-2 bg-[#f97316] rounded-full mr-3"></span>{current.d1}</div>
                    <div className="flex items-center"><span className="w-2 h-2 bg-[#f97316] rounded-full mr-3"></span>{current.d2}</div>
                </div>
            </div>
            <div className="bg-gray-800 p-8 border border-gray-700 rounded-lg">
                <div className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-4">{current.mTitle}</div>
                <ul className="space-y-4 font-semibold text-lg">
                    <li className="flex items-center justify-between border-b border-gray-700 pb-3"><span className="flex items-center"><span className="text-[#f97316] mr-4 font-mono">01</span> {current.m1}</span><span className="text-xs text-gray-400">{current.m1Sub}</span></li>
                    <li className="flex items-center justify-between border-b border-gray-700 pb-3"><span className="flex items-center"><span className="text-[#f97316] mr-4 font-mono">02</span> {current.m2}</span><span className="text-xs text-gray-400">{current.m2Sub}</span></li>
                    <li className="flex items-center justify-between border-b border-gray-700 pb-3"><span className="flex items-center"><span className="text-[#f97316] mr-4 font-mono">03</span> {current.m3}</span><span className="text-xs text-gray-400">{current.m3Sub}</span></li>
                    <li className="flex items-center justify-between pt-1"><span className="flex items-center"><span className="text-[#f97316] mr-4 font-mono">04</span> {current.m4}</span><span className="text-xs text-gray-400">{current.m4Sub}</span></li>
                </ul>
                <div className="mt-8"><a href="/about" className="text-white text-sm font-bold hover:text-[#f97316] transition flex items-center">{current.mLink}</a></div>
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
