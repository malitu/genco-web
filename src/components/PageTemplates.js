/**
 * GENCO — Alt Sayfa Şablonları
 * ---------------------------------------------------------------------------
 * Her alt sayfanın başlangıç içeriği. Stüdyoda o sayfa için hiç blok
 * yayınlanmamışsa bu şablonlar canlı sitede gösterilir; kullanıcı panelden
 * düzenleyip "Kaydet & Yayınla" dediğinde bloklar Firestore'a yazılır ve
 * bundan sonra şablon yerine yayınlanan bloklar kullanılır.
 *
 * Metinler eski sayfa dosyalarındaki TR/EN içeriklerin birebir taşınmış
 * hâlidir; hiçbir metin kaybolmamıştır.
 */

import {
  NAV_DEFAULTS,
  FOOTER_DEFAULTS,
  PAGE_HEADER_DEFAULTS,
  CARD_GRID_DEFAULTS,
  FEATURE_BLOCK_DEFAULTS,
  ARTICLE_LIST_DEFAULTS,
  CTA_BAND_DEFAULTS,
  CONTACT_DEFAULTS,
  FAQ_DEFAULTS,
  STATS_BAND_DEFAULTS,
  MEDIA_DEFAULTS,
} from "./GencoBlocks";

const bi = (tr, en) => ({ tr, en });

const nav = () => ({ ...NAV_DEFAULTS, id: "tpl_nav" });
const footer = () => ({ ...FOOTER_DEFAULTS, id: "tpl_footer" });

const header = (badge, heading, sub) => ({
  ...PAGE_HEADER_DEFAULTS,
  id: "tpl_header",
  badge: bi(badge.tr, badge.en),
  heading: bi(heading.tr, heading.en),
  sub: bi(sub.tr, sub.en),
});

/**
 * @param {string} scope  Vaka analizlerinde gösterilecek kapsam satırı
 *                        (sektör · pazar · yapılan iş). Boş bırakılırsa gizlenir.
 */
const feature = (id, eyebrow, heading, desc, items, boxTitle, boxSub, scope = null) => ({
  ...FEATURE_BLOCK_DEFAULTS,
  id,
  eyebrow: bi(eyebrow.tr, eyebrow.en),
  scope: scope ? bi(scope.tr, scope.en) : bi("", ""),
  heading: bi(heading.tr, heading.en),
  desc: bi(desc.tr, desc.en),
  items: items.map((t, i) => ({ id: `${id}_i${i}`, title: bi(t.tr, t.en) })),
  boxTitle: bi(boxTitle.tr, boxTitle.en),
  boxSub: bi(boxSub.tr, boxSub.en),
});

const cta = (id, badge, heading, sub, buttonLabel) => ({
  ...CTA_BAND_DEFAULTS,
  id,
  badge: bi(badge.tr, badge.en),
  heading: bi(heading.tr, heading.en),
  sub: bi(sub.tr, sub.en),
  buttonLabel: bi(buttonLabel.tr, buttonLabel.en),
  buttonHref: "/contact",
});

/**
 * Fotoğraf bandı / görsel bloğu.
 * @param {string} id
 * @param {"row"|"spotlight"|"split"} layout
 * @param {Array<{url, tr, en}>} items  görsel + altyazı (iki dilli)
 * @param {{tr,en}} heading  boş bırakılabilir
 */
const media = (id, layout, items, heading = null, body = null) => ({
  ...MEDIA_DEFAULTS,
  id,
  layout,
  captionPosition: layout === "row" ? "below" : "below",
  heading: heading ? bi(heading.tr, heading.en) : bi("", ""),
  body: body ? bi(body.tr, body.en) : bi("", ""),
  items: items.map((it, i) => ({
    id: `${id}_m${i + 1}`,
    kind: "image",
    url: it.url,
    caption: bi(it.tr, it.en),
  })),
});

/* ========================================================================== *
 *  Hizmetler — /services
 * ========================================================================== */

const services = [
  nav(),
  header(
    { tr: "Uçtan Uca Ticaret Yönetimi", en: "End-to-End Trade Management" },
    {
      tr: "Dış ticaret operasyonunuzu baştan sona yönetiyoruz",
      en: "We Manage Your Entire Foreign Trade Operation",
    },
    {
      tr: "Kendi bünyenizde bir ihracat departmanı kurmadan, dışarıdan çalışan profesyonel bir ekip gibi hizmet veriyoruz: doğru pazarı buluyor, doğru alıcıyı tespit ediyor, müzakereleri yürütüyor ve sevkiyat kapanışına kadar süreci biz yönetiyoruz.",
      en: "We work as a professional team outside your organisation instead of asking you to build an in-house export department: we identify the right market and the right buyer, run the negotiations, and manage the process through to shipment closure.",
    }
  ),
  feature(
    "tpl_svc_1",
    { tr: "01 / OUTSOURCED EXPORT", en: "01 / OUTSOURCED EXPORT" },
    {
      tr: "Dış Kaynaklı İhracat Departmanı",
      en: "Outsourced Export Department",
    },
    {
      tr: "Kendi bünyenizde maliyetli bir ihracat departmanı kurma yüküne girmeden, küresel pazar dinamiklerine hakim profesyonel bir dış ticaret ekibiyle doğrudan çalışın. Ürünlerinizin hedef pazarlardaki en doğru alıcılara sunulmasını ve satış kapanışlarını üstleniyoruz.",
      en: "Work directly with an expert foreign trade team specialized in global market dynamics without the burden of building an expensive internal export department. We ensure your products reach the right buyers and handle sales closures.",
    },
    [
      { tr: "Hedef Pazar & Rakip Analizi", en: "Target Market & Competitor Analysis" },
      { tr: "C-Level Karar Verici Teması", en: "Direct C-Level Decision-Maker Access" },
      { tr: "Teklif & Sözleşme Yönetimi", en: "Offer & Contract Management" },
      { tr: "Küresel Dağıtım Ağı Kurulumu", en: "Global Distribution Network Setup" },
    ],
    {
      tr: "Sıfır Kurulum Maliyeti, Doğrudan Satış",
      en: "Zero Setup Cost, Direct Sales",
    },
    {
      tr: "İzmir merkezli operasyon gücümüzle, markanızı uluslararası arenada aktif olarak temsil ediyor ve yeni pazarlara en kısa sürede giriş yapmanızı sağlıyoruz.",
      en: "With our Izmir-based operational strength, we actively represent your brand in the international arena and ensure rapid entry into new markets.",
    }
  ),
  feature(
    "tpl_svc_2",
    { tr: "02 / STRATEGIC SOURCING", en: "02 / STRATEGIC SOURCING" },
    {
      tr: "Nitelikli Tedarik ve Üretici Denetimi",
      en: "Qualified Sourcing & Manufacturer Audits",
    },
    {
      tr: "Uluslararası alıcılar için Türkiye’den güvenli ve standartlara tam uyumlu tedarik zinciri kuruyoruz. Kritik mühendislik gereksinimlerinize eksiksiz uyan üreticileri buluyor, kapasite ve kalite denetimlerini yerinde gerçekleştiriyoruz.",
      en: "We build secure, fully compliant supply chains from Turkey for international buyers. We identify manufacturers matching your critical engineering specs and conduct on-site capacity and quality audits.",
    },
    [
      { tr: "Teknik Şartname Uyumluluğu", en: "Technical Spec Compliance" },
      { tr: "Fabrika Kapasite Denetimi", en: "Factory Capacity Audits" },
      { tr: "Numune & Pilot Üretim", en: "Sample & Pilot Production" },
      { tr: "Sevkiyat Kalite Kontrolü", en: "Shipment Quality Control" },
    ],
    {
      tr: "Tolerans & Standart Uyumu",
      en: "Tolerance & Standard Compliance",
    },
    {
      tr: "Demir çelik alaşım standartlarından medikal polimerlere kadar kritik teknik şartnamelerin sahada eksiksiz uygulanmasını denetliyoruz.",
      en: "We ensure precise on-site execution of critical technical specifications ranging from steel alloy standards to medical polymers.",
    }
  ),
  feature(
    "tpl_svc_3",
    { tr: "03 / B2B LEAD GENERATION", en: "03 / B2B LEAD GENERATION" },
    {
      tr: "Veri Odaklı Alıcı & Distribütör Bulma",
      en: "Data-Driven Buyer & Distributor Sourcing",
    },
    {
      tr: "Jenerik listelerle zaman kaybetmiyoruz. Küresel ticaret istihbarat ağları, tescilli veritabanları ve çok katmanlı araştırma metodolojimiz üzerinden doğrudan ithalatçıları tespit ederek nokta atışı outreach kampanyaları yürütüyoruz.",
      en: "We don't waste time with generic lists. Through global trade intelligence networks, proprietary databases, and multi-layered research methodologies, we pinpoint importers and execute laser-focused outreach campaigns.",
    },
    [
      { tr: "Doğrulanmış C-Level Veriler", en: "Verified C-Level Data" },
      { tr: "Sektörel Outreach Stratejisi", en: "Sectoral Outreach Strategy" },
      { tr: "Bölgesel Partner Eşleştirme", en: "Regional Partner Matching" },
      { tr: "Aktif Dönüşüm Takibi", en: "Active Conversion Tracking" },
    ],
    {
      tr: "Nokta Atışı Karar Verici Erişimi",
      en: "Laser-Focused Decision-Maker Access",
    },
    {
      tr: "Doğru kişiye, doğru zamanda ve doğru teknik argümanlarla ulaşarak satış döngülerini hızlandırıyoruz.",
      en: "We accelerate sales cycles by reaching the right person at the right time with the right technical arguments.",
    }
  ),
  feature(
    "tpl_svc_4",
    { tr: "04 / MARKET ENTRY", en: "04 / MARKET ENTRY" },
    {
      tr: "Türkiye ve Avrupa Pazarına Giriş Stratejisi",
      en: "Turkey & European Market Entry Strategy",
    },
    {
      tr: "Küresel markaların Türkiye pazarındaki yapılanmalarında ya da Türk üreticilerin Avrupa ağlarında büyümesinde regülasyon uyumu, gümrük süreçleri ve yerel bayi/distribütör yapılanmalarını koordine ediyoruz.",
      en: "We coordinate regulatory compliance, customs procedures, and local dealer/distributor setups for global brands entering Turkey or Turkish producers growing in European networks.",
    },
    [
      { tr: "Regülasyon & Mevzuat Uyumu", en: "Regulatory & Compliance Harmonization" },
      { tr: "Yerel Partner Eşleştirme", en: "Local Partner Matching" },
      { tr: "Operasyonel Süreç Kurulumu", en: "Operational Process Setup" },
      { tr: "Sürdürülebilir Büyüme Ağı", en: "Sustainable Growth Network" },
    ],
    {
      tr: "İzmir'den Küresel Pazarlara",
      en: "From Izmir to Global Markets",
    },
    {
      tr: "Yerel üretim gücü ile küresel standartlar arasında kusursuz bir ticari köprü kurarak operasyonel riskleri sıfıra indiriyoruz.",
      en: "We eliminate operational risks by establishing a seamless commercial bridge between local manufacturing power and global standards.",
    }
  ),
  cta(
    "tpl_svc_cta",
    { tr: "BİZİMLE ÇALIŞIN", en: "WORK WITH US" },
    {
      tr: "Ticari Operasyonunuzu Birlikte Tasarlayalım",
      en: "Let's Design Your Commercial Operation Together",
    },
    {
      tr: "İhtiyacınıza uygun modeli belirlemek ve doğrudan sahada çalışmaya başlamak için bizimle iletişime geçin.",
      en: "Contact us to determine the model suited to your needs and start working directly on the ground.",
    },
    { tr: "Projenizi Görüşelim", en: "Discuss Your Project" }
  ),

  /* ---- Anahtar Teslim İthalat ------------------------------------------------
     Eski sitedeki "Kullan-at ithalat" hizmetinin güncel adı ve içeriği.
     Panelden adı ve metinleri değiştirilebilir. ---------------------------- */
  {
    ...CARD_GRID_DEFAULTS,
    id: "tpl_svc_turnkey",
    columns: 2,
    heading: bi("Anahtar Teslim İthalat", "Turnkey Import"),
    sub: bi(
      "Firmanızın kendi bünyesinde takip edemeyeceği ithalat süreçlerini biz üstleniyoruz. Ürün kaynağından gümrükleme ve depoya ulaşmaya kadar tüm zincir tek elden yönetilir.",
      "We take over the import processes your company cannot manage in-house. From product sourcing through customs clearance and delivery to your warehouse, the entire chain is handled by us."
    ),
    cards: [
      {
        id: "tpl_svc_tt1",
        eyebrow: bi("ÖN ARAŞTIRMA", "FEASIBILITY"),
        title: bi("Ön araştırma ve fizibilite", "Pre-research and feasibility"),
        desc: bi(
          "Sektörünüzün ve ithal etmek istediğiniz ürünün özgün yönlerini analiz ediyor, potansiyel tedarikçi ülkelerin ekonomik ve lojistik koşullarını değerlendiriyor, gümrük uyumluluk gereksinimlerini ve taşıma modlarını ortaya koyuyoruz. Sonuç: ithalatınızın fizibilitesi, riskleri ve faydaları hakkında bilinçli karar verebileceğiniz bir ön rapor.",
          "We analyse the specifics of your sector and the product you intend to import, evaluate the economic and logistics conditions of potential supplier countries, and lay out customs compliance requirements and shipping options. The result is a pre-research report so you can make an informed decision on feasibility, risk and benefit."
        ),
        note: bi("", ""),
        image: "",
      },
      {
        id: "tpl_svc_tt2",
        eyebrow: bi("TEKLİF", "SOURCING"),
        title: bi("Tedarikçi seçimi ve fiyat", "Supplier selection and pricing"),
        desc: bi(
          "Yurt içinde fiyat, kalite veya tasarım avantajı sunabilecek ürünler için farklı ülke ve üreticilerden teklif topluyor, ihracatçı firmalarla pazarlıkları yürütüyor, en uygun GTİP numaralarını tespit ediyor ve taşıma masraflarını raporluyoruz.",
          "For products that offer price, quality or design advantages, we collect quotations from multiple countries and manufacturers, negotiate with exporters, identify the most suitable HS codes, and report freight costs."
        ),
        note: bi("", ""),
        image: "",
      },
      {
        id: "tpl_svc_tt3",
        eyebrow: bi("OPERASYON", "EXECUTION"),
        title: bi("Doküman, taşıma ve gümrükleme", "Documentation, freight and customs"),
        desc: bi(
          "Aynı ithalatı birden fazla ülkeden denemek zorunda kalmayın. Akreditif yazımı ve açılışından sevkiyat takibine, uluslararası taşıma ve sigortaya, denetim ve kalite uyum testlerinden gümrükleme ile yurt içi taşımacılığa kadar tüm adımları biz yürütüyoruz.",
          "You no longer have to try the same import from multiple countries. From letter-of-credit issuance and shipment tracking to international freight and insurance, quality compliance testing, customs clearance and domestic delivery, we execute every step."
        ),
        note: bi("", ""),
        image: "",
      },
      {
        id: "tpl_svc_tt4",
        eyebrow: bi("SONUÇ", "OUTCOME"),
        title: bi("Depoya ulaşan ürün", "Product delivered to your door"),
        desc: bi(
          "Her aşamayı sıfır risk ilkesiyle yönetiyor, ürünün eksiksiz ve hatasız biçimde deponuza ulaşmasını sağlıyoruz. Böylece bürokratik karmaşalarla ve uzun prosedürlerle uğraşmadan ana işinize odaklanıyorsunuz.",
          "We manage every step on a zero-risk principle and ensure your goods arrive at your warehouse complete and correct — so you stay focused on your core business instead of bureaucracy."
        ),
        note: bi("", ""),
        image: "",
      },
    ],
  },

  /* ---- Fotoğraf bandı: operasyon sahada yürüyor ---- */
  media(
    "tpl_svc_band",
    "row",
    [
      {
        url: "/img/services-band-warehouse.webp",
        tr: "Konteyner yükleme anında operasyon: sevkiyat planlamasından istif ve teslimata kadar zincir birlikte yürür.",
        en: "Operations at the moment of container loading: from shipment planning to stacking and delivery, the chain moves together.",
      },
      {
        url: "/img/services-card-trade-review.webp",
        tr: "Dış ticaret ekibiyle masada: hedef pazar, alıcı profili ve sevkiyat takvimi birlikte netleştirilir.",
        en: "At the desk with the trade team: target market, buyer profile and shipment schedule are clarified together.",
      },
      {
        url: "/img/services-card-audit.webp",
        tr: "Üretim hattında yerinde denetim: kapasite, kalite ve teknik şartname uyumu sahada doğrulanır.",
        en: "On-site audit on the production line: capacity, quality and technical specification compliance are verified in the field.",
      },
    ],
    { tr: "Söz değil, operasyon", en: "Not promises, operations" }
  ),

  /* ---- Nasıl çalışıyoruz: süreç, koşul değil ---- */
  {
    ...ARTICLE_LIST_DEFAULTS,
    id: "tpl_svc_process",
    heading: bi("Nasıl çalışıyoruz?", "How We Work"),
    articles: [
      {
        id: "tpl_svc_p1",
        eyebrow: bi("ADIM 01", "STEP 01"),
        category: bi("TANIMA", "DISCOVERY"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Talebi ve kapsamı netleştirme", "Clarifying your need and scope"),
        body: bi(
          "Ürününüzü, hedef pazarınızı ve beklentinizi konuşuyoruz. Hangi ülkeye, hangi standartla, ne sıklıkla göndermek istediğinizi anladıktan sonra çalışma kapsamını birlikte tanımlıyoruz.",
          "We start by understanding your product, your target market and your expectations. Once we are clear on which country, which standards and how often you want to ship, we define the scope of work together."
        ),
      },
      {
        id: "tpl_svc_p2",
        eyebrow: bi("ADIM 02", "STEP 02"),
        category: bi("ANALİZ", "RESEARCH"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Pazar ve alıcı analizi", "Market and buyer analysis"),
        body: bi(
          "Tescilli ticaret istihbarat ağımız ve veritabanlarımız üzerinden hedef pazardaki gerçek alıcıları, ithalatçıları ve distribütörleri tespit ediyor; teknik şartname ve regülasyon gereksinimlerini çıkarıyoruz.",
          "Through our proprietary trade intelligence network and databases, we identify real buyers, importers and distributors in your target market, and extract the technical specification and regulatory requirements involved."
        ),
      },
      {
        id: "tpl_svc_p3",
        eyebrow: bi("ADIM 03", "STEP 03"),
        category: bi("UYGULAMA", "EXECUTION"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Tedarik, denetim ve müzakere", "Sourcing, auditing and negotiation"),
        body: bi(
          "Üretici kapasitesini ve kalite süreçlerini yerinde denetliyor, teklifleri koordine ediyor, müzakereleri bizzat yürütüyor ve sevkiyat planını oluşturuyoruz.",
          "We audit manufacturer capacity and quality processes on site, coordinate quotations, conduct the negotiations ourselves, and prepare the shipment plan."
        ),
      },
      {
        id: "tpl_svc_p4",
        eyebrow: bi("ADIM 04", "STEP 04"),
        category: bi("SÜREKLİLİK", "CONTINUITY"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Kapanış ve uzun vadeli ağ", "Closure and long-term network"),
        body: bi(
          "Sevkiyat kapanışına kadar süreci yönetiyor, ardından tek seferlik satış yerine kalıcı distribütörlük ve bayi ağları kurarak büyümeyi sürdürüyoruz.",
          "We manage the process through to shipment closure, then go beyond one-off sales by building permanent distributor and dealer networks to sustain growth."
        ),
      },
    ],
  },

  /* ---- Sıkça sorulan sorular ---- */
  {
    ...FAQ_DEFAULTS,
    id: "tpl_svc_faq",
    heading: bi("Sıkça sorulan sorular", "Frequently asked questions"),
    sub: bi(
      "En çok merak edilen dört soru. Yanıtını bulamazsanız iletişim formundan yazabilirsiniz.",
      "The four questions we are asked most. If your answer is not here, contact us through the form."
    ),
    items: [
      {
        id: "tpl_svc_fq1",
        question: bi(
          "Kendi bünyemizde ihracat departmanı kurmamız gerekiyor mu?",
          "Do we need to set up our own export department?"
        ),
        answer: bi(
          "Hayır. Dış kaynaklı ihracat departmanı hizmetimiz tam olarak bunun için var: dışarıdan çalışan profesyonel bir ekip, sizin ekibinize ek yük bindirmeden aynı işi yapar. Sonradan kendi ekibinizi kurmak isterseniz bu süreçte de yol gösteriyoruz.",
          "No. Our outsourced export department service exists precisely for this: a professional team working from outside performs the same job without adding load to your own staff. If you later prefer to build an internal team, we guide you through that transition as well."
        ),
      },
      {
        id: "tpl_svc_fq2",
        question: bi(
          "Çalışma şekliniz ve ücretlendirmeniz nedir?",
          "How does your working and pricing model look?"
        ),
        answer: bi(
          "Kapsam her proje için farklılaşır; sabit bir paket uygulamıyoruz. İlk görüşmede ürününüzü, pazarınızı ve hedefinizi dinleyip size özel bir kapsam ve öneri hazırlıyoruz.",
          "Scope differs for every project; we do not run a fixed package. In the first meeting we listen to your product, market and goals, then prepare a scope and proposal tailored to you."
        ),
      },
      {
        id: "tpl_svc_fq3",
        question: bi(
          "Hangi sektörlerde çalışıyorsunuz?",
          "Which sectors do you work in?"
        ),
        answer: bi(
          "Demir çelik, medikal, denizcilik, tohumculuk, ambalaj ve femtech başta olmak üzere altı ana sektörde özel uzmanlığımız var. Bunların dışındaki sektörler için de aynı metodolojiyle çalışabiliyoruz.",
          "We have dedicated expertise in six core sectors, led by steel, medical, marine, agriculture, packaging and femtech. We also apply the same methodology in sectors outside these core domains."
        ),
      },
      {
        id: "tpl_svc_fq4",
        question: bi(
          "Sonuç garantisi veriyor musunuz?",
          "Do you guarantee results?"
        ),
        answer: bi(
          "Pazara giriş sürecinin tamamını birlikte yürütüyor, teknik uygunluğu sahada doğruluyor ve sevkiyatın kapanmasına kadar operasyonu yönetiyoruz. Ticari sonucun garanti edilmesi yerine, sürecin şeffaf ve denetlenebilir ilerlemesini taahhüt ediyoruz.",
          "We run the full market-entry process together, verify technical compliance on site, and manage operations until the shipment closes. Rather than promising a guaranteed commercial outcome, we commit to a transparent, auditable process."
        ),
      },
    ],
  },

  footer(),
];

/* ========================================================================== *
 *  Sektörler — /industries
 * ========================================================================== */

const industries = [
  nav(),
  header(
    {
      tr: "Sektörel Yetkinlik ve Uzmanlık",
      en: "Sectoral Competence & Expertise",
    },
    {
      tr: "Uzmanlaştığımız sektörler",
      en: "Industries We Specialise In",
    },
    {
        tr: "GENCO olarak kritik endüstriyel dikey sektörlerde tescilli teknik bilgiye ve yerleşik tedarikçi–alıcı ağlarına sahibiz. Bu altı alanda ithalat ve ihracat operasyonlarını bizzat kendimiz yürütüyoruz.",
        en: "At GENCO we hold proprietary technical knowledge and established supplier–buyer networks across critical industrial sectors. In these six areas we run the import and export operations ourselves.",
    }
  ),
  {
    ...CARD_GRID_DEFAULTS,
    id: "tpl_ind_grid",
    heading: bi("", ""),
    sub: bi("", ""),
    columns: 3,
    cards: [
      {
        id: "tpl_ind_1",
        eyebrow: bi("01 / SEKTÖR", "01 / SECTOR"),
        title: bi("Vasıflı Çelik Çubuk", "Engineering Steel Bars"),
        desc: bi(
          "Vasıflı (engineering) çelik çubuk gruplarında ithalat ve ihracat. EN ve ASTM normlarına uyum, hassas ölçü ve tolerans yönetimi ile tedarikçi ve alıcı koordinasyonu.",
          "Import and export of engineering steel bar groups. EN and ASTM compliance, precision dimension and tolerance management, and supplier–buyer coordination."
        ),
        note: bi("✓ Vasıflı Çelik İthalat & İhracat", "✓ Engineering Steel Import & Export"),
        image: "/img/sector-photo-steel.webp",
      },
      {
        id: "tpl_ind_2",
        eyebrow: bi("02 / SEKTÖR", "02 / SECTOR"),
        title: bi("Yatçılık & Marine Ekipman", "Yachting & Marine Equipment"),
        desc: bi(
          "Yatçılık ve marine ekipmanı üzerinden ithalat-ihracat. Aksesuar ve güvenlik ekipmanları, CE ve tescil uyumu, sevkiyat süreçleri.",
          "Import and export in yachting and marine equipment. Accessories and safety equipment, CE and registration compliance, shipment processes."
        ),
        note: bi("✓ Aksesuar & Güvenlik Ekipmanları", "✓ Accessories & Safety Equipment"),
        image: "/img/sector-photo-marine.webp",
      },
      {
        id: "tpl_ind_3",
        eyebrow: bi("03 / SEKTÖR", "03 / SECTOR"),
        title: bi("Tohumculuk", "Seed Trade"),
        desc: bi(
          "Tohum ithalat ve ihracatı. Ürün izinlerinin alınması, analiz süreçlerinin yönetilmesi, bitki sağlığı ve sertifikasyon gereksinimlerinin takibi.",
          "Seed import and export. Securing product permits, managing analysis processes, tracking phytosanitary and certification requirements."
        ),
        note: bi("✓ İzin & Analiz Süreçleri", "✓ Permit & Analysis Processes"),
        image: "/img/sector-photo-seeds.webp",
      },
      {
        id: "tpl_ind_4",
        eyebrow: bi("04 / SEKTÖR", "04 / SECTOR"),
        title: bi("Medikal & Sağlık", "Medical & Healthcare"),
        desc: bi(
          "Medikal malzemeler ve cerrahi sarf ürünlerinde ithalat-ihracat. Ürün grubunun regülasyon gereksinimlerine göre tedarikçi, alıcı ve sevkiyat koordinasyonu.",
          "Import and export of medical supplies and surgical consumables. Supplier, buyer and shipment coordination shaped by each product group's regulatory requirements."
        ),
        note: bi("✓ Cerrahi Sarf & Medikal Ürünleri", "✓ Surgical & Medical Products"),
        image: "/img/sector-photo-medical.webp",
      },
      {
        id: "tpl_ind_5",
        eyebrow: bi("05 / SEKTÖR", "05 / SECTOR"),
        title: bi("Ambalaj", "Packaging"),
        desc: bi(
          "Ambalaj tasarımı, baskı öncesi hazırlık ve baskı hizmetleri. Fikirden baskılı ürüne kadar tüm zincir tek elden yürütülür: tasarım, prepress kontrol, kalıp ve plaka, baskı ve sonrası işlemler.",
          "Packaging design, pre-press preparation and printing. The entire chain is handled end to end, from the initial idea to the printed product: design, prepress checks, tooling and plates, printing and post-press finishing."
        ),
        note: bi("✓ Tasarım · Prepress · Baskı", "✓ Design · Prepress · Printing"),
        image: "/img/sector-photo-packaging.webp",
      },
      {
        id: "tpl_ind_6",
        eyebrow: bi("06 / SEKTÖR", "06 / SECTOR"),
        title: bi(
          "Femtech & Sağlık Teknolojileri",
          "Femtech & Health Tech"
        ),
        desc: bi(
          "Kadın sağlığı ve yenilikçi sağlık teknolojileri alanında ihracat. Hedef pazar analizi, alıcı tespiti, düzenleyici gereksinimlerin takibi ve sevkiyat koordinasyonu.",
          "Exports in women's health and innovative health technologies. Market analysis, buyer identification, tracking regulatory requirements and shipment coordination."
        ),
        note: bi("✓ Sağlık Ürünleri İhracatı", "✓ Health Product Exports"),
        image: "/img/sector-photo-femtech.webp",
      },
    ],
  },
  cta(
    "tpl_ind_cta",
    { tr: "Sınırsız Operasyonel Esneklik", en: "Unlimited Operational Flexibility" },
    { tr: "Uzmanlık Alanlarımız Dışında Mısınız?", en: "Outside Our Core Fields?" },
    {
      tr: "GENCO'nun tescilli tedarik ve pazar araştırma metodolojisi, sektörel ayrıcalık gözetmeksizin her türlü ürüne ve hammaddeye uyarlanabilir. Hangi sektörde olursanız olun, ithalat ve ihracat hedefinizi sahada gerçeğe dönüştürüyoruz.",
      en: "GENCO's proprietary sourcing and market research methodology can adapt to any product or raw material without sectoral limitations. No matter your industry, we turn your import and export goals into reality on the ground.",
    },
    { tr: "Sektörünüzü Görüşelim", en: "Discuss Your Industry" }
  ),
  footer(),
];

/* ========================================================================== *
 *  Vaka Analizleri — /case-studies
 * ========================================================================== */

const caseStudies = [
  nav(),
  header(
    { tr: "Vaka Analizleri — Sahadaki İcraatlarımız", en: "Case Studies — Our Field Execution" },
    {
      tr: "Yaptığımız işler: sektör, pazar ve kapsam",
      en: "What we have done: sector, market and scope",
    },
    {
      tr: "Bu sayfa **yürüttüğümüz somut operasyonları** gösterir: hangi sektörde, hangi pazarda, ne kapsamda çalıştık. Müşteri ve hacim bilgileri gizlilik nedeniyle paylaşılmamaktadır.\n\nSektörün kendisiyle ilgili teknik ve düzenleyici tartışmaları için Sektör Analizleri sayfasına bakın.",
      en: "This page shows the concrete operations we have run: in which sector, in which market, and with what scope. Client and volume figures are withheld for confidentiality.\n\nFor technical and regulatory discussion of the sectors themselves, see the Sector Insights page.",
    }
  ),
  media(
    "tpl_cs_band",
    "row",
    [
      {
        url: "/img/cases-band-ship.webp",
        tr: "Her vaka bir sektör, bir pazar ve bir kapsam taşır. Sayılar gizlidir; kapsamı paylaşırız.",
        en: "Each case carries a sector, a market and a scope. The figures are confidential; we share the scope.",
      },
    ],
    null
  ),
  feature(
    "tpl_cs_1",
    { tr: "VAKA / 01", en: "CASE / 01" },
    {
      tr: "Vasıflı Çelik Çubuk İthalat ve İhracatı",
      en: "Engineering Steel Bar Import and Export",
    },
    {
      tr: "Vasıflı (engineering) çelik çubuk grubunda ithalat ve ihracat operasyonları yürütüyoruz. Ürün gamını EN ve ASTM normlarına uygun hale getirme, hassas ölçü ve tolerans yönetimi ile tedarikçi ve alıcı koordinasyonu tek merkezden yürütülür.",
      en: "We run import and export operations in the engineering steel bar segment. Bringing the product range into EN and ASTM compliance, managing precision dimensions and tolerances, and coordinating suppliers and buyers are all handled from a single point.",
    },
    [
      { tr: "Vasıflı Çelik", en: "Engineering Steel" },
      { tr: "Çelik Çubuk", en: "Steel Bars" },
      { tr: "İthalat & İhracat", en: "Import & Export" },
    ],
    {
      tr: "Standart ve Ölçü Uyumu",
      en: "Standard and Dimensional Compliance",
    },
    {
      tr: "EN ve ASTM normlarında tam hakimiyetle metalurjik ve ölçüsel gereksinimlerin pazar beklentileriyle kusursuz buluşması sağlanır.",
      en: "With complete mastery of EN and ASTM norms, metallurgical and dimensional requirements are made to meet market expectations exactly.",
    },
    {
      tr: "Çelik çubuk tedarikçileri ve alıcıları · uluslararası pazarlar · ithalat ve ihracat",
      en: "Steel bar suppliers and buyers · international markets · import and export",
    }
  ),
  feature(
    "tpl_cs_2",
    { tr: "VAKA / 02", en: "CASE / 02" },
    {
      tr: "Yat ve Marine Ekipman İthalat-İhracatı",
      en: "Yacht and Marine Equipment Import-Export",
    },
    {
      tr: "Yatçılık ve marine ekipmanı alanında aksesuar ve güvenlik ekipmanları üzerinden ithalat-ihracat yapıyoruz. CE ve tescil dokümantasyonu, ürün uygunluğu ve sevkiyat süreçleri birlikte yönetilir.",
      en: "In the yachting and marine equipment field we run import and export in accessories and safety equipment. CE and registration documentation, product compliance and shipment processes are managed together.",
    },
    [
      { tr: "Yatçılık", en: "Yachting" },
      { tr: "Aksesuar & Güvenlik", en: "Accessories & Safety" },
      { tr: "İthalat & İhracat", en: "Import & Export" },
    ],
    { tr: "CE ve Tescil Uyumu", en: "CE and Registration Compliance" },
    {
      tr: "Yat ve kritik marine ekipmanlarının tescil gereksinimleri, CE ve gürültü emisyon belgeleri eksiksiz koordine edilir.",
      en: "Registration requirements, CE and noise emission documents for yachts and critical marine equipment are fully coordinated.",
    },
    {
      tr: "Yat ve marine ekipmanı · uluslararası pazarlar · aksesuar ve güvenlik ekipmanı",
      en: "Yacht and marine equipment · international markets · accessories and safety equipment",
    }
  ),
  feature(
    "tpl_cs_3",
    { tr: "VAKA / 03", en: "CASE / 03" },
    {
      tr: "Tohum İthalat-İhracatı ve İzin Süreçleri",
      en: "Seed Import-Export and Permit Processes",
    },
    {
      tr: "Tohum ithalat ve ihracatında ürün izinlerinin alınmasını, analiz süreçlerinin yönetilmesini ve lojistiği birlikte yürütüyoruz. Hedef ülkenin bitki sağlığı ve sertifikasyon gereksinimlerini takip ediyoruz.",
      en: "For seed import and export we handle product permits, analysis processes and logistics together. We track the phytosanitary and certification requirements of each destination country.",
    },
    [
      { tr: "Tohumculuk", en: "Seed Trade" },
      { tr: "İzin & Analiz", en: "Permits & Analysis" },
      { tr: "İthalat & İhracat", en: "Import & Export" },
    ],
    { tr: "İzin ve Analiz Süreçleri", en: "Permit and Analysis Processes" },
    {
      tr: "Tohumculukta hassas taşıma ve depolama standartlarına uygun uluslararası alıcı eşleştirmeleri tamamlanır.",
      en: "International buyer matchings meeting the sensitive transport and storage standards of seed products are completed.",
    },
    {
      tr: "Tohum tedarikçileri ve alıcıları · uluslararası pazarlar · izin, analiz ve ithalat-ihracat",
      en: "Seed suppliers and buyers · international markets · permits, analysis and trade",
    }
  ),
  feature(
    "tpl_cs_4",
    { tr: "VAKA / 04", en: "CASE / 04" },
    {
      tr: "Cerrahi Sarf Ürünleri İthalat-İhracatı",
      en: "Surgical Consumables Import-Export",
    },
    {
      tr: "Medikal malzemeler ve cerrahi sarf ürünlerinde ithalat ve ihracat operasyonları yürütüyoruz. Ürün grubunun pazar ve regülasyon gereksinimlerine göre tedarikçi ve alıcı koordinasyonu ile sevkiyat süreçleri yönetilir.",
      en: "We run import and export operations for medical supplies and surgical consumables. Supplier and buyer coordination and shipment processes are managed according to the market and regulatory requirements of each product group.",
    },
    [
      { tr: "Medikal & Sağlık", en: "Medical & Health" },
      { tr: "Cerrahi Sarf Ürünleri", en: "Surgical Consumables" },
      { tr: "İthalat & İhracat", en: "Import & Export" },
    ],
    { tr: "Regülasyon Uyumlu Tedarik", en: "Regulation-Compliant Supply" },
    {
      tr: "Üretim ve sevkiyat arasındaki tüm kalite güvence adımları tek merkezden yönetilir.",
      en: "Every quality assurance step between production and shipment is managed from a single point.",
    },
    {
      tr: "Cerrahi sarf ve medikal ürün grupları · uluslararası pazarlar · ithalat-ihracat",
      en: "Surgical and medical product groups · international markets · import and export",
    }
  ),
  feature(
    "tpl_cs_5",
    { tr: "VAKA / 05", en: "CASE / 05" },
    {
      tr: "Ambalaj Tasarımından Baskılı Ürüne Uçtan Uca Hizmet",
      en: "End-to-End Service from Packaging Design to Printed Product",
    },
    {
      tr: "Ambalaj ihtiyacınızı sıfırdan çalışarak yürütüyoruz. Ürününüzün fiziksel özelliklerine, raf ömrüne, taşıma koşullarına ve satış kanalına göre tasarım; ardından baskı öncesi kontrol, renk ve ölçü doğrulaması ile prova; sonra kalıp, plaka ve baskı üretimi. Aynı ekip dosyanın oluşturulmasından makineye verilmesine kadar süreci bırakmaz.",
      en: "We run your packaging requirement from scratch. Design is shaped around your product's physical properties, shelf life, transport conditions and sales channel; followed by pre-press checks, colour and dimension verification and proofs; then tooling, plates and print production. The same team carries the file from creation to the press.",
    },
    [
      { tr: "Ambalaj", en: "Packaging" },
      { tr: "Tasarım", en: "Design" },
      { tr: "Baskı Öncesi", en: "Pre-Press" },
      { tr: "Baskı", en: "Printing" },
    ],
    { tr: "Tek ekip, tüm zincir", en: "One team, the entire chain" },
    {
      tr: "Tasarım dosyasından baskılı ürüne kadar hiçbir aşamada aktarım kaybı yaşanmaz; renk ve ölçü tutarlılığı üretim boyunca korunur.",
      en: "No loss of fidelity at any stage between the design file and the printed product; colour and dimension consistency are preserved throughout production.",
    },
    {
      tr: "Ambalaj tasarımı ve baskı · uçtan uca hizmet · üretim öncesi kontrol",
      en: "Packaging design and printing · end-to-end service · pre-production control",
    }
  ),
  feature(
    "tpl_cs_6",
    { tr: "VAKA / 06", en: "CASE / 06" },
    {
      tr: "Femtech ve Sağlık Ürünleri İhracatı",
      en: "Femtech and Health Product Exports",
    },
    {
      tr: "Kadın sağlığı ve yenilikçi sağlık teknolojileri alanındaki markaların ihracat süreçlerini yürütüyoruz. Hedef pazar analizi, alıcı tespiti, düzenleyici gereksinimlerin takibi ve sevkiyat koordinasyonu ile ihracatı birlikte kuruyoruz.",
      en: "We run export operations for brands in women's health and innovative health technologies. Market analysis, buyer identification, tracking regulatory requirements and shipment coordination — we build the export operation together.",
    },
    [
      { tr: "Femtech", en: "Femtech" },
      { tr: "Sağlık Teknolojileri", en: "Health Technologies" },
      { tr: "İhracat", en: "Export" },
    ],
    { tr: "İhracat Operasyonu", en: "Export Operations" },
    {
      tr: "Uluslararası iş geliştirme stratejileri hayata geçirilir ve markaların dış pazarlara açılması desteklenir.",
      en: "International business development strategies are put into action and brands are supported in opening new markets.",
    },
    {
      tr: "Sağlık teknolojisi ve femtech markaları · uluslararası pazarlar · ihracat",
      en: "Health technology and femtech brands · international markets · export",
    }
  ),
  cta(
    "tpl_cs_cta",
    { tr: "BİZİMLE ÇALIŞIN", en: "WORK WITH US" },
    {
      tr: "Sektörünüzde Benzer Bir Başarı Hikayesi Yazalım",
      en: "Let's Write a Similar Success Story in Your Industry",
    },
    {
      tr: "Ürünlerinizi ve küresel ticaret hedeflerinizi görüşmek, operasyonel modelimizi birlikte planlamak için bizimle iletişime geçin.",
      en: "Contact us to discuss your products and global trade goals and plan our operational model together.",
    },
    { tr: "İletişime Geçin", en: "Get in Touch" }
  ),
  footer(),
];

/* ========================================================================== *
 *  Trade Intelligence — /insights
 * ========================================================================== */

const insights = [
  nav(),
  header(
    {
      tr: "Sektör Analizleri — Sektörün Kuralları",
      en: "Sector Insights — How the Sector Works",
    },
    {
      tr: "Sektör Analizleri: Sahadan Notlar",
      en: "Sector Insights: Notes from the Field",
    },
    {
      tr: "Bu sayfa **yaptığımız işleri değil, sektörün kendi kurallarını** anlatır: hangi standart, hangi izin, hangi tuzak. Uluslararası ticarette kendi deneyimimizden çıkardığımız stratejik notları burada paylaşıyoruz.\n\nYürüttüğümüz somut operasyonlar için Vaka Analizleri sayfasına bakın.",
      en: "This page is not about what we have done, but about how the sector itself works: which standard, which permit, which trap. Here we share the strategic notes drawn from our own experience in international trade.\n\nFor the concrete operations we have run, see the Case Studies page.",
    }
  ),
  media(
    "tpl_ins_band",
    "row",
    [
      {
        url: "/img/insights-band-steelmill.webp",
        tr: "Sektörün kurallarını sahada öğreniyoruz: tolerans, sertifikasyon, izin ve teslim süreleri gerçek üretimde belirlenir.",
        en: "We learn how a sector works in the field: tolerances, certification, permits and lead times are determined in real production.",
      },
    ],
    null
  ),
  {
    ...ARTICLE_LIST_DEFAULTS,
    id: "tpl_ins_articles",
    heading: bi("", ""),
    articles: [
      {
        id: "tpl_ins_1",
        eyebrow: bi("ANALİZ 01 / DEMİR ÇELİK & METALLER", "ANALYSIS 01 / STEEL & METALS"),
        category: bi(
          "TEKNİK & STRATEJİK ANALİZ",
          "TECHNICAL & STRATEGIC ANALYSIS"
        ),
        // Tarih ve yazar bilgisi şirketin kendi verisidir; panelden doldurulur.
        date: bi("", ""),
        author: bi("", ""),
        title: bi(
          "Çelik Çubuk İhracatında EN ve ASTM Standartları Neden Kritik?",
          "Why EN and ASTM Standards Are Critical in Steel Bar Exports?"
        ),
        body: bi(
          "Karbon, alaşımlı, paslanmaz ve sementasyon çelik çubuk ticaretinde küresel alıcıların en hassas olduğu konuların başında uluslararası standart uyumu gelmektedir. Üreticilerin sahip olduğu yerel normlar ile hedef pazardaki EN veya ASTM standartları arasındaki uyumsuzluk, sevkiyatların gümrükte kalmasına yol açabilir.\n\nGENCO olarak inç ve milimetre hassas tolerans dönüşümlerini laboratuvar seviyesinde koordine ediyor; ısıl işlem, çekme mukavemeti ve yüzey kalitesi gibi kritik metalurjik özellikleri teknik dosyayla alıcıya sunarak güven tesis ediyoruz.",
          "International standard compliance tops the list of concerns for global buyers in the carbon, alloy, stainless, and case-hardening steel bar trade. Mismatches between a manufacturer's local norms and the EN or ASTM standards of the target market can cause shipments to be held at customs.\n\nAs GENCO, we coordinate inch and millimetre precision tolerance conversions at laboratory level, and build buyer confidence by presenting critical metallurgical properties—heat treatment, tensile strength, and surface quality—with the technical documentation."
        ),
      },
      {
        id: "tpl_ins_2",
        eyebrow: bi("ANALİZ 02 / MEDİKAL & SAĞLIK", "ANALYSIS 02 / MEDICAL & HEALTH"),
        category: bi("TEDARİK ZİNCİRİ & DENETİM", "SUPPLY CHAIN & AUDITING"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi(
          "Cerrahi Sarf Malzemeleri Tedariğinde Yerinde Denetimin Önemi",
          "The Importance of On-Site Auditing in Surgical Consumables Sourcing"
        ),
        body: bi(
          "Medikal ve cerrahi sarf malzemeleri ticaretinde hata payı sıfırdır. Standart bobin ürünler yerine belirli uzunluklarda boyutlandırılmış ve uçları sertleştirilmiş cerrahi iplikler gibi kritik ürünlerde üreticinin kapasitesi hayati önem taşır.\n\nGENCO, alıcı adına yerel üretim tesislerini bizzat yerinde denetler; sterilizasyon koşullarından hammadde izlenebilirliğine kadar tüm aşamaları sahada yöneterek operasyonel riskleri ortadan kaldırır.",
          "In the medical and surgical consumables trade the margin for error is zero. For critical products—such as surgical sutures cut to specific lengths with hardened ends—rather than standard spool products, the manufacturer's capacity is vital.\n\nGENCO audits local manufacturing facilities on-site on behalf of the buyer; from sterilization conditions to raw material traceability, every stage is managed in the field to eliminate operational risks."
        ),
      },
      {
        id: "tpl_ins_3",
        eyebrow: bi("ANALİZ 03 / YATÇILIK & MARINE", "ANALYSIS 03 / YACHTING & MARINE"),
        category: bi("REGÜLASYON & UYUM", "REGULATION & COMPLIANCE"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi(
          "Denizcilik Ekipmanında CE ve Tescil Uyumunun Doğru Okunması",
          "Reading CE Marking and Type Approval Correctly in Marine Equipment"
        ),
        body: bi(
          "Denizcilik ekipmanı ticaretinde en sık yaşanan hata, CE işaretini bir kalite veya menşe işareti sanmaktır. CE yalnızca ilgili yönetmeliğe uyum beyanıdır; tek başına ürünün üretim kalitesini göstermez. Can kurtarma ve emniyet ekipmanlarında ise ek olarak tip onayı ve gemi adına tescil süreçleri devreye girer.\n\nGENCO olarak sevkiyat öncesi bu belge setini tek tek kontrol ediyoruz: uygunluk beyanı, teknik dosya, tip onayı numarası ve tescil uyumu. Eksik olan tek bir belge, gümrükte ciddi gecikme ve depoda mal tutulması anlamına geliyor.",
          "The most common mistake in the marine equipment trade is treating the CE mark as a sign of quality or origin. CE is only a declaration of conformity with the relevant directive; it does not by itself indicate manufacturing quality. For life-saving and safety equipment, type approval and vessel registration processes also apply.\n\nBefore shipment we verify this document set one by one: the declaration of conformity, the technical file, the type approval number and registration compliance. A single missing document means serious customs delays and stock being held at the warehouse."
        ),
      },
      {
        id: "tpl_ins_4",
        eyebrow: bi("ANALİZ 04 / TOHUMCULUK", "ANALYSIS 04 / SEED TRADE"),
        category: bi("İZİN & BELGELENDİRME", "PERMITS & CERTIFICATION"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi(
          "Tohum İthalatında İzin Zinciri: Analiz Sertifikasından Bitki Sağlığı Belgesine",
          "The Permit Chain in Seed Imports: From Analysis Certificate to Phytosanitary Certificate"
        ),
        body: bi(
          "Tohum, ithalatı en çok belgeye bağlı ürün gruplarından biridir. Doğru bir operasyon yalnızca tek bir izinle değil, birbirini izleyen bir zincirle ilerler: ithalat izni, laboratuvar analiz raporları, bitki sağlığı belgesi ve hedef ülkede çeşit tescili. Analiz sonuçları temizlenmiş tohumlarda olduğu gibi işlenmiş tohumlarda da geçerlidir ve belge üzerinde bu ayrım açıkça yazılır.\n\nGENCO olarak belge takibini operasyon başında planlıyor, her aşamanın sorumlusunu ve terminini netleştiriyoruz. Bir sonraki adımın önünü açmayan evrakı sevkiyat öncesi tamamlamak, gümrükte demirbaş beklemekten tek seçenektir.",
          "Seed is one of the most document-dependent import product groups. A correct operation runs on a chain of consecutive steps, not on a single permit: the import permit, laboratory analysis reports, the phytosanitary certificate, and variety registration in the destination country. Analysis results are valid both for cleaned and for treated seed, and this distinction is stated explicitly on the document.\n\nAt GENCO we plan the document trail from the start and fix the owner and the deadline of each step. Completing paperwork before it blocks the next step is the only alternative to waiting at customs with capital tied up."
        ),
      },
      {
        id: "tpl_ins_5",
        eyebrow: bi("ANALİZ 05 / AMBALAJ", "ANALYSIS 05 / PACKAGING"),
        category: bi(
          "ÜRETİM & ÖNCESİ KONTROL",
          "PRODUCTION & PRE-PRESS"
        ),
        date: bi("", ""),
        author: bi("", ""),
        title: bi(
          "Baskı Öncesi Kontrol: Rengi ve Ölçüyü Baskıda Kaybetmemek",
          "Pre-Press Control: Not Losing Colour and Dimensions on Press"
        ),
        body: bi(
          "Ambalajda en pahalı hata, tasarımın onaylanmış olup baskıda hatalı çıkmasıdır. Sebebi çoğu zaman çizgi veya metin detaylarının baskı çözünürlüğünün altında kalması, taşma payının (bleed) eksik tanımlanması ve ince detayların renkler arasında birbirine girmesidir. Ekran rengi ile basılı rengin aynı olmadığı unutulduğunda ise onay müşteride geçerken üretimde şaşar.\n\nGENCO olarak tasarım dosyasını makineye verilmeden önce kontrol ediyoruz: çözünürlük, taşma, renk profili, dieline toleransı ve prova çıktısı. Bu kontrol basamağı, baskı sonrası düzeltme maliyetinin çok altında bir sigortadır.",
          "The most expensive defect in packaging is a design that was approved but comes off press wrong. The cause is usually that a line or text detail falls below print resolution, that bleed is under-specified, or that fine elements collide across colours. It also happens when nobody remembers that on-screen colour and printed colour are not the same — the proof looks right at the customer and surprises in production.\n\nAt GENCO we check the design file before it goes to press: resolution, bleed, colour profile, dieline tolerance and the proof output. This step is insurance at a fraction of the cost of correcting after printing."
        ),
      },
      {
        id: "tpl_ins_6",
        eyebrow: bi("ANALİZ 06 / FEMTECH & SAĞLIK", "ANALYSIS 06 / FEMTECH & HEALTH"),
        category: bi(
          "PAZAR GİRİŞİ & REGÜLASYON",
          "MARKET ACCESS & REGULATION"
        ),
        date: bi("", ""),
        author: bi("", ""),
        title: bi(
          "Kadın Sağlığı Ürünlerinde Avrupa'ya Giriş: MDR Kapsamı ve Teknik Dosya",
          "Entering Europe with Women's Health Products: MDR Scope and the Technical File"
        ),
        body: bi(
          "Kadın sağlığı alanındaki ürünlerin Avrupa'ya girişi, tıbbi cihaz olup olmamalarına göre tamamen farklı iki yol izler. Tıbbi cihaz kapsamındaki ürünlerde sınıflandırma doğru yapılmazsa ruhsat ve belgeler baştan hatalı kurulur. Cihaz olmayan ürünlerde ise asgari teknik dosya, izlenebilirlik ve pazarlama iddialarının sınırları devreye girer.\n\nGENCO olarak sınıflandırmayı ürünün klinik işlevi ve kullanım amacı üzerinden birlikte değerlendiriyor, ardından gerekli uygunluk değerlendirmesini, teknik dosyayı ve etiket ile kullanım talimatı setini tek akışta hazırlıyoruz. Böylece ürün, hedef pazarda hangi kanalda satılacaksa o kanalın gerektirdiği belgelerle birlikte gitmiş oluyor.",
          "Women's health products entering Europe follow two entirely different routes depending on whether they are medical devices. For products within the device scope, an incorrect classification means the approval and documentation are built on a wrong foundation from the start. For products outside the scope, minimum technical documentation, traceability and the limits on marketing claims come into play.\n\nAt GENCO we assess classification together against the product's clinical function and intended use, then prepare the required conformity assessment, the technical file and the label and instructions for use set in a single flow. That way the product reaches whichever sales channel it will use in the target market already carrying the documentation that channel requires."
        ),
      },
    ],
  },
  footer(),
];

/* ========================================================================== *
 *  Hakkımızda — /about
 * ========================================================================== */

const about = [
  nav(),
  header(
    { tr: "Kurumsal Kimlik & Vizyon", en: "Corporate Identity & Vision" },
    {
      tr: "Analiz yön gösterir. Uygulama ticareti büyütür.",
      en: "Analysis guides. Execution grows trade.",
    },
    {
      tr: "Genco İthalat İhracat Medikal Ürün San. Tic. Ltd. Şti. olarak şirketlere dışarıdan rapor sunan pasif bir danışmanlık kurumu değiliz; küresel ticaret ağlarında sizin adınıza masaya oturan ve sahada operasyon yürüten bir iş ortağıyız.",
      en: "As Genco Import Export Medical Products Industry and Trading Co. Ltd., we are not a passive consultancy handing over outside reports; we are a business partner who sits at the table on your behalf and runs operations on the ground.",
    }
  ),

  /* ---- Operasyon merkezi bandı ---- */
  media(
    "tpl_about_band",
    "row",
    [
      {
        url: "/img/about-band-operations.webp",
        tr: "İzmir Bornova'daki operasyon merkezimiz: ofis ve depo aynı çatı altında, sevkiyat planlaması sahadan başlar.",
        en: "Our operations centre in Bornova, Izmir: office and warehouse under one roof, with shipment planning starting on site.",
      },
    ],
    null
  ),

  /* ---- Kurum bilgileri: sayılar doğrulanana kadar boş kalır ---- */
  {
    ...STATS_BAND_DEFAULTS,
    id: "tpl_about_facts",
    heading: bi("", ""),
    items: [
      { id: "tpl_about_f1", value: bi("2008", "2008"), label: bi("Kuruluş yılı", "Founded") },
      { id: "tpl_about_f2", value: bi("18", "18"), label: bi("Yıllık deneyim", "Years of experience") },
      { id: "tpl_about_f3", value: bi("48+", "48+"), label: bi("Aktif pazar sayısı", "Active markets") },
      { id: "tpl_about_f4", value: bi("1000+", "1000+"), label: bi("Tamamlanan proje", "Completed projects") },
    ],
  },

  feature(
    "tpl_about_intro",
    { tr: "İzmir'den Küresel Arenaya", en: "From Izmir to the Global Arena" },
    {
      tr: "Neden buradayız",
      en: "Why We Exist",
    },
    {
      tr: "İzmir Bornova merkezli kurulan GENCO; demir çelikten medikal malzemelere, denizcilikten tarım ve tohumculuğa, ambalajdan yenilikçi femtech teknolojilerine kadar geniş bir dikey yelpazede tescilli teknik bilgiye ve yerleşik alıcı ağlarına sahiptir.\n\nBu bilgi ve ağları müşterimiz adına sahada kullanıyoruz: doğrudan karar vericiye ulaşmak, teknik şartname uyumunu yerinde doğrulamak ve sevkiyat kapanışına kadar süreci yönetmek.",
      en: "Founded in Izmir Bornova, GENCO holds proprietary technical knowledge and established buyer networks across a wide vertical spectrum: from steel and metals to medical supplies, marine, agriculture, packaging, and innovative femtech technologies.\n\nWe put that knowledge and those networks to work on the ground on our clients' behalf: reaching decision-makers directly, verifying technical specification compliance on site, and managing the process through to shipment closure.",
    },
    [],
    { tr: "Ölçütümüz", en: "Our Standard" },
    {
      tr: "Küresel ticarette başarı, genel listelerle vakit kaybetmek değil; doğru teknik standartları bilmek, doğrudan karar vericiyle temas kurmak ve operasyonun her aşamasında sahada var olmaktır.",
      en: "Success in global trade is not about wasting time on generic lists; it is knowing the right technical standards, reaching decision-makers directly, and being on the ground at every stage of the operation.",
    }
  ),

  /* ---- Çalışma biçimimiz: malzeme seçimi ve teknik inceleme ---- */
  media(
    "tpl_about_details",
    "row",
    [
      {
        url: "/img/about-detail-samples.webp",
        tr: "Ürün ve malzeme seçimi: müşterinin hedef pazarı ve raf ömrü beklentisine göre numune ve teknik dosya birlikte belirlenir.",
        en: "Product and material selection: samples and technical documentation are defined together against the buyer's target market and shelf-life expectations.",
      },
      {
        url: "/img/about-detail-engineering.webp",
        tr: "Mühendislik incelemesi: çizim, ölçü ve malzeme uyumu masa başında değil, numune üzerinde doğrulanır.",
        en: "Engineering review: drawing, dimension and material compatibility are verified on the sample, not at the desk.",
      },
    ],
    null
  ),

  {
    ...CARD_GRID_DEFAULTS,
    id: "tpl_about_steps",
    heading: bi("The GENCO Method — Dört Aşama", "The GENCO Method — Four Steps"),
    sub: bi(
      "Uluslararası ticareti masada bırakmıyoruz; araştırmadan kapanışa kadar dört aşamalı bir icraat metodolojisiyle ilerliyoruz.",
      "We don't leave international trade at the table; we run a four-step execution methodology from research through to closure."
    ),
    columns: 2,
    cards: [
      {
        id: "tpl_about_step1",
        eyebrow: bi("01 / RESEARCH", "01 / RESEARCH"),
        title: bi(
          "Araştırma & Hedef Pazar Analizi",
          "Research & Target Market Analysis"
        ),
        desc: bi(
          "Genel listelerle vakit kaybetmiyoruz. Tescilli ticaret istihbarat ağlarımız üzerinden ürününüzün küresel pazardaki en doğru alıcılarını nokta atışı tespit ediyor; EN, ASTM ve sektörel teknik şartnameleri eksiksiz analiz ederek stratejimizi kuruyoruz.",
          "We don't waste time with generic lists. Through our proprietary trade intelligence networks, we pinpoint the right buyers for your product in the global market and build our strategy by thoroughly analysing EN, ASTM, and sectoral technical specs."
        ),
        note: bi("", ""),
        image: "",
      },
      {
        id: "tpl_about_step2",
        eyebrow: bi("02 / CONNECT", "02 / CONNECT"),
        title: bi(
          "Stratejik B2B İletişim (Connect)",
          "Strategic B2B Communication (Connect)"
        ),
        desc: bi(
          "Aracıları ve alt kademeleri atlıyoruz. Doğrulanmış altyapılarımızla doğrudan C-level karar vericilere ulaşıyor; ürününüzün teknik avantajlarını ve tolerans üstünlüklerini en doğru dille doğrudan masaya taşıyoruz.",
          "We skip intermediaries and lower tiers. Using our verified infrastructure, we reach C-level decision-makers directly and bring your product's technical advantages and tolerance superiorities straight to the table."
        ),
        note: bi("", ""),
        image: "",
      },
      {
        id: "tpl_about_step3",
        eyebrow: bi("03 / EXECUTE", "03 / EXECUTE"),
        title: bi(
          "Sahada İcraat ve Müzakere (Execute)",
          "Field Execution & Negotiation (Execute)"
        ),
        desc: bi(
          "Rapor sunup çekilmiyoruz. Müzakerelerin yürütülmesi, ticari tekliflerin optimize edilmesi, üretim tesislerinde yerinde kapasite ve kalite denetimlerinin yapılması ile sevkiyat kapanışına kadar tüm operasyonel süreci bizzat yönetiyor, riski sıfırlıyoruz.",
          "We don't just deliver reports and walk away. We personally manage the entire operational process from conducting negotiations and optimizing commercial offers to on-site capacity and quality audits in manufacturing facilities until shipment closure, eliminating risk."
        ),
        note: bi("", ""),
        image: "",
      },
      {
        id: "tpl_about_step4",
        eyebrow: bi("04 / GROW", "04 / GROW"),
        title: bi("Sürdürülebilir Büyüme (Grow)", "Sustainable Growth (Grow)"),
        desc: bi(
          "Tek seferlik satışlar değil, küresel ölçekte kalıcı distribütörlükler ve güçlü bayi ağları kuruyoruz. Markanızın uluslararası pazarlarda uzun vadeli, karlı ve sürdürülebilir bir ticari hacme ulaşmasını sağlayarak köprü olmaya devam ediyoruz.",
          "We build permanent distributorships and strong dealer networks on a global scale, not just one-off sales. We continue to act as a bridge ensuring your brand reaches a long-term, profitable, and sustainable commercial volume in international markets."
        ),
        note: bi("", ""),
        image: "",
      },
    ],
  },
  cta(
    "tpl_about_cta",
    { tr: "BİZİMLE ÇALIŞIN", en: "WORK WITH US" },
    {
      tr: "Küresel Ticarette Güçlü Bir Ortak Arıyorsanız",
      en: "Looking for a Strong Partner in Global Trade?",
    },
    {
      tr: "İzmir Bornova merkezli operasyon gücümüzle tanışmak ve projelerinizi görüşmek için bizimle iletişime geçin.",
      en: "Contact us to meet our Izmir Bornova-based operational strength and discuss your projects.",
    },
    { tr: "İletişime Geçin", en: "Get in Touch" }
  ),
  footer(),
];

/* ========================================================================== *
 *  İletişim — /contact
 * ========================================================================== */

const contact = [
  nav(),
  header(
    { tr: "İletişim & İş Birliği", en: "Contact & Collaboration" },
    {
      tr: "Projelerinizi Sahada Birlikte Yönetelim",
      en: "Let's Manage Your Projects Together on the Ground",
    },
    {
      tr: "İhracatınızı büyütmek, Türkiye'den güvenli tedarik sağlamak veya pazarınıza yeni bir ortak aramak için bizimle doğrudan iletişime geçin.",
      en: "Contact us directly to scale your exports, secure sourcing from Turkey, or find a new partner for your market.",
    }
  ),
  { ...CONTACT_DEFAULTS, id: "tpl_contact_body" },
  footer(),
];

/* ========================================================================== *
 *  Gizlilik Politikası (KVKK) — /gizlilik
 * --------------------------------------------------------------------------
 *  İletişim formu KVKK kapsamında kişisel veri topladığı için aydınlatma
 *  metni zorunludur. Bilinen şirket bilgileriyle yazılmıştır; hukuki
 *  denetimden geçirilmesi önerilir.
 * ========================================================================== */

const privacy = [
  nav(),
  header(
    { tr: "Yasal Bilgilendirme", en: "Legal Notice" },
    { tr: "Gizlilik Politikası", en: "Privacy Policy" },
    {
      tr: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, web sitemiz üzerinden paylaştığınız kişisel verilerin nasıl işlendiğini bu sayfada açıklıyoruz.",
      en: "Under Turkish Personal Data Protection Law no. 6698 (KVKK), this page explains how personal data shared through our website is processed.",
    }
  ),
  {
    ...ARTICLE_LIST_DEFAULTS,
    id: "tpl_priv_body",
    heading: bi("", ""),
    articles: [
      {
        id: "tpl_priv_1",
        eyebrow: bi("01", "01"),
        category: bi("VERİ SORUMLUSU", "DATA CONTROLLER"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Veri sorumlusu kimdir?", "Who is the data controller?"),
        body: bi(
          "Veri sorumlusu, Genco İthalat İhracat Medikal Ürün San. Tic. Ltd. Şti.'dir.\n\nAdres: Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova / İzmir – TÜRKİYE\nTelefon: +90 505 926 12 51\nE-posta: info@gencotr.com",
          "The data controller is Genco Import Export Medical Products Industry and Trading Co. Ltd.\n\nAddress: Meriç Mah. 5746/5 SK. No: 3 Inner Door No: Z1 Bornova / Izmir – TURKEY\nPhone: +90 505 926 12 51\nEmail: info@gencotr.com"
        ),
      },
      {
        id: "tpl_priv_2",
        eyebrow: bi("02", "02"),
        category: bi("İŞLENEN VERİLER", "DATA PROCESSED"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Hangi verileri işliyoruz?", "Which data do we process?"),
        body: bi(
          "Web sitemizde yalnızca iletişim formu aracılığıyla tarafınızca iletilen bilgileri işleriz: ad soyad, kurumsal e-posta adresi, telefon numarası ve talebinize ilişkin mesaj metni. Bu bilgiler formu doldururken sizin tarafınızdan açıkça iletilir.",
          "Through our website we process only the information you submit via the contact form: your name, corporate email address, phone number, and the message describing your request. This information is provided by you at the time you complete the form."
        ),
      },
      {
        id: "tpl_priv_w3f",
        eyebrow: bi("03", "03"),
        category: bi("VERİ İŞLEYEN VE TEKNİK ALTYAPI", "DATA PROCESSOR AND TECHNICAL INFRASTRUCTURE"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi(
          "Verileriniz hangi teknik sağlayıcı üzerinden iletilir?",
          "Through which technical provider is your data transmitted?"
        ),
        body: bi(
          "İletişim formu aracılığıyla iletilen veriler, teknik olarak zorunlu olduğu ölçüde e-posta hizmeti sağlayıcısı Web3Forms üzerinden iletilir. Veriler, talebiniz sonuçlandırıldıktan sonra bu sağlayıcının sistemlerinden silinir.",
          "Data submitted through the contact form is transmitted, only to the extent technically necessary, via the email service provider Web3Forms. Once your request has been concluded, the data is deleted from that provider's systems."
        ),
      },
      {
        id: "tpl_priv_3",
        eyebrow: bi("04", "04"),
        category: bi("AMAÇ VE HUKUKİ SEBEP", "PURPOSE AND LEGAL BASIS"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Neden ve hangi sebeple işliyoruz?", "Why and on what legal basis?"),
        body: bi(
          "İletilen bilgiler yalnızca talebinizin değerlendirilmesi, size dönüş yapılması ve iş ilişkisi kapsamında yürütülecek hizmetlerin planlanması amacıyla işlenir.\n\nİşleme faaliyeti KVKK 5. maddesi uyarınca açık rızanız veya sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, kanuni yükümlülüklerimizin yerine getirilmesi ve meşru menfaat hukuki sebeplerine dayanır. Bu amaç dışında kullanılmayacak ve üçüncü taraflara satış veya paylaşım yapılmayacaktır. Yukarıdaki bölümde belirtilen teknik olarak zorunlu e-posta iletimi dışında verileriniz herhangi bir üçüncü kişiyle paylaşılmayacaktır.",
          "The submitted information is processed solely to evaluate your request, to respond to you, and to plan services within the scope of a potential business relationship.\n\nProcessing is carried out under Article 5 of KVKK on the basis of your explicit consent, the necessity of processing for the conclusion or performance of a contract, the fulfilment of our legal obligations, and our legitimate interests. Your data will not be used for any other purpose, nor sold or shared with third parties. Apart from the technically necessary email transmission described in the section above, your data will not be shared with any third party."
        ),
      },
      {
        id: "tpl_priv_4",
        eyebrow: bi("05", "05"),
        category: bi("SAKLANMA SÜRESİ", "RETENTION PERIOD"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Verilerinizi ne kadar süre saklıyoruz?", "How long do we retain your data?"),
        body: bi(
          "İletişim formu aracılığıyla iletilen bilgiler, talebinizin sonuçlandırılmasını takiben ticari ve hukuki yükümlülüklerimizin gerektirdiği süre boyunca saklanır; bu süre sonunda silinir veya anonim hâle getirilir.",
          "Information submitted through the contact form is retained for as long as required to conclude your request and to meet our commercial and legal obligations, after which it is deleted or anonymised."
        ),
      },
      {
        id: "tpl_priv_5",
        eyebrow: bi("06", "06"),
        category: bi("HAKLARINIZ", "YOUR RIGHTS"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Haklarınızı nasıl kullanabilirsiniz?", "How can you exercise your rights?"),
        body: bi(
          "KVKK 11. madde kapsamında; verilerinize erişme, düzeltilmesini veya silinmesini isteme, işlemenin sınırlandırılmasını talep etme ve verilerinizin aktarıldığı üçüncü kişileri öğrenme haklarına sahipsiniz.\n\nBu haklarınızı kullanmak için info@gencotr.com adresine yazmanız yeterlidir. Talebiniz en geç 30 gün içinde sonuçlandırılır.",
          "Under Article 11 of KVKK you have the right to access your data, to request its correction or deletion, to request restriction of processing, and to learn the third parties to whom your data has been transferred.\n\nTo exercise these rights, write to info@gencotr.com. Your request will be concluded within 30 days at the latest."
        ),
      },
      {
        id: "tpl_priv_6",
        eyebrow: bi("07", "07"),
        category: bi("GÜNCELLEME", "UPDATES"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Bu metin güncellenebilir mi?", "May this notice be updated?"),
        body: bi(
          "Bu aydınlatma metni yasal değişiklikler veya işleme amaçlarının değişmesi hâlinde güncellenebilir. Güncel metin bu sayfada yayımlanır.",
          "This notice may be updated in the event of legislative changes or a change in processing purposes. The current version is published on this page."
        ),
      },
    ],
  },
  cta(
    "tpl_priv_cta",
    { tr: " SORULARINIZ MI VAR?", en: "QUESTIONS?" },
    { tr: "Verilerinizle ilgili bir sorunuz mu var?", en: "Any question about your data?" },
    {
      tr: "KVKK kapsamındaki haklarınızı kullanmak ya da verileriniz hakkında bilgi almak için bize yazabilirsiniz.",
      en: "To exercise your rights under KVKK or to obtain information about your data, you can contact us.",
    },
    { tr: "Bize Ulaşın", en: "Contact Us" }
  ),
  footer(),
];

/* ========================================================================== *
 *  Dışa aktarım
 * ========================================================================== */

export const PAGE_TEMPLATES = {
  services,
  industries,
  caseStudies,
  insights,
  about,
  contact,
  gizlilik: privacy,
};

/** Sayfa anahtarına karşılık gelen şablonu döner (yoksa boş dizi). */
export function getPageTemplate(key) {
  return PAGE_TEMPLATES[key] || [];
}

/* ========================================================================== *
 *  Yeni sayfalar
 * --------------------------------------------------------------------------
 *  Stüdyoda "Yeni Sayfa Ekle" ile açılan sayfalar için başlangıç iskeleti:
 *  menü + boş sayfa başlığı + alt bilgi. İçerik sonradan blok eklenerek
 *  doldurulur.
 * ========================================================================== */

/** URL adresinde kullanılamayacak adlar (gerçek sayfalarla çakışmasın). */
export const RESERVED_SLUGS = [
  "home",
  "admin",
  "method",
  "_next",
  "api",
  "favicon.ico",
];

/**
 * Adres parçasını normalize eder: küçük harf, sadece harf/rakam/tire,
 * boşluklar tireye çevrilir. Geçersizse null döner.
 */
export function slugify(input) {
  const base = String(input || "")
    .trim()
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!base || RESERVED_SLUGS.includes(base)) return null;
  return base;
}

/** Adres parçası + iki dilli menü adından yeni sayfanın başlangıç blokları. */
export function createPageBlocks(slug, labelTr, labelEn, baseLinks = NAV_DEFAULTS.links) {
  const links = [
    ...baseLinks,
    {
      id: `lnk_${slug}`,
      label: bi(labelTr || "Yeni Sayfa", labelEn || "New Page"),
      href: `/${slug}`,
    },
  ];

  return [
    { ...NAV_DEFAULTS, id: `page_${slug}_nav`, links },
    {
      ...PAGE_HEADER_DEFAULTS,
      id: `page_${slug}_header`,
      badge: bi("Yeni Bölüm", "New Section"),
      heading: bi(labelTr || "Yeni Sayfa", labelEn || "New Page"),
      sub: bi(
        "Bu alana sayfanın kısa açıklamasını yazın.",
        "Add a short description for this page."
      ),
    },
    { ...FOOTER_DEFAULTS, id: `page_${slug}_footer` },
  ];
}

export default PAGE_TEMPLATES;
