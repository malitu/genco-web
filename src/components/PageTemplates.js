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

const feature = (id, eyebrow, heading, desc, items, boxTitle, boxSub) => ({
  ...FEATURE_BLOCK_DEFAULTS,
  id,
  eyebrow: bi(eyebrow.tr, eyebrow.en),
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

/* ========================================================================== *
 *  Hizmetler — /services
 * ========================================================================== */

const services = [
  nav(),
  header(
    { tr: "Uçtan Uca Ticaret Yönetimi", en: "End-to-End Trade Management" },
    {
      tr: "Aktif İş Geliştirme ve Operasyonel Çözümlerimiz",
      en: "Active Business Development & Operational Solutions",
    },
    {
      tr: "GENCO olarak şirketlere sadece dışarıdan tavsiye vermiyoruz; tescilli küresel ticaret istihbarat ağımız ve stratejik veritabanlarımızla doğrudan pazar açıyor, müzakereleri yürütüyor ve sevkiyat kapanışına kadar operasyonu bizzat yönetiyoruz.",
      en: "As GENCO, we don't just offer external advice; using our proprietary global trade intelligence network and strategic databases, we directly open markets, conduct negotiations, and manage operations until shipment closure.",
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
      tr: "Derinlemesine Hakim Olduğumuz Alanlar ve Esnek Çözüm Ağımız",
      en: "Our Core Domains and Flexible Solution Network",
    },
    {
      tr: "GENCO olarak kritik endüstriyel dikey sektörlerde tescilli teknik bilgiye ve küresel alıcı ağlarına sahibiz. Sınırlarımızı bu alanlarla sınırlamayarak, esnek metodolojimizle her sektörde uluslararası ticaret operasyonu yönetebiliyoruz.",
      en: "As GENCO, we possess proprietary technical knowledge and global buyer networks across critical industrial vertical sectors. Beyond these core domains, our flexible methodology enables us to manage international trade operations in any sector.",
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
        title: bi("Demir Çelik & Metaller", "Steel & Metals"),
        desc: bi(
          "Karbon, alaşımlı, paslanmaz ve sementasyon çelik çubuk gruplarında uluslararası standartlara (EN, ASTM) tam hakimiyet. İnç/milimetre tolerans dönüşümleri ve Avrupa pazarında sürdürülebilir distribütör ağı yönetimi.",
          "Full mastery of international standards (EN, ASTM) in carbon, alloy, stainless, and case-hardening steel bar groups. Inch/mm tolerance conversions and sustainable European distributor network management."
        ),
        note: bi(
          "✓ Alaşım Standartları & Tolerans Uzmanlığı",
          "✓ Alloy Standards & Tolerance Expertise"
        ),
        image: "",
      },
      {
        id: "tpl_ind_2",
        eyebrow: bi("02 / SEKTÖR", "02 / SECTOR"),
        title: bi("Denizcilik (Marine)", "Marine"),
        desc: bi(
          "Tekne, deniz araçları ve kritik marine ekipmanlarının uluslararası ticareti, tescil regülasyonları, CE ve gürültü emisyon uyumluluk belgeleri ile küresel tedarik zinciri yönetimi.",
          "International trade, registration regulations, CE and noise emission compliance documentation for boats, watercraft, and critical marine equipment."
        ),
        note: bi("✓ Tekne & Marine Ekipmanları Tedariği", "✓ Boat & Marine Equipment Sourcing"),
        image: "",
      },
      {
        id: "tpl_ind_3",
        eyebrow: bi("03 / SEKTÖR", "03 / SECTOR"),
        title: bi("Tohumculuk & Tarım", "Agriculture & Seeds"),
        desc: bi(
          "Tohumculuk endüstrisinde küresel pazar araştırmaları, uluslararası dağıtım kanalları ve tarımsal ticaret operasyonlarında güvenilir iş geliştirme ve tedarikçi koordine etme kabiliyeti.",
          "Global market research in the seed industry, international distribution channels, and reliable business development and supplier coordination in agricultural trade."
        ),
        note: bi("✓ Küresel Tarım Ağı & Dağıtım", "✓ Global Agriculture Network & Distribution"),
        image: "",
      },
      {
        id: "tpl_ind_4",
        eyebrow: bi("04 / SEKTÖR", "04 / SECTOR"),
        title: bi("Medikal & Sağlık", "Medical & Healthcare"),
        desc: bi(
          "Medikal malzemeler, cerrahi sarf malzemeleri, hastane donanımları ve uluslararası sağlık sektörü standartlarına tam uyumlu tedarikçi ağları ile global distribütör eşleştirme operasyonları.",
          "Global distributor matching operations with medical supplies, surgical consumables, hospital equipment, and supplier networks fully compliant with international health sector standards."
        ),
        note: bi(
          "✓ Medikal Malzemeler & Cerrahi Sarflar",
          "✓ Medical Supplies & Surgical Consumables"
        ),
        image: "",
      },
      {
        id: "tpl_ind_5",
        eyebrow: bi("05 / SEKTÖR", "05 / SECTOR"),
        title: bi("Otomotiv & Yan Sanayi", "Automotive & Supply Chain"),
        desc: bi(
          "Otomotiv endüstrisi için talep edilen yüksek kalite standartlarına uygun parça tedariği, üretici kapasite denetimleri ve uluslararası OEM/Aftermarket alıcılarıyla stratejik buluşturma operasyonları.",
          "Part procurement meeting high quality standards required for the automotive industry, manufacturer capacity audits, and strategic matchmaking with international OEM/Aftermarket buyers."
        ),
        note: bi("✓ OEM & Yan Sanayi Buluşturma", "✓ OEM & Aftermarket Matchmaking"),
        image: "",
      },
      {
        id: "tpl_ind_6",
        eyebrow: bi("06 / SEKTÖR", "06 / SECTOR"),
        title: bi(
          "Femtech & Sağlık Teknolojileri",
          "Femtech & Health Tech"
        ),
        desc: bi(
          "Kadın sağlığı ve yenilikçi sağlık teknolojileri alanında yükselen pazar trendleri, uluslararası ürün konumlandırma ve bu niş pazarda büyüme gösteren markalar için stratejik iş geliştirme desteği.",
          "Strategic business development support for rising market trends in women's health and innovative health technologies, international product positioning, and growth in this niche market."
        ),
        note: bi(
          "✓ Niş Pazar ve Büyüme Stratejisi",
          "✓ Niche Market & Growth Strategy"
        ),
        image: "",
      },
    ],
  },
  cta(
    "tpl_ind_cta",
    { tr: "Sınırsız Operasyonel Esneklik", en: "Unlimited Operational Flexibility" },
    { tr: "Uzmanlık Alanlarımız Dışında Mısınız?", en: "Outside Our Core Fields?" },
    {
      tr: "GENCO'nun tescilli pazar araştırma ve aktif dış ticaret metodolojisi, sektörel ayrıcalık gözetmeksizin her türlü endüstriyel ürüne ve hammaddeye uyarlanabilir. Hangi sektörde olursanız olun, küresel ticari hedeflerinizi sahada gerçeğe dönüştürüyoruz.",
      en: "GENCO's proprietary market research and active foreign trade methodology can adapt to any industrial product and raw material without sectoral limitations. No matter your industry, we turn your global trade goals into reality on the ground.",
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
    { tr: "Sahadaki İcraatlarımız", en: "Our Field Execution" },
    {
      tr: "Ağırlıklı Çalıştığımız Sektörlerde Başarı Hikayeleri",
      en: "Success Stories in Our Core Industries",
    },
    {
      tr: "Demir çelikten medikal malzemelere, denizcilikten femtech ve tarım teknolojilerine kadar uzmanlık alanlarımızda yürüttüğümüz stratejik operasyonları ve teknik çözümleri inceleyin.",
      en: "Examine the strategic operations and technical solutions we execute across our core domains, ranging from steel to medical supplies, marine, femtech, and agricultural technologies.",
    }
  ),
  feature(
    "tpl_cs_1",
    { tr: "SEKTÖREL VAKA / 01", en: "SECTORAL CASE / 01" },
    {
      tr: "Demir Çelik Çubuk Grubunda Avrupa Pazarı ve Tolerans Yönetimi",
      en: "European Market & Tolerance Management in Steel Bar Groups",
    },
    {
      tr: "Karbon, alaşımlı, paslanmaz ve sementasyon çelik çubuk kategorisinde üreticilerimiz için Avrupa pazarında doğrudan karar vericilere ulaşıldı. EN ve ASTM alaşım standartlarına tam uyum sağlanarak inç/milimetre hassas boyut dönüşümleri ve tedarik zinciri süreçleri hatasız olarak yönetildi.",
      en: "Direct decision-makers were reached in the European market for our manufacturers in carbon, alloy, stainless, and case-hardening steel bars. Full compliance with EN and ASTM standards was achieved, flawlessly managing inch/mm precise dimension conversions and supply chain processes.",
    },
    [
      { tr: "Demir Çelik", en: "Steel & Metals" },
      { tr: "Alaşım & Tolerans", en: "Alloy & Tolerance" },
      { tr: "Distribütör Ağı", en: "Distributor Network" },
    ],
    {
      tr: "Uluslararası Standart Uyumu",
      en: "International Standard Compliance",
    },
    {
      tr: "EN ve ASTM normlarına tam hakimiyetle, metalurjik gereksinimlerin küresel alıcı beklentileriyle kusursuz buluşması sağlandı.",
      en: "With complete mastery of EN and ASTM norms, metallurgical requirements perfectly matched global buyer expectations.",
    }
  ),
  feature(
    "tpl_cs_2",
    { tr: "SEKTÖREL VAKA / 02", en: "SECTORAL CASE / 02" },
    {
      tr: "Denizcilik Sektöründe Tekne ve Ekipman Tedariği",
      en: "Boat and Equipment Sourcing in Marine Sector",
    },
    {
      tr: "Denizcilik alanında faaliyet gösteren üreticilerimiz için tekne ve marine ekipmanlarının uluslararası sevkiyat süreçleri ele alındı. Ürünlerin Avrupa Birliği normlarına uygunluk beyanları (Declaration of Conformity) ve teknik dokümantasyon süreçleri titizlikle yönetilerek pazar engelleri ortadan kaldırıldı.",
      en: "International shipment processes for boats and marine equipment were managed for our manufacturers operating in the marine field. Market barriers were eliminated by meticulously governing EU Declaration of Conformity and technical documentation processes.",
    },
    [
      { tr: "Denizcilik", en: "Marine" },
      { tr: "Tekne & Donanım", en: "Boats & Equipment" },
      { tr: "CE & Mevzuat Uyumu", en: "CE & Regulatory Compliance" },
    ],
    { tr: "Regülasyon ve Sertifikasyon", en: "Regulation & Certification" },
    {
      tr: "Tekne ve kritik marine ekipmanlarının uluslararası tescil gereksinimleri, CE ve gürültü emisyon belgeleri eksiksiz koordine edildi.",
      en: "International registration requirements, CE, and noise emission documents for boats and critical marine equipment were fully coordinated.",
    }
  ),
  feature(
    "tpl_cs_3",
    { tr: "SEKTÖREL VAKA / 03", en: "SECTORAL CASE / 03" },
    {
      tr: "Tohumculuk ve Tarımsal Ticarette Küresel Ağ",
      en: "Global Network in Agriculture and Seed Trade",
    },
    {
      tr: "Tarım ve tohumculuk endüstrisindeki üreticilerimizin küresel pazarlara açılması amacıyla hedef odaklı alıcı araştırmaları gerçekleştirildi. Lojistik ve iklimlendirme gereksinimlerine duyarlı dağıtım kanalları analiz edilerek uluslararası ticaret ortaklıkları tesis edildi.",
      en: "Targeted buyer research was carried out to expand our manufacturers in the agricultural and seed industries into global markets. International trade partnerships were established by analyzing distribution channels sensitive to logistics and climate control.",
    },
    [
      { tr: "Tohumculuk", en: "Agriculture" },
      { tr: "Küresel Dağıtım", en: "Global Distribution" },
      { tr: "Stratejik Ortaklıklar", en: "Strategic Partnerships" },
    ],
    { tr: "Tarımsal Lojistik", en: "Agricultural Logistics" },
    {
      tr: "Tohumculukta hassas taşıma ve depolama standartlarına uygun uluslararası alıcı eşleştirmeleri başarıyla tamamlandı.",
      en: "International buyer matchings meeting sensitive transport and storage standards in seeds were successfully completed.",
    }
  ),
  feature(
    "tpl_cs_4",
    { tr: "SEKTÖREL VAKA / 04", en: "SECTORAL CASE / 04" },
    {
      tr: "Medikal Malzemeler ve Cerrahi Sarf Tedariği",
      en: "Medical Supplies & Surgical Consumables Sourcing",
    },
    {
      tr: "Uluslararası sağlık sektörü alıcıları için medikal malzemeler, hastane donanımları ve cerrahi sarf ürünlerinde tedarik zinciri operasyonları yürütüldü. Yerel üretim tesislerinin kapasite ve kalite denetimleri yapılarak, uluslararası standartlara tam uyumlu sevkiyatlar güvence altına alındı.",
      en: "Supply chain operations were conducted for international healthcare buyers regarding medical supplies, hospital equipment, and surgical consumables. Capacity and quality audits of local manufacturing facilities ensured shipments fully compliant with international standards.",
    },
    [
      { tr: "Medikal & Sağlık", en: "Medical & Health" },
      { tr: "Cerrahi Sarf Ürünleri", en: "Surgical Consumables" },
      { tr: "Yerinde Denetim", en: "On-Site Auditing" },
    ],
    { tr: "Kritik Kalite", en: "Critical Quality" },
    {
      tr: "Medikal malzemeler ve cerrahi sarf ürünlerinde üretim denetiminden nihai sevkiyata kadar tüm kalite güvence adımları yönetildi.",
      en: "All quality assurance steps from production audit to final shipment were managed for medical supplies and surgical consumables.",
    }
  ),
  feature(
    "tpl_cs_5",
    { tr: "SEKTÖREL VAKA / 05", en: "SECTORAL CASE / 05" },
    {
      tr: "Otomotiv Yan Sanayi İçin OEM Eşleştirmeleri",
      en: "OEM Matchmaking for Automotive Sub-Industry",
    },
    {
      tr: "Otomotiv yan sanayi üreticilerimizin küresel OEM ve aftermarket tedarik zincirlerine entegre olması için veri odaklı alıcı analizleri gerçekleştirildi. Yüksek kalite beklentilerine sahip uluslararası markalarla doğrudan köprü kurularak ticari müzakereler yönetildi.",
      en: "Data-driven buyer analyses were executed to integrate our automotive sub-industry manufacturers into global OEM and aftermarket supply chains. Commercial negotiations were directed by building direct bridges with high-expectation international brands.",
    },
    [
      { tr: "Otomotiv", en: "Automotive" },
      { tr: "Yan Sanayi & OEM", en: "Sub-Industry & OEM" },
      { tr: "Global Tedarik Ağı", en: "Global Supply Network" },
    ],
    { tr: "Otomotiv Standartları", en: "Automotive Standards" },
    {
      tr: "Otomotiv sektörünün katı kalite ve teslimat zamanlaması kriterlerine uygun operasyonel altyapı kuruldu.",
      en: "Operational infrastructure compliant with the strict quality and delivery timing criteria of the automotive sector was established.",
    }
  ),
  feature(
    "tpl_cs_6",
    { tr: "SEKTÖREL VAKA / 06", en: "SECTORAL CASE / 06" },
    {
      tr: "Femtech ve Sağlık Teknolojilerinde Büyüme",
      en: "Growth in Femtech and Health Technologies",
    },
    {
      tr: "Femtech ve yenilikçi sağlık teknolojileri sektöründe faaliyet gösteren markaların uluslararası pazarlara giriş süreçleri koordine edildi. Doğru hedef kitle analizi ve niş distribütör ağları üzerinden markaların küresel ölçekte büyümesi desteklendi.",
      en: "Market entry processes for brands operating in femtech and innovative health technologies were coordinated. Global scaling of brands was supported through precise target audience analysis and niche distributor networks.",
    },
    [
      { tr: "Femtech", en: "Femtech" },
      { tr: "Sağlık Teknolojileri", en: "Health Technologies" },
      { tr: "Uluslararası Büyüme", en: "International Growth" },
    ],
    { tr: "Yenilikçi Pazar", en: "Niche Market" },
    {
      tr: "Kadın sağlığı ve sağlık teknolojileri alanında yükselen trendlere uygun uluslararası iş geliştirme stratejileri hayata geçirildi.",
      en: "International business development strategies aligned with rising trends in women's health and health technologies were brought to life.",
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
      tr: "Sektörel Analiz & İçgörüler",
      en: "Sectoral Analysis & Insights",
    },
    {
      tr: "Trade Intelligence: Sahadan ve Veriden Notlar",
      en: "Trade Intelligence: Notes from the Field and Data",
    },
    {
      tr: "Demir çelik toleranslarından medikal tedarik zincirlerine, denizcilik regülasyonlarından niş pazar dinamiklerine kadar uluslararası ticarette bizzat deneyimlediğimiz stratejik içgörüleri paylaşıyoruz.",
      en: "We share the strategic insights we personally experience in international trade, ranging from steel tolerances to medical supply chains, marine regulations to niche market dynamics.",
    }
  ),
  {
    ...ARTICLE_LIST_DEFAULTS,
    id: "tpl_ins_articles",
    heading: bi("", ""),
    articles: [
      {
        id: "tpl_ins_1",
        eyebrow: bi("01 / DEMİR ÇELİK & METALLER", "01 / STEEL & METALS"),
        category: bi(
          "TEKNİK & STRATEJİK ANALİZ",
          "TECHNICAL & STRATEGIC ANALYSIS"
        ),
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
        eyebrow: bi("02 / MEDİKAL & SAĞLIK", "02 / MEDICAL & HEALTH"),
        category: bi("TEDARİK ZİNCİRİ & DENETİM", "SUPPLY CHAIN & AUDITING"),
        title: bi(
          "Cerrahi Sarf Malzemeleri Tedariğinde Yerinde Denetimin Önemi",
          "The Importance of On-Site Auditing in Surgical Consumables Sourcing"
        ),
        body: bi(
          "Medikal ve cerrahi sarf malzemeleri ticaretinde hata payı sıfırdır. Standart bobin ürünler yerine belirli uzunluklarda boyutlandırılmış ve uçları sertleştirilmiş cerrahi iplikler gibi kritik ürünlerde üreticinin kapasitesi hayati önem taşır.\n\nGENCO, alıcı adına yerel üretim tesislerini bizzat yerinde denetler; sterilizasyon koşullarından hammadde izlenebilirliğine kadar tüm aşamaları sahada yöneterek operasyonel riskleri ortadan kaldırır.",
          "In the medical and surgical consumables trade the margin for error is zero. For critical products—such as surgical sutures cut to specific lengths with hardened ends—rather than standard spool products, the manufacturer's capacity is vital.\n\nGENCO audits local manufacturing facilities on-site on behalf of the buyer; from sterilization conditions to raw material traceability, every stage is managed in the field to eliminate operational risks."
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
      tr: "Analiz Yön Gösterir. İcraat Ticaret Yaratır.",
      en: "Analysis guides. Execution creates trade.",
    },
    {
      tr: "GENCO Imports & Exports olarak şirketlere sadece dışarıdan rapor sunan pasif bir danışmanlık kurumu değiliz; küresel ticaret ağlarında sizin adınıza bizzat masaya oturan ve sahada operasyon yürüten aktif iş geliştirme ortağınızız.",
      en: "As GENCO Imports & Exports, we are not a passive consultancy providing outside reports; we are your active business development partner sitting at the table on your behalf and running operations on the ground.",
    }
  ),
  feature(
    "tpl_about_intro",
    { tr: "İzmir'den Küresel Arenaya", en: "From Izmir to the Global Arena" },
    {
      tr: "Uluslararası Ticarette Operasyonel Güç ve Güven",
      en: "Operational Strength and Trust in International Trade",
    },
    {
      tr: "İzmir Bornova merkezli kurulan GENCO, demir çelikten medikal malzemelere, denizcilikten tarım ve tohumculuğa, otomotivden yenilikçi femtech teknolojilerine kadar geniş bir dikey yelpazede tescilli teknik bilgiye ve küresel alıcı ağlarına sahiptir.\n\nGeleneksel dış ticaret danışmanlık modellerinin ötesine geçerek; tescilli ticaret istihbarat altyapılarımız ve çok katmanlı araştırma ağlarımızla doğrudan C-level karar vericilere ulaşıyor, ürünlerinizin teknik şartnamelere tam uyumunu yerinde denetliyor ve sevkiyat kapanışına kadar tüm süreci yönetiyoruz.",
      en: "Founded in Izmir Bornova, GENCO possesses proprietary technical knowledge and global buyer networks across a wide vertical spectrum ranging from steel and metals to medical supplies, marine, agriculture, automotive, and innovative femtech technologies.\n\nMoving beyond traditional foreign trade consultancy models, through our proprietary trade intelligence infrastructure and multi-layered research networks, we reach C-level decision-makers directly, audit your products' compliance with technical specifications on-site, and manage the entire process until shipment closure.",
    },
    [],
    { tr: "Aktif Saha Operasyonu", en: "Active Field Operation" },
    {
      tr: "Küresel ticarette başarı; jenerik pazar araştırmalarıyla vakit kaybetmek değil, doğru teknik standartları bilmek, doğrudan karar vericiyle temas kurmak ve operasyonun her aşamasında sahada var olmaktır.",
      en: "Success in global trade is not about wasting time with generic market research; it is knowing the right technical standards, contacting decision-makers directly, and being present on the ground at every stage of the operation.",
    }
  ),
  {
    ...CARD_GRID_DEFAULTS,
    id: "tpl_about_steps",
    heading: bi("Operasyonel Felsefemiz — The GENCO Method", "Our Operational Philosophy — The GENCO Method"),
    sub: bi(
      "Uluslararası ticareti masada bırakmıyor; araştırmadan kapanışa kadar uçtan uca yönettiğimiz 4 aşamalı tescilli icraat metodolojimizle fark yaratıyoruz.",
      "We don't leave international trade at the table; we make a difference with our 4-step proprietary execution methodology managed end-to-end from research to closure."
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
          "Jenerik listelerle vakit kaybetmiyoruz. Tescilli ticaret istihbarat ağlarımız üzerinden ürününüzün küresel pazardaki en doğru alıcılarını nokta atışı tespit ediyor; EN, ASTM ve sektörel teknik şartnameleri eksiksiz analiz ederek stratejimizi kuruyoruz.",
          "We don't waste time with generic lists. Through our proprietary trade intelligence networks, we pinpoint the right buyers for your product in the global market and build our strategy by thoroughly analyzing EN, ASTM, and sectoral technical specs."
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
 *  Dışa aktarım
 * ========================================================================== */

export const PAGE_TEMPLATES = {
  services,
  industries,
  caseStudies,
  insights,
  about,
  contact,
};

/** Sayfa anahtarına karşılık gelen şablonu döner (yoksa boş dizi). */
export function getPageTemplate(key) {
  return PAGE_TEMPLATES[key] || [];
}

export default PAGE_TEMPLATES;