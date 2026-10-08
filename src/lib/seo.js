/**
 * Ortak SEO / yapısal veri kaynakları.
 * ---------------------------------------------------------------------------
 * Buradaki değerler site genelinde tek yerden yönetilir: meta etiketleri,
 * Open Graph, JSON-LD ve sitemap hepsi buradan beslenir. Bir yerde değişince
 * tüm site güncellenir.
 *
 * CANLI ADRES: Alan adı Vercel'e taşınana kadar NEXT_PUBLIC_SITE_URL ile
 * geçici olarak vercel.app adresi verilebilir.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gencotr.com"
).replace(/\/+$/, "");

export const ORG = {
  name: "Genco İthalat İhracat Medikal Ürün San. Tic. Ltd. Şti.",
  shortName: "GENCO",
  legalName: "Genco İthalat İhracat Medikal Ürün San. Tic. Ltd. Şti.",
  legalNameEn: "Genco Import Export Medical Products Industry and Trading Co. Ltd.",
  foundingDate: "2008",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/img/home-port.webp`,
  email: "info@gencotr.com",
  phone: "+90 505 926 12 51",
  phoneRaw: "+905059261251",
  address: {
    street: "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1",
    district: "Bornova",
    city: "İzmir",
    region: "İzmir",
    country: "TR",
    countryName: "Türkiye",
  },
  sameAs: [],
  description:
    "İzmir merkezli ithalat ve ihracat operasyon firması. Vasıflı çelik, yatçılık ve marine ekipmanı, tohumculuk, medikal, otomotiv yan sanayi ve femtech sektörlerinde ürün kaynağından gümrükleme ve teslimata kadar uçtan uca operasyon yönetimi.",
  descriptionEn:
    "Izmir-based import and export operations company. We manage the entire chain from product sourcing through customs clearance to delivery across engineering steel, yachting and marine equipment, seed trade, medical, automotive supply chain and femtech sectors.",
  slogan: "Rotanızı dünyaya çevirin, biz pusulanız olalım.",
  sloganEn: "Take your business around the world — we'll be your compass.",
  areasServed: ["Türkiye", "Avrupa", "Orta Doğu", "Afrika", "Asya", "Amerika"],
  hours: "Pazartesi–Cuma 09:00–18:00 (GMT+3)",
};

/** Sayfa başlıkları ve açıklamaları — tek tek özgün. */
export const PAGES = {
  home: {
    title: "GENCO — Türkiye'deki Uluslararası Ticaret Ekibiniz",
    titleEn: "GENCO — Your International Trade Team in Turkey",
    description:
      "2008'den beri İzmir'den ithalat ve ihracat operasyonlarını yürütüyoruz. Çelik, denizcilik, medikal, tohumculuk, otomotiv ve femtech sektörlerinde ürün kaynağından gümrükleme ve teslimata kadar tüm zincir bizim sorumluluğumuzda.",
    descriptionEn:
      "Since 2008 we have run import and export operations from Izmir. Across steel, marine, medical, seed trade, automotive and femtech sectors, the entire chain from sourcing to delivery is our responsibility.",
  },
  services: {
    title: "İthalat & İhracat Hizmetleri — Anahtar Teslim Operasyon",
    titleEn: "Import & Export Services — Turnkey Operations",
    description:
      "Dış kaynaklı ihracat departmanı, üretici denetimi, GTİP tespiti, akreditif ve gümrükleme hizmetleri. Ambalaj tasarımı, baskı öncesi destek ve baskı dâhil uçtan uca çözümler.",
    descriptionEn:
      "Outsourced export department, manufacturer audits, HS code determination, letter of credit and customs clearance services, including packaging design, pre-press support and printing.",
  },
  industries: {
    title: "Sektörlerimiz — Çelik, Denizcilik, Medikal, Ambalaj, Tohum, Femtech",
    titleEn: "Our Sectors — Steel, Marine, Medical, Packaging, Seed, Femtech",
    description:
      "Altı ana sektörde tescilli teknik bilgi ve yerleşik alıcı ağları: vasıflı çelik, yatçılık ve marine ekipmanı, tohumculuk, medikal ve cerrahi sarf, otomotiv yan sanayi, ambalaj ve femtech.",
    descriptionEn:
      "Proprietary technical knowledge and established buyer networks across six sectors: engineering steel, yachting and marine equipment, seed trade, medical and surgical consumables, automotive supply chain, packaging and femtech.",
  },
  caseStudies: {
    title: "Vaka Analizleri — Sektör, Pazar ve Kapsam",
    titleEn: "Case Studies — Sector, Market and Scope",
    description:
      "Yürüttüğümüz operasyonların sektör, pazar ve kapsam bazlı incelemesi. Müşteri ve hacim bilgileri gizlilik nedeniyle paylaşılmamaktadır.",
    descriptionEn:
      "A sector, market and scope breakdown of the operations we have run. Client and volume figures are withheld for confidentiality.",
  },
  insights: {
    title: "Sektör Analizleri — Çelik, Medikal, Denizcilik, Tohum, Ambalaj",
    titleEn: "Sector Insights — Steel, Medical, Marine, Seed, Packaging",
    description:
      "Uluslararası ticarette sahadan çıkardığımız stratejik notlar: çelik toleransları, medikal tedarik zincirleri, denizcilik uyumu, tohum izinleri, baskı öncesi kontrol ve MDR kapsamı.",
    descriptionEn:
      "Strategic notes from the field: steel tolerances, medical supply chains, marine compliance, seed permits, pre-press control and MDR scope.",
  },
  about: {
    title: "Hakkımızda — 2008'den beri İzmir'de İthalat-İhracat",
    titleEn: "About Us — Import & Export in Izmir Since 2008",
    description:
      "Genco İthalat İhracat Medikal Ürün San. Tic. Ltd. Şti. 2008'de İzmir Bornova'da kuruldu. Dış ticaret süreçlerinin en başından gümrükleme işlemlerinin tamamlanmasına kadar tüm süreci yönetiyoruz.",
    descriptionEn:
      "Founded in 2008 in Bornova, Izmir, we manage every step of foreign trade from initial research through to completion of customs clearance.",
  },
  contact: {
    title: "İletişim — Teklif ve Proje Talebi",
    titleEn: "Contact — Request a Quote or Project",
    description:
      "İthalat ve ihracat operasyonlarınız için teklif ve proje talebi. +90 505 926 12 51 · info@gencotr.com · İzmir Bornova. Hafta içi 09:00–18:00 arası dönüş yapıyoruz.",
    descriptionEn:
      "Request a quote or project for your import and export operations. +90 505 926 12 51 · info@gencotr.com · Bornova, Izmir. We reply on weekdays between 09:00 and 18:00.",
  },
  gizlilik: {
    title: "Gizlilik Politikası — KVKK Aydınlatma Metni",
    titleEn: "Privacy Policy — KVKK Notice",
    description:
      "6698 sayılı KVKK kapsamında web sitemiz üzerinden paylaştığınız kişisel verilerin nasıl işlendiğini açıklayan aydınlatma metni. Veri sorumlusu ve haklarınız hakkında bilgilendirme.",
    descriptionEn:
      "Our notice explaining how personal data shared through this website is processed under Turkish Personal Data Protection Law no. 6698 (KVKK), including the data controller and your rights.",
  },
};

/** Sektör listesi — /industries ve yapısal veri için tek kaynak. */
export const SECTORS = [
  { tr: "Vasıflı Çelik", en: "Engineering Steel" },
  { tr: "Yatçılık & Marine", en: "Yachting & Marine" },
  { tr: "Tohumculuk", en: "Seed Trade" },
  { tr: "Medikal & Sağlık", en: "Medical & Health" },
  { tr: "Ambalaj", en: "Packaging" },
  { tr: "Femtech & Sağlık Teknolojileri", en: "Femtech & Health Tech" },
];

/** Hizmet listesi — Service şeması ve hizmet sayfası. */
export const SERVICES = [
  {
    tr: "Dış Kaynaklı İhracat Departmanı",
    en: "Outsourced Export Department",
    desc: "Şirket içi departman kurmadan uluslararası satış ekibi.",
    descEn: "An international sales team without building an in-house department.",
  },
  {
    tr: "Nitelikli Tedarik ve Üretici Denetimi",
    en: "Qualified Sourcing and Manufacturer Audits",
    desc: "Doğru üreticiyi bulma, kapasite ve kalite denetimi.",
    descEn: "Finding the right manufacturer, auditing capacity and quality.",
  },
  {
    tr: "Tolerans ve Standart Uyumu",
    en: "Tolerance and Standards Compliance",
    desc: "EN, ASTM ve GTİP uyumunun teknik dosyayla güvence altına alınması.",
    descEn: "Securing EN, ASTM and HS code compliance with technical documentation.",
  },
  {
    tr: "Veri Odaklı Alıcı ve Distribütör Bulma",
    en: "Data-Driven Buyer and Distributor Finding",
    desc: "Doğrudan karar vericilere ulaşan ticari iletişim.",
    descEn: "Commercial outreach that reaches decision-makers directly.",
  },
  {
    tr: "Anahtar Teslim İthalat",
    en: "Turnkey Import",
    desc: "Ön araştırmadan gümrükleme ve depoya teslimata kadar tüm zincir.",
    descEn: "The entire chain from pre-research through customs to delivery.",
  },
  {
    tr: "Ambalaj Tasarımı, Baskı Öncesi Destek ve Baskı",
    en: "Packaging Design, Pre-Press Support and Printing",
    desc: "Fikirden baskılı ürüne kadar uçtan uca ambalaj hizmeti.",
    descEn: "End-to-end packaging service from idea to printed product.",
  },
];

/** Tam adresi tek satırda döndürür (schema ve görünen metin için). */
export function fullAddress() {
  const a = ORG.address;
  return `${a.street}, ${a.district}/${a.city} – ${a.countryName}`;
}

/** Sayfa URL'si. */
export function pageUrl(pathname = "/") {
  return `${SITE_URL}${pathname === "/" ? "" : pathname}`;
}