"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function GencoModernStudio() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState("content"); // "content", "media", "news"

  // 1. Metin ve İçerik Yönetimi
  const [siteContent, setSiteContent] = useState({
    heroTitle: "Türkiye'deki Uluslararası Ticaret Ekibiniz",
    heroSub: "Sadece dış ticaret danışmanlığı sunmuyoruz. Fırsatları araştırıyor, doğru uluslararası partnerleri buluyor ve tüm ticari operasyonu sizin adınıza bizzat yönetiyoruz.",
    mgmtTitle: "Masada ve Sahada Doğrudan Operasyon",
    mgmtDesc: "Jenerik pazar araştırmalarıyla vakit kaybetmiyoruz. Tescilli ticaret istihbarat altyapılarımızı kullanarak doğrudan karar vericilere ulaşıyoruz."
  });

  // 2. Medya Kütüphanesi (Fotoğraflar, Logolar)
  const [mediaLibrary, setMediaLibrary] = useState([
    { id: 1, name: "Ana Logo", url: "/logo.png" },
    { id: 2, name: "Outsourced Export", url: "/outsourced-export.jpg" }
  ]);
  const [newImgName, setNewImgName] = useState("");
  const [newImgUrl, setNewImgUrl] = useState("");

  // 3. Haberler ve Duyurular Modülü
  const [newsList, setNewsList] = useState([
    { id: 1, title: "12. European Suzuki Children's Convention Katılımımız", date: "2026-04-03", summary: "İstanbul AKM'de gerçekleştirilen uluslararası etkinlikte yerimizi aldık." }
  ]);
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsSummary, setNewNewsSummary] = useState("");

  useEffect(() => {
    const fetchStudioData = async () => {
      try {
        const docRef = doc(db, "settings", "modern_studio");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.siteContent) setSiteContent(prev => ({ ...prev, ...data.siteContent }));
          if (data.mediaLibrary) setMediaLibrary(data.mediaLibrary);
          if (data.newsList) setNewsList(data.newsList);
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
      await setDoc(doc(db, "settings", "modern_studio"), { 
        siteContent, 
        mediaLibrary, 
        newsList 
      }, { merge: true });
      
      // Ayrıca ana sayfanın okuduğu eski 'general' dokümanını da güncelleyelim ki site anında görsün
      await setDoc(doc(db, "settings", "general"), siteContent, { merge: true });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Kaydedilirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  // Medya Yükleme (Base64)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newMedia = { id: Date.now(), name: file.name, url: reader.result };
      setMediaLibrary(prev => [...prev, newMedia]);
      alert(`"${file.name}" başarıyla yüklendi!`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddNews = (e) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsSummary) return;
    const newItem = { id: Date.now(), title: newNewsTitle, date: new Date().toISOString().split('T')[0], summary: newNewsSummary };
    setNewsList(prev => [newItem, ...prev]);
    setNewNewsTitle("");
    setNewNewsSummary("");
  };

  const handleDeleteNews = (id) => {
    setNewsList(prev => prev.filter(n => n.id !== id));
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-mono">GENCO Modern Studio Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-sans p-6">
        <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <span className="bg-[#f97316] text-white font-bold text-xs px-3 py-1 rounded-full">MODERN STUDIO</span>
            <h1 className="text-2xl font-bold text-[#0f172a] mt-3">GENCO Giriş</h1>
            <p className="text-xs text-gray-500 mt-1">Yönetim Paneli Yetkilendirmesi</p>
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
            <button type="submit" className="w-full bg-[#f97316] hover:bg-orange-600 text-white p-3.5 font-bold rounded-xl transition text-sm">Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f5f9] text-[#1e293b] min-h-screen flex flex-col font-sans">
      
      {/* ÜST WIZARD MENÜSÜ */}
      <header className="bg-[#0f172a] text-white border-b border-gray-800 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="bg-[#f97316] text-white font-bold text-xs px-3 py-1 rounded">GENCO STUDIO</span>
            <span className="text-xs text-gray-300 font-mono">Modern CMS v3.0</span>
          </div>

          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
            <button onClick={() => setActiveTab("content")} className={`px-4 py-1.5 rounded-md transition ${activeTab === "content" ? "bg-[#f97316] text-white font-bold" : "text-gray-300 hover:text-white"}`}>
              📝 Sayfa Metinleri
            </button>
            <button onClick={() => setActiveTab("media")} className={`px-4 py-1.5 rounded-md transition ${activeTab === "media" ? "bg-[#f97316] text-white font-bold" : "text-gray-300 hover:text-white"}`}>
              🖼️ Medya & Fotoğraflar ({mediaLibrary.length})
            </button>
            <button onClick={() => setActiveTab("news")} className={`px-4 py-1.5 rounded-md transition ${activeTab === "news" ? "bg-[#f97316] text-white font-bold" : "text-gray-300 hover:text-white"}`}>
              📰 Haberler & Duyurular ({newsList.length})
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold">
          <button onClick={handleLogout} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition">
            🔒 Çıkış
          </button>
          <a href="/" target="_blank" className="bg-slate-800 text-gray-200 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-700 transition">
            Canlı Siteyi Gör ↗
          </a>
          <button 
            onClick={handleSaveAll} 
            disabled={saving}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-md disabled:opacity-50"
          >
            {saving ? "Yayınlanıyor..." : "🚀 Kaydet & Yayınla"}
          </button>
        </div>
      </header>

      {success && (
        <div className="max-w-5xl mx-auto w-full px-8 mt-6">
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-xs font-semibold shadow-sm text-center">
            ✓ Tüm değişiklikler, fotoğraflar ve haberler başarıyla Firebase'e kaydedildi ve canlı siteye yansıtıldı!
          </div>
        </div>
      )}

      {/* İÇERİK ALANI */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-8 space-y-8">
        
        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-[#0f172a] border-b pb-4">Ana Sayfa Metin Yönetimi</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ana Başlık (Hero Title)</label>
                  <textarea rows="2" value={siteContent.heroTitle} onChange={(e) => setSiteContent({...siteContent, heroTitle: e.target.value})} className="w-full border border-gray-300 p-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#f97316]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Alt Açıklama (Hero Subtitle)</label>
                  <textarea rows="3" value={siteContent.heroSub} onChange={(e) => setSiteContent({...siteContent, heroSub: e.target.value})} className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#f97316]" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-[#0f172a] border-b pb-4">Operasyonel Kutu Yönetimi</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Kutu Başlığı</label>
                  <input type="text" value={siteContent.mgmtTitle} onChange={(e) => setSiteContent({...siteContent, mgmtTitle: e.target.value})} className="w-full border border-gray-300 p-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#f97316]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Kutu Açıklaması</label>
                  <textarea rows="3" value={siteContent.mgmtDesc} onChange={(e) => setSiteContent({...siteContent, mgmtDesc: e.target.value})} className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#f97316]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-[#0f172a] border-b pb-4">Bilgisayardan Fotoğraf Yükle</h2>
              <p className="text-xs text-gray-500">Cihazınızdan seçtiğiniz görseller güvenle Firebase medya havuzuna kaydedilir.</p>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-xs border border-gray-300 p-4 rounded-xl bg-gray-50 cursor-pointer" />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-[#0f172a] border-b pb-4">Medya Havuzu ({mediaLibrary.length})</h2>
              <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {mediaLibrary.map(m => (
                  <div key={m.id} className="border border-gray-200 p-3 rounded-xl bg-gray-50 text-center flex flex-col justify-between">
                    <img src={m.url} alt={m.name} className="h-24 w-full object-cover rounded-lg mb-2 border" />
                    <span className="text-[10px] font-bold text-gray-700 truncate">{m.name}</span>
                    <button onClick={() => setMediaLibrary(mediaLibrary.filter(item => item.id !== m.id))} className="mt-2 bg-red-50 text-red-600 text-[10px] font-bold py-1 rounded hover:bg-red-100 transition">Kaldır</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "news" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#0f172a] border-b pb-3">Yeni Haber / Duyuru Ekle</h2>
              <form onSubmit={handleAddNews} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Haber Başlığı</label>
                  <input type="text" value={newNewsTitle} onChange={(e) => setNewNewsTitle(e.target.value)} placeholder="Örn: Yeni Pazar Açılımı" className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#f97316]" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Özet / İçerik</label>
                  <textarea rows="3" value={newNewsSummary} onChange={(e) => setNewNewsSummary(e.target.value)} placeholder="Haberin detayları..." className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#f97316]" required />
                </div>
                <button type="submit" className="w-full bg-[#f97316] text-white p-3 rounded-xl font-bold text-xs hover:bg-orange-600 transition">Haber Ekle</button>
              </form>
            </div>

            <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#0f172a] border-b pb-3">Yayınlanan Haberler ({newsList.length})</h2>
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                {newsList.map(news => (
                  <div key={news.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-gray-400">{news.date}</span>
                      <h4 className="font-bold text-xs text-[#0f172a]">{news.title}</h4>
                      <p className="text-xs text-gray-600">{news.summary}</p>
                    </div>
                    <button onClick={() => handleDeleteNews(news.id)} className="text-red-500 hover:text-red-700 text-xs font-bold bg-white border px-2.5 py-1 rounded shadow-sm">Sil</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 pb-12">
          <button 
            onClick={handleSaveAll} 
            disabled={saving}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg text-sm disabled:opacity-50"
          >
            {saving ? "Yayınlanıyor..." : "🚀 Tüm Değişiklikleri Kaydet & Yayınla"}
          </button>
        </div>

      </main>

    </div>
  );
}
