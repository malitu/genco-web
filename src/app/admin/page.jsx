"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function GencoStudioVisualEditor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [activePage, setActivePage] = useState("home");

  // Site Görsel Kütüphanesi
  const [mediaLibrary, setMediaLibrary] = useState([
    { id: 1, name: "Ana Logo", url: "/logo.png" },
    { id: 2, name: "Outsourced Export", url: "/outsourced-export.jpg" },
    { id: 3, name: "Strategic Sourcing", url: "/strategic-sourcing.jpg" },
    { id: 4, name: "Lead Generation", url: "/lead-generation.jpg" },
    { id: 5, name: "Market Entry", url: "/market-entry.jpg" }
  ]);

  // Sayfa Blokları
  const [pagesContent, setPagesContent] = useState({
    home: [
      { id: 101, type: "hero", badge: "Uluslararası İş Geliştirme Ortağınız", title: "Türkiye'deki Uluslararası Ticaret Ekibiniz", subtitle: "Sadece dış ticaret danışmanlığı sunmuyoruz. Fırsatları araştırıyor, doğru uluslararası partnerleri buluyor ve tüm ticari operasyonu sizin adınıza bizzat yönetiyoruz.", animation: "fade-in", images: [], interval: 3 },
      { id: 102, type: "slider", heading: "Küresel Operasyonel Görsellerimiz", animation: "slide-up", images: ["/outsourced-export.jpg", "/strategic-sourcing.jpg"], interval: 3 }
    ],
    services: [
      { id: 201, type: "hero", badge: "Uçtan Uca Ticaret Yönetimi", title: "Aktif İş Geliştirme ve Operasyonel Çözümlerimiz", subtitle: "GENCO olarak şirketlere sadece dışarıdan tavsiye vermiyoruz; doğrudan pazar açıyor ve operasyonu bizzat yönetiyoruz.", animation: "zoom-in", images: [], interval: 3 }
    ],
    industries: [
      { id: 301, type: "hero", badge: "Sektörel Yetkinlik ve Uzmanlık", title: "Derinlemesine Hakim Olduğumuz Alanlar ve Esnek Çözüm Ağımız", subtitle: "Demir Çelik, Denizcilik, Tohumculuk, Medikal, Otomotiv ve Femtech alanlarında tescilli uzmanlık.", animation: "float", images: [], interval: 3 }
    ]
  });

  const [sliderIndexes, setSliderIndexes] = useState({});

  useEffect(() => {
    const fetchStudioData = async () => {
      try {
        const docRef = doc(db, "settings", "genco_studio");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.pagesContent) setPagesContent(data.pagesContent);
          if (data.mediaLibrary) setMediaLibrary(data.mediaLibrary);
        }
      } catch (e) {
        console.log("Firebase verisi bekleniyor.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudioData();
  }, []);

  useEffect(() => {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      setIsAuthenticated(true);
    } catch (error) {
      setLoginError("E-posta veya şifre hatalı!");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await setDoc(doc(db, "settings", "genco_studio"), { 
        pagesContent, 
        mediaLibrary 
      }, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Kaydedilirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  // Doğrudan canlı ekrandan metin güncelleme
  const handleInlineChange = (blockId, field, value) => {
    const currentBlocks = [...(pagesContent[activePage] || [])];
    const blockIndex = currentBlocks.findIndex(b => b.id === blockId);
    if (blockIndex !== -1) {
      currentBlocks[blockIndex][field] = value;
      setPagesContent({
        ...pagesContent,
        [activePage]: currentBlocks
      });
    }
  };

  const handleAddBlock = (type) => {
    let newBlock;
    if (type === "hero") {
      newBlock = { id: Date.now(), type: "hero", badge: "YENİ ETİKET", title: "Buraya Yeni Başlık Yazın", subtitle: "Buraya açıklama metninizi yazabilirsiniz...", animation: "fade-in", images: [], interval: 3 };
    } else if (type === "textBlock") {
      newBlock = { id: Date.now(), type: "textBlock", heading: "Yeni Bölüm Başlığı", content: "Buraya detaylı içerik metninizi yazabilirsiniz...", animation: "slide-up", images: [], interval: 3 };
    } else if (type === "slider") {
      newBlock = { id: Date.now(), type: "slider", heading: "Yeni Galeri / Slider Başlığı", animation: "fade-in", images: [mediaLibrary[0]?.url || "/logo.png"], interval: 3 };
    }

    const updated = [...(pagesContent[activePage] || []), newBlock];
    setPagesContent({ ...pagesContent, [activePage]: updated });
  };

  const handleDeleteBlock = (id) => {
    if (!confirm("Bu bloğu sayfadan silmek istediğinize emin misiniz?")) return;
    const updated = (pagesContent[activePage] || []).filter(b => b.id !== id);
    setPagesContent({ ...pagesContent, [activePage]: updated });
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-mono">GENCO Visual Studio Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-sans p-6">
        <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <span className="bg-[#f97316] text-white font-bold text-xs px-3 py-1 rounded-full">VISUAL STUDIO</span>
            <h1 className="text-2xl font-bold text-[#0f172a] mt-3">GENCO Giriş</h1>
            <p className="text-xs text-gray-500 mt-1">Görsel Editör Yetkilendirmesi</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">E-posta</label>
              <input 
                type="email" 
                value={emailInput} 
                onChange={(e) => setEmailInput(e.target.value)} 
                placeholder="E-posta adresinizi giriniz" 
                className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#f97316]"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Şifre</label>
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="Şifrenizi giriniz" 
                className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#f97316]"
                required 
              />
            </div>
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold text-center">
                ❌ {loginError}
              </div>
            )}
            <button type="submit" className="w-full bg-[#f97316] hover:bg-orange-600 text-white p-3.5 font-bold rounded-xl transition shadow-md text-sm">
              Editörü Başlat
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentBlocks = pagesContent[activePage] || [];
  const logoUrl = mediaLibrary[0]?.url || "/logo.png";

  return (
    <div className="bg-[#f1f5f9] text-[#1e293b] min-h-screen flex flex-col font-sans select-none">
      
      {/* WIX TARZI ÜST WIZARD MENÜSÜ */}
      <header className="bg-[#0f172a] text-white border-b border-gray-800 py-3 px-6 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="bg-[#f97316] text-white font-bold text-xs px-2.5 py-1 rounded">GENCO STUDIO</span>
            <span className="text-xs text-gray-300 font-mono">Visual Editor v2.0</span>
          </div>

          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
            {[
              { id: "home", label: "Ana Sayfa" },
              { id: "services", label: "Hizmetler" },
              { id: "industries", label: "Sektörler" }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setActivePage(p.id)}
                className={`px-4 py-1.5 rounded-md transition ${activePage === p.id ? "bg-[#f97316] text-white font-bold shadow" : "text-gray-300 hover:text-white"}`}
              >
                {p.label} Düzenle
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold">
          <button onClick={handleLogout} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition">
            🔒 Çıkış
          </button>
          <a href="/" target="_blank" className="bg-slate-800 text-gray-200 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-700 transition">
            Canlı Önizleme ↗
          </a>
          <button 
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold transition shadow-lg disabled:opacity-50"
          >
            {saving ? "Yayınlanıyor..." : "🚀 Yayınla & Kaydet"}
          </button>
        </div>
      </header>

      {success && (
        <div className="bg-green-500 text-white text-center py-2 text-xs font-bold transition shadow">
          ✓ Değişiklikler başarıyla canlı siteye yansıtıldı!
        </div>
      )}

      {/* WIX TARZI SOL ARAÇ ÇUBUĞU & ORTA CANLI TUVAL (CANVAS) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SOL WIX MENÜSÜ: BİLEŞEN EKLEME */}
        <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col justify-between shadow-sm z-10 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Sayfaya Blok Ekle</h3>
              <p className="text-[11px] text-gray-500 mb-4">Aşağıdaki bileşenlere tıklayarak aktif sayfaya anında yeni bir bölüm ekleyebilirsiniz.</p>
              
              <div className="space-y-2.5">
                <button onClick={() => handleAddBlock("hero")} className="w-full text-left bg-orange-50 border border-orange-200 hover:bg-orange-100 text-[#f97316] p-3 rounded-xl font-bold text-xs transition flex items-center justify-between">
                  <span>+ Manşet (Hero) Bloğu</span>
                  <span>⚡</span>
                </button>
                <button onClick={() => handleAddBlock("textBlock")} className="w-full text-left bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[#0f172a] p-3 rounded-xl font-bold text-xs transition flex items-center justify-between">
                  <span>+ Metin / İçerik Bloğu</span>
                  <span>📄</span>
                </button>
                <button onClick={() => handleAddBlock("slider")} className="w-full text-left bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-600 p-3 rounded-xl font-bold text-xs transition flex items-center justify-between">
                  <span>+ Görsel Slider / Galeri</span>
                  <span>🖼️</span>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">💡 Kullanım İpuçları</h3>
              <ul className="text-[11px] text-gray-500 space-y-2 leading-relaxed">
                <li>• Sağdaki canlı sitede doğrudan metinlerin üzerine tıklayarak yazılarını değiştirebilirsiniz.</li>
                <li>• Eklediğiniz blokları sağ üst köşelerindeki <strong>"Blok Sil"</strong> butonuyla kaldırabilirsiniz.</li>
                <li>• İşiniz bitince üst menüden <strong>Yayınla & Kaydet</strong> butonuna basmanız yeterlidir.</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 text-center text-[10px] text-gray-400 font-mono">
            GENCO Studio Visual Engine © 2026
          </div>
        </aside>

        {/* ORTA WIX TUVALİ: DOĞRUDAN CANLI SİTE ÜZERİNDE DÜZENLEME */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            
            {/* Canlı Site Üst Navbar Önizlemesi */}
            <nav className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center">
              <img src={logoUrl} alt="GENCO" className="h-8 w-auto object-contain" />
              <div className="hidden md:flex space-x-6 text-xs font-semibold text-gray-500">
                <span>Hizmetler</span>
                <span>Sektörler</span>
                <span>Vaka Analizleri</span>
                <span>Hakkımızda</span>
              </div>
              <span className="bg-[#f97316] text-white text-[10px] px-2 py-1 rounded font-bold">TR / Vizyon Mode</span>
            </nav>

            {/* Sayfa Blokları Tuvali */}
            <div className="flex-1 divide-y divide-gray-100">
              {currentBlocks.map((block, index) => {
                const images = block.images || [];
                const currentImgIdx = sliderIndexes[block.id] || 0;

                return (
                  <div key={block.id} className="relative group p-8 md:p-12 hover:bg-orange-50/20 transition">
                    
                    {/* Blok Yönetim Araç Çubuğu (Wix Hover Kontrolü) */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-white border border-gray-200 shadow-md rounded-lg px-3 py-1 flex items-center space-x-2 z-20">
                      <span className="text-[10px] font-mono font-bold text-gray-400">Blok #{index + 1} ({block.type})</span>
                      <button 
                        onClick={() => handleDeleteBlock(block.id)} 
                        className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded transition"
                      >
                        Blok Sil ✕
                      </button>
                    </div>

                    {block.type === "slider" ? (
                      <div className="text-center">
                        <input 
                          type="text" 
                          value={block.heading || ""} 
                          onChange={(e) => handleInlineChange(block.id, "heading", e.target.value)}
                          placeholder="Galeri Başlığı..."
                          className="text-xl md:text-2xl font-bold text-[#0f172a] mb-6 text-center w-full bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-[#f97316]" 
                        />
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border bg-gray-100 h-[300px]">
                          {images.length > 0 ? (
                            <img src={images[currentImgIdx]} alt="Slider" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">Görsel seçilmedi</div>
                          )}
                        </div>
                      </div>
                    ) : block.type === "hero" ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            value={block.badge || ""} 
                            onChange={(e) => handleInlineChange(block.id, "badge", e.target.value)}
                            className="text-[#f97316] font-bold text-xs uppercase tracking-wider bg-transparent border-b border-dashed border-orange-200 w-full focus:outline-none" 
                          />
                          <textarea 
                            rows="2" 
                            value={block.title || ""} 
                            onChange={(e) => handleInlineChange(block.id, "title", e.target.value)}
                            className="text-2xl md:text-4xl font-bold text-[#0f172a] leading-tight bg-transparent border border-dashed border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-[#f97316]" 
                          />
                          <textarea 
                            rows="3" 
                            value={block.subtitle || ""} 
                            onChange={(e) => handleInlineChange(block.id, "subtitle", e.target.value)}
                            className="text-sm text-gray-600 bg-transparent border border-dashed border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-[#f97316]" 
                          />
                        </div>
                        <div className="bg-[#0f172a] p-6 rounded-xl text-white shadow-lg">
                          <span className="text-[#f97316] text-xs font-bold uppercase tracking-widest block mb-2">Operasyonel Güç</span>
                          <h4 className="text-xl font-bold mb-2">Masada ve Sahada Bizzat Yönetim</h4>
                          <p className="text-gray-300 text-xs">Jenerik pazar araştırmalarıyla vakit kaybetmiyoruz, doğrudan sonuç üretiyoruz.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          value={block.heading || ""} 
                          onChange={(e) => handleInlineChange(block.id, "heading", e.target.value)}
                          className="text-xl font-bold text-[#0f172a] bg-transparent border-b border-dashed border-gray-300 w-full focus:outline-none focus:border-[#f97316]" 
                        />
                        <textarea 
                          rows="3" 
                          value={block.content || ""} 
                          onChange={(e) => handleInlineChange(block.id, "content", e.target.value)}
                          className="text-xs text-gray-600 bg-transparent border border-dashed border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-[#f97316]" 
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Canlı Site Alt Bilgi (Footer) */}
            <footer className="bg-white py-8 border-t border-gray-200 text-center text-xs text-gray-400">
              © 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.
            </footer>

          </div>
        </main>

      </div>

    </div>
  );
}
