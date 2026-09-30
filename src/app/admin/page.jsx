"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function GencoCleanAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Yönetilebilir Site Metinleri (Canlı sitemizin birebir alanları)
  const [formData, setFormData] = useState({
    heroTitle: "Türkiye'deki Uluslararası Ticaret Ekibiniz",
    heroSub: "Sadece dış ticaret danışmanlığı sunmuyoruz. Fırsatları araştırıyor, doğru uluslararası partnerleri buluyor ve tüm ticari operasyonu sizin adınıza bizzat yönetiyoruz.",
    mgmtTitle: "Masada ve Sahada Doğrudan Operasyon",
    mgmtDesc: "Jenerik pazar araştırmalarıyla vakit kaybetmiyoruz. Tescilli ticaret istihbarat altyapılarımızı kullanarak doğrudan karar vericilere ulaşıyor; demir çelikten medikal, denizcilik ve femtech projelerine kadar teknik standartları bizzat yönetiyoruz.",
    indTitle: "Ağırlıklı Çalıştığımız Sektörler",
    indDesc: "Derinlemesine ağa ve teknik bilgiye sahip olduğumuz ana alanların yanı sıra, esnek metodolojimizle her sektörde uluslararası ticaret operasyonu yönetebiliyoruz."
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.log("Firebase verisi bekleniyor.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAndPublish = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await setDoc(doc(db, "settings", "general"), formData, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-mono">GENCO Admin Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-sans p-6">
        <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <span className="bg-[#f97316] text-white font-bold text-xs px-3 py-1 rounded-full">GÜVENLİ ERİŞİM</span>
            <h1 className="text-2xl font-bold text-[#0f172a] mt-3">GENCO Admin Giriş</h1>
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
      
      {/* ÜST MENÜ */}
      <header className="bg-[#0f172a] text-white border-b border-gray-800 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <span className="bg-[#f97316] text-white font-bold text-xs px-3 py-1 rounded">GENCO ADMIN</span>
          <span className="font-bold text-sm">İçerik ve Metin Yönetim Paneli</span>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold">
          <button onClick={handleLogout} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition">
            🔒 Çıkış Yap
          </button>
          <a href="/" target="_blank" className="bg-slate-800 text-gray-200 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-700 transition">
            Canlı Siteyi Gör ↗
          </a>
          <button 
            onClick={handleSaveAndPublish} 
            disabled={saving}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-md disabled:opacity-50"
          >
            {saving ? "Yayınlanıyor..." : "🚀 Kaydet & Yayınla"}
          </button>
        </div>
      </header>

      {success && (
        <div className="max-w-4xl mx-auto w-full px-8 mt-6">
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-xs font-semibold shadow-sm text-center">
            ✓ Değişiklikler başarıyla Firebase'e kaydedildi ve canlı siteye yansıtıldı!
          </div>
        </div>
      )}

      {/* İÇERİK FORMU */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-8 space-y-8">
        
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-[#0f172a]">Ana Sayfa - Manşet (Hero) Alanı</h2>
            <p className="text-xs text-gray-500 mt-1">Sitenin en üst kısmında yer alan ana başlık ve açıklama metinleri.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ana Başlık (Hero Title)</label>
              <textarea 
                rows="2" 
                value={formData.heroTitle} 
                onChange={(e) => handleChange("heroTitle", e.target.value)} 
                className="w-full border border-gray-300 p-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#f97316]" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Alt Açıklama (Hero Subtitle)</label>
              <textarea 
                rows="3" 
                value={formData.heroSub} 
                onChange={(e) => handleChange("heroSub", e.target.value)} 
                className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#f97316]" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-[#0f172a]">Aktif Ticaret Yönetimi Kutusu</h2>
            <p className="text-xs text-gray-500 mt-1">Manşet yanında yer alan koyu renkli operasyonel yönetim kutusu.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Kutulama Başlığı</label>
              <input 
                type="text" 
                value={formData.mgmtTitle} 
                onChange={(e) => handleChange("mgmtTitle", e.target.value)} 
                className="w-full border border-gray-300 p-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#f97316]" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Kutulama Açıklaması</label>
              <textarea 
                rows="3" 
                value={formData.mgmtDesc} 
                onChange={(e) => handleChange("mgmtDesc", e.target.value)} 
                className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#f97316]" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-[#0f172a]">Sektörler Bölümü Başlığı</h2>
            <p className="text-xs text-gray-500 mt-1">Ana sayfadaki sektörler alanının başlık ve açıklaması.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sektörler Başlığı</label>
              <input 
                type="text" 
                value={formData.indTitle} 
                onChange={(e) => handleChange("indTitle", e.target.value)} 
                className="w-full border border-gray-300 p-3.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#f97316]" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sektörler Açıklaması</label>
              <textarea 
                rows="2" 
                value={formData.indDesc} 
                onChange={(e) => handleChange("indDesc", e.target.value)} 
                className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#f97316]" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-12">
          <button 
            onClick={handleSaveAndPublish} 
            disabled={saving}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg text-sm disabled:opacity-55"
          >
            {saving ? "Yayınlanıyor..." : "🚀 Değişiklikleri Kaydet & Yayınla"}
          </button>
        </div>

      </main>

    </div>
  );
}
