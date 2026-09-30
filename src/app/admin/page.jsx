"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function GencoStudioAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(true);

  const [activeTab, setActiveTab] = useState("pages");
  const [activePage, setActivePage] = useState("home");
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Site Görsel Kütüphanesi
  const [mediaLibrary, setMediaLibrary] = useState([
    { id: 1, name: "Ana Logo", url: "/logo.png" },
    { id: 2, name: "Outsourced Export", url: "/outsourced-export.jpg" },
    { id: 3, name: "Strategic Sourcing", url: "/strategic-sourcing.jpg" },
    { id: 4, name: "Lead Generation", url: "/lead-generation.jpg" },
    { id: 5, name: "Market Entry", url: "/market-entry.jpg" }
  ]);
  const [newImgName, setNewImgName] = useState("");
  const [newImgUrl, setNewImgUrl] = useState("");

  // Blok Tabanlı Sayfa İçerikleri
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
    ],
    caseStudies: [
      { id: 401, type: "hero", badge: "Sahadaki İcraatlarımız", title: "Ağırlıklı Çalıştığımız Sektörlerde Başarı Hikayeleri", subtitle: "Demir çelikten medikal malzemelere kadar yürüttüğümüz stratejik operasyonlar.", animation: "fade-in", images: [], interval: 3 }
    ],
    insights: [
      { id: 501, type: "hero", badge: "Sektörel Analiz & İçgörüler", title: "Trade Intelligence: Sahadan ve Veriden Notlar", subtitle: "Uluslararası ticarette bizzat deneyimlediğimiz stratejik içgörüler.", animation: "slide-up", images: [], interval: 3 }
    ],
    about: [
      { id: 601, type: "hero", badge: "Kurumsal Kimlik & Vizyon", title: "Analiz Yön Gösterir. İcraat Ticaret Yaratır.", subtitle: "İzmir Bornova merkezli kurulan aktif dış ticaret ve iş geliştirme ortağınız.", animation: "zoom-in", images: [], interval: 3 }
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
        setLoadingLogin(false);
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
      setEmailInput("");
      setPasswordInput("");
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

  const handleBlockChange = (index, field, value) => {
    const updatedBlocks = [...pagesContent[activePage]];
    updatedBlocks[index][field] = value;
    setPagesContent({
      ...pagesContent,
      [activePage]: updatedBlocks
    });
  };

  const handleAddBlock = (type) => {
    let newBlock;
    if (type === "hero") {
      newBlock = { id: Date.now(), type: "hero", badge: "Yeni Etiket", title: "Yeni Başlık Ekle", subtitle: "Yeni açıklama metnini buraya yazın...", animation: "fade-in", images: [], interval: 3 };
    } else if (type === "textBlock") {
      newBlock = { id: Date.now(), type: "textBlock", heading: "Yeni Bölüm Başlığı", content: "Buraya detaylı içerik metninizi yazabilirsiniz...", animation: "slide-up", images: [], interval: 3 };
    } else if (type === "slider") {
      newBlock = { id: Date.now(), type: "slider", heading: "Kayan Resimler / Galeri Başlığı", animation: "fade-in", images: [mediaLibrary[0]?.url || "/logo.png"], interval: 3 };
    }

    pagesContent[activePage].push(newBlock);
    setPagesContent({ ...pagesContent });
    setSelectedBlockIndex(pagesContent[activePage].length - 1);
  };

  const handleDeleteBlock = (id) => {
    if (!confirm("Bu bloğu silmek istediğinize emin misiniz?")) return;
    const updated = pagesContent[activePage].filter(b => b.id !== id);
    setPagesContent({
      ...pagesContent,
      [activePage]: updated
    });
    setSelectedBlockIndex(0);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const newMedia = {
        id: Date.now(),
        name: file.name,
        url: base64String
      };
      setMediaLibrary(prev => [...prev, newMedia]);
      alert(`"${file.name}" başarıyla yüklendi ve kütüphaneye eklendi!`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMediaUrl = (e) => {
    e.preventDefault();
    if (!newImgName || !newImgUrl) return;
    const newMedia = { id: Date.now(), name: newImgName, url: newImgUrl };
    setMediaLibrary([...mediaLibrary, newMedia]);
    setNewImgName("");
    setNewImgUrl("");
  };

  if (loading || loadingLogin) {
    return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-mono">GENCO Studio Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-sans p-6">
        <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <span className="bg-[#f97316] text-white font-bold text-xs px-3 py-1 rounded-full">GÜVENLİ ERİŞİM</span>
            <h1 className="text-2xl font-bold text-[#0f172a] mt-3">GENCO Studio Giriş</h1>
            <p className="text-xs text-gray-500 mt-1">Yönetim Paneli Yetkilendirmesi</p>
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
              Giriş Yap
            </button>
          </form>

          <div className="text-center mt-6 text-[10px] text-gray-400">
            GENCO Imports & Exports LTD. © 2026
          </div>
        </div>
      </div>
    );
  }

  const currentBlocks = pagesContent[activePage] || [];
  const selectedBlock = currentBlocks[selectedBlockIndex] || currentBlocks[0];

  const renderExactLiveWebsiteTemplate = (blocks) => (
    <div className="bg-[#fafafa] text-[#1e293b] antialiased min-h-screen flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center">
          <img src={mediaLibrary[0]?.url || "/logo.png"} alt="GENCO" className="h-8 w-auto object-contain" />
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
                      <span className="bg-[#f97316] text-white px-8 py-4 text-center font-bold rounded shadow-lg">Proje Başlatın</span>
                      <span className="border-2 border-[#0f172a] text-[#0f172a] px-8 py-4 text-center font-bold rounded">Hizmetlerimizi İnceleyin</span>
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

  return (
    <div className="bg-[#f1f5f9] text-[#1e293b] min-h-screen flex flex-col font-sans">
      
      <nav className="bg-[#0f172a] text-white border-b border-gray-800 py-4 px-8 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <span className="bg-[#f97316] text-white font-bold text-xs px-2.5 py-1 rounded">GENCO STUDIO</span>
          <span className="font-bold tracking-wider text-sm">Modüler Arayüz & Görsel Yöneticisi</span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded transition">
            🔒 Çıkış Yap
          </button>
          <button 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-bold transition shadow-sm border border-slate-600"
          >
            {isPreviewMode ? "✏️ Düzenlemeye Geri Dön" : "🔍 Kaydetmeden Önizle"}
          </button>
          <a href="/" target="_blank" className="text-gray-300 hover:text-[#f97316] transition flex items-center">
            Canlı Siteyi Gör ↗
          </a>
          <button 
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-5 py-2 rounded font-bold transition shadow-sm disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Sistemi Kaydet & Yayınla"}
          </button>
        </div>
      </nav>

      {!isPreviewMode && (
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex space-x-4 shadow-sm">
          <button 
            onClick={() => setActiveTab("pages")} 
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition ${activeTab === "pages" ? "bg-[#0f172a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            📄 Sayfa Blok Düzenleyici & Görsel Seçici
          </button>
          <button 
            onClick={() => setActiveTab("media")} 
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition ${activeTab === "media" ? "bg-[#0f172a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            🖼️ Firebase Medya Kütüphanesi ({mediaLibrary.length})
          </button>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto w-full px-8 mt-4">
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-xs font-semibold shadow-sm">
            ✓ Değişiklikler ve medya havuzu başarıyla Firebase'e kaydedildi!
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8">
        
        {isPreviewMode ? (
          <div className="bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-200 text-amber-900 p-4 flex justify-between items-center text-xs font-bold sticky top-0 z-50">
              <span>⚠️ ÖNİZLEME MODUNDASINIZ: Bu değişiklikler henüz kaydedilmedi ve canlı siteye yansıtılmadı. ({activePage.toUpperCase()} Sayfası)</span>
              <button onClick={() => setIsPreviewMode(false)} className="bg-amber-600 text-white px-3 py-1.5 rounded hover:bg-amber-700 transition">
                Düzenlemeye Geri Dön
              </button>
            </div>
            {renderExactLiveWebsiteTemplate(currentBlocks)}
          </div>
        ) : activeTab === "media" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center shadow-sm">
                <h3 className="text-sm font-bold text-[#0f172a] mb-2">Bilgisayardan Resim Yükle</h3>
                <p className="text-xs text-gray-500 mb-4">Cihazınızdaki bir görseli seçerek kütüphaneye anında ekleyin.</p>
                <label className="bg-[#0f172a] hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-xs cursor-pointer inline-block transition shadow-sm">
                  📁 Bilgisayardan Dosya Seç
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#0f172a] mb-4">Veya URL ile Görsel Ekle</h3>
                <form onSubmit={handleAddMediaUrl} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Görsel Adı</label>
                    <input type="text" value={newImgName} onChange={(e) => setNewImgName(e.target.value)} placeholder="Örn: Fabrika Sahası" className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#f97316]" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Görsel URL</label>
                    <input type="text" value={newImgUrl} onChange={(e) => setNewImgUrl(e.target.value)} placeholder="Örn: /outsourced-export.jpg" className="w-full border border-gray-300 p-3 rounded-xl text-xs font-mono focus:outline-none focus:border-[#f97316]" required />
                  </div>
                  <button type="submit" className="w-full bg-[#f97316] text-white p-3 font-bold rounded-xl hover:bg-orange-600 transition text-xs">
                    Kütüphaneye Ekle
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#0f172a] mb-4">Firebase Görsel Havuzu ({mediaLibrary.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {mediaLibrary.map((media) => (
                  <div key={media.id} className="border border-gray-200 p-3 rounded-xl bg-[#fafafa] flex flex-col justify-between">
                    <div className="h-32 bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center border">
                      <img src={media.url} alt={media.name} className="w-full h-full object-cover" onError={(e)=>{e.target.src="/logo.png"}} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#0f172a] truncate">{media.name}</h4>
                      <p className="text-[9px] text-gray-400 font-mono truncate">{media.url}</p>
                    </div>
                    <button onClick={() => setMediaLibrary(mediaLibrary.filter(m => m.id !== media.id))} className="mt-3 bg-red-50 text-red-600 border border-red-200 py-1 rounded text-[10px] font-bold hover:bg-red-100 transition">
                      Kütüphaneden Kaldır
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit space-y-6">
              
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Sayfalar</h3>
                <div className="space-y-1">
                  {[
                    { id: "home", label: "Ana Sayfa" },
                    { id: "services", label: "Hizmetler Sayfası" },
                    { id: "industries", label: "Sektörler Sayfası" },
                    { id: "caseStudies", label: "Vaka Analizleri" },
                    { id: "insights", label: "Trade Intelligence" },
                    { id: "about", label: "Hakkımızda Sayfası" },
                  ].map(page => (
                    <button
                      key={page.id}
                      onClick={() => { setActivePage(page.id); setSelectedBlockIndex(0); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex justify-between items-center ${
                        activePage === page.id ? "bg-[#0f172a] text-white shadow-sm" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{page.label}</span>
                      <span className="text-[10px] opacity-60 font-mono">{(pagesContent[page.id] || []).length} Blok</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <span className="text-xs font-bold text-gray-500 block mb-2">Yeni Blok Ekle:</span>
                <div className="space-y-2">
                  <button onClick={() => handleAddBlock("hero")} className="w-full bg-orange-50 text-[#f97316] border border-orange-200 py-2.5 rounded-lg text-xs font-bold hover:bg-orange-100 transition">
                    + Hero / Manşet Bloğu
                  </button>
                  <button onClick={() => handleAddBlock("textBlock")} className="w-full bg-gray-50 text-[#0f172a] border border-gray-200 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition">
                    + Metin / İçerik Bloğu
                  </button>
                  <button onClick={() => handleAddBlock("slider")} className="w-full bg-indigo-50 text-indigo-600 border border-indigo-200 py-2.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition">
                    + Kayan Resimler (Slider) Bloğu Ekle
                  </button>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 pt-6 bg-amber-50/50 p-4 rounded-xl border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-3 flex items-center">
                  <span>✨ Seçili Blok Efekti & Slider Ayarları</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Düzenlenen Blok</label>
                    <select 
                      value={selectedBlockIndex} 
                      onChange={(e) => setSelectedBlockIndex(Number(e.target.value))}
                      className="w-full border border-gray-300 p-2.5 rounded-xl text-xs bg-white font-bold focus:outline-none focus:border-[#f97316]"
                    >
                      {currentBlocks.map((b, idx) => (
                        <option key={b.id || idx} value={idx}>
                          #{idx + 1} ({b.type.toUpperCase()}) - {b.title || b.heading || "Blok"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedBlock && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Blok Animasyonu</label>
                        <select 
                          value={selectedBlock.animation || "fade-in"} 
                          onChange={(e) => handleBlockChange(selectedBlockIndex, "animation", e.target.value)}
                          className="w-full border border-gray-300 p-2.5 rounded-xl text-xs bg-white font-mono focus:outline-none focus:border-[#f97316]"
                        >
                          <option value="fade-in">Yavaşça Belirme (Fade In)</option>
                          <option value="zoom-in">Hafifçe Büyüme / Zoom</option>
                          <option value="slide-up">Aşağıdan Yukarı Kayma (Slide Up)</option>
                          <option value="float">Yüzen / Nabız Efekti (Float)</option>
                        </select>
                      </div>

                      {selectedBlock.type === "slider" && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                            🖼️ Kayan Resimler Seçimi (Görsel Ön İzlemeli)
                          </label>
                          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                            {mediaLibrary.map(m => {
                              const imagesArr = selectedBlock.images || [];
                              const isSelected = imagesArr.includes(m.url);
                              return (
                                <div 
                                  key={m.id} 
                                  onClick={() => {
                                    let updated = [...imagesArr];
                                    if (isSelected) {
                                      updated = updated.filter(u => u !== m.url);
                                    } else {
                                      updated.push(m.url);
                                    }
                                    handleBlockChange(selectedBlockIndex, "images", updated);
                                  }}
                                  className={`cursor-pointer border rounded-xl p-2 flex flex-col items-center text-center transition ${
                                    isSelected ? "border-[#f97316] bg-orange-50 ring-2 ring-orange-100" : "border-gray-200 bg-white hover:border-gray-300"
                                  }`}
                                >
                                  <div className="w-full h-16 rounded-lg overflow-hidden bg-gray-100 mb-1 border">
                                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" onError={(e)=>{e.target.src="/logo.png"}} />
                                  </div>
                                  <span className="text-[10px] font-bold text-gray-700 truncate w-full">{m.name}</span>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-[9px] text-gray-400 mt-1">Seçtiğiniz küçük görsellere tıklayarak slider galerinize ekleyebilir veya çıkarabilirsiniz.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white px-6 py-4 border border-gray-200 rounded-2xl shadow-sm flex justify-between items-center">
                <h2 className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">{activePage} Blok İçerikleri</h2>
                <div className="flex space-x-2">
                  <button onClick={() => setIsPreviewMode(true)} className="bg-slate-700 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-slate-800 transition">
                    🔍 Kaydetmeden Önizle
                  </button>
                  <button onClick={handleSaveAll} className="bg-[#f97316] text-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-orange-600 transition shadow-sm">
                    Sistemi Kaydet & Yayınla
                  </button>
                </div>
              </div>

              <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
                {currentBlocks.map((block, index) => (
                  <div key={block.id} className={`bg-white border rounded-2xl p-6 shadow-sm relative transition ${selectedBlockIndex === index ? "border-[#f97316] ring-2 ring-orange-100" : "border-gray-200"}`}>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                      <span className="text-[10px] font-mono bg-[#0f172a] text-white px-2 py-1 rounded uppercase cursor-pointer" onClick={() => setSelectedBlockIndex(index)}>
                        #{index + 1} — {block.type.toUpperCase()} (Düzenlemek için seç)
                      </span>
                      <button onClick={() => handleDeleteBlock(block.id)} className="text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 px-3 py-1 rounded border border-red-100 transition">
                        Sil ✕
                      </button>
                    </div>

                    {block.type === "hero" ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Üst Etiket (Badge)</label>
                          <input type="text" value={block.badge || ""} onChange={(e) => handleBlockChange(index, "badge", e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#f97316]" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Başlık</label>
                          <textarea rows="2" value={block.title || ""} onChange={(e) => handleBlockChange(index, "title", e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-[#f97316]" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Açıklama</label>
                          <textarea rows="3" value={block.subtitle || ""} onChange={(e) => handleBlockChange(index, "subtitle", e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#f97316]" />
                        </div>
                      </div>
                    ) : block.type === "slider" ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Galeri / Slider Başlığı</label>
                          <input type="text" value={block.heading || ""} onChange={(e) => handleBlockChange(index, "heading", e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-[#f97316]" />
                        </div>
                        <p className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                          ℹ️ Bu slider bloğunun görsellerini sol alttaki <strong>"Seçili Blok Efekti & Slider Ayarları"</strong> panelinden seçebilirsiniz.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Bölüm Başlığı</label>
                          <input type="text" value={block.heading || ""} onChange={(e) => handleBlockChange(index, "heading", e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-[#f97316]" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">İçerik Metni</label>
                          <textarea rows="3" value={block.content || ""} onChange={(e) => handleBlockChange(index, "content", e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#f97316]" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      <footer className="bg-white border-t border-gray-200 py-6 px-8 text-center text-xs text-gray-400">
        GENCO Studio • İçerik ve Medya Yönetim Modülü © 2026 | Tel: +90 232 462 16 49 | info@gencotr.com
      </footer>

    </div>
  );
}
