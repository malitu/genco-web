"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// Mevcut sorunsuz çalışan Firebase bağlantımızı kullanıyoruz
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
/*  Yapılandırma                                                      */
/* ------------------------------------------------------------------ */

// Firebase yolunu canlı ana sayfamızla birebir eşitledik
const CONTENT_DOC_PATH = ['settings', 'general'];
const MEDIA_COLLECTION = 'siteMedia';
const NEWS_COLLECTION = 'news';
const MAX_IMAGE_SIDE = 1400;
const MAX_IMAGE_CHARS = 900000; // Firestore belge sınırı 1 MB

// Ana sayfadaki değişken isimleriyle (key) birebir aynı olacak şekilde ayarlandı
const CONTENT_SECTIONS = [
  {
    id: 'hero',
    title: 'Manşet (Hero) Alanı',
    description: 'Ana sayfanın en üstündeki başlık ve açıklama.',
    fields: [
      { key: 'heroTitle', label: 'Hero Başlığı', type: 'text' },
      { key: 'heroSub', label: 'Hero Alt Açıklaması', type: 'textarea' },
    ],
  },
  {
    id: 'operations',
    title: 'Aktif Ticaret Yönetimi',
    description: 'Ana sayfadaki operasyonel kutunun metinleri.',
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
  { id: 'content', label: 'Sayfa metinleri' },
  { id: 'media', label: 'Medya kütüphanesi' },
  { id: 'news', label: 'Haberler ve duyurular' },
];

/* ------------------------------------------------------------------ */
/*  Yardımcı fonksiyonlar                                            */
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
    case 'auth/network-request-failed': return 'Ağ bağlantısı kurulamadı. İnternetinizi kontrol edin.';
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
  if (output.length > MAX_IMAGE_CHARS) {
    throw new Error('Görsel çok büyük. Lütfen daha küçük bir dosya seçin.');
  }
  return output;
}

/* ------------------------------------------------------------------ */
/*  Küçük arayüz bileşenleri                                         */
/* ------------------------------------------------------------------ */

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/30';
const primaryButtonClass = 'inline-flex items-center justify-center rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ea580c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] disabled:opacity-60';
const dangerButtonClass = 'inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400';

function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div role="status" aria-live="polite" className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${isError ? 'bg-red-600 text-white' : 'bg-[#0f172a] text-white'}`}>
      {toast.message}
    </div>
  );
}

function FullScreenMessage({ title, text }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-[#0f172a]">{title}</h1>
        {text ? <p className="mt-2 text-sm text-slate-600">{text}</p> : null}
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
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6">
          <div className="h-1 w-10 rounded bg-[#f97316]" />
          <h1 className="mt-4 text-2xl font-bold text-[#0f172a]">GENCO Studio</h1>
          <p className="mt-1 text-sm text-slate-600">Site içeriğini yönetmek için giriş yapın.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">E-posta</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="ad@firma.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Şifre</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Şifreniz" />
          </div>
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <button type="submit" disabled={loading} className={`${primaryButtonClass} w-full`}>
            {loading ? 'Giriş yapılıyor…' : 'Giriş yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sekme: Sayfa metinleri                                           */
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
        if (active) notify('error', 'Metinler yüklenemedi. Yetki ayarlarınızı kontrol edin.');
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
      notify('success', 'Sayfa metinleri başarıyla kaydedildi.');
    } catch (error) {
      notify('error', 'Kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="py-10 text-center text-sm text-slate-500">Metinler yükleniyor…</p>;

  return (
    <div className="space-y-6">
      {CONTENT_SECTIONS.map((section) => (
        <section key={section.id} className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-[#0f172a]">{section.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{section.description}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {section.fields.map((field) => {
              const wide = field.type === 'textarea';
              return (
                <div key={field.key} className={wide ? 'md:col-span-2' : ''}>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea rows={3} value={values[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} className={inputClass} />
                  ) : (
                    <input type="text" value={values[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} className={inputClass} />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <div className="flex justify-end">
        <button type="button" onClick={handleSave} disabled={saving} className={primaryButtonClass}>
          {saving ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sekme: Medya kütüphanesi                                         */
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
        notify('error', `${file.name}: yüklenemedi.`);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (success > 0) notify('success', `${success} görsel yüklendi.`);
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
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); uploadFiles(e.dataTransfer.files); }}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition ${dragging ? 'border-[#f97316] bg-orange-50' : 'border-slate-300 bg-white'}`}
      >
        <p className="text-sm font-medium text-[#0f172a]">Görselleri buraya sürükleyin</p>
        <p className="mt-1 text-xs text-slate-500">Görseller otomatik küçültülür ve sıkıştırılır.</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
        <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={uploading} className={`${primaryButtonClass} mt-4`}>
          {uploading ? 'Yükleniyor…' : 'Bilgisayardan görsel seç'}
        </button>
      </div>

      {mediaItems.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-500">Henüz görsel yok. Yukarıdan ilk görselinizi yükleyin.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mediaItems.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="aspect-video bg-slate-100">
                <img src={item.dataUrl} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-3 flex justify-between items-center">
                <div className="truncate w-3/4">
                  <p className="truncate text-sm font-medium text-[#0f172a]">{item.name}</p>
                  <p className="text-xs text-slate-500">{formatSize(item.size || 0)}</p>
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
/*  Sekme: Haberler                                                  */
/* ------------------------------------------------------------------ */

function NewsTab({ newsItems, notify }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    if (!cleanTitle || !cleanDescription) {
      notify('error', 'Başlık ve açıklama alanlarını doldurun.');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, NEWS_COLLECTION), { title: cleanTitle, description: cleanDescription, createdAt: serverTimestamp() });
      setTitle(''); setDescription('');
      notify('success', 'Haber yayınlandı.');
    } catch (error) {
      notify('error', 'Haber eklenemedi.');
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
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={handleAdd} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2 lg:self-start">
        <h2 className="text-base font-semibold text-[#0f172a]">Yeni haber ekle</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Başlık</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Haber başlığı" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Açıklama</label>
          <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="Haberin içeriği" />
        </div>
        <button type="submit" disabled={saving} className={`${primaryButtonClass} w-full`}>
          {saving ? 'Yayınlanıyor…' : 'Haberi yayınla'}
        </button>
      </form>

      <div className="space-y-3 lg:col-span-3">
        <h2 className="text-base font-semibold text-[#0f172a]">Yayındaki haberler ({newsItems.length})</h2>
        {newsItems.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-500">Henüz haber yok. Soldaki formdan ekleyin.</p>
        ) : (
          newsItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#0f172a]">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
                <button type="button" onClick={() => handleDelete(item)} className={dangerButtonClass}>Sil</button>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{item.description}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ana bileşen                                                      */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
    setLoginLoading(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoginError(authErrorMessage(error));
    } finally {
      setLoginLoading(false);
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

  if (!authReady) return <FullScreenMessage title="GENCO Studio yükleniyor…" />;
  if (!user) return <LoginScreen onLogin={handleLogin} loading={loginLoading} error={loginError} />;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-[#0f172a] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1.5 rounded bg-[#f97316]" aria-hidden="true" />
            <div>
              <h1 className="text-lg font-bold leading-tight">GENCO Studio</h1>
              <p className="text-xs text-slate-300">İçerik yönetim paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-300 sm:inline">{user.email}</span>
            <button type="button" onClick={handleLogout} className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800">Çıkış yap</button>
          </div>
        </div>

        <nav className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="-mb-px flex gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const selected = tab.id === currentTab.id;
              return (
                <li key={tab.id}>
                  <button onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${selected ? 'border-[#f97316] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {currentTab.id === 'content' && <ContentTab notify={notify} />}
        {currentTab.id === 'media' && <MediaTab mediaItems={mediaItems} notify={notify} />}
        {currentTab.id === 'news' && <NewsTab newsItems={newsItems} notify={notify} />}
      </main>

      <Toast toast={toast} />
    </div>
  );
}
