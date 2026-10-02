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
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  deleteDoc,
  deleteField,
  serverTimestamp,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import GencoBlocks, {
  BLOCK_LIBRARY,
  DEFAULT_SITE_BLOCKS,
  NAV_DEFAULTS,
  getBlockDef,
  normaliseBlock,
  L,
} from "../../components/GencoBlocks";
import HomePage from "../../components/HomePage";
import SitePage from "../../components/SitePage";
import {
  PAGE_TEMPLATES,
  slugify,
  createPageBlocks,
} from "../../components/PageTemplates";


const STUDIO_DOC = ["settings", "genco_studio"];

/**
 * Medya kütüphanesi artık stüdyo belgesinin içinde değil, ayrı belgelerde
 * tutulur (genco_media/<id>).
 *
 * Neden: Firestore'un belge sınırı 1 MB'dır. Görseller eskiden aynı belgede
 * saklanıyordu; sayfa metinleriyle birlikte sınır dolduğunda YAYINLAMA
 * tamamen başarısız oluyordu. Her görsel kendi belgesinde olduğu için artık
 * yalnızca tek bir görselin 1 MB'ı aşması sorun olur — o durumda zaten
 * küçültme ile uyarı veriyoruz.
 */
const MEDIA_COLLECTION = "genco_media";

/* Canonical page keys. Kept identical to the previous studio so any content
   already saved in Firestore keeps loading. */
const STATIC_PAGES = [
  { id: "home", label: "Ana Sayfa", live: true },
  { id: "services", label: "Hizmetler" },
  { id: "industries", label: "Sektörler" },
  { id: "caseStudies", label: "Vaka Analizleri" },
  { id: "insights", label: "Trade Intelligence" },
  { id: "about", label: "Hakkımızda" },
  { id: "contact", label: "İletişim" },
];

// Anahtar → canlı adres parçası. Yeni sayfalarda anahtar zaten adrestir.
const PAGE_PATHS = { home: "", caseStudies: "case-studies" };

// Every sayfanın başlangıç şablonu. Ana sayfa GencoBlocks içinde, alt sayfalar
// src/components/PageTemplates.js içinde tanımlıdır. Böylece canlı site ile
// stüdyo aynı varsayılan içeriği kullanır ve stüdyoda hiçbir sayfa boş
// görünmez.
const DEFAULT_PAGES = {
  home: DEFAULT_SITE_BLOCKS,
  services: PAGE_TEMPLATES.services,
  industries: PAGE_TEMPLATES.industries,
  caseStudies: PAGE_TEMPLATES.caseStudies,
  insights: PAGE_TEMPLATES.insights,
  about: PAGE_TEMPLATES.about,
  contact: PAGE_TEMPLATES.contact,
};

/**
 * Bir sayfanın menü bloğuna yeni link ekler (yoksa menü bloğu oluşturur).
 * Yeni sayfa oluşturulurken tüm sayfaların menüsüne aynı link eklenir; böylece
 * menü site genelinde tutarlı kalır.
 */
function withNavLink(blocks, link) {
  const list = Array.isArray(blocks) ? blocks : [];
  const already = list.some(
    (b) => b?.type === "nav" && (b.links || []).some((l) => l.href === link.href)
  );
  if (already) return list;

  const navIndex = list.findIndex((b) => b?.type === "nav");
  if (navIndex < 0) {
    return [
      { ...NAV_DEFAULTS, id: `${link.id}_nav_${Date.now().toString(36)}`, links: [...NAV_DEFAULTS.links, link] },
      ...list,
    ];
  }

  return list.map((b, i) =>
    i === navIndex ? { ...b, links: [...(b.links || []), link] } : b
  );
}

const DEFAULT_MEDIA = [{ id: "seed_logo", name: "GENCO Logo", url: "/logo.png" }];

/**
 * Stüdyo tuvali — seçili sayfayı canlı sitedekiyle aynı bileşenle çizer.
 * Ana sayfa için HomePage, alt sayfalar için SitePage kullanılır; ikisi de
 * blok motorunu paylaştığı için önizleme ile yayın sonucu birebir aynıdır.
 */
function StudioCanvas({
  pageKey,
  blocks,
  preview,
  editLang,
  setEditLang,
  selectedId,
  setSelectedId,
  onChange,
  onDelete,
  onMove,
  onDuplicate,
  onPickImage,
}) {
  const shared = {
    blocks,
    mode: preview ? "live" : "edit",
    lang: editLang,
    onLangChange: setEditLang,
    selectedId,
    onSelect: setSelectedId,
    onChange,
    onDelete,
    onMove,
    onDuplicate,
    onPickImage,
  };

  if (pageKey === "home") return <HomePage {...shared} />;

  return <SitePage pageKey={pageKey} {...shared} />;
}

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

/** Bir işlemin süresini sınırlar. Storage takılırsa kullanıcı sonsuza kadar beklemez. */
function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} zaman aşımı`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** MIME boş olsa bile dosyanın görsel olup olmadığını uzantıdan anlar. */
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp|svg|heic|heif|tiff?)$/i;
const isImageFile = (f) =>
  (typeof f.type === "string" && f.type.startsWith("image/")) ||
  IMAGE_EXT.test(f.name || "");

/**
 * Görseli tarayıcıda küçültür ve hem Blob hem data URL üretir.
 *
 * Neden önemli:
 *   • Storage'a küçültülmüş dosya gider (orijinal 10 MB telefon fotoğrafı
 *     yüklenirse yükleme çok yavaşlar / başarısız olur).
 *   • Storage çalışmazsa belgeye gömülecek data URL küçük kalır; Firestore'ın
 *     1 MB belge sınırını tüketmez.
 *   • PNG/JPEG dışındaki biçimler (HEIC vb.) tarayıcıda çözülemeyebilir;
 *     o durumda dosya olduğu gibi kullanılır.
 */
function compressImage(file, maxDim = 1400, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.onload = () => {
      const rawDataUrl = String(reader.result || "");
      const img = new Image();

      img.onerror = () =>
        resolve({
          dataUrl: rawDataUrl,
          blob: file,
          shrunk: false,
          bytes: file.size,
          reason: "tarayıcı bu biçimi çözemedi, dosya olduğu gibi kullanıldı",
        });

      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        // Şeffaf PNG'lerde arka planın beyazlaşmasını önler (JPEG'a çevirirken).
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                dataUrl: rawDataUrl,
                blob: file,
                shrunk: false,
                bytes: file.size,
                reason: "sıkıştırılamadı",
              });
              return;
            }
            const fr = new FileReader();
            fr.onerror = () =>
              resolve({ dataUrl: rawDataUrl, blob, shrunk: true, bytes: blob.size });
            fr.onload = () =>
              resolve({
                dataUrl: String(fr.result || rawDataUrl),
                blob,
                shrunk: true,
                bytes: blob.size,
                width: w,
                height: h,
              });
            fr.readAsDataURL(blob);
          },
          "image/jpeg",
          quality
        );
      };

      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Belgeye gömülecek data URL'in Firestore sınırına (1 MB) girmesini garanti
 * eder. Gerekirse daha da küçültür; son çare olarak görseli atlar.
 * Dönüş: { dataUrl, blob, bytes, shrunk, note }
 */
const INLINE_LIMIT = 700_000; // base64 karakter ≈ 520 KB ham

async function prepareInlineImage(file, url) {
  // url verilmediyse ilk sıkıştırmayı yap.
  let result = url
    ? { dataUrl: url, blob: file, bytes: file.size }
    : await compressImage(file);

  if (result.dataUrl.length <= INLINE_LIMIT) return result;

  // 2. deneme: daha küçük.
  const smaller = await compressImage(file, 1000, 0.6);
  if (smaller.dataUrl.length <= INLINE_LIMIT) return smaller;

  // 3. deneme: en küçük hâli.
  const tiny = await compressImage(file, 720, 0.5);
  if (tiny.dataUrl.length <= INLINE_LIMIT) return tiny;

  throw new Error(
    `Görsel küçültüldükten sonra hâlâ çok büyük (${Math.round(
      tiny.dataUrl.length / 1024
    )} KB). Lütfen daha küçük bir görsel seçin.`
  );
}

/** Firestore'ın 1 MB belge sınırına ne kadar yaklaştığımızı tahmin eder. */
function estimateBytes(value) {
  try {
    return new Blob([JSON.stringify(value)]).size;
  } catch {
    return JSON.stringify(value).length;
  }
}

const cx = (...parts) => parts.filter(Boolean).join(" ");

/**
 * Seçili bloğun düzenlenebilir bağlantı adreslerini listeler.
 * Dönen her kayıt: { path, label, value, set(block, yeniDeğer) }
 *   path  → handleChangeField'in güncelleyeceği üst alan (dizi elemanıysa
 *           yeni dizi döndürür)
 *
 * Kapsam: menü linkleri, hero butonları, ticari hedef kartları ve
 * eylem çağrısı butonu.
 */
function linkFieldsOf(block) {
  if (!block) return [];

  if (block.type === "nav") {
    return (block.links || []).map((l, i) => ({
      key: `nav_${l.id}`,
      label: `${L(l.label, "TR") || `Link ${i + 1}`} adresi`,
      value: l.href || "",
      set: (b, v) => ({
        ...b,
        links: (b.links || []).map((x) =>
          x.id === l.id ? { ...x, href: v } : x
        ),
      }),
    }));
  }

  if (block.type === "hero") {
    return [
      {
        key: "primaryHref",
        label: `${L(block.primaryLabel, "TR") || "Birincil buton"} adresi`,
        value: block.primaryHref || "",
        set: (b, v) => ({ ...b, primaryHref: v }),
      },
      {
        key: "secondaryHref",
        label: `${L(block.secondaryLabel, "TR") || "İkincil buton"} adresi`,
        value: block.secondaryHref || "",
        set: (b, v) => ({ ...b, secondaryHref: v }),
      },
    ];
  }

  if (block.type === "routes") {
    return (block.cards || []).map((c, i) => ({
      key: `route_${c.id}`,
      label: `${L(c.title, "TR") || `Kart ${i + 1}`} adresi`,
      value: c.href || "/services",
      set: (b, v) => ({
        ...b,
        cards: (b.cards || []).map((x) => (x.id === c.id ? { ...x, href: v } : x)),
      }),
    }));
  }

  if (block.type === "ctaBand") {
    return [
      {
        key: "buttonHref",
        label: `${L(block.buttonLabel, "TR") || "Buton"} adresi`,
        value: block.buttonHref || "",
        set: (b, v) => ({ ...b, buttonHref: v }),
      },
    ];
  }

  return [];
}

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

  /* Yeni sayfalar (Firestore customPages) -------------------------------- */
  const [customPages, setCustomPages] = useState([]);
  const [showNewPage, setShowNewPage] = useState(false);
  const [npSlug, setNpSlug] = useState("");
  const [npTr, setNpTr] = useState("");
  const [npEn, setNpEn] = useState("");
  const [npError, setNpError] = useState("");

  // Statik sayfalar + kullanıcının açtığı sayfalar
  const PAGES = useMemo(
    () => [
      ...STATIC_PAGES,
      ...customPages.map((p) => ({ id: p.slug, label: p.label?.tr || p.slug, custom: true })),
    ],
    [customPages]
  );
  const [selectedId, setSelectedId] = useState(null);
  const [leftTab, setLeftTab] = useState("blocks");
  const [viewport, setViewport] = useState("desktop");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Yükleme günlüğü: hangi dosya ne oldu? Kullanıcı "yüklenmedi" dediğinde
  // sebebini buradan okuyabilmeli.
  const [uploadLog, setUploadLog] = useState([]);
  // Tuvalde düzenlenen dil. Her metin iki dilli olduğu için TR ve EN'yi
  // ayrı ayrı yazabilirsiniz.
  const [editLang, setEditLang] = useState("TR");
  // Tuvalden "Görsel Ekle" ile açılan hedef: { blockId, field }
  const [imageTarget, setImageTarget] = useState(null);

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

            // Stüdyoda açılmış yeni sayfaları geri yükle.
            const savedCustom = Array.isArray(data.customPages)
              ? data.customPages.filter((p) => p?.slug)
              : [];
            if (savedCustom.length) setCustomPages(savedCustom);

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
          /* Medya kütüphanesi artık ayrı belgelerde tutulur. */
          const mediaSnap = await getDocs(collection(db, MEDIA_COLLECTION));
          if (!cancelled && !mediaSnap.empty) {
            setMedia(
              mediaSnap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }))
            );
          } else if (Array.isArray(data.mediaLibrary) && data.mediaLibrary.length) {
            // Geçiş: eski belgedeki görselleri kendi belgelerine taşı.
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
    const all = Array.from(files || []);
    const list = all.filter(isImageFile);
    const skipped = all.filter((f) => !isImageFile(f));

    if (!list.length) {
      flash(
        skipped.length
          ? "Seçilen dosya bir görsel değil. JPG, PNG, WebP veya GIF seçin."
          : "Dosya seçilmedi.",
        "warn"
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    setUploadLog([]);
    const added = [];
    const failed = [];

    for (const file of list) {
      try {
        // 1) Görseli küçült. Storage'a da belgeye de bu sürüm gider.
        const { dataUrl, blob, shrunk, bytes } = await prepareInlineImage(file);

        let url = dataUrl;
        let stored = false;
        let why = "Storage kullanılamıyor, belgeye gömüldü";

        // 2) Firebase Storage dene. Zaman aşımı koyuyoruz: bucket kapalıysa ya
        //    da kurallar reddederse SDK üstel geri çekilmeyle tekrar dener ve
        //    düğme "Yükleniyor…" deyip sonsuza kadar asılı kalırdı.
        try {
          const safeName = (file.name || "gorsel").replace(/[^a-zA-Z0-9._-]/g, "_");
          const uploaded = await withTimeout(
            uploadBytes(
              storageRef(storage, `genco-media/${Date.now()}_${safeName}`),
              blob,
              { contentType: "image/jpeg" }
            ),
            15000,
            "Storage yüklemesi"
          );
          url = await withTimeout(getDownloadURL(uploaded), 8000, "Storage bağlantısı");
          stored = true;
          why = "Storage'a yüklendi";
        } catch (storageErr) {
          why =
            "Storage kullanılamıyor, belgeye gömüldü" +
            (storageErr?.code ? ` (${storageErr.code})` : "");
          console.warn("Storage yüklemesi başarısız:", storageErr);
        }

        added.push({
          id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          url,
          stored,
          bytes,
        });
        setUploadLog((log) => [
          ...log,
          {
            name: file.name,
            ok: true,
            detail:
              `${why} · ${Math.round((stored ? bytes : url.length) / 1024)} KB` +
              (shrunk ? ` · ${Math.round(file.size / 1024)} KB'dan küçültüldü` : ""),
          },
        ]);
      } catch (e) {
        failed.push(file.name);
        setUploadLog((log) => [
          ...log,
          { name: file.name, ok: false, detail: `İşlenemedi: ${e?.message || e}` },
        ]);
        console.error("Görsel işlenemedi:", e);
      }
    }

    if (added.length) {
      setMedia((prev) => [...prev, ...added]);
    }

    const inline = added.filter((m) => !m.stored).length;
    const parts = [];
    if (added.length) {
      parts.push(
        inline
          ? `${added.length} görsel eklendi (${inline} tanesi belgeye gömüldü)`
          : `${added.length} görsel Storage'a yüklendi`
      );
    }
    if (skipped.length) parts.push(`${skipped.length} dosya görsel olmadığı için atlandı`);
    if (failed.length) parts.push(`${failed.length} dosya işlenemedi`);

    flash(
      parts.join(" · ") +
        " — Kalıcı olması için «Kaydet & Yayınla» düğmesine basın.",
      failed.length ? "error" : inline ? "warn" : "ok"
    );

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
    // Tuvalden "Görsel Ekle" ile açılan hedef varsa önce onu doldur.
    if (imageTarget) {
      applyImageToField(imageTarget.blockId, imageTarget.field, url);
      setImageTarget(null);
      return;
    }
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

  /** Tuvaldeki bir görsel alanına medya kütüphanesinden seçim yapar. */
  const openImagePicker = (blockId, field) => {
    setSelectedId(blockId);
    setLeftTab("media");
    setImageTarget({ blockId, field });
    flash("Medya kütüphanesinden bir görsel seçin (ya da yeni yükleyin).", "info");
  };

  /** Seçilen görseli hedef alana yazar. field: "image" | "item:<id>" | "card:<id>" */
  const applyImageToField = (blockId, field, url) => {
    setDraft((prev) => {
      const list = prev[activePage] || [];
      return {
        ...prev,
        [activePage]: list.map((b) => {
          if (b.id !== blockId) return b;
          if (field.startsWith("item:")) {
            const id = field.slice(5);
            return {
              ...b,
              items: (b.items || []).map((x) => (x.id === id ? { ...x, image: url } : x)),
            };
          }
          if (field.startsWith("card:")) {
            const id = field.slice(5);
            return {
              ...b,
              cards: (b.cards || []).map((x) => (x.id === id ? { ...x, image: url } : x)),
            };
          }
          if (field.startsWith("media:")) {
            const id = field.slice(6);
            return {
              ...b,
              items: (b.items || []).map((x) =>
                x.id === id ? { ...x, url, kind: "image" } : x
              ),
            };
          }
          return { ...b, [field]: url };
        }),
      };
    });
    flash("Görsel eklendi.");
  };

  const removeMedia = (id) => {
    const target = media.find((m) => m.id === id);
    if (!target) return;
    setMedia((prev) => prev.filter((m) => m.id !== id));
    // Görselin kendi belgesini de sil (yayınlama sırasında yazılıyordu).
    if (id !== "seed_logo") {
      deleteDoc(doc(db, MEDIA_COLLECTION, id)).catch((e) =>
        console.warn("Medya belgesi silinemedi:", e?.code || e?.message || e)
      );
    }
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

  /* --- new pages -------------------------------------------------------- */
  /**
   * Yeni sayfa açar ve menü linkini site genelindeki tüm sayfalara ekler.
   * Değişiklikler "Kaydet & Yayınla" ile Firestore'a yazılır.
   */
  const createPage = () => {
    const slug = slugify(npSlug);
    if (!slug) {
      setNpError(
        "Geçerli bir adres gerekli. Örnek: blog, kalite-politikasi, ekip."
      );
      return;
    }
    if (PAGES.some((p) => p.id === slug)) {
      setNpError(`"${slug}" adresinde bir sayfa zaten var.`);
      return;
    }
    const tr = npTr.trim() || slug;
    const en = npEn.trim() || tr;
    const link = { id: `lnk_${slug}`, label: { tr, en }, href: `/${slug}` };

    setDraft((prev) => {
      const next = { ...prev };
      // Yeni sayfanın menüsü, ana sayfadaki güncel menü linklerini temel alır
      // (kullanıcının eklediği/sildiği linkler de aktarılır).
      const homeNav = (prev.home || []).find((b) => b?.type === "nav");
      const baseLinks = (homeNav?.links || NAV_DEFAULTS.links).filter(
        (l) => l.href !== link.href
      );

      for (const key of Object.keys(next)) {
        next[key] = withNavLink(next[key], link);
      }
      next[slug] = createPageBlocks(slug, tr, en, baseLinks);
      return next;
    });
    setPublished((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = withNavLink(next[key], link);
      }
      return next;
    });

    setCustomPages((prev) => [
      ...prev,
      { slug, label: { tr, en }, createdAt: Date.now() },
    ]);
    setActivePage(slug);
    setSelectedId(null);
    setShowNewPage(false);
    setNpSlug("");
    setNpTr("");
    setNpEn("");
    setNpError("");
    flash(`"${tr}" sayfası oluşturuldu. Menüye eklendi — yayınlamayı unutmayın.`);
  };

  /** Yeni sayfayı ve tüm menülerdeki linkini kaldırır. */
  const removePage = (slug) => {
    const target = PAGES.find((p) => p.id === slug);
    if (!target?.custom) return;
    if (!window.confirm(`"${target.label}" sayfası silinsin mi?`)) return;

    setDraft((prev) => {
      const next = {};
      for (const [key, list] of Object.entries(prev)) {
        if (key === slug) continue;
        next[key] = (list || []).map((b) =>
          b?.type === "nav"
            ? { ...b, links: (b.links || []).filter((l) => l.href !== `/${slug}`) }
            : b
        );
      }
      return next;
    });
    setPublished((prev) => {
      const next = {};
      for (const [key, list] of Object.entries(prev)) {
        if (key === slug) continue;
        next[key] = (list || []).map((b) =>
          b?.type === "nav"
            ? { ...b, links: (b.links || []).filter((l) => l.href !== `/${slug}`) }
            : b
        );
      }
      return next;
    });

    setCustomPages((prev) => prev.filter((p) => p.slug !== slug));
    if (activePage === slug) {
      setActivePage("home");
      setSelectedId(null);
    }
    flash(`"${target.label}" sayfası silindi — yayınlayınca siteden kalkar.`);
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

      // Belge sınırına çok yaklaşıldıysa baştan uyar: Firestore 1 MB üstünü
      // sessizce değil, "failed-precondition" hatasıyla reddeder ve kullanıcı
      // neden yüklenmediğini anlamaz.
      const bytes = estimateBytes(payload);
      if (bytes > 900_000) {
        flash(
          `Sayfa içeriği ${Math.round(bytes / 1024)} KB — Firestore belge sınırı 1 MB. ` +
            "Bazı görselleri kaldırın veya sayfa metinlerini kısaltın.",
          "error"
        );
        setSaving(false);
        return;
      }

      // Görseller ayrı belgelere yazılır (her biri kendi 1 MB bütçesiyle).
      await Promise.all(
        media.map((m) =>
          setDoc(
            doc(db, MEDIA_COLLECTION, m.id),
            { name: m.name, url: m.url, stored: m.stored, bytes: m.bytes },
            { merge: true }
          ).catch((e) =>
            console.warn(`Medya yazılamadı (${m.name}):`, e?.code || e?.message || e)
          )
        )
      );

      await setDoc(
        doc(db, ...STUDIO_DOC),
        {
          pagesContent: payload,
          customPages,
          // Medya artık genco_media koleksiyonunda; eski alanı temizle ki
          // belge şişip yayınlamayı bozmasın.
          mediaLibrary: deleteField(),
          publishedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setPublished(draft);
      flash(
        media.some((m) => !m.stored)
          ? "Yayınlandı! Not: Storage'a yüklenemeyen görseller belgeye gömüldü."
          : "Yayınlandı! Değişiklikler canlı siteye aktarıldı."
      );
    } catch (e) {
      console.error("Yayınlama hatası:", e);
      const code = e?.code || "";
      if (code === "permission-denied") {
        flash("Yayınlanamadı: Firebase kuralları bu yazmayı reddetti.", "error");
      } else if (code === "failed-precondition" || code === "invalid-argument") {
        flash(
          "Yayınlanamadı: Belge 1 MB sınırını aşıyor. Görselleri kaldırıp tekrar deneyin.",
          "error"
        );
      } else if (code === "unavailable" || code === "deadline-exceeded") {
        flash("Yayınlanamadı: Firebase'e ulaşılamadı. İnternet bağlantısını kontrol edin.", "error");
      } else {
        flash(`Yayınlanamadı (${code || "bilinmeyen hata"}). Detaylar konsolda.`, "error");
      }
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
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                ● /{PAGE_PATHS[activePage] ?? activePage}
              </span>
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

                        {/* ---- Bağlantı adresleri ----
                            Metin tuvalden düzenlenir; nereye gittiği ise
                            buradan. Önceden hiçbir yerden değiştirilemiyordu,
                            bu yüzden butonlar hep koda gömülü adrese gidiyordu. */}
                        {linkFieldsOf(selectedBlock).length > 0 && (
                          <div className="space-y-2 pt-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Bağlantı adresleri
                            </label>
                            {linkFieldsOf(selectedBlock).map((f) => (
                              <div key={f.key} className="space-y-0.5">
                                <span className="block text-[10px] text-slate-500">
                                  {f.label}
                                </span>
                                <input
                                  value={f.value || ""}
                                  placeholder="/hizmetler"
                                  onChange={(e) =>
                                    handleChangeField(
                                      selectedBlock.id,
                                      f.key,
                                      f.set(selectedBlock, e.target.value)
                                    )
                                  }
                                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-mono focus:outline-none focus:border-genco-flame"
                                />
                              </div>
                            ))}
                            <p className="text-[10px] text-slate-400 leading-snug">
                              Site içi sayfa için: <code>/hizmetler</code> · Dış
                              bağlantı için tam adres.
                            </p>
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
                      Görsel önce küçültülür (en fazla 1400 piksel), sonra
                      Firebase Storage&apos;a yüklenir. Storage kullanılamazsa
                      görsel kendi belgesine gömülür.
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

                  {/* ---- Yükleme günlüğü: neden yüklenmedi? ---- */}
                  {uploadLog.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Son yükleme
                        </span>
                        <button
                          type="button"
                          onClick={() => setUploadLog([])}
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                        >
                          Temizle
                        </button>
                      </div>
                      {uploadLog.map((row, i) => (
                        <div
                          key={`${row.name}_${i}`}
                          className="text-[10px] leading-snug flex gap-1.5"
                        >
                          <span className="shrink-0 font-bold">
                            {row.ok ? "✅" : "❌"}
                          </span>
                          <span className="min-w-0">
                            <strong className="text-slate-700">{row.name}</strong>
                            <span className="block text-slate-500">
                              {row.detail}
                            </span>
                          </span>
                        </div>
                      ))}
                      <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                        Yüklenen görselin kalıcı olması için
                        <strong> «Kaydet &amp; Yayınla» </strong>
                        düğmesine basın.
                      </p>
                    </div>
                  )}

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
                    <div key={p.id} className="flex items-stretch gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePage(p.id);
                          setSelectedId(null);
                        }}
                        className={cx(
                          "flex-1 text-left px-3 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between border",
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
                      {p.custom && (
                        <button
                          type="button"
                          onClick={() => removePage(p.id)}
                          title="Sayfayı sil"
                          className="px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-red-600 hover:border-red-200 transition text-[11px] font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  {/* ---- Yeni sayfa ---- */}
                  {!showNewPage ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewPage(true);
                        setNpError("");
                      }}
                      className="w-full rounded-lg border-2 border-dashed border-slate-300 bg-white px-3 py-2.5 text-[11px] font-bold text-slate-500 hover:border-[#f97316] hover:text-[#f97316] transition"
                    >
                      + Yeni Sayfa Ekle
                    </button>
                  ) : (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Yeni sayfa
                      </div>

                      <input
                        value={npSlug}
                        onChange={(e) => {
                          setNpSlug(e.target.value);
                          setNpError("");
                        }}
                        placeholder="adres: blog"
                        className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[11px] font-mono focus:outline-none focus:border-[#f97316]"
                      />
                      <input
                        value={npTr}
                        onChange={(e) => setNpTr(e.target.value)}
                        placeholder="Menü adı (TR) — Blog"
                        className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[11px] focus:outline-none focus:border-[#f97316]"
                      />
                      <input
                        value={npEn}
                        onChange={(e) => setNpEn(e.target.value)}
                        placeholder="Menu label (EN) — Blog"
                        className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[11px] focus:outline-none focus:border-[#f97316]"
                      />

                      {npError && (
                        <p className="text-[10px] font-semibold text-red-600">
                          {npError}
                        </p>
                      )}

                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={createPage}
                          className="flex-1 rounded-lg bg-[#f97316] px-3 py-2 text-[11px] font-bold text-white hover:bg-orange-600 transition"
                        >
                          Oluştur
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewPage(false);
                            setNpError("");
                          }}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-500 hover:bg-slate-50"
                        >
                          Vazgeç
                        </button>
                      </div>

                      <p className="text-[10px] leading-snug text-slate-400">
                        Sayfa boş bir iskeletle (menü + başlık + alt bilgi) açılır
                        ve menü linki tüm sayfalara eklenir. İçeriği soldaki
                        blok listesinden eklersiniz.
                      </p>
                    </div>
                  )}
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
              <StudioCanvas
                pageKey={activePage}
                blocks={blocks}
                preview={preview}
                editLang={editLang}
                setEditLang={setEditLang}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onChange={handleChangeField}
                onDelete={deleteBlock}
                onMove={moveBlock}
                onDuplicate={duplicateBlock}
                onPickImage={openImagePicker}
              />
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
