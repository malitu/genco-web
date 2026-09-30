"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function GencoStudioFullScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [activePage, setActivePage] = useState("home");
  const [activeTab, setActiveTab] = useState("editor"); // "editor" veya "media"

  // Firebase Görsel Kütüphanesi
  const [mediaLibrary, setMediaLibrary] = useState([
    { id: 1, name: "Ana Logo", url: "/logo.png" },
    { id: 2, name: "Outsourced Export", url: "/outsourced-export.jpg" },
    { id: 3, name: "Strategic Sourcing", url: "/strategic-sourcing.jpg" }
  ]);

  // Sayfa İçerikleri
  const [pagesContent, setPagesContent] = useState({
    home: [
      { 
        id: 101, 
        type: "hero", 
        badge: "Uluslararası İş Geliştirme Ortağınız", 
        title: "Türkiye'deki Uluslararası Ticaret Ekibiniz", 
        subtitle: "Sadece dış ticaret danışmanlığı sunmuyoruz. Fırsatları araştırıyor, doğru uluslararası partnerleri buluyor ve tüm ticari operasyonu sizin adınıza bizzat yönetiyoruz.",
        boxTitle: "Masada ve Sahada Doğrudan Operasyon",
        boxDesc: "Jenerik pazar araştırmalarıyla vakit kaybetmiyoruz. Tescilli ticaret istihbarat altyapılarımızı kullanarak doğrudan karar vericilere ulaşıyor; demir çelikten medikal, denizcilik ve femtech projelerine kadar teknik standartları bizzat yönetiyoruz."
      },
      { 
        id: 102, 
        type: "sectors", 
        heading: "Ağırlıklı Çalıştığımız Sektörler", 
        content: "Derinlemesine ağ ve teknik bilgiye sahip olduğumuz ana alanların yanı sıra, esnek metodolojimizle her sektörde uluslararası ticaret operasyonu yönetebiliyoruz.",
        footerNote: "* Uzmanlık alanlarımız haricinde, talebe göre her sektörde özel pazar araştırması ve operasyon yönetimi sağlanmaktadır."
      }
    ],
    services: [
      { id: 201, type: "hero", badge: "Uçtan Uca Ticaret Yönetimi", title: "Aktif İş Geliştirme ve Operasyonel Çözümlerimiz", subtitle: "GENCO olarak şirketlere sadece dışarıdan tavsiye vermiyoruz; doğrudan pazar açıyor ve operasyonu bizzat yönetiyoruz." }
    ],
    industries: [
      { id: 301, type: "hero", badge: "Sektörel Yetkinlik ve Uzmanlık", title: "Derinlemesine Hakim Olduğumuz Alanlar ve Esnek Çözüm Ağımız", subtitle: "Demir Çelik, Denizcilik, Tohumculuk, Medikal, Otomotiv ve Femtech alanlarında tescilli uzmanlık." }
    ]
  });

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
      newBlock = { id: Date.now(), type: "hero", badge: "YENİ ETİKET", title: "Yeni Başlık Yazın", subtitle: "Açıklama metni...", boxTitle: "Operasyon Başlığı", boxDesc: "Açıklama..." };
    } else if (type === "sectors") {
      newBlock = { id: Date.now(), type: "sectors", heading: "Sektörler Başlığı", content: "Açıklama...", footerNote: "Not..." };
    }

    const updated = [...(pagesContent[activePage] || []), newBlock];
    setPagesContent({ ...pagesContent, [activePage]: updated });
  };

  const handleDeleteBlock = (id) => {
    if (!confirm("Bu bloğu silmek istediğinize emin misiniz?")) return;
    const updated = (pagesContent[activePage] || []).filter(b => b.id !== id);
    setPagesContent({ ...pagesContent, [activePage]: updated });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newMedia = { id: Date.now(), name: file.name, url: reader.result };
      setMediaLibrary(prev => [...prev, newMedia]);
      alert(`"${file.name}" medya kütüphanesine eklendi!`);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-mono">GENCO Full-Screen Studio Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-sans p-6">
        <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <span className="bg-[#f97316] text-white font-bold text-xs px-3 py-1 rounded-full">FULL-SCREEN STUDIO</span>
            <h1 className="text-2xl font-bold text-[#0f172a] mt-3">GENCO Giriş</h1>
            <p className="text-xs text-gray-500 mt-1">Yetkili Yönetici Doğrulaması</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">E-posta</label>
              <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="E-posta adresiniz" className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#f97316]" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Şifre</label>
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Şifreniz" className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#f97316]" required />
            </div>
            {loginError && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold text-center">❌ {loginError}</div>}
            <button type="submit" className="w-full bg-[#f97316] text-white p-3.5 font-bold rounded-xl transition text-sm">Stüdyoyu Aç</button>
          </form>
        </div>
      </div>
    );
  }

  const currentBlocks = pagesContent[activePage] || [];
  const logoUrl = mediaLibrary[0]?.url || "/logo.png";

  return (
    <div className="bg-[#f1f5f9] text-[#1e293b] min-h-screen flex flex-col font-sans select-none">
      
      {/* ÜST WIZARD MENÜSÜ */}
      <header className="bg-[#0f172a] text-white border-b border-gray-800 py-3 px-6 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="bg-[#f97316] text-white font-bold text-xs px-2.5 py-1 rounded">GENCO STUDIO</span>
            <span className="text-xs text-gray-300 font-mono">Full-Screen Editor</span>
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

          <div className="flex space-x-2 text-xs">
            <button onClick={() => setActiveTab("editor")} className={`px-3 py-1.5 rounded font-bold ${activeTab === "editor" ? "bg-slate-700 text-white" : "text-gray-400"}`}>✏️ Sayfa Düzenleyici</button>
            <button onClick={() => setActiveTab("media")} className={`px-3 py-1.5 rounded font-bold ${activeTab === "media" ? "bg-slate-700 text-white" : "text-gray-400"}`}>🖼️ Medya Kütüphanesi</button>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold">
          <button onClick={handleLogout} className="bg-red-500/20 text-red-400 px-3 py-2 rounded-lg">Çıkış</button>
          <a href="/" target="_blank" className="bg-slate-800 text-gray-200 px-4 py-2 rounded-lg">Önizle ↗</a>
          <button onClick={handleSaveAll} disabled={saving} className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg">
            {saving ? "Yayınlanıyor..." : "🚀 Kaydet & Yayınla"}
          </button>
        </div>
      </header>

      {success && <div className="bg-green-500 text-white text-center py-2 text-xs font-bold">✓ Değişiklikler başarıyla kaydedildi ve canlı siteye yansıtıldı!</div>}

      {/* İÇERİK SEKMELERİ */}
      <div className="flex flex-1 overflow-hidden">
        
        {activeTab === "media" ? (
          <div className="flex-1 p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#0f172a]">Bilgisayardan Fotoğraf Yükle</h3>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-xs border p-3 rounded-xl bg-gray-50" />
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#0f172a]">Medya Havuzu ({mediaLibrary.length})</h3>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {mediaLibrary.map(m => (
                  <div key={m.id} className="border p-2 rounded-xl text-center bg-gray-50">
                    <img src={m.url} alt={m.name} className="h-20 w-full object-cover rounded mb-1" />
                    <span className="text-[10px] font-bold truncate block">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* SOL KONTROL MENÜSÜ */}
            <aside className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col justify-between shadow-sm z-10 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Sayfaya Blok Ekle</h3>
                  <div className="space-y-2.5">
                    <button onClick={() => handleAddBlock("hero")} className="w-full text-left bg-orange-50 border border-orange-200 text-[#f97316] p-3 rounded-xl font-bold text-xs flex justify-between">
                      <span>+ Manşet (Hero) Bloğu</span><span>⚡</span>
                    </button>
                    <button onClick={() => handleAddBlock("sectors")} className="w-full text-left bg-indigo-50 border border-indigo-200 text-indigo-600 p-3 rounded-xl font-bold text-xs flex justify-between">
                      <span>+ Sektörler Bölümü</span><span>📊</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">💡 Kullanım Rehberi</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Sağ taraftaki geniş alanda sitenizin canlı görünümü yer alır. Yazılara doğrudan tıklayarak değiştirebilir, sağ üst köşelerinden blokları silebilirsiniz. İşiniz bitince üst menüden <strong>Kaydet & Yayınla</strong> butonuna basabilirsiniz.
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 font-mono text-center pt-4 border-t">
                GENCO Full-Screen Studio © 2026
              </div>
            </aside>

            {/* SAĞ TARAF: TAM EKRAN GENİŞ CANLI TUVAL */}
            <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
              <div className="bg-white w-full rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col min-h-full">
                
                {/* Navbar Önizlemesi */}
                <nav className="bg-white border-b border-gray-200 py-4 px-10 flex justify-between items-center">
                  <img src={logoUrl} alt="GENCO" className="h-8 w-auto object-contain" />
                  <div className="hidden lg:flex space-x-8 text-xs font-semibold text-gray-600">
                    <span>Hizmetler</span><span>Sektörler</span><span>Vaka Analizleri</span><span>Trade Intelligence</span><span>Hakkımızda</span><span>İletişim</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-bold">
                    <span className="bg-[#f97316] text-white px-2 py-1 rounded">TR</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">EN</span>
                  </div>
                </nav>

                {/* Genişletilmiş Blok Alanı */}
                <div className="flex-1 divide-y divide-gray-100">
                  {currentBlocks.map((block, index) => (
                    <div key={block.id} className="relative group p-10 md:p-16 hover:bg-orange-50/10 transition">
                      
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition bg-white border border-gray-200 shadow-md rounded-lg px-3 py-1.5 flex items-center space-x-3 z-20">
                        <span className="text-xs font-mono font-bold text-gray-400">Blok #{index + 1} ({block.type})</span>
                        <button onClick={() => handleDeleteBlock(block.id)} className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded transition">Sil ✕</button>
                      </div>

                      {block.type === "hero" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                          <div className="space-y-6">
                            <input type="text" value={block.badge || ""} onChange={(e) => handleInlineChange(block.id, "badge", e.target.value)} className="text-[#f97316] font-bold text-sm uppercase tracking-wider bg-transparent border-b border-dashed border-orange-200 w-full focus:outline-none" />
                            <textarea rows="2" value={block.title || ""} onChange={(e) => handleInlineChange(block.id, "title", e.target.value)} className="text-3xl md:text-5xl font-bold text-[#0f172a] leading-tight bg-transparent border border-dashed border-gray-300 rounded-lg p-2 w-full focus:outline-none" />
                            <textarea rows="4" value={block.subtitle || ""} onChange={(e) => handleInlineChange(block.id, "subtitle", e.target.value)} className="text-base text-gray-600 bg-transparent border border-dashed border-gray-300 rounded-lg p-2 w-full focus:outline-none" />
                            <div className="flex gap-4 pt-2">
                              <span className="bg-[#f97316] text-white px-8 py-3.5 font-bold rounded shadow text-xs">Proje Başlatın</span>
                              <span className="border-2 border-[#0f172a] text-[#0f172a] px-8 py-3.5 font-bold rounded text-xs">Hizmetlerimizi İnceleyin</span>
                            </div>
                          </div>
                          <div className="bg-[#0f172a] p-8 md:p-10 rounded-2xl text-white shadow-xl space-y-4">
                            <input type="text" value={block.boxTitle || ""} onChange={(e) => handleInlineChange(block.id, "boxTitle", e.target.value)} className="text-xl font-bold text-white bg-transparent border-b border-dashed border-gray-700 w-full focus:outline-none" />
                            <textarea rows="4" value={block.boxDesc || ""} onChange={(e) => handleInlineChange(block.id, "boxDesc", e.target.value)} className="text-xs text-gray-300 bg-transparent border border-dashed border-gray-700 rounded-lg p-2 w-full focus:outline-none" />
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 pt-3 border-t border-gray-800">
                              <div>✓ Doğrudan C-Level Erişim</div>
                              <div>✓ Teknik Şartname Uyumu</div>
                              <div>✓ Geniş Sektörel Esneklik</div>
                              <div>✓ Numune & Sevkiyat Takibi</div>
                            </div>
                          </div>
                        </div>
                      ) : block.type === "sectors" ? (
                        <div className="space-y-10 py-6">
                          <div className="text-center max-w-3xl mx-auto space-y-4">
                            <input type="text" value={block.heading || ""} onChange={(e) => handleInlineChange(block.id, "heading", e.target.value)} className="text-3xl font-bold text-[#0f172a] text-center w-full bg-transparent border-b border-dashed border-gray-300 focus:outline-none" />
                            <textarea rows="2" value={block.content || ""} onChange={(e) => handleInlineChange(block.id, "content", e.target.value)} className="text-sm text-gray-600 text-center w-full bg-transparent border border-dashed border-gray-300 rounded-lg p-2 focus:outline-none" />
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                            {["01\nDemir Çelik", "02\nDenizcilik", "03\nTohumculuk", "04\nMedikal", "05\nOtomotiv", "06\nFemtech"].map((sec, sIdx) => (
                              <div key={sIdx} className="bg-white border border-gray-200 p-6 rounded-2xl text-center shadow-sm">
                                <span className="text-orange-500 font-bold text-xl block mb-1">{sec.split("\n")[0]}</span>
                                <span className="font-bold text-slate-800 text-sm">{sec.split("\n")[1]}</span>
                              </div>
                            ))}
                          </div>
                          <input type="text" value={block.footerNote || ""} onChange={(e) => handleInlineChange(block.id, "footerNote", e.target.value)} className="text-xs text-gray-400 text-center w-full bg-transparent border-b border-dashed border-gray-200 focus:outline-none" />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* Footer Önizlemesi */}
                <footer className="bg-white py-8 px-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                  <div>© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.</div>
                  <div className="mt-2 md:mt-0">Meriç Mah. 5746/5 SK. No: 3 Bornova/İzmir - TÜRKİYE</div>
                </footer>

              </div>
            </main>
          </>
        )}

      </div>

    </div>
  );
}
