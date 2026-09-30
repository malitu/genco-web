"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { db, auth } from "../../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

/* ------------------------------------------------------------------ */
/*  Yapılandırma & Canlı Site Eşleşmesi                               */
/* ------------------------------------------------------------------ */

// Ana sayfamızın (`src/app/page.jsx`) okuduğu veritabanı yolu ile birebir eşleştirildi
const CONTENT_DOC_PATH = ['settings', 'general'];
const MEDIA_COLLECTION = 'siteMedia';
const NEWS_COLLECTION = 'news';
const MAX_IMAGE_SIDE = 1400;
const MAX_IMAGE_CHARS = 900000;

// Canlı sitemizin kullandığı tam değişken isimleriyle (key) uyumlu hale getirildi
const CONTENT_SECTIONS = [
  {
    id: 'hero',
    title: 'Manşet (Hero) Alanı',
    description: 'Ana sayfanın en üstündeki başlık ve alt açıklama metinleri.',
    fields: [
      { key: 'heroTitle', label: 'Ana Başlık (Hero Title)', type: 'text' },
      { key: 'heroSub', label: 'Alt Açıklama (Hero Subtitle)', type: 'textarea' },
    ],
  },
  {
    id: 'operations',
    title: 'Aktif Ticaret Yönetimi',
    description: 'Manşet yanında yer alan operasyonel kutunun metinleri.',
    fields: [
      { key: 'mgmtTitle', label: 'Kutu Başlığı', type: 'text' },
      { key: 'mgmtDesc', label: 'Kutu Açıklaması', type: 'textarea' },
    ],
  },
  {
    id: 'industries',
    title: 'Sektörler Bölümü',
    description: 'Ana sayfadaki sektörler alanının başlık ve açıklaması.',
    fields: [
      { key: 'indTitle', label: 'Sektörler Başlığı', type: 'text' },
      { key: 'indDesc', label: 'Sektörler Açıklaması', type: 'textarea' },
    ],
  }
];

const ALL_FIELD_KEYS = CONTENT_SECTIONS.flatMap((section) =>
  section.fields.map((field) => field.key)
);

const TABS = [
  { id: 'content', label: 'Sayfa Metinleri' },
  { id: 'media', label: 'Medya Kütüphanesi' },
  { id: 'news', label: 'Haberler & Duyurular' },
];

/* ------------------------------------------------------------------ */
/*  Yardımcı Fonksiyonlar                                            */
/* ------------------------------------------------------------------ */

function authErrorMessage(error) {
  const code = error && error.code ? error.code : '';
  switch (code) {
    case 'auth/invalid-email': return 'E-posta adresi geçersiz.';
    case 'auth/user-disabled': return 'Bu hesap devre dışı bırakılmış.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'E-posta veya şifre hatalı.';
    case 'auth/too-many-requests': return 'Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
    case 'auth/network-request-failed': return 'Ağ bağlantısı kurulamadı.';
    default: return 'Giriş yapılamadı. Bilgilerinizi kontrol edip tekrar deneyin.';
  }
}

function formatDate(value) {
  try {
    if (value && typeof value.toDate === 'function') {
      return value.toDate().toLocaleDateString('tr-TR', {
        day: '2-digit', month: 'long', year: 'numeric',
      });
    }
  } catch (error) {}
  return 'Az önce';
}

function formatSize(chars) {
  const kb = Math.round((chars * 0.75) / 1024);
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Görsel açılamadı.'));
    img.src = src;
  });
}

async function compressImage(file) {
  const source = await readFileAsDataUrl(file);
  const img = await loadImage(source);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Tarayıcı görsel işlemeyi desteklemiyor.');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  let quality = 0.85;
  let output = canvas.toDataURL('image/jpeg', quality);
  while (output.length > MAX_IMAGE_CHARS && quality > 0.3) {
    quality -= 0.1;
    output = canvas.toDataURL('image/jpeg', quality);
  }
  return output;
}

/* ------------------------------------------------------------------ */
/*  Arayüz Bileşenleri                                               */
/* ------------------------------------------------------------------ */

const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/30';
const primaryButtonClass = 'inline-flex items-center justify-center rounded-xl bg-[#f97316] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ea580c] focus:outline-none shadow-md disabled:opacity-60';
const dangerButtonClass = 'inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50';

function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div role="status" aria-live="polite" className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-xl px-5 py-4 text-sm font-bold shadow-2xl ${isError ? 'bg-red-600 text-white' : 'bg-[#0f172a] text-white'}`}>
      {toast.message}
    </div>
  );
}

function FullScreenMessage({ title }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h1 className="text-sm font-mono text-slate-300">{title}</h1>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, loading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(email.trim(), password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-100">
        <div className="mb-8 text-center">
          <span className="bg-[#f97316] text-white font-bold text-xs px-3 py-1 rounded-full">STUDIO GİRİŞİ</span>
          <h1 className="mt-3 text-2xl font-bold text-[#0f172a]">GENCO Studio</h1>
          <p className="mt-1 text-xs text-slate-500">Yönetim paneline erişmek için giriş yapın.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">E-posta</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="ad@gencotr.com" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Şifre</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
          </div>
          {error ? <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 text-center">{error}</p> : null}
          <button type="submit" disabled={loading} className={`${primaryButtonClass} w-full mt-2`}>
            {loading ? 'Giriş yapılıyor…' : 'Sisteme Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sekme: Sayfa Metinleri                                           */
/* ------------------------------------------------------------------ */

function ContentTab({ notify }) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const snap = await getDoc(doc(db, CONTENT_DOC_PATH[0], CONTENT_DOC_PATH[1]));
        if (!active) return;
        const data = snap.exists() ? snap.data() : {};
        const next = {};
        ALL_FIELD_KEYS.forEach((key) => {
          next[key] = typeof data[key] === 'string' ? data[key] : '';
        });
        setValues(next);
      } catch (error) {
        if (active) notify('error', 'Metinler yüklenemedi.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [notify]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, CONTENT_DOC_PATH[0], CONTENT_DOC_PATH[1]), { ...values, updatedAt: serverTimestamp() }, { merge: true });
      notify('success', 'Değişiklikler kaydedildi ve canlı siteye yansıtıldı!');
    } catch (error) {
      notify('error', 'Kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="py-20 text-center text-sm font-mono text-slate-500">İçerikler yükleniyor…</p>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {CONTENT_SECTIONS.map((section) => (
        <section key={section.id} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#0f172a]">{section.title}</h2>
          <p className="mt-1 text-xs text-slate-500">{section.description}</p>
          <div className="mt-6 space-y-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea rows={3} value={values[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} className={inputClass} />
                ) : (
                  <input type="text" value={values[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} className={inputClass} />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
      <div className="flex justify-end pb-12">
        <button type="button" onClick={handleSave} disabled={saving} className={primaryButtonClass}>
          {saving ? 'Yayınlanıyor…' : '🚀 Kaydet & Yayınla'}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sekme: Medya Kütüphanesi                                         */
/* ------------------------------------------------------------------ */

function MediaTab({ mediaItems, notify }) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) {
      notify('error', 'Lütfen görsel dosyası seçin (JPG, PNG, WebP).');
      return;
    }
    setUploading(true);
    let success = 0;
    for (const file of files) {
      try {
        const dataUrl = await compressImage(file);
        await addDoc(collection(db, MEDIA_COLLECTION), {
          name: file.name, dataUrl, size: dataUrl.length, createdAt: serverTimestamp(),
        });
        success += 1;
      } catch (error) {
        notify('error', `${file.name} yüklenemedi.`);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (success > 0) notify('success', `${success} görsel başarıyla yüklendi.`);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`"${item.name}" görselini silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteDoc(doc(db, MEDIA_COLLECTION, item.id));
      notify('success', 'Görsel silindi.');
    } catch (error) {
      notify('error', 'Görsel silinemedi.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); uploadFiles(e.dataTransfer.files); }}
        className={`rounded-2xl border-2 border-dashed p-10 text-center transition ${dragging ? 'border-[#f97316] bg-orange-50' : 'border-slate-300 bg-white'}`}
      >
        <p className="text-sm font-bold text-[#0f172a]">Görselleri buraya sürükleyip bırakın</p>
        <p className="mt-1 text-xs text-slate-500">Seçtiğiniz fotoğraflar otomatik olarak optimize edilir.</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
        <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={uploading} className={`${primaryButtonClass} mt-4`}>
          {uploading ? 'Yükleniyor…' : 'Bilgisayardan Görsel Seç'}
        </button>
      </div>

      {mediaItems.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">Henüz medya görseli bulunmuyor.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mediaItems.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
              <div className="aspect-video bg-slate-100">
                <img src={item.dataUrl} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4 flex justify-between items-center bg-slate-50 border-t">
                <div className="truncate pr-2">
                  <p className="truncate text-xs font-bold text-[#0f172a]">{item.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{formatSize(item.size || 0)}</p>
                </div>
                <button type="button" onClick={() => handleDelete(item)} className={dangerButtonClass}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sekme: Haberler & Duyurular                                      */
/* ------------------------------------------------------------------ */

function NewsTab({ newsItems, notify }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (event) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      notify('error', 'Lütfen başlık ve açıklama alanlarını doldurun.');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, NEWS_COLLECTION), { title: title.trim(), description: description.trim(), createdAt: serverTimestamp() });
      setTitle(''); setDescription('');
      notify('success', 'Haber başarıyla yayınlandı.');
    } catch (error) {
      notify('error', 'Haber yayınlanamadı.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`"${item.title}" haberini silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteDoc(doc(db, NEWS_COLLECTION, item.id));
      notify('success', 'Haber silindi.');
    } catch (error) {
      notify('error', 'Haber silinemedi.');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5 max-w-6xl mx-auto">
      <form onSubmit={handleAdd} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 lg:col-span-2 lg:self-start shadow-sm">
        <h2 className="text-base font-bold text-[#0f172a] border-b pb-3">Yeni Haber / Duyuru Ekle</h2>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Başlık</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Haber başlığı yazın..." />
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Açıklama / İçerik</label>
          <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="Haber detaylarını girin..." />
        </div>
        <button type="submit" disabled={saving} className={`${primaryButtonClass} w-full`}>
          {saving ? 'Yayınlanıyor…' : 'Haberi Yayınla'}
        </button>
      </form>

      <div className="space-y-4 lg:col-span-3">
        <h2 className="text-base font-bold text-[#0f172a]">Yayındaki Haberler ({newsItems.length})</h2>
        {newsItems.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">Henüz yayınlanmış bir haber bulunmuyor.</p>
        ) : (
          newsItems.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#0f172a]">{item.title}</h3>
                  <p className="mt-1 text-[11px] font-mono text-slate-400">{formatDate(item.createdAt)}</p>
                </div>
                <button type="button" onClick={() => handleDelete(item)} className={dangerButtonClass}>Sil</button>
              </div>
              <p className="mt-4 whitespace-pre-line text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ana Bileşen                                                      */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [mediaItems, setMediaItems] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [toast, setToast] = useState(null);

  const notify = useCallback((type, message) => {
    setToast({ type, message, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubMedia = onSnapshot(query(collection(db, MEDIA_COLLECTION), orderBy('createdAt', 'desc')), (snapshot) => {
      setMediaItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    const unsubNews = onSnapshot(query(collection(db, NEWS_COLLECTION), orderBy('createdAt', 'desc')), (snapshot) => {
      setNewsItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    return () => { unsubMedia(); unsubNews(); };
  }, [user]);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMediaItems([]);
      setNewsItems([]);
    } catch (error) {
      notify('error', 'Çıkış yapılamadı.');
    }
  };

  const currentTab = useMemo(() => TABS.find((tab) => tab.id === activeTab) || TABS[0], [activeTab]);

  if (!authReady) return <FullScreenMessage title="GENCO Studio Yükleniyor…" />;
  if (!user) return <LoginScreen onLogin={handleLogin} error={null} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <header className="bg-[#0f172a] text-white sticky top-0 z-40 shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-7 w-1.5 rounded-full bg-[#f97316]" aria-hidden="true" />
            <div>
              <h1 className="text-base font-bold leading-tight">GENCO Studio</h1>
              <p className="text-[11px] text-slate-400 font-mono">Modern İçerik Yönetimi</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-xs font-semibold text-slate-300 hover:text-white transition">Canlı Siteye Git ↗</a>
            <button type="button" onClick={handleLogout} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700">Çıkış Yap</button>
          </div>
        </div>

        <nav className="mx-auto max-w-6xl px-6 border-t border-slate-800">
          <ul className="flex gap-2 -mb-px">
            {TABS.map((tab) => {
              const selected = tab.id === currentTab.id;
              return (
                <li key={tab.id}>
                  <button onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap border-b-2 px-5 py-3.5 text-xs font-bold transition ${selected ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-slate-400 hover:text-white'}`}>
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {currentTab.id === 'content' && <ContentTab notify={notify} />}
        {currentTab.id === 'media' && <MediaTab mediaItems={mediaItems} notify={notify} />}
        {currentTab.id === 'news' && <NewsTab newsItems={newsItems} notify={notify} />}
      </main>

      <Toast toast={toast} />
    </div>
  );
}
