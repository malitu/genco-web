/**
 * Tek seferlik veri taşıma (migration) betiği.
 *
 * Neden gerekiyor?
 *   Stüdyo eski sürümde çalışırken ana sayfadaki tek "hero" bloğu TEK DİLLİ
 *   (düz metin) olarak kaydedilmiş. Yeni sistem her metni  {tr, en}  biçiminde
 *   bekliyor. Bu betik o kaydı iki dilli biçime çevirir, bozuk deneme
 *   metnini temizler ve ana sayfayı tam blok setiyle doldurur.
 *
 * Çalıştırma:
 *   node scripts/migrate-home.mjs
 *
 * Idempotenttir: betik ikinci kez çalıştırılırsa hiçbir şey değiştirmez.
 */

const PROJECT_ID = "genco-platform";
const API_KEY = "AIzaSyAnAih19--l7BLzm8mHQSyKQetIZJiSX1M";
const DOC = `${PROJECT_ID}-default`; // REST varsayılan veritabanı

const bi = (tr, en) => ({ tr, en });

const SECTIONS = [
  { id: "seed_nav", type: "nav", logo: "/logo.png", links: [
    { id: "lnk_services", label: bi("Hizmetler", "Services"), href: "/services" },
    { id: "lnk_industries", label: bi("Sektörler", "Industries"), href: "/industries" },
    { id: "lnk_cases", label: bi("Vaka Analizleri", "Case Studies"), href: "/case-studies" },
    { id: "lnk_insights", label: bi("Trade Intelligence", "Trade Intelligence"), href: "/insights" },
    { id: "lnk_about", label: bi("Hakkımızda", "About Us"), href: "/about" },
    { id: "lnk_contact", label: bi("İletişim", "Contact"), href: "/contact" },
  ]},
  { id: "seed_hero", type: "hero",
    badge: bi("Uluslararası İş Geliştirme Ortağınız", "Your International Business Development Partner"),
    title: bi("Türkiye'deki Uluslararası Ticaret Ekibiniz", "Your International Trade Team in Turkey"),
    subtitle: bi(
      "Sadece dış ticaret danışmanlığı sunmuyoruz. Fırsatları araştırıyor, doğru uluslararası partnerleri buluyor ve tüm ticari operasyonu sizin adınıza bizzat yönetiyoruz.",
      "We don't just offer foreign trade consultancy. We research opportunities, find the right international partners, and personally manage your entire commercial operation."
    ),
    primaryLabel: bi("Proje Başlatın", "Start a Project"), primaryHref: "/contact",
    secondaryLabel: bi("Hizmetlerimizi İnceleyin", "Inspect Our Services"), secondaryHref: "/services",
    image: "",
    boxBadge: bi("Aktif Ticaret Yönetimi", "Active Trade Management"),
    boxTitle: bi("Masada ve Sahada Doğrudan Operasyon", "Direct Operation at the Table and in the Field"),
    boxDesc: bi(
      "Jenerik pazar araştırmalarıyla vakit kaybetmiyoruz. Tescilli ticaret istihbarat altyapılarımızı kullanarak doğrudan karar vericilere ulaşıyor; demir çelikten medikal, denizcilik ve femtech projelerine kadar teknik standartları bizzat yönetiyoruz.",
      "We don't waste time with generic market research. Using our proprietary trade intelligence infrastructure, we reach decision-makers directly and manage technical standards from steel to medical, marine, and femtech projects."
    ),
    check1: bi("✓ Doğrudan C-Level Erişim", "✓ Direct C-Level Access"),
    check2: bi("✓ Teknik Şartname Uyumu", "✓ Technical Spec Compliance"),
    check3: bi("✓ Geniş Sektörel Esneklik", "✓ Wide Sectoral Flexibility"),
    check4: bi("✓ Numune & Sevkiyat Takibi", "✓ Sample & Shipment Tracking"),
  },
  { id: "seed_industries", type: "industries",
    badge: bi("Sektörel Yetkinlik", "Sectoral Competence"),
    heading: bi("Ağırlıklı Çalıştığımız Sektörler", "Industries We Focus On"),
    description: bi(
      "Derinlemesine ağa ve teknik bilgiye sahip olduğumuz ana alanların yanı sıra, esnek metodolojimizle her sektörde uluslararası ticaret operasyonu yönetebiliyoruz.",
      "In addition to our core domains where we hold deep technical knowledge and networks, our flexible methodology allows us to manage trade operations in any sector."
    ),
    items: [
      { id: "ind_1", title: bi("Demir Çelik", "Steel & Metals") },
      { id: "ind_2", title: bi("Denizcilik", "Marine") },
      { id: "ind_3", title: bi("Tohumculuk", "Agriculture") },
      { id: "ind_4", title: bi("Medikal", "Medical") },
      { id: "ind_5", title: bi("Otomotiv", "Automotive") },
      { id: "ind_6", title: bi("Femtech", "Femtech") },
    ],
    note: bi(
      "* Uzmanlık alanlarımız haricinde, talebe göre her sektörde özel pazar araştırması ve operasyon yönetimi sağlanmaktadır.",
      "* Beyond our core specialties, bespoke market research and operation management are available for any sector upon request."
    ),
  },
  { id: "seed_routes", type: "routes",
    heading: bi("Ticari Hedefinizi Seçin", "Choose Your Commercial Goal"),
    subheading: bi(
      "İster küresel pazarlarda büyümek isteyen bir üretici, ister Türkiye'den nitelikli tedarik arayan bir marka olun; operasyonunuzu uçtan uca yönetiyoruz.",
      "Whether you're a manufacturer expanding globally or a brand seeking reliable supply from Turkey, we manage your operations end-to-end."
    ),
    cards: [
      { id: "card_1",
        badge: bi("Yerli Üreticiler İçin", "For Local Manufacturers"),
        title: bi("İhracat Pazarınızı Büyütelim", "Scale Your Export Markets"),
        desc: bi(
          "Şirket içi ihracat departmanı kurma maliyetine katlanmadan, dışarıdan uluslararası satış ekibiniz olarak küresel alıcılara ulaşıyoruz.",
          "Without building an internal export department, we act as your outsourced international sales team reaching global buyers."
        ),
        link: bi("İhracat Modelini İncele →", "View Export Model →") },
      { id: "card_2",
        badge: bi("Uluslararası Alıcılar İçin", "For International Buyers"),
        title: bi("Türkiye'den Güvenli Tedarik", "Secure Sourcing from Turkey"),
        desc: bi(
          "Doğru üreticiyi bulma, kapasite denetimi, fiyat teklifi koordinasyonu ve uluslararası standartlara uygunluk süreçlerini yönetiyoruz.",
          "We handle manufacturer discovery, capacity audits, quotation coordination, and international standards compliance."
        ),
        link: bi("Tedarik Süreçlerini Gör →", "View Sourcing Processes →") },
      { id: "card_3",
        badge: bi("Global Markalar İçin", "For Global Brands"),
        title: bi("Türkiye Pazarına Giriş", "Market Entry to Turkey"),
        desc: bi(
          "Türkiye pazarını analiz etmek, yerel regülasyonlara uyum sağlamak ve güçlü bir distribütör veya bayi ağı kurarak ticari operasyon başlatmak.",
          "Analyzing the Turkish market, ensuring local regulatory compliance, and establishing strong distributor or dealer networks."
        ),
        link: bi("Pazara Giriş Stratejisi →", "Market Entry Strategy →") },
    ],
  },
  { id: "seed_method", type: "method",
    badge: bi("Farkımız", "Our Differentiator"),
    title1: bi("Analiz yön gösterir.", "Analysis guides."),
    title2: bi("İcraat ticaret yaratır.", "Execution creates trade."),
    desc: bi(
      "Pek çok kurum sadece rapor sunar ve çekilir; GENCO ise masada sizinle birlikte oturur, müzakereleri yürütür ve siparişin kapanışına kadar sahada yer alır.",
      "Many firms hand over reports and walk away; GENCO sits at the table with you, leads negotiations, and stays on the ground until order closure."
    ),
    d1: bi(
      "Demir Çelik ve endüstriyel metallerde tolerans ve alaşım standardı uzmanlığı.",
      "Expertise in tolerance and alloy standards for steel and industrial metals."
    ),
    d2: bi(
      "Medikal, Femtech, Tohumculuk, Denizcilik ve Otomotiv sektörlerinde tecrübe.",
      "Extensive experience across Medical, Femtech, Agriculture, Marine, and Automotive sectors."
    ),
    methodTitle: bi("The GENCO Method", "The GENCO Method"),
    items: [
      { id: "m_1", name: bi("Araştırma (Research)", "Research"), sub: bi("Veri Odaklı", "Data-Driven") },
      { id: "m_2", name: bi("İletişim (Connect)", "Connect"), sub: bi("Stratejik B2B", "Strategic B2B") },
      { id: "m_3", name: bi("İcraat (Execute)", "Execute"), sub: bi("Sahada Yönetim", "Field Management") },
      { id: "m_4", name: bi("Büyüme (Grow)", "Grow"), sub: bi("Sürdürülebilir Ağ", "Sustainable Network") },
    ],
  },
  { id: "seed_footer", type: "footer",
    rights: bi("© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.", "© 2026 GENCO Imports & Exports LTD. All rights reserved."),
    address: bi(
      "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com",
      "Meriç Mah. 5746/5 SK. No: 3 Inner Door No: Z1 Bornova/İzmir - TURKEY | Phone: +90 232 462 16 49 | info@gencotr.com"
    ),
  },
];

/* --- Firestore REST yardimcilari --- */
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function toFirestoreValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "number") {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  if (typeof v === "boolean") return { booleanValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toFirestoreValue) } };
  const fields = {};
  for (const [k, val] of Object.entries(v)) fields[k] = toFirestoreValue(val);
  return { mapValue: { fields } };
}

function fromFirestoreValue(v) {
  if (!v) return undefined;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(fromFirestoreValue);
  if ("mapValue" in v) {
    const out = {};
    for (const [k, val] of Object.entries(v.mapValue.fields || {})) {
      out[k] = fromFirestoreValue(val);
    }
    return out;
  }
  return undefined;
}

async function readDoc() {
  const res = await fetch(`${BASE}/settings/genco_studio`);
  if (!res.ok) return null;
  return fromFirestoreValue((await res.json()).fields);
}

async function patchDoc(fields) {
  const body = { fields };
  for (const [k, v] of Object.entries(fields)) body.fields[k] = toFirestoreValue(v);
  const res = await fetch(`${BASE}/settings/genco_studio`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Yazma hatası ${res.status}: ${await res.text()}`);
}

function isBilingual(v) {
  return v && typeof v === "object" && !Array.isArray(v) && typeof v.tr === "string";
}

async function main() {
  console.log("Mevcut belge okunuyor…");
  const doc = await readDoc();
  const pc = (doc && doc.pagesContent) || {};
  const home = Array.isArray(pc.home) ? pc.home : [];

  // Zaten taşınmış mı?
  const already = home.length >= 6 && home.every((b) => !b || isBilingual(b.title));
  if (already) {
    console.log("Ana sayfa zaten iki dilli — taşıma gerekmiyor. Çıkılıyor.");
    return;
  }

  // Eski hero'daki TR metinleri koru, deneme artıklarını temizle.
  const legacyHero = home.find((b) => b && b.type === "hero") || {};
  const clean = (s) => {
    if (typeof s !== "string") return "";
    return s
      .replace(/\s*denemeler yap[ıi]yoruz[^\n]*$/i, "")
      .replace(/[()+]{3,}/g, "")
      .trim();
  };

  const merged = SECTIONS.map((section) => {
    if (section.type !== "hero") return section;
    const t = section.title.tr;
    const s = section.subtitle.tr;
    // Eski kayıtta gerçek bir değişiklik yapıldıysa onu koru.
    const useTitle = legacyHero.title && clean(legacyHero.title) !== t
      ? clean(legacyHero.title) : t;
    const useSub = legacyHero.subtitle && clean(legacyHero.subtitle) !== s
      ? clean(legacyHero.subtitle) : s;
    return {
      ...section,
      title: { tr: useTitle, en: section.title.en },
      subtitle: { tr: useSub, en: section.subtitle.en },
    };
  });

  console.log("Ana sayfa 6 blok olarak yazılıyor (menü → manşet → sektörler → hedef → farkımız → alt bilgi)…");
  await patchDoc({ pagesContent: { ...pc, home: merged } });

  console.log("Tamamlandı.");
  console.log("  Bloklar:", merged.map((b) => b.type).join(", "));
  console.log("  Bozuk deneme metni temizlendi.");
}

main().catch((e) => {
  console.error("HATA:", e.message);
  process.exit(1);
});
