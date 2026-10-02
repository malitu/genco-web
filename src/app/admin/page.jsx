"use client";

/**
 * GENCO Visual Studio
 * ---------------------------------------------------------------------------
 * Wix benzeri, tam ekran görsel içerik & sayfa tasarım stüdyosu.
 *
 * Tasarım ilkeleri
 *  - Taslak (draft) ve Yayın (production) kesin olarak ayrıdır. Yapılan hiçbir
 *    değişiklik "🚀 Kaydet & Yayınla" butonuna basılana kadar Firebase'e yazılmaz.
 *  - Tuval, canlı sitede kullanılan <GencoBlocks /> bileşenini birebir render
 *    eder; böylece önizleme ile yayın sonucu arasında fark oluşmaz.
 *  - Metinler contentEditable ile doğrudan yerinde düzenlenir.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { db, storage, auth } from "../../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import GencoBlocks, {
  BLOCK_LIBRARY,
  DEFAULT_SITE_BLOCKS,
  getBlockDef,
  normaliseBlock,
  L,
} from "../../components/GencoBlocks";
import HomePage from "../../components/HomePage";

const STUDIO_DOC = ["settings", "genco_studio"];

/* Canonical page keys. Kept identical to the previous studio so any content
   already saved in Firestore keeps loading. */
const PAGES = [
  { id: "home", label: "Ana Sayfa", live: true },
  { id: "services", label: "Hizmetler" },
  { id: "industries", label: "Sektörler" },
  { id: "caseStudies", label: "Vaka Analizleri" },
  { id: "insights", label: "Trade Intelligence" },
  { id: "about", label: "Hakkımızda" },
];

// Ana sayfa şablonu GencoBlocks içinde tanımlıdır (DEFAULT_SITE_BLOCKS).
// Böylece canlı site ile stüdyo aynı varsayılan içeriği kullanır.
const DEFAULT_PAGES = {
  home: DEFAULT_SITE_BLOCKS,
  services: [],
  industries: [],
  caseStudies: [],
  insights: [],
  about: [],
};

const DEFAULT_MEDIA = [{ id: "seed_logo", name: "GENCO Logo", url: "/logo.png" }];

/**
 * Eski (tek dilli) kayıtları iki dilli şablona taşır.
 *
 * Veritabanındaki eski bloklarda metinler düz string olarak durur. Bu
 * fonksiyon o düz metni, şablondaki TR/EN karşılıklarıyla birleştirir:
 *   • Alan zaten {tr,en} ise olduğu gibi korunur.
 *   • Alan düz metinse ve şablonda İngilizcesi varsa {tr: eski, en: şablon}
 *     hâline getirilir — eski Türkçe içerik kaybolmaz.
 *   • Şablonda karşılığı yoksa yalnızca TR'si doldurulur.
 */
function mergeLegacyBlock(template, saved) {
  const out = { ...template };
  if (!saved || typeof saved !== "object") return out;

  for (const key of Object.keys(template)) {
    if (key === "id" || key === "type") continue;

    const tplVal = template[key];
    const savedVal = saved[key];

    // Dizi alanlar (link, item, kart) her zaman şablondan gelir; eski
    // dizilerde dil çifti olmadığı için içerik kaybına yol açmasın.
    if (Array.isArray(tplVal)) continue;
    if (typeof tplVal === "object" && tplVal !== null) continue;
    if (typeof tplVal !== "string") continue;

    if (savedVal && typeof savedVal === "object") {
      out[key] = savedVal; // zaten iki dilli
    } else if (typeof savedVal === "string" && savedVal.trim()) {
      out[key] = { tr: savedVal, en: tplVal };
    }
  }

  // Kayıttaki kimlik korunur ki seçim/silme doğru çalışsın.
  if (saved.id) out.id = saved.id;
  return out;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const VIEWPORTS = {
  desktop: { label: "Masaüstü", width: "100%", zoom: 1 },
  tablet: { label: "Tablet", width: "820px", zoom: 0.8 },
  mobile: { label: "Mobil", width: "420px", zoom: 0.62 },
};

function isDirtyOf(a = {}, b = {}) {
  return JSON.stringify(a) !== JSON.stringify(b);
}

function authErrorMessage(error) {
  const code = error?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "E-posta adresi geçersiz.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-posta veya şifre hatalı.";
    case "auth/user-disabled":
      return "Bu hesap devre dışı bırakılmış.";
    case "auth/too-many-requests":
      return "Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.";
    case "auth/network-request-failed":
      return "Ağ bağlantısı kurulamadı.";
    default:
      return "Giriş yapılamadı. Bilgilerinizi kontrol edip tekrar deneyin.";
  }
}

/** Client-side downscale so we never push a huge blob into Firestore. */
function fileToDataUrl(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.onload = () => {
      const dataUrl = reader.result;
      if (!file.type || !file.type.startsWith("image/")) {
        resolve({ dataUrl, blob: file });
        return;
      }
      const img = new Image();
      img.onerror = () => resolve({ dataUrl, blob: file });
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const out = canvas.toDataURL("image/jpeg", quality);
        resolve({ dataUrl: out, blob: file });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* -------------------------------------------------------------------------- */
/*  Small presentational pieces                                               */
/* -------------------------------------------------------------------------- */

function Button({ children, onClick, tone = "slate", size = "md", className, type, disabled, title }) {
  const tones = {
    slate: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    dark: "bg-genco-ink text-white border border-genco-ink hover:bg-slate-800",
    flame: "bg-genco-flame text-white border border-genco-flame hover:bg-orange-600",
    ghost: "bg-transparent text-slate-500 border border-transparent hover:bg-slate-100",
    danger: "bg-red-600 text-white border border-red-600 hover:bg-red-700",
  };
  const sizes = { sm: "px-2.5 py-1.5 text-[11px]", md: "px-3.5 py-2 text-xs" };
  return (
    <button
      type={type || "button"}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed",
        tones[tone],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function GencoStudioAdmin() {
  /* --- auth ------------------------------------------------------------- */
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  /* --- content ---------------------------------------------------------- */
  const [published, setPublished] = useState(DEFAULT_PAGES);
  const [draft, setDraft] = useState(DEFAULT_PAGES);
  const [media, setMedia] = useState(DEFAULT_MEDIA);

  /* --- ui --------------------------------------------------------------- */
  const [activePage, setActivePage] = useState("home");
  const [selectedId, setSelectedId] = useState(null);
  const [leftTab, setLeftTab] = useState("blocks");
  const [viewport, setViewport] = useState("desktop");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Tuvalde düzenlenen dil. Her metin iki dilli olduğu için TR ve EN'yi
  // ayrı ayrı yazabilirsiniz.
  const [editLang, setEditLang] = useState("TR");

  const fileInputRef = useRef(null);
  const toastTimer = useRef(null);

  const flash = useCallback((message, tone = "ok") => {
    setToast({ message, tone });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* --- Firebase Auth ------------------------------------------------------ */
  useEffect(() => {
    // Firebase varsayılan olarak oturumu tarayıcıda saklar; bu durumda
    // kullanıcı sonraki açılışlarda şifre girmeden panele girerdi.
    // Her açılışta şifre sorulsun diye sayfa yüklenir yüklenmez mevcut
    // oturum kapatılır.
    if (auth.currentUser) {
      signOut(auth).catch((e) => console.error("Oturum kapatılamadı:", e));
    }
  }, []);

  useEffect(() => {
    // onAuthStateChanged hem sayfa yüklenirken hem de giriş/çıkışta çalışır.
    // setUser her zaman güncel kullanıcıyı yazmalıdır; aksi halde başarılı
    // giriş sonrasında panel hiç açılmaz.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setReady(true);
    });
    return () => unsubscribe();
  }, []);

  /* --- initial load ----------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, ...STUDIO_DOC));
        if (!cancelled && snap.exists()) {
          const data = snap.data() || {};
          if (data.pagesContent) {
            const normalised = {};
            Object.keys(data.pagesContent).forEach((key) => {
              const list = data.pagesContent[key];
              normalised[key] = Array.isArray(list)
                ? list.map((b, i) => normaliseBlock(b, i))
                : [];
            });
            // Ana sayfada kayıtlı blok YOKSA tam şablonu kullan. Kayıtlı
            // bloklar eski (tek dilli) formatta olabileceği için, yalnızca
            // "hero" varsa bu eksik kabul edilir ve şablon uygulanır; böylece
            // menü, sektörler, ticari hedef, farkımız ve footer de panelde
            // düzenlenebilir olur.
            const hasFullPage =
              (normalised.home || []).filter((b) => b.type !== "hero").length > 0;

            if (hasFullPage) {
              setPublished(normalised);
              setDraft(normalised);
            } else {
              // Yayınlanmış sürüm varsa onu koru, yoksa şablonu kullan.
              // Eski (tek dilli) kayıtlar iki dillileştirilir: düz metin
              // alanlar, içinde TR ve EN bulunan bir alana dönüştürülür.
              // Böylece eski içerik korunur ve İngilizce karşılıklar da gelir.
              const fallback = { ...DEFAULT_PAGES };
              // Ham (normalize edilmemiş) kayıt kullanılır; aksi halde eski
              // düz metin şablona karışır ve iki dillileştirme gerçekleşmez.
              const rawHome = Array.isArray(data.pagesContent.home)
                ? data.pagesContent.home
                : [];
              if (rawHome.length) {
                fallback.home = DEFAULT_SITE_BLOCKS.map((base) => {
                  const saved = rawHome.find(
                    (b) => (b?.type || "textBlock") === base.type
                  );
                  return saved ? mergeLegacyBlock(base, saved) : base;
                });
              }
              setPublished(fallback);
              setDraft(fallback);
            }
          }
          if (Array.isArray(data.mediaLibrary) && data.mediaLibrary.length) {
            setMedia(data.mediaLibrary);
          }
        }
      } catch (e) {
        console.error("Studio yüklenemedi:", e);
        flash(
          "Firebase'e ulaşılamadı. Varsayılan taslakla çalışıyorsunuz; yayınlama başarısız olabilir.",
          "warn"
        );
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [flash]);

  /* --- derived ---------------------------------------------------------- */
  const blocks = useMemo(() => {
    const list = draft[activePage] || [];
    return list.map((b, i) => (b.__index !== undefined ? b : normaliseBlock(b, i)));
  }, [draft, activePage]);

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedId) || null,
    [blocks, selectedId]
  );

  const dirty = isDirtyOf(draft, published);
  const activePageMeta = PAGES.find((p) => p.id === activePage);

  /* --- auth actions ----------------------------------------------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("E-posta ve şifre alanlarını doldurun.");
      return;
    }
    setLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      setLoginPassword("");
    } catch (error) {
      console.error("Giriş hatası:", error);
      setLoginError(authErrorMessage(error));
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Çıkış hatası:", error);
      flash("Çıkış yapılamadı.", "error");
    }
  };

  /* --- draft mutations (NEVER touch Firestore here) --------------------- */
  const commit = useCallback(
    (updater) => {
      setDraft((prev) => {
        const current = prev[activePage] || [];
        return { ...prev, [activePage]: updater(current) };
      });
    },
    [activePage]
  );

  const handleChangeField = useCallback(
    (id, field, value) => {
      commit((current) =>
        current.map((b) => (b.id === id ? { ...b, [field]: value } : b))
      );
    },
    [commit]
  );

  const addBlock = useCallback(
    (type) => {
      const def = getBlockDef(type);
      if (!def) return;
      const block = def.create();
      commit((current) => [...current, block]);
      setSelectedId(block.id);
      flash(`${def.label} bloğu eklendi.`);
    },
    [commit, flash]
  );

  const deleteBlock = useCallback(
    (id) => {
      commit((current) => current.filter((b) => b.id !== id));
      setSelectedId((prev) => (prev === id ? null : prev));
      flash("Blok sayfadan kaldırıldı.", "warn");
    },
    [commit, flash]
  );

  const moveBlock = useCallback(
    (id, dir) => {
      commit((current) => {
        const i = current.findIndex((b) => b.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= current.length) return current;
        const next = [...current];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
    },
    [commit]
  );

  const duplicateBlock = useCallback(
    (id) => {
      commit((current) => {
        const i = current.findIndex((b) => b.id === id);
        if (i < 0) return current;
        const clone = {
          ...current[i],
          id: `${current[i].id}_copy_${Math.random().toString(36).slice(2, 6)}`,
        };
        return [...current.slice(0, i + 1), clone, ...current.slice(i + 1)];
      });
    },
    [commit]
  );

  const revert = useCallback(() => {
    setDraft(published);
    setSelectedId(null);
    flash("Taslak, yayınlanmış sürüme geri alındı.", "warn");
  }, [published, flash]);

  /* --- media ------------------------------------------------------------ */
  const handleFiles = async (files) => {
    const list = Array.from(files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!list.length) return;

    setUploading(true);
    const added = [];

    for (const file of list) {
      try {
        const { dataUrl } = await fileToDataUrl(file);
        let url = dataUrl;
        let stored = false;

        // Prefer Firebase Storage; fall back to an inline data URL if the
        // bucket is not enabled or security rules reject the write.
        try {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const uploaded = await uploadBytes(
            storageRef(storage, `genco-media/${Date.now()}_${safeName}`),
            file,
            { contentType: file.type }
          );
          url = await getDownloadURL(uploaded);
          stored = true;
        } catch (storageErr) {
          console.warn("Storage yüklemesi başarısız, data URL kullanılıyor:", storageErr);
        }

        added.push({
          id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          url,
          stored,
        });
      } catch (e) {
        console.error("Görsel işlenemedi:", e);
      }
    }

    if (added.length) {
      setMedia((prev) => [...prev, ...added]);
      const inline = added.filter((m) => !m.stored).length;
      flash(
        inline
          ? `${added.length} görsel eklendi. ${inline} tanesi Storage'a yüklenemediği için belgeye gömüldü (Firestore 1 MB sınırına dikkat).`
          : `${added.length} görsel kütüphaneye eklendi.`,
        inline ? "warn" : "ok"
      );
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addMediaByUrl = () => {
    const url = window.prompt("Görsel URL'sini yapıştırın:");
    if (!url) return;
    const name = window.prompt("Görsel adı:", "Yeni görsel") || "Yeni görsel";
    setMedia((prev) => [
      ...prev,
      { id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name, url, stored: true },
    ]);
  };

  const assignMedia = (url) => {
    if (!selectedBlock) {
      flash("Önce tuvalden bir blok seçin.", "warn");
      return;
    }
    if (selectedBlock.type === "slider") {
      const images = selectedBlock.images || [];
      if (images.includes(url)) {
        flash("Bu görsel zaten bu galeride.", "warn");
        return;
      }
      handleChangeField(selectedBlock.id, "images", [...images, url]);
      flash("Görsel galeriye eklendi.");
    } else {
      handleChangeField(selectedBlock.id, "image", url);
      flash("Görsel bloğa atandı.");
    }
  };

  const removeMedia = (id) => {
    const target = media.find((m) => m.id === id);
    if (!target) return;
    setMedia((prev) => prev.filter((m) => m.id !== id));
    // Detach from any block still referencing it.
    setDraft((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = (next[key] || []).map((b) => {
          let changed = false;
          let copy = b;
          if (b.image === target.url) {
            copy = { ...copy, image: "" };
            changed = true;
          }
          if (Array.isArray(copy.images) && copy.images.includes(target.url)) {
            copy = { ...copy, images: copy.images.filter((u) => u !== target.url) };
            changed = true;
          }
          return changed ? copy : b;
        });
      });
      return next;
    });
  };

  const removeImageFromBlock = (url) => {
    if (!selectedBlock || selectedBlock.type !== "slider") return;
    handleChangeField(
      selectedBlock.id,
      "images",
      (selectedBlock.images || []).filter((u) => u !== url)
    );
  };

  /* --- publish ---------------------------------------------------------- */
  const publish = async () => {
    setSaving(true);
    try {
      // __index is an internal render hint; never persist it.
      const payload = Object.fromEntries(
        Object.entries(draft).map(([key, list]) => [
          key,
          (list || []).map(({ __index, ...rest }) => rest),
        ])
      );
      await setDoc(
        doc(db, ...STUDIO_DOC),
        {
          pagesContent: payload,
          mediaLibrary: media,
          publishedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setPublished(draft);
      flash("Yayınlandı! Değişiklikler canlı siteye aktarıldı.");
    } catch (e) {
      console.error("Yayınlama hatası:", e);
      flash(
        "Yayınlanamadı. Firebase kurallarını ve belge boyutunu (1 MB) kontrol edin.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ====================================================================== */
  /*  LOGIN                                                                */
  /* ====================================================================== */
  if (!ready) {
    return (
      <div className="min-h-screen bg-genco-ink text-white flex items-center justify-center font-mono text-sm">
        GENCO Studio yükleniyor…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-genco-ink flex items-center justify-center font-sans p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl border border-gray-100"
        >
          <div className="text-center mb-8">
            <span
              className="text-white font-bold text-xs px-3 py-1 rounded-full"
              style={{ backgroundColor: "#f97316" }}
            >
              GÜVENLİ ERİŞİM
            </span>
            <h1 className="text-2xl font-bold text-genco-ink mt-3">
              GENCO Visual Studio
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Görsel İçerik ve Sayfa Tasarım Stüdyosu
            </p>
          </div>

          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            E-posta
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="admin@gencotr.com"
            className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-genco-flame mb-4"
            autoFocus
          />

          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Şifre
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Şifrenizi girin"
            className="w-full border border-gray-300 p-3.5 rounded-xl text-sm focus:outline-none focus:border-genco-flame"
          />

          {loginError && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold text-center">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            className="genco-login-btn w-full mt-4 text-white p-3.5 font-bold rounded-xl transition shadow-md text-sm"
            style={{ backgroundColor: "#f97316" }}
          >
            {loggingIn ? "Giriş yapılıyor…" : "Stüdyoya Giriş Yap"}
          </button>

          <p className="mt-5 text-[11px] text-gray-400 text-center leading-relaxed">
            Erişim yalnızca Firebase Authentication ile yetkilendirilmiş
            yöneticiler içindir.
          </p>
        </form>
      </div>
    );
  }

  /* ====================================================================== */
  /*  STUDIO                                                               */
  /* ====================================================================== */
  const vp = VIEWPORTS[viewport];

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 text-slate-800 font-sans overflow-hidden">
      {/* ---------------- Top bar ---------------- */}
      <header className="shrink-0 bg-genco-ink text-white border-b border-slate-800">
        <div className="h-14 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="bg-genco-flame text-white font-bold text-[11px] px-2.5 py-1 rounded">
              GENCO STUDIO
            </span>
            <span className="hidden sm:block text-sm font-semibold truncate">
              {activePageMeta?.label}
              {activePageMeta?.live ? (
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  ● canlı sayfaya bağlı
                </span>
              ) : (
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  içerik deposu
                </span>
              )}
            </span>
            {dirty && (
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-1 rounded">
                ● Yayınlanmamış değişiklik
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-0.5">
              {Object.entries(VIEWPORTS).map(([key, v]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setViewport(key)}
                  className={cx(
                    "px-2.5 py-1.5 text-[10px] font-bold rounded-md transition",
                    viewport === key
                      ? "bg-genco-flame text-white"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* Düzenlenen dil — her metin iki dilli olduğu için TR ve EN
                ayrı ayrı yazılabilir. */}
            <div className="flex items-center gap-1 rounded-lg bg-slate-800 p-0.5">
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Dil
              </span>
              {["TR", "EN"].map((code) => (
                <button
                  key={code}
                  type="button"
                  title={
                    code === "TR"
                      ? "Türkçe metinleri düzenliyorsunuz"
                      : "İngilizce metinleri düzenliyorsunuz"
                  }
                  onClick={() => setEditLang(code)}
                  className={cx(
                    "px-2.5 py-1.5 text-[10px] font-bold rounded-md transition",
                    editLang === code
                      ? "bg-genco-flame text-white"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  {code}
                </button>
              ))}
            </div>

            <Button tone="slate" onClick={() => setPreview((p) => !p)}>
              {preview ? "✏️ Düzenlemeye Dön" : "🔍 Önizle"}
            </Button>
            {dirty && (
              <Button tone="ghost" onClick={revert} className="!text-slate-300">
                ↺ Geri Al
              </Button>
            )}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline text-xs font-bold text-slate-300 hover:text-genco-flame transition px-1"
            >
              Canlı Site ↗
            </a>
            <span
              className="hidden lg:inline text-[11px] text-slate-400 truncate max-w-[180px]"
              title={user?.email || ""}
            >
              {user?.email}
            </span>
            <Button tone="ghost" onClick={handleLogout} className="!text-slate-300">
              Çıkış
            </Button>
            <Button tone="flame" onClick={publish} disabled={saving}>
              {saving ? "Yayınlanıyor…" : "🚀 Kaydet & Yayınla"}
            </Button>
          </div>
        </div>

        {toast && (
          <div
            className={cx(
              "px-4 py-2 text-xs font-semibold border-t",
              toast.tone === "error"
                ? "bg-red-950 text-red-200 border-red-900"
                : toast.tone === "warn"
                ? "bg-amber-950 text-amber-200 border-amber-900"
                : "bg-emerald-950 text-emerald-200 border-emerald-900"
            )}
          >
            {toast.message}
          </div>
        )}
      </header>

      {/* ---------------- Body ---------------- */}
      <div className="flex-1 flex overflow-hidden">
        {/* ---------- Left toolbar ---------- */}
        {!preview && (
          <aside className="w-80 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
            <div className="shrink-0 flex border-b border-slate-200">
              {[
                { id: "blocks", label: "Bloklar" },
                { id: "media", label: "Medya" },
                { id: "pages", label: "Sayfalar" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setLeftTab(t.id)}
                  className={cx(
                    "flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition",
                    leftTab === t.id
                      ? "bg-genco-ink text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* ---- BLOCKS ---- */}
              {leftTab === "blocks" && (
                <>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                      Modül Ekle
                    </h3>
                    <div className="space-y-2">
                      {BLOCK_LIBRARY.map((b) => (
                        <button
                          key={b.type}
                          type="button"
                          onClick={() => addBlock(b.type)}
                          className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-genco-flame hover:bg-orange-50/50 transition group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-genco-ink">
                              + {b.label}
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ background: b.accent }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            {b.hint}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                      Sayfa Yapısı ({blocks.length})
                    </h3>
                    {blocks.length === 0 ? (
                      <p className="text-[11px] text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center">
                        Bu sayfa boş. Yukarıdan yeni bir blok ekleyin.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {blocks.map((b, i) => {
                          const def = getBlockDef(b.type);
                          const label =
                            L(b.title, editLang) ||
                            L(b.heading, editLang) ||
                            L(b.badge, editLang) ||
                            def?.label ||
                            b.type;
                          return (
                            <div
                              key={b.id}
                              onClick={() => setSelectedId(b.id)}
                              className={cx(
                                "w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-2 border",
                                selectedId === b.id
                                  ? "bg-orange-50 border-genco-flame text-genco-ink"
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                              )}
                            >
                              <span className="text-[10px] font-mono text-slate-400">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="flex-1 truncate">{label}</span>
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: def?.accent || "#94a3b8" }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {selectedBlock && (
                    <div className="border-t border-slate-200 pt-5">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        Seçili Blok
                      </h3>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
                        <div className="text-xs font-bold text-genco-ink">
                          {getBlockDef(selectedBlock.type)?.label}
                        </div>

                        {selectedBlock.type === "hero" && (
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Görsel
                            </label>
                            {selectedBlock.image ? (
                              <div className="relative">
                                <img
                                  src={selectedBlock.image}
                                  alt=""
                                  className="w-full h-24 object-cover rounded-lg border border-slate-200"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleChangeField(selectedBlock.id, "image", "")
                                  }
                                  className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded"
                                >
                                  Kaldır
                                </button>
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-400">
                                Görsel yok — Medya sekmesinden atayın.
                              </p>
                            )}
                          </div>
                        )}

                        {selectedBlock.type === "slider" && (
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Galeri Görselleri ({selectedBlock.images?.length || 0})
                            </label>
                            {selectedBlock.images?.length ? (
                              <div className="space-y-1.5">
                                {selectedBlock.images.map((url, i) => (
                                  <div
                                    key={url + i}
                                    className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1.5"
                                  >
                                    <img
                                      src={url}
                                      alt=""
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                    <span className="flex-1 text-[10px] text-slate-500 truncate">
                                      Görsel {i + 1}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeImageFromBlock(url)}
                                      className="text-red-500 text-[10px] font-bold px-1"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-400">
                                Galeri boş — Medya sekmesinden ekleyin.
                              </p>
                            )}
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 pt-1">
                              Geçiş Süresi (saniye)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={selectedBlock.interval || 4}
                              onChange={(e) =>
                                handleChangeField(
                                  selectedBlock.id,
                                  "interval",
                                  Number(e.target.value) || 4
                                )
                              }
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                            />
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <Button tone="slate" size="sm" onClick={() => duplicateBlock(selectedBlock.id)}>
                            Kopyala
                          </Button>
                          <Button
                            tone="danger"
                            size="sm"
                            onClick={() => deleteBlock(selectedBlock.id)}
                          >
                            Blok Sil
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ---- MEDIA ---- */}
              {leftTab === "media" && (
                <>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center">
                    <h3 className="text-xs font-bold text-genco-ink mb-1">
                      Görsel Yükle
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-3">
                      Firebase Storage&apos;a yüklenir. Depolama kapalıysa görsel
                      belgeye gömülür.
                    </p>
                    <Button
                      tone="dark"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? "Yükleniyor…" : "📁 Dosya Seç"}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Kütüphane ({media.length})
                    </h3>
                    <Button tone="ghost" size="sm" onClick={addMediaByUrl}>
                      + URL ekle
                    </Button>
                  </div>

                  {selectedBlock ? (
                    <p className="text-[10px] bg-orange-50 border border-orange-200 text-orange-800 rounded-lg p-2.5">
                      Seçili blok: <strong>{getBlockDef(selectedBlock.type)?.label}</strong>
                      {selectedBlock.type === "slider"
                        ? " → tıkladığınız görsele galeriye eklenir."
                        : " → tıkladığınız görsel blok görseli olur."}
                    </p>
                  ) : (
                    <p className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 rounded-lg p-2.5">
                      Görsel atamak için önce tuvalden bir blok seçin.
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {media.map((m) => (
                      <div
                        key={m.id}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50"
                      >
                        <button
                          type="button"
                          onClick={() => assignMedia(m.url)}
                          className="block w-full h-24 bg-slate-100 group relative"
                          title="Bloğa ata"
                        >
                          <img
                            src={m.url}
                            alt={m.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <span className="absolute inset-0 bg-genco-flame/0 group-hover:bg-genco-flame/20 transition flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100">
                            Ata
                          </span>
                        </button>
                        <div className="p-2 flex items-center justify-between gap-1">
                          <span className="text-[10px] font-semibold text-slate-600 truncate">
                            {m.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMedia(m.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold shrink-0"
                            title="Kütüphaneden kaldır"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ---- PAGES ---- */}
              {leftTab === "pages" && (
                <div className="space-y-1.5">
                  {PAGES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setActivePage(p.id);
                        setSelectedId(null);
                      }}
                      className={cx(
                        "w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between border",
                        activePage === p.id
                          ? "bg-genco-ink text-white border-genco-ink"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <span className="truncate">{p.label}</span>
                      <span className="text-[10px] opacity-60 font-mono shrink-0 ml-2">
                        {(draft[p.id] || []).length} blok
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* ---------- Canvas ---------- */}
        <main className="flex-1 overflow-y-auto bg-slate-200/60">
          {preview && (
            <div className="sticky top-0 z-30 bg-amber-500 text-amber-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm">
              <span>
                ÖNİZLEME — Bu değişiklikler kaydedilmedi ve canlı sitede
                görünmüyor.
              </span>
              <button
                type="button"
                onClick={() => setPreview(false)}
                className="bg-amber-900 text-amber-50 px-3 py-1 rounded text-[10px] font-bold"
              >
                Düzenlemeye Dön
              </button>
            </div>
          )}

          <div className="p-4 md:p-8">
            <div
              className="mx-auto bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300"
              style={{ width: vp.width, maxWidth: "100%" }}
            >
              {/* Tuval, canlı sitedekiyle BİREBİR aynı bileşeni render eder.
                  Bu yüzden burada gördüğünüz şey, Yayınla'dan sonra
                  gencotr.com'da açılacak şeyin ta kendisidir. */}
              {activePage === "home" ? (
                <HomePage
                  blocks={blocks}
                  mode={preview ? "live" : "edit"}
                  lang={editLang}
                  onLangChange={setEditLang}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onChange={handleChangeField}
                  onDelete={deleteBlock}
                  onMove={moveBlock}
                  onDuplicate={duplicateBlock}
                />
              ) : (
                <div className="bg-[#fafafa] min-h-[600px]">
                  <div className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
                    <img
                      src="/logo.png"
                      alt="GENCO"
                      className="h-8 w-auto object-contain"
                    />
                    <div className="hidden sm:flex gap-5 text-[11px] font-semibold text-gray-500">
                      <span>Hizmetler</span>
                      <span>Sektörler</span>
                      <span>Vaka Analizleri</span>
                      <span>Trade Intelligence</span>
                      <span>Hakkımızda</span>
                      <span>İletişim</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      <span className="bg-[#f97316] text-white px-1.5 py-0.5 rounded">
                        TR
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-400">EN</span>
                    </div>
                  </div>
                  <GencoBlocks
                    blocks={blocks}
                    mode={preview ? "live" : "edit"}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onChange={handleChangeField}
                    onDelete={deleteBlock}
                    onMove={moveBlock}
                  />
                  <div className="bg-white py-8 border-t border-gray-200 px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] text-gray-400 text-center">
                    <div>© 2026 GENCO Imports & Exports LTD.</div>
                    <div>Meriç Mah. 5746/5 SK. Bornova/İzmir — info@gencotr.com</div>
                  </div>
                </div>
              )}
            </div>

            {!preview && (
              <p className="text-center text-[11px] text-slate-500 mt-4">
                Tuval, canlı siteyle aynı bileşeni kullanır — burada gördüğünüz
                her şey Yayınla'dan sonra birebir aynı görünür. Başlık ve
                metinlerin üzerine tıklayarak doğrudan yerinde
                düzenleyebilirsiniz. <kbd>Esc</kbd> ile düzenlemeden çıkılır.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
