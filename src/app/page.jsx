"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [pagesContent, setPagesContent] = useState(null);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sliderIndexes, setSliderIndexes] = useState({});

  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const docRef = doc(db, "settings", "genco_studio");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.pagesContent) setPagesContent(data.pagesContent);
          if (data.mediaLibrary) setMediaLibrary(data.mediaLibrary);
        }
      } catch (e) {
        console.log("Firebase verisi yüklenirken hata oluştu:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchWebsiteData();
  }, []);

  // Slider otomatik geçiş timer'ı
  useEffect(() => {
    if (!pagesContent) return;
    const intervalTimer = setInterval(() => {
      setSliderIndexes(prev => {
        const newIndexes = { ...prev };
        Object.keys(pagesContent).forEach(pageKey => {
          (pagesContent[pageKey] || []).forEach(block => {
            if (block.type === "slider" && block.images && block.images.length > 1) {
              const currentIdx = newIndexes[block.id] || 0;
              newIndexes[block.id] = (currentIdx + 1) % block.images.length;
            }
          });
        });
        return newIndexes;
      });
    }, 4000);
    return () => clearInterval(intervalTimer);
  }, [pagesContent]);

  if (loading) {
    return <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center font-sans">GENCO Yükleniyor...</div>;
  }

  // Eğer Firebase'de veri henüz yoksa varsayılan ana sayfa bloklarını göster
  const blocks = pagesContent?.home || [
    { id: 101, type: "hero", badge: "Uluslararası İş Geliştirme Ortağınız", title: "Türkiye'deki Uluslararası Ticaret Ekibiniz", subtitle: "Sadece dış ticaret danışmanlığı sunmuyoruz. Fırsatları araştırıyor, doğru uluslararası partnerleri buluyor ve tüm ticari operasyonu sizin adınıza bizzat yönetiyoruz.", animation: "fade-in", images: [], interval: 3 },
    { id: 102, type: "slider", heading: "Küresel Operasyonel Görsellerimiz", animation: "slide-up", images: ["/outsourced-export.jpg", "/strategic-sourcing.jpg"], interval: 3 }
  ];

  const logoUrl = mediaLibrary[0]?.url || "/logo.png";

  return (
    <div className="bg-[#fafafa] text-[#1e293b] antialiased min-h-screen flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center">
          <img src={logoUrl} alt="GENCO" className="h-8 w-auto object-contain" />
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-600">
          <span className="hover:text-[#f97316] cursor-pointer">Hizmetler</span>
          <span className="hover:text-[#f97316] cursor-pointer">Sektörler</span>
          <span className="hover:text-[#f97316] cursor-pointer">Vaka Analizleri</span>
          <span className="hover:text-[#f97316] cursor-pointer">Trade Intelligence</span>
          <span className="hover:text-[#f97316] cursor-pointer">Hakkımızda</span>
          <span className="hover:text-[#f97316] cursor-pointer">İletişim</span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold">
          <span className="bg-[#f97316] text-white px-2 py-1 rounded">TR</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-400">EN</span>
        </div>
      </nav>

      <main className="flex-1">
        {blocks.map((block, i) => {
          const images = block.images || [];
          const currentImgIdx = sliderIndexes[block.id] || 0;

          if (block.type === "slider") {
            return (
              <section key={block.id || i} className="py-20 bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-6">{block.heading}</h2>
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border bg-gray-100 h-[350px] md:h-[500px]">
                    {images.length > 0 ? (
                      <>
                        <img 
                          src={images[currentImgIdx]} 
                          alt="Slider" 
                          className="w-full h-full object-cover transition-all duration-700" 
                          onError={(e)=>{e.target.src="/logo.png"}}
                        />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                          {images.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              onClick={() => setSliderIndexes({ ...sliderIndexes, [block.id]: dotIdx })}
                              className={`w-3 h-3 rounded-full transition-all ${
                                dotIdx === currentImgIdx ? "bg-[#f97316] w-6" : "bg-white/70 hover:bg-white"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">Bu blokta henüz görsel seçilmedi.</div>
                    )}
                  </div>
                </div>
              </section>
            );
          } else if (block.type === "hero") {
            return (
              <header key={block.id || i} className="py-20 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[#f97316] font-bold tracking-wider text-sm mb-4 uppercase">{block.badge}</span>
                    <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-6">{block.title}</h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">{block.subtitle}</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      <span className="bg-[#f97316] text-white px-8 py-4 text-center font-bold rounded shadow-lg cursor-pointer">Proje Başlatın</span>
                      <span className="border-2 border-[#0f172a] text-[#0f172a] px-8 py-4 text-center font-bold rounded cursor-pointer">Hizmetlerimizi İnceleyin</span>
                    </div>
                  </div>
                  <div className="relative bg-[#0f172a] p-8 rounded-lg text-white shadow-xl overflow-hidden">
                    <div className="text-[#f97316] font-bold text-sm uppercase tracking-widest mb-2">Aktif Ticaret Yönetimi</div>
                    <h3 className="text-2xl font-bold mb-4">Masada ve Sahada Doğrudan Operasyon</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">Jenerik pazar araştırmalarıyla vakit kaybetmiyoruz. Doğrudan karar vericilere ulaşıyoruz.</p>
                  </div>
                </div>
              </header>
            );
          } else {
            return (
              <section key={block.id || i} className="py-20 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-[#fafafa] border border-gray-200 p-8 md:p-12 rounded-2xl shadow-sm">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">{block.heading}</h2>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">{block.content}</p>
                  </div>
                </div>
              </section>
            );
          }
        })}
      </main>

      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.</div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com
          </div>
        </div>
      </footer>
    </div>
  );
}
