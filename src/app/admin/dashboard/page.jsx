"use client";
import { useState, useEffect } from "react";
import { db, storage } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AdminDashboard() {
  const [heroTitle, setHeroTitle] = useState("Türkiye'deki Uluslararası Ticaret Ekibiniz");
  const [heroSub, setHeroSub] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const handleSave = async () => {
    try {
      let logoUrl = "/logo.png";
      
      // Eğer yeni logo yüklendiyse Storage'a at
      if (logoFile) {
        const logoRef = ref(storage, "site-assets/logo.png");
        await uploadBytes(logoRef, logoFile);
        logoUrl = await getDownloadURL(logoRef);
      }

      // Veritabanını güncelle
      await setDoc(doc(db, "settings", "general"), {
        heroTitle,
        heroSub,
        logoUrl
      });
      alert("Site başarıyla güncellendi!");
    } catch (error) {
      console.error(error);
      alert("Kayıt sırasında hata oluştu. Firebase ayarlarınızı kontrol edin.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#0f172a] text-white p-6">
        <h2 className="font-bold text-xl mb-8">GENCO YÖNETİM</h2>
        <nav className="space-y-4">
          <a href="#" className="block text-[#f97316] font-bold">Genel Ayarlar</a>
          <a href="#" className="block hover:text-gray-300">Hizmet Sayfaları</a>
          <a href="#" className="block hover:text-gray-300">Trade Intelligence (Blog)</a>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <div className="bg-white p-8 rounded shadow-sm max-w-3xl">
          <h1 className="text-2xl font-bold mb-6">Site Genel Ayarları</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Logo Yükle</label>
            <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} className="border p-2 w-full" />
            <p className="text-xs text-gray-500 mt-1">Önerilen format: Şeffaf PNG veya SVG.</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Ana Sayfa Başlığı (H1)</label>
            <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="border p-3 w-full rounded" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Ana Sayfa Alt Metni</label>
            <textarea rows="3" value={heroSub} onChange={(e) => setHeroSub(e.target.value)} className="border p-3 w-full rounded"></textarea>
          </div>

          <button onClick={handleSave} className="bg-[#f97316] text-white px-6 py-3 font-bold rounded">
            Değişiklikleri Yayına Al
          </button>
        </div>
      </main>
    </div>
  );
}
