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
 * Hizmet/kapsam bloğu.
 * @param {string} scope  Vaka analizlerinde gösterilecek kapsam satırı
 *                        (sektör · pazar · yapılan iş). Boş bırakılırsa gizlenir.
 * @param {{tr,en}} link  Ayrıntı sayfası bağlantısı (yoksa gizlenir).
 * @param {string} linkHref
 */
const feature = (
  id,
  eyebrow,
  heading,
  desc,
  items,
  boxTitle,
  boxSub,
  scope = null,
  link = null,
  linkHref = ""
) => ({
  ...FEATURE_BLOCK_DEFAULTS,
  id,
  eyebrow: bi(eyebrow.tr, eyebrow.en),
  scope: scope ? bi(scope.tr, scope.en) : bi("", ""),
  heading: bi(heading.tr, heading.en),
  desc: bi(desc.tr, desc.en),
  items: items.map((t, i) => ({ id: `${id}_i${i}`, title: bi(t.tr, t.en) })),
  boxTitle: bi(boxTitle.tr, boxTitle.en),
  boxSub: bi(boxSub.tr, boxSub.en),
  linkLabel: link ? bi(link.tr, link.en) : bi("", ""),
  linkHref,
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

// /services sayfasinin tam yeniden yazımı.
// Kapsam, çıktı ve çalışma modeli her hizmette açıkça belirtilir.
const services = [
  nav(),
  header(
    { tr: "HİZMETLER", en: "SERVICES" },
    {
      tr: "Uluslararası Ticaretin Araştırma ve Uygulama Aşamalarında Yanınızdayız",
      en: "We Support You Through Both the Research and the Execution Stages of International Trade",
    },
    {
      tr: "GENCO, şirketlerin ihracat, ithalat ve uluslararası iş geliştirme süreçlerini destekler. İhtiyacınıza göre belirli bir işi üstlenir veya araştırmadan sipariş takibine kadar daha geniş bir kapsamda çalışırız.\n\nHer projede hedefi, sorumlulukları, teslim edilecek çıktıları ve raporlama biçimini başlangıçta netleştiririz.",
      en: "GENCO supports companies across their export, import and international business development processes. Depending on your needs, we take on a specific piece of work or operate across a wider scope, from research through to order follow-up.\n\nIn every project we define the objective, responsibilities, deliverables and reporting format at the outset.",
    }
  ),

  /* ---- 1. Dış kaynaklı ihracat -------------------------------------------- */
  feature(
    "tpl_svc_1",
    { tr: "01 / DIŞ KAYNAKLI İHRACAT", en: "01 / OUTSOURCED EXPORT" },
    {
      tr: "Dış Kaynaklı İhracat Departmanı",
      en: "Outsourced Export Department",
    },
    {
      tr: "İhracata başlamak veya mevcut satışlarını yeni ülkelere taşımak isteyen üreticiler için şirket dışından çalışan bir ihracat ekibi modeli sunuyoruz.",
      en: "For manufacturers looking to start exporting or to carry existing sales into new countries, we offer an export team that works outside your organisation.",
    },
    [
      { tr: "Ürün ve ihracat hazırlığının değerlendirilmesi", en: "Assessment of product and export readiness" },
      { tr: "Hedef ülke ve müşteri gruplarının araştırılması", en: "Research into target countries and customer groups" },
      { tr: "Potansiyel alıcılarla ilk temas", en: "First contact with potential buyers" },
      { tr: "Ürün sunumu, teklif ve ticari görüşme takibi", en: "Product presentation, quotation and follow-up on commercial meetings" },
      { tr: "Numune ve sipariş koordinasyonu", en: "Sample and order coordination" },
      { tr: "Sevkiyat hazırlığının ilgili taraflarla takibi", en: "Tracking shipment preparation with the relevant parties" },
    ],
    {
      tr: "Sağlanan çıktılar",
      en: "What you receive",
    },
    {
      tr: "Hedef pazar değerlendirmesi, müşteri aday listesi, görüşme kayıtları, teklif ve numune durum takibi ile düzenli ilerleme raporları.",
      en: "Target market assessment, candidate customer list, meeting records, quotation and sample status tracking, and regular progress reports.",
    },
    null,
    { tr: "Dış Kaynaklı İhracat Modelini İnceleyin", en: "See the Outsourced Export Model" },
    "/services/outsourced-export"
  ),

  /* ---- 2. Türkiye'den tedarik --------------------------------------------- */
  feature(
    "tpl_svc_2",
    { tr: "02 / TEDARİK", en: "02 / SOURCING" },
    {
      tr: "Türkiye'den Tedarik ve Üretici Araştırması",
      en: "Sourcing from Turkey and Manufacturer Research",
    },
    {
      tr: "Uluslararası alıcılar için ürün özelliklerine ve satın alma koşullarına uygun Türk üreticileri araştırıyoruz.",
      en: "For international buyers, we research Turkish manufacturers that match your product specifications and purchasing conditions.",
    },
    [
      { tr: "Teknik şartname ve satın alma beklentilerinin netleştirilmesi", en: "Clarifying the technical specification and purchasing expectations" },
      { tr: "Üretici adaylarının araştırılması", en: "Research into candidate manufacturers" },
      { tr: "Kapasite, ürün gamı ve belge bilgilerinin toplanması", en: "Collecting capacity, product range and documentation data" },
      { tr: "Fiyat, teslim süresi ve ödeme koşullarının karşılaştırılması", en: "Comparing price, lead time and payment terms" },
      { tr: "Numune ve üretici ziyaretlerinin koordinasyonu", en: "Coordination of samples and factory visits" },
      { tr: "Sipariş ve sevkiyat takibi", en: "Order and shipment tracking" },
    ],
    {
      tr: "Sağlanan çıktılar",
      en: "What you receive",
    },
    {
      tr: "Üretici kısa listesi, karşılaştırmalı teklif tablosu, açık teknik ve ticari konular listesi ile sipariş durum raporu.",
      en: "A shortlist of manufacturers, a comparative quotation table, a list of open technical and commercial points, and an order status report.",
    },
    null,
    { tr: "Türkiye'den Tedarik Sürecini İnceleyin", en: "See the Sourcing Process" },
    "/services/turkey-sourcing"
  ),

  /* ---- 3. Alıcı ve distribütör geliştirme --------------------------------- */
  feature(
    "tpl_svc_3",
    { tr: "03 / PAZAR GELİŞTİRME", en: "03 / MARKET DEVELOPMENT" },
    {
      tr: "Alıcı ve Distribütör Geliştirme",
      en: "Buyer and Distributor Development",
    },
    {
      tr: "Ürününüzü satabilecek firmaları belirlemek için hedef ülke, satış kanalı ve müşteri profili üzerinden araştırma yapıyoruz.",
      en: "To identify the companies that can sell your product, we research by target country, sales channel and customer profile.",
    },
    [
      { tr: "Uygun distribütör ve alıcı profilinin tanımlanması", en: "Defining the suitable distributor and buyer profile" },
      { tr: "Aday firmaların ürün portföyü ve pazar faaliyetlerinin incelenmesi", en: "Reviewing candidate companies' product portfolios and market activity" },
      { tr: "Ulaşılabilir iletişim bilgilerinin araştırılması", en: "Research into reachable contact information" },
      { tr: "İlk temas ve görüşme koordinasyonu", en: "First contact and meeting coordination" },
      { tr: "İlgi, uygunluk ve sonraki adımların takibi", en: "Tracking interest, suitability and next steps" },
    ],
    {
      tr: "Sağlanan çıktılar",
      en: "What you receive",
    },
    {
      tr: "Gerekçeli aday listesi, temas kayıtları, görüşme notları ve değerlendirme tablosu.",
      en: "A reasoned candidate list, contact records, meeting notes and an evaluation table.",
    },
    null,
    { tr: "Alıcı ve Distribütör Geliştirme Hizmeti", en: "Buyer and Distributor Development" },
    "/services/distributor-development"
  ),

  /* ---- 4. Pazara giriş desteği -------------------------------------------- */
  feature(
    "tpl_svc_4",
    { tr: "04 / PAZARA GİRİŞ", en: "04 / MARKET ENTRY" },
    {
      tr: "Pazara Giriş Desteği",
      en: "Market Entry Support",
    },
    {
      tr: "Türkiye'ye veya farklı bir ülkeye giriş yapmak isteyen markalar için satış kanalı, rakip ve yerel iş ortağı araştırması sağlıyoruz. Ürünün hedef pazarda hangi kanallarda değerlendirilebileceğini araştırır; distribütör, bayi veya kurumsal alıcı adaylarıyla görüşmeleri destekleriz. Ürüne özel düzenleyici ve teknik konularda gerekli uzman ve hizmet sağlayıcılarla koordinasyon kurarız.",
      en: "For brands entering Turkey or another country, we research sales channels, competitors and local partners. We investigate which channels your product can realistically be sold through, and support meetings with distributor, dealer or corporate buyer candidates. On regulatory and technical matters specific to your product, we coordinate with the relevant specialists and service providers.",
    },
    [
      { tr: "Satış kanalı ve rakip araştırması", en: "Sales channel and competitor research" },
      { tr: "Yerel iş ortağı adaylarının belirlenmesi", en: "Identifying local partner candidates" },
      { tr: "Görüşme ve değerlendirme sürecinin yürütülmesi", en: "Running the meeting and evaluation process" },
      { tr: "Düzenleyici ve teknik uzmanlarla koordinasyon", en: "Coordination with regulatory and technical specialists" },
    ],
    {
      tr: "Sağlanan çıktılar",
      en: "What you receive",
    },
    {
      tr: "Pazar ve kanal değerlendirmesi, iş ortağı aday listesi ve önceliklendirilmiş uygulama planı.",
      en: "A market and channel assessment, a partner candidate list and a prioritised implementation plan.",
    }
  ),

  /* ---- 5. İthalat ve sevkiyat koordinasyonu -------------------------------- */
  feature(
    "tpl_svc_5",
    { tr: "05 / İTHALAT", en: "05 / IMPORT" },
    {
      tr: "İthalat ve Sevkiyat Koordinasyonu",
      en: "Import and Shipment Coordination",
    },
    {
      tr: "İthalat projelerinde tedarikçi araştırmasından siparişin teslimine kadar kararlaştırılan aşamaları takip ediyoruz. Teklif karşılaştırması, ödeme ve teslim koşullarının görüşülmesi, ticari belgelerin takibi, taşıma tekliflerinin koordinasyonu ve sevkiyat durum raporlaması bu kapsamda değerlendirilebilir. Gümrükleme, laboratuvar testi, belgelendirme ve taşıma gibi uzmanlık gerektiren işlemleri ilgili yetkili kuruluşlarla koordine ederiz.",
      en: "On import projects we track the agreed stages from supplier research through to delivery of the order. Quotation comparison, negotiation of payment and delivery terms, follow-up on trade documents, coordination of freight quotations and shipment status reporting can all fall within this scope. Customs clearance, laboratory testing, certification and freight — which require specialist expertise — are coordinated with the relevant authorised bodies.",
    },
    [
      { tr: "Tedarikçi araştırması ve teklif karşılaştırması", en: "Supplier research and quotation comparison" },
      { tr: "Ödeme ve teslim koşullarının görüşülmesi", en: "Negotiation of payment and delivery terms" },
      { tr: "Ticari belgelerin takibi", en: "Follow-up on trade documents" },
      { tr: "Taşıma tekliflerinin koordinasyonu", en: "Coordination of freight quotations" },
      { tr: "Sevkiyat durum raporlaması", en: "Shipment status reporting" },
    ],
    {
      tr: "Sağlanan çıktılar",
      en: "What you receive",
    },
    {
      tr: "Karşılaştırmalı teklif tablosu, açık konular listesi, belge takip kaydı ve sevkiyat durum raporları.",
      en: "A comparative quotation table, a list of open points, a document tracking record and shipment status reports.",
    }
  ),

  /* ---- 6. Ambalaj ---------------------------------------------------------- */
  feature(
    "tpl_svc_6",
    { tr: "06 / AMBALAJ", en: "06 / PACKAGING" },
    {
      tr: "Ambalaj Geliştirme ve Üretim Tedariki",
      en: "Packaging Development and Production Sourcing",
    },
    {
      tr: "Ürününüzün kullanım amacı, satış kanalı ve üretim koşullarına göre ambalaj tasarımı, baskı öncesi hazırlık ve üretim tedarikini koordine ediyoruz.",
      en: "We coordinate packaging design, pre-press preparation and production sourcing according to your product's intended use, sales channel and production conditions.",
    },
    [
      { tr: "Ambalaj ihtiyacının tanımlanması", en: "Defining the packaging requirement" },
      { tr: "Tasarım ve ölçü bilgilerinin hazırlanması", en: "Preparing design and dimension data" },
      { tr: "Numune veya prova değerlendirmesi", en: "Sample or proof evaluation" },
      { tr: "Üretici tekliflerinin karşılaştırılması", en: "Comparing manufacturer quotations" },
      { tr: "Üretim takibi", en: "Production follow-up" },
    ],
    {
      tr: "Sağlanan çıktılar",
      en: "What you receive",
    },
    {
      tr: "Hazırlanmış tasarım dosyası, karşılaştırmalı üretici teklifleri ve numune/prova onay kaydı.",
      en: "A prepared design file, comparative manufacturer quotations and a record of sample/proof approval.",
    }
  ),

  /* ---- Çalışma modelimiz --------------------------------------------------- */
  {
    ...CARD_GRID_DEFAULTS,
    id: "tpl_svc_model",
    columns: 2,
    heading: bi("Çalışma modelimiz", "How We Work Together"),
    sub: bi(
      "Ücretlendirmeyi ürün, hedef pazar, araştırma kapsamı ve operasyon yoğunluğuna göre tekliflendiririz. Çalışmaya başlamadan önce kapsam ve ticari koşulları yazılı olarak netleştiririz.",
      "We quote based on the product, target market, research scope and operational intensity. Before work begins, the scope and commercial terms are set out in writing."
    ),
    cards: [
      {
        id: "tpl_svc_m1",
        eyebrow: bi("PROJE BAZLI", "PROJECT-BASED"),
        title: bi("Proje bazlı destek", "Project-based support"),
        desc: bi(
          "Belirli bir ürün, ülke, araştırma veya sipariş için tanımlanmış kapsam.",
          "A defined scope for a specific product, country, research task or order."
        ),
        note: bi("", ""),
        image: "",
      },
      {
        id: "tpl_svc_m2",
        eyebrow: bi("DÜZENLİ", "ONGOING"),
        title: bi("Düzenli destek", "Ongoing support"),
        desc: bi(
          "İhracat veya tedarik süreçlerinin sürekli takibi için kararlaştırılan çalışma modeli.",
          "An agreed working model for the continuous follow-up of your export or sourcing processes."
        ),
        note: bi("", ""),
        image: "",
      },
    ],
  },

  cta(
    "tpl_svc_cta",
    { tr: "BİZİMLE ÇALIŞIN", en: "WORK WITH US" },
    {
      tr: "İhtiyacınıza Uygun Modeli Görüşelim",
      en: "Let's Discuss the Model That Fits You",
    },
    {
      tr: "Ürününüzü, hedef pazarınızı ve ihtiyaç duyduğunuz desteği paylaşın. Size uygun çalışma kapsamını birlikte belirleyelim.",
      en: "Share your product, your target market and the support you need. Let us define the right scope of work together.",
    },
    { tr: "Talebimi Gönder", en: "Send My Request" }
  ),
  footer(),
];;

/* ========================================================================== *
 *  Sektörler — /industries
 * ========================================================================== */

// /industries sablonu: genel uzmanlik iddialari yerine urun gruplari ve
// operasyon konulari.
const industries = [
  nav(),
  header(
    {
      tr: "SEKTÖRLER",
      en: "SECTORS",
    },
    {
      tr: "Ürününüzün Teknik ve Ticari İhtiyaçlarına Göre Çalışıyoruz",
      en: "We Work to Your Product's Technical and Commercial Requirements",
    },
    {
      tr: "Uluslararası ticarette aynı yöntem her ürüne aynı şekilde uygulanamaz. Teknik şartname, satın alma kanalı, belge ihtiyacı ve sevkiyat koşulları ürün grubuna göre değişir.\n\nGENCO, araştırma ve operasyon kapsamını bu farklılıkları dikkate alarak belirler.",
      en: "In international trade, the same method cannot be applied to every product in the same way. Technical specifications, purchasing channels, documentation requirements and shipping conditions vary by product group.\n\nGENCO defines the research and operational scope with these differences in mind.",
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
        eyebrow: bi("01 / ÇELİK", "01 / STEEL"),
        title: bi("Vasıflı Çelik", "Engineering Steel"),
        desc: bi(
          "Çelik çubuk ve ilgili endüstriyel malzeme gruplarında üretici, tedarikçi ve alıcı koordinasyonu sağlıyoruz. Çalışmanın başlangıcında çelik kalitesi, referans standart, ölçü, tolerans, teslim durumu ve belge beklentilerini netleştiriyoruz. Tekliflerin aynı teknik kapsam üzerinden karşılaştırılmasını ve açık konuların sipariş öncesinde çözülmesini destekliyoruz.",
          "We provide manufacturer, supplier and buyer coordination for steel bars and related industrial material groups. At the start of the work we clarify steel quality, reference standards, dimensions, tolerances, delivery condition and documentation expectations. We support the comparison of quotations on the same technical scope and the resolution of open points before ordering."
        ),
        note: bi(
          "Destek alanları: Ürün ve üretici araştırması · Teklif karşılaştırması · Teknik belge takibi · Numune ve sevkiyat koordinasyonu",
          "Support areas: Product and manufacturer research · Quotation comparison · Technical documentation follow-up · Sample and shipment coordination"
        ),
        image: "/img/sector-photo-steel.webp",
      },
      {
        id: "tpl_ind_2",
        eyebrow: bi("02 / MARINE", "02 / MARINE"),
        title: bi("Yatçılık ve Marine Ekipmanı", "Yachting & Marine Equipment"),
        desc: bi(
          "Yatçılık ve marine ürünlerinde aksesuar, ekipman ve ilgili ürün grupları için tedarikçi ve alıcı araştırması yapıyoruz. Ürünün kullanım amacı, teknik özellikleri ve hedef pazardaki satış kanalı üzerinden çalışma kapsamını oluşturuyoruz. Gerekli belge ve uygunluk kontrollerini ürün grubuna göre ilgili taraflarla koordine ediyoruz.",
          "For yachting and marine products we research suppliers and buyers across accessories, equipment and related product groups. We build the scope of work around the product's intended use, technical features and the sales channel in the target market. We coordinate the documentation and conformity checks required for each product group with the relevant parties."
        ),
        note: bi(
          "Destek alanları: Ürün eşleştirme · Tedarikçi araştırması · Belge takibi · Sipariş koordinasyonu",
          "Support areas: Product matching · Supplier research · Documentation follow-up · Order coordination"
        ),
        image: "/img/sector-photo-marine.webp",
      },
      {
        id: "tpl_ind_3",
        eyebrow: bi("03 / TOHUMCULUK", "03 / SEED TRADE"),
        title: bi("Tohumculuk", "Seed Trade"),
        desc: bi(
          "Tohum ticaretinde ürün, menşe ve hedef ülkeye bağlı süreçlerin birlikte planlanmasına destek oluyoruz. Tedarikçi iletişimi, ürün bilgilerinin toplanması, gerekli izin ve analiz süreçlerinin ilgili uzmanlarla takibi ile sevkiyat hazırlığını koordine ediyoruz.",
          "In seed trade we support the joint planning of processes that depend on the product, its origin and the target country. We coordinate supplier communication, the collection of product information, follow-up on the permits and analysis processes with the relevant specialists, and shipment preparation."
        ),
        note: bi(
          "Destek alanları: Tedarikçi ve alıcı araştırması · Belge ve analiz koordinasyonu · Operasyon takibi",
          "Support areas: Supplier and buyer research · Documentation and analysis coordination · Operational follow-up"
        ),
        image: "/img/sector-photo-seeds.webp",
      },
      {
        id: "tpl_ind_4",
        eyebrow: bi("04 / MEDİKAL", "04 / MEDICAL"),
        title: bi("Medikal Ürünler", "Medical Products"),
        desc: bi(
          "Medikal malzemeler ve cerrahi sarf ürünlerinde teknik beklentileri ve ticari koşulları birlikte değerlendiriyoruz. Ürünün kullanım amacı, ürün tanımı, belge seti ve alıcının şartnamesi üzerinden üretici araştırması yapıyoruz. Teknik ve düzenleyici değerlendirme gerektiren konuları ilgili uzmanlarla koordine ediyoruz.",
          "We assess the technical expectations and commercial conditions of medical supplies and surgical consumables together. We research manufacturers based on the product's intended use, product definition, documentation set and the buyer's specification. We coordinate matters requiring technical and regulatory assessment with the relevant specialists."
        ),
        note: bi(
          "Destek alanları: Üretici araştırması · Numune koordinasyonu · Teknik belge takibi · Ticari görüşmeler",
          "Support areas: Manufacturer research · Sample coordination · Technical documentation follow-up · Commercial meetings"
        ),
        image: "/img/sector-photo-medical.webp",
      },
      {
        id: "tpl_ind_5",
        eyebrow: bi("05 / AMBALAJ", "05 / PACKAGING"),
        title: bi("Ambalaj", "Packaging"),
        desc: bi(
          "Ambalajın tasarım, üretim ve tedarik aşamalarını birlikte ele alıyoruz. Ürün özellikleri, kullanım koşulları, baskı yöntemi, sipariş miktarı ve hedef maliyet üzerinden uygun seçenekleri araştırıyoruz. Tasarım dosyası, ölçü, malzeme ve prova bilgilerinin üreticiyle netleştirilmesini sağlıyoruz.",
          "We handle the design, production and sourcing stages of packaging together. We research suitable options based on product characteristics, usage conditions, printing method, order quantity and target cost. We ensure that the design file, dimensions, materials and proof details are clarified with the manufacturer."
        ),
        note: bi(
          "Destek alanları: Ambalaj geliştirme · Baskı öncesi hazırlık · Üretici araştırması · Numune ve üretim koordinasyonu",
          "Support areas: Packaging development · Pre-press preparation · Manufacturer research · Sample and production coordination"
        ),
        image: "/img/sector-photo-packaging.webp",
      },
      {
        id: "tpl_ind_6",
        eyebrow: bi("06 / FEMTECH", "06 / FEMTECH"),
        title: bi(
          "Femtech ve Kadın Sağlığı Ürünleri",
          "Femtech and Women's Health Products"
        ),
        desc: bi(
          "Kadın sağlığı ürünleri ve sağlık teknolojileri alanındaki markalar için hedef pazar, satış kanalı ve distribütör araştırması sağlıyoruz. Ürünün kullanım amacı ve hedef müşteri grubuna göre uygun ticari kanalları belirliyor; potansiyel iş ortaklarıyla görüşmeleri takip ediyoruz. Ürün sınıflandırması ve pazarlama iddiaları gibi konularda gerekli uzman değerlendirmelerini koordine ediyoruz.",
          "For brands in women's health products and health technologies, we research target markets, sales channels and distributors. We identify the suitable commercial channels based on the product's intended use and target customer group, and follow up on discussions with potential partners. We coordinate the expert assessments needed on matters such as product classification and marketing claims."
        ),
        note: bi(
          "Destek alanları: Pazar araştırması · Distribütör geliştirme · Ürün sunumu · İhracat koordinasyonu",
          "Support areas: Market research · Distributor development · Product presentation · Export coordination"
        ),
        image: "/img/sector-photo-femtech.webp",
      },
    ],
  },
  cta(
    "tpl_ind_cta",
    { tr: "FARKLI BİR SEKTÖRDE MİSİNİZ?", en: "WORKING IN A DIFFERENT SECTOR?" },
    { tr: "Farklı Bir Sektörde Misiniz?", en: "Are You in a Different Sector?" },
    {
      tr: "Ürününüzü ve ticari hedefinizi paylaşın. İhtiyacın kapsamını, araştırma yöntemini ve birlikte çalışabileceğimiz alanları değerlendirelim.",
      en: "Share your product and your commercial objective. Let us assess the scope of the need, the research method and the areas where we can work together.",
    },
    { tr: "Sektörünüzü Görüşelim", en: "Discuss Your Sector" }
  ),
  footer(),
];;

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
      tr: "Bu sayfa yürüttüğümüz somut operasyonları gösterir: hangi sektörde, hangi pazarda, ne kapsamda çalıştık. Müşteri ve hacim bilgileri gizlilik nedeniyle paylaşılmamaktadır.\n\nSektörün kendisiyle ilgili teknik ve düzenleyici tartışmalar için Sektör Analizleri sayfasına bakın.",
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
      tr: "Bu sayfa yaptığımız işleri değil, sektörün kendi kurallarını anlatır: hangi standart, hangi izin, hangi tuzak. Uluslararası ticarette kendi deneyimimizden çıkardığımız stratejik notları burada paylaşıyoruz.\n\nYürüttüğümüz somut operasyonlar için Vaka Analizleri sayfasına bakın.",
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
    id: "tpl_ins_full",
    heading: bi("Uygulama notları", "Implementation notes"),
    articles: [
      {
        id: "tpl_ins_f1",
        eyebrow: bi("NOT 01", "NOTE 01"),
        category: bi("TEKNİK ŞARTNAME", "TECHNICAL SPECIFICATION"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Teklif Öncesi Teknik Şartnameyi Netleştirmek", "Clarifying the Technical Specification Before Requesting Quotes"),
        href: "/insights/teknik-sartnameyi-netlestirmek",
        linkLabel: bi("", ""),
        body: bi(
          "Aynı ürün adıyla sunulan iki teklif aynı kapsamı içermeyebilir. Malzeme, ölçü, tolerans, teslim durumu ve belge beklentileri açık yazılmadığında fiyat karşılaştırması yanıltıcı olabilir.",
          "Two quotations offered under the same product name may not cover the same scope. Without written clarity on material, dimensions, tolerance, delivery condition and documentation, comparing prices can be misleading."
        ),
      },
      {
        id: "tpl_ins_f2",
        eyebrow: bi("NOT 02", "NOTE 02"),
        category: bi("ÜRETİCİ SEÇİMİ", "MANUFACTURER SELECTION"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Üretici Seçiminde Fiyatın Yanında Neye Bakılmalı?", "What to Look At Beyond Price When Choosing a Manufacturer"),
        href: "/insights/uretici-seciminde-karsilastirilacak-basliklar",
        linkLabel: bi("", ""),
        body: bi(
          "Uygun fiyat, üreticinin ihtiyacınıza uygun olduğu anlamına gelmez. Ürün deneyimi, kapasite, numune süreci, iletişim ve teslim koşullarının birlikte değerlendirilmesi gerekir.",
          "A suitable price does not mean the manufacturer fits your requirement. Product experience, capacity, the sample process, communication and delivery conditions need to be assessed together."
        ),
      },
      {
        id: "tpl_ins_f3",
        eyebrow: bi("NOT 03", "NOTE 03"),
        category: bi("İŞ ORTAĞI", "BUSINESS PARTNERS"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Distribütör Listesinden İş Ortağı Seçimine", "From a Distributor List to Choosing a Business Partner"),
        href: "/insights/distributor-listesinden-is-ortagi-secimine",
        linkLabel: bi("", ""),
        body: bi(
          "Bir ülkedeki distribütörlerin listesini çıkarmak araştırmanın başlangıcıdır. Asıl karar, hangi firmanın ürününüzü doğru müşteri grubuna ulaştırabileceğidir.\n\nYazan: GENCO · 11 Ekim 2026 · Sektör Notu",
          "Producing a list of distributors in a country is where research begins. The real decision is which company can get your product to the right customer group."
        ),
      },
    ],
  },
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

// /about sablonu: kurulus hikayesi, calisma bicimi ve sorumluluk
// sinirlari acikca yazilir.
//
// NOT — Yonetici profili: Brief'te istenen "Ali Tuncdamar" bolumu buraya
// eklenmedi. Gorevi, calisma yillari ve fotografi dogrulanmadan yayinlanan
// metin yaniltici olur. Bilgiler teyit edildiginde panelden bu bolum
// eklenebilir (nav → footer arasi feature blogu).
const about = [
  nav(),
  header(
    { tr: "HAKKIMIZDA", en: "ABOUT US" },
    {
      tr: "2008'den Beri Uluslararası Ticaretin İçindeyiz",
      en: "In International Trade Since 2008",
    },
    {
      tr: "GENCO, 2008 yılında İzmir'de ithalat ve ihracat alanında faaliyet göstermek üzere kuruldu.\n\nBugün üreticilerin dış pazarlara ulaşmasına, uluslararası alıcıların Türkiye'den tedarik yapmasına ve markaların yeni iş ortakları geliştirmesine destek oluyoruz. Çalışmalarımızı araştırma, iletişim ve operasyon takibini bir araya getirerek yürütüyoruz.",
      en: "GENCO was established in 2008 in Izmir to operate in import and export.\n\nToday we support manufacturers in reaching new markets, international buyers in sourcing from Turkey, and brands in developing new business partners. We carry out our work by bringing research, communication and operational follow-up together.",
    }
  ),

  media(
    "tpl_about_band",
    "row",
    [
      {
        url: "/img/about-band-operations.webp",
        tr: "Operasyon sahada: araştırma sonucunu temas, görüşme ve sipariş takibine taşırız.",
        en: "Operations in the field: we carry the research result through to contact, meetings and order follow-up.",
      },
    ],
    { tr: "Söz değil, çalışma biçimi", en: "Not promises, but a working method" }
  ),

  /* ---- Neden GENCO -------------------------------------------------------- */
  feature(
    "tpl_about_why",
    { tr: "NEDEN GENCO?", en: "WHY GENCO?" },
    {
      tr: "Uluslararası ticarette doğru firmayı bulmak tek başına yeterli değildir",
      en: "Finding the right company is not enough on its own",
    },
    {
      tr: "Teknik beklentilerin anlaşılması, tekliflerin karşılaştırılması, görüşmelerin takip edilmesi ve siparişin doğru bilgilerle ilerlemesi gerekir. GENCO bu aşamalar arasındaki koordinasyonu sağlar. Kararlaştırılan kapsamda müşterimizin ekibinin bir uzantısı olarak çalışır; üretici, alıcı ve hizmet sağlayıcılar arasındaki iletişimi takip ederiz.",
      en: "Technical expectations have to be understood, quotations compared, meetings followed up and the order progressed with accurate information. GENCO provides the coordination between these stages. Within the agreed scope we work as an extension of our client's team, and we follow up the communication between manufacturers, buyers and service providers.",
    },
    [
      { tr: "Teknik beklentilerin birlikte netleştirilmesi", en: "Clarifying technical expectations together" },
      { tr: "Tekliflerin aynı kapsam üzerinden karşılaştırılması", en: "Comparing quotations on the same scope" },
      { tr: "Görüşme ve teklif takibi", en: "Meeting and quotation follow-up" },
      { tr: "Sipariş ve sevkiyat bilgilerinin takibi", en: "Follow-up on order and shipment information" },
    ],
    {
      tr: "Çalışma yaklaşımımız",
      en: "How we approach the work",
    },
    {
      tr: "Sorumlulukları açık tanımlarız: GENCO'nun yürüteceği işleri, müşterinin karar vermesi gereken konuları ve uzman kuruluşların sorumluluklarını başlangıçta belirleriz.",
      en: "We define responsibilities clearly: at the outset we establish what GENCO will handle, what the client needs to decide, and which responsibilities belong to specialist bodies.",
    }
  ),

  /* ---- Çalışma yaklaşımımız: dört adım ----------------------------------- */
  {
    ...ARTICLE_LIST_DEFAULTS,
    id: "tpl_about_approach",
    heading: bi("Çalışma Yaklaşımımız", "Our Working Approach"),
    articles: [
      {
        id: "tpl_about_ap1",
        eyebrow: bi("01", "01"),
        category: bi("İHTİYAÇ", "NEED"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Önce ihtiyacı netleştiririz", "We clarify the need first"),
        body: bi(
          "Ürünü, hedef ülkeyi, teknik beklentileri ve ticari koşulları anlamadan araştırmaya başlamayız.",
          "We do not begin research before we understand the product, the target country, the technical expectations and the commercial terms."
        ),
      },
      {
        id: "tpl_about_ap2",
        eyebrow: bi("02", "02"),
        category: bi("KARŞILAŞTIRMA", "COMPARISON"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Seçenekleri karşılaştırılabilir hale getiririz", "We make options comparable"),
        body: bi(
          "Firma isimleriyle birlikte ürün uygunluğu, kapasite bilgileri, fiyat, teslim süresi ve açık konuları değerlendiririz.",
          "Alongside company names, we assess product suitability, capacity data, price, lead time and open points."
        ),
      },
      {
        id: "tpl_about_ap3",
        eyebrow: bi("03", "03"),
        category: bi("TAKİP", "FOLLOW-UP"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Görüşmeleri ve sonraki adımları takip ederiz", "We follow up on meetings and next steps"),
        body: bi(
          "İlk teması bir sonuç olarak görmeyiz. Teklif, numune, teknik soru ve ticari görüşmelerin ilerlemesini düzenli takip ederiz.",
          "We do not treat first contact as an outcome. We follow up regularly on the progress of quotations, samples, technical questions and commercial meetings."
        ),
      },
      {
        id: "tpl_about_ap4",
        eyebrow: bi("04", "04"),
        category: bi("KAPSAM", "SCOPE"),
        date: bi("", ""),
        author: bi("", ""),
        title: bi("Sorumlulukları açık tanımlarız", "We define responsibilities clearly"),
        body: bi(
          "GENCO'nun yürüteceği işleri, müşterinin karar vermesi gereken konuları ve uzman kuruluşların sorumluluklarını başlangıçta belirleriz.",
          "At the outset we establish what GENCO will handle, what the client needs to decide, and which responsibilities belong to specialist bodies."
        ),
      },
    ],
  },

  /* ---- Yerel koordinasyon ------------------------------------------------- */
  media(
    "tpl_about_local",
    "split",
    [
      {
        url: "/img/about-detail-samples.webp",
        tr: "Numune çalışmaları: teknik değerlendirme gerektiren ürünlerde numune planlaması ve takibi.",
        en: "Sample work: planning and tracking samples for products requiring technical evaluation.",
      },
      {
        url: "/img/about-detail-engineering.webp",
        tr: "Üretici ziyaretleri: kapasite ve üretim koşullarının yerinde görülmesi.",
        en: "Factory visits: seeing capacity and production conditions on site.",
      },
    ],
    { tr: "Türkiye'de Yerel Koordinasyon, Uluslararası İletişim", en: "Local Coordination in Turkey, International Communication" },
    {
      tr: "İzmir merkezli yapımızla Türkiye'deki üreticiler ve hizmet sağlayıcılarla iletişim kuruyor; uluslararası müşterilerimizin taleplerini Türkçe ve İngilizce takip ediyoruz. Ürün ve proje ihtiyacına göre üretici ziyaretleri, numune çalışmaları ve sevkiyat hazırlıklarını koordine ediyoruz.",
      en: "From our base in Izmir we liaise with manufacturers and service providers in Turkey, and follow the requirements of our international clients in Turkish and English. Depending on the product and project, we coordinate factory visits, sample work and shipment preparation.",
    }
  ),

  /* ---- Çalışma modeli ----------------------------------------------------- */
  feature(
    "tpl_about_model",
    { tr: "ÇALIŞMA MODELİ", en: "WORKING MODEL" },
    {
      tr: "Projenize Uygun Bir Çalışma Modeli",
      en: "A Working Model That Suits Your Project",
    },
    {
      tr: "Her şirketin ihtiyacı aynı değildir. Bazı müşterilerimiz belirli bir ülkede alıcı araştırmasına, bazıları bir ürün için üretici bulmaya, bazıları ise düzenli ihracat ve sipariş takibine ihtiyaç duyar.",
      en: "Every company's needs differ. Some clients need buyer research in a specific country, some need to find a manufacturer for a product, and some need ongoing export and order follow-up.",
    },
    [
      { tr: "Belirli bir ülkede alıcı araştırması", en: "Buyer research in a specific country" },
      { tr: "Bir ürün grubu için üretici bulma", en: "Finding a manufacturer for a product group" },
      { tr: "Düzenli ihracat ve sipariş takibi", en: "Ongoing export and order follow-up" },
      { tr: "Tek seferlik, tanımlanmış kapsamlı proje", en: "A one-off project with a defined scope" },
    ],
    {
      tr: "Çalışma modelimizi bu ihtiyaca göre oluştururuz.",
      en: "We build the working model around that need.",
    },
    { tr: "", en: "" }
  ),

  cta(
    "tpl_about_cta",
    { tr: "TANIŞALIM", en: "LET'S TALK" },
    { tr: "GENCO ile Tanışın", en: "Meet GENCO" },
    {
      tr: "Ürününüzü, hedef pazarınızı ve ihtiyaç duyduğunuz desteği paylaşın. Size uygun çalışma kapsamını birlikte belirleyelim.",
      en: "Share your product, your target market and the support you need. Let us define the right scope of work together.",
    },
    { tr: "Talebimi Gönder", en: "Send My Request" }
  ),
  footer(),
];;

/* ========================================================================== *
 *  İletişim — /contact
 * ========================================================================== */

const contact = [
  nav(),
  header(
    { tr: "İLETİŞİM", en: "CONTACT" },
    {
      tr: "İhracat veya Tedarik İhtiyacınızı Paylaşın",
      en: "Share Your Export or Sourcing Requirement",
    },
    {
      tr: "Yeni bir pazara ulaşmak, Türkiye'den üretici bulmak veya mevcut bir siparişi daha düzenli takip etmek istiyorsanız projenizi bize anlatın.\n\nÜrününüzü, hedef ülkenizi ve ihtiyaç duyduğunuz desteği öğrendikten sonra uygun çalışma kapsamını değerlendirelim.",
      en: "If you are looking to reach a new market, find a manufacturer in Turkey, or have an existing order followed up more regularly, tell us about your project.\n\nOnce we understand your product, your target country and the support you need, we will assess the appropriate scope of work.",
    }
  ),

  /* ---- Size nasıl destek olabiliriz ---------------------------------------- */
  feature(
    "tpl_ct_help",
    { tr: "KAPSAM", en: "SCOPE" },
    { tr: "Size Nasıl Destek Olabiliriz?", en: "How We Can Help" },
    {
      tr: "Çalışma kapsamını ihtiyacınıza göre belirli bir iş üzerinden veya daha geniş bir süreç üzerinden tanımlarız.",
      en: "We define the scope around your need, either for a specific piece of work or across a broader process.",
    },
    [
      { tr: "İhracat geliştirme ve alıcı araştırması", en: "Export development and buyer research" },
      { tr: "Türkiye'den üretici ve ürün tedariki", en: "Manufacturer and product sourcing from Turkey" },
      { tr: "Distribütör veya yerel iş ortağı araştırması", en: "Distributor or local partner research" },
      { tr: "İthalat ve sipariş koordinasyonu", en: "Import and order coordination" },
      { tr: "Ambalaj geliştirme ve üretim tedariki", en: "Packaging development and production sourcing" },
      { tr: "Diğer uluslararası ticaret projeleri", en: "Other international trade projects" },
    ],
    {
      tr: "Talebinizde Hangi Bilgiler Bulunmalı?",
      en: "What Information Should Your Request Include?",
    },
    {
      tr: "Daha sağlıklı bir ilk değerlendirme için mümkünse şu bilgileri paylaşın: Şirketiniz ve faaliyet alanınız · Ürün veya ürün grubu · Hedef ülke ya da teslim yeri · Yaklaşık miktar veya proje kapsamı · Teknik şartname, çizim veya ürün bağlantısı · Hedef takvim ve ihtiyaç duyduğunuz destek.\n\nTüm bilgiler henüz hazır değilse mevcut durumunuzu yazabilirsiniz.",
      en: "For a more useful first assessment, please share where possible: your company and field of activity · the product or product group · the target country or delivery location · approximate quantity or project scope · technical specification, drawing or a product link · your target timeline and the support you need.\n\nIf not everything is ready yet, simply describe your current situation.",
    }
  ),

  { ...CONTACT_DEFAULTS, id: "tpl_contact_body" },
  footer(),
];;

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

/* ========================================================================== *
 *  Hizmet detay sayfaları — /services/*
 * --------------------------------------------------------------------------
 *  Her biri kendi URL'ine sahip ayrı bir sayfadır ve /services özetinde
 *  bağlantı verilir. Neden ayrı sayfa: her hizmetin kapsamı, çıktısı ve
 *  "kimin için uygun" sorusu farklıdır; tek sayfada toplamak bunları
 *  kaybettirir.
 *
 *  Yeni hizmet sayfası eklerken dört yeri güncelle:
 *    1. Buraya şablonu yaz ve PAGE_TEMPLATES'e ekle.
 *    2. src/lib/seo.js → PAGES'e title/description (TR + EN) ekle.
 *    3. src/lib/localeYol.js → TR_YOLLAR'a anahtarı ekle.
 *    4. app/(tr)/services/<slug>/page.jsx ve app/(en)/en/services/<slug>/page.jsx
 *       dosyalarını oluştur; sitemap.js ve admin STATIC_PAGES'a da ekle.
 * ========================================================================== */

/* --- Ortak yardımcı: hizmet detay sayfasının süreç listesi -------------- */
const steps = (id, items) =>
  items.map((t, i) => ({
    id: `${id}_s${i + 1}`,
    eyebrow: bi(`0${i + 1}`, `0${i + 1}`),
    category: bi("ADIM", "STEP"),
    date: bi("", ""),
    author: bi("", ""),
    title: bi(t.baslik.tr, t.baslik.en),
    body: bi(t.metin.tr, t.metin.en),
  }));

/* ========================================================================== *
 *  A. Dış kaynaklı ihracat — /services/outsourced-export
 * ========================================================================== */

const outsourcedExport = [
  nav(),
  header(
    { tr: "DIŞ KAYNAKLI İHRACAT", en: "OUTSOURCED EXPORT" },
    {
      tr: "Şirketinizin Dış Kaynaklı İhracat Ekibi",
      en: "Your Outsourced Export Team",
    },
    {
      tr: "İhracata başlamak veya mevcut satışlarını geliştirmek isteyen üreticiler için araştırma, iletişim ve operasyon takibini bir araya getiriyoruz. GENCO, kararlaştırılan kapsamda şirketinizin dış kaynaklı ihracat ekibi olarak çalışır.",
      en: "For manufacturers looking to start exporting or to grow existing sales, we bring research, communication and operational follow-up together. Within the agreed scope, GENCO works as your outsourced export team.",
    }
  ),

  feature(
    "tpl_oe_who",
    { tr: "KİMLER İÇİN", en: "WHO IT SUITS" },
    { tr: "Kimler İçin Uygun?", en: "Who Is This For?" },
    {
      tr: "Mevcut ekibini kurmadan ihracat hareketini yönetmek isteyen işletmeler için uygundur.",
      en: "This model suits companies that want to manage their export activity without building their own team.",
    },
    [
      { tr: "İhracata başlamak isteyen üreticiler", en: "Manufacturers looking to start exporting" },
      { tr: "Ayrı bir ihracat ekibi kurmadan çalışmak isteyen şirketler", en: "Companies that want to work without a separate export team" },
      { tr: "Mevcut ekibini yeni pazar araştırmasında desteklemek isteyen işletmeler", en: "Businesses that want to support their existing team in new market research" },
      { tr: "Alıcı görüşmeleri ve teklif takibinde düzenli desteğe ihtiyaç duyan firmalar", en: "Firms that need regular support with buyer meetings and quotation follow-up" },
    ],
    {
      tr: "Çalışmaya nasıl başlıyoruz?",
      en: "How we start",
    },
    {
      tr: "Önce ürün gamınızı, üretim kapasitenizi, mevcut satış yapınızı ve hedeflerinizi değerlendiriyoruz. Ürün bilgileri, fiyatlandırma yaklaşımı, teslim süreleri ve gerekli satış materyalleri üzerinden araştırma kapsamını belirliyoruz.",
      en: "We first assess your product range, production capacity, current sales activity and objectives. From there we define the research scope in terms of product information, pricing approach, lead times and the sales materials required.",
    }
  ),

  {
    ...ARTICLE_LIST_DEFAULTS,
    id: "tpl_oe_work",
    heading: bi("Hangi İşleri Yürütüyoruz?", "What We Handle"),
    articles: steps("tpl_oe_w", [
      {
        baslik: { tr: "Hedef pazar ve müşteri araştırması", en: "Target market and customer research" },
        metin: {
          tr: "Hedef ülkeleri, müşteri gruplarını ve satış kanalını araştırır; aday firma listesini oluştururuz.",
          en: "We research target countries, customer groups and the sales channel, and build a candidate company list.",
        },
      },
      {
        baslik: { tr: "Aday firmalarla ilk temas", en: "First contact with candidate companies" },
        metin: {
          tr: "Doğru kişiye ulaşmak için iletişim bilgilerini araştırır ve kararlaştırılan kapsamda ilk teması yaparız.",
          en: "We research contact details to reach the right person and make first contact within the agreed scope.",
        },
      },
      {
        baslik: { tr: "Ürün sunumu ve ticari görüşme", en: "Product presentation and commercial meetings" },
        metin: {
          tr: "Ürün sunumunu hazırlar, görüşmeleri organize eder ve sonuçları takip ederiz.",
          en: "We prepare the product presentation, arrange meetings and track the outcomes.",
        },
      },
      {
        baslik: { tr: "Teklif ve numune takibi", en: "Quotation and sample follow-up" },
        metin: {
          tr: "Gelen talepleri, teklifleri ve numune durumlarını kaydeder, açık konuları takip ederiz.",
          en: "We record incoming requests, quotations and sample status, and follow up on open points.",
        },
      },
      {
        baslik: { tr: "Sipariş aşamalarının takibi", en: "Order stage follow-up" },
        metin: {
          tr: "Sipariş onayından sevkiyat hazırlığına kadar aşamaları takip eder, taraflar arasındaki iletişimi yürütürüz.",
          en: "We follow the stages from order confirmation through shipment preparation and manage communication between the parties.",
        },
      },
    ]),
  },

  feature(
    "tpl_oe_report",
    { tr: "RAPORLAMA", en: "REPORTING" },
    { tr: "Süreç Nasıl Raporlanıyor?", en: "How Is Progress Reported?" },
    {
      tr: "Raporlama biçimi başlangıçta kararlaştırılır.",
      en: "The reporting format is agreed at the outset.",
    },
    [
      { tr: "Araştırılan aday listesi", en: "The list of researched candidates" },
      { tr: "Temas durumları", en: "Contact status" },
      { tr: "Gelen talepler ve değerlendirmesi", en: "Incoming requests and their assessment" },
      { tr: "Bekleyen işler ve açık konular", en: "Pending items and open points" },
    ],
    {
      tr: "Satış garantisi var mı?",
      en: "Is There a Sales Guarantee?",
    },
    {
      tr: "Satış kararı piyasa koşullarına ve alıcının değerlendirmesine bağlıdır. GENCO'nun üstleneceği işleri ve takip edilecek çıktıları başlangıçta netleştiririz.",
      en: "A sales decision depends on market conditions and the buyer's assessment. At the outset we set out what GENCO will handle and which outputs will be tracked.",
    }
  ),

  cta(
    "tpl_oe_cta",
    { tr: "BAŞLAYALIM", en: "LET'S START" },
    { tr: "İhracat Hedefinizi Görüşelim", en: "Discuss Your Export Objective" },
    {
      tr: "Ürün gamınızı ve hedef pazarınızı paylaşın; araştırma kapsamını birlikte belirleyelim.",
      en: "Share your product range and target market, and let us define the research scope together.",
    },
    { tr: "Talebimi Gönder", en: "Send My Request" }
  ),
  footer(),
];

/* ========================================================================== *
 *  B. Türkiye'den tedarik — /services/turkey-sourcing
 * ========================================================================== */

const turkeySourcing = [
  nav(),
  header(
    { tr: "TÜRKİYE'DEN TEDARİK", en: "SOURCING FROM TURKEY" },
    {
      tr: "Türkiye'den Tedarik Süreciniz İçin Yerel Koordinasyon",
      en: "Local Coordination for Your Sourcing Process in Turkey",
    },
    {
      tr: "GENCO, Türkiye'den ürün satın almak isteyen uluslararası şirketler için üretici araştırması ve sipariş koordinasyonu sağlar. Teknik şartnameniz ve satın alma koşullarınız üzerinden uygun seçenekleri araştırır; üreticilerle iletişimi ve açık konuların takibini yürütürüz.",
      en: "GENCO provides manufacturer research and order coordination for international companies looking to buy from Turkey. We research suitable options against your technical specification and purchasing conditions, and manage communication with manufacturers and follow-up on open points.",
    }
  ),

  {
    ...ARTICLE_LIST_DEFAULTS,
    id: "tpl_ts_process",
    heading: bi("Süreç Nasıl İlerliyor?", "How the Process Works"),
    articles: steps("tpl_ts_p", [
      {
        baslik: { tr: "Satın alma ihtiyacını tanımlama", en: "Defining the purchasing requirement" },
        metin: {
          tr: "Ürün, kullanım amacı, miktar, teknik özellikler, ambalaj ve teslim beklentilerini netleştiririz.",
          en: "We clarify the product, its intended use, quantity, technical features, packaging and delivery expectations.",
        },
      },
      {
        baslik: { tr: "Üretici araştırması", en: "Manufacturer research" },
        metin: {
          tr: "Ürün grubuna uygun adayları belirler; ürün gamı, kapasite ve ilgili belge bilgilerini toplarız.",
          en: "We identify suitable candidates for the product group and collect product range, capacity and relevant documentation.",
        },
      },
      {
        baslik: { tr: "Teklif karşılaştırması", en: "Quotation comparison" },
        metin: {
          tr: "Fiyatın yanında teslim süresi, ödeme koşulları, teknik farklılıklar ve teklif kapsamını değerlendiririz.",
          en: "Alongside price, we assess lead time, payment terms, technical differences and the scope of each quotation.",
        },
      },
      {
        baslik: { tr: "Numune ve ziyaret koordinasyonu", en: "Sample and visit coordination" },
        metin: {
          tr: "Gerekli olduğunda numune gönderimini ve üretici ziyaretini planlarız. Teknik inceleme veya bağımsız denetim ihtiyacını ilgili uzmanlarla koordine ederiz.",
          en: "Where required, we arrange sample dispatch and factory visits. We coordinate technical inspection or independent inspection needs with the relevant specialists.",
        },
      },
      {
        baslik: { tr: "Sipariş ve sevkiyat takibi", en: "Order and shipment tracking" },
        metin: {
          tr: "Onaylanan kapsamın üreticiye aktarılmasını, üretim durumunun takip edilmesini ve sevkiyat hazırlığının ilgili taraflarla koordinasyonunu sağlarız.",
          en: "We ensure the agreed scope is passed to the manufacturer, follow production status, and coordinate shipment preparation with the relevant parties.",
        },
      },
    ]),
  },

  feature(
    "tpl_ts_deliver",
    { tr: "ÇIKTILAR", en: "DELIVERABLES" },
    { tr: "Size Ne Sunuyoruz?", en: "What We Provide" },
    {
      tr: "Araştırma sonucu, karşılaştırılabilir bir tabloya dönüşür.",
      en: "The research result is turned into a comparable table.",
    },
    [
      { tr: "Üretici kısa listesi", en: "A shortlist of manufacturers" },
      { tr: "Karşılaştırmalı teklifler", en: "Comparative quotations" },
      { tr: "Teknik ve ticari açık konular tablosu", en: "A table of open technical and commercial points" },
      { tr: "Sipariş durum bilgileri", en: "Order status information" },
    ],
    {
      tr: "İlk Değerlendirme İçin Ne Göndermelisiniz?",
      en: "What Should You Send for a First Assessment?",
    },
    {
      tr: "Teknik şartname veya ürün açıklaması, yaklaşık miktar, hedef teslim yeri ve istediğiniz takvim.",
      en: "A technical specification or product description, approximate quantity, target delivery location and the timeline you have in mind.",
    }
  ),

  cta(
    "tpl_ts_cta",
    { tr: "TEDARİK TALEBİ", en: "SOURCING REQUEST" },
    { tr: "Tedarik Talebinizi Paylaşın", en: "Share Your Sourcing Requirement" },
    {
      tr: "Ürün grubunuzu ve teknik beklentinizi iletin; uygun üretici adaylarını birlikte belirleyelim.",
      en: "Send us your product group and technical expectations, and let us identify suitable manufacturer candidates together.",
    },
    { tr: "Talebimi Gönder", en: "Send My Request" }
  ),
  footer(),
];

/* ========================================================================== *
 *  C. Alıcı ve distribütör geliştirme — /services/distributor-development
 * ========================================================================== */

const distributorDevelopment = [
  nav(),
  header(
    { tr: "PAZAR GELİŞTİRME", en: "MARKET DEVELOPMENT" },
    {
      tr: "Ürününüz İçin Uygun Alıcı ve Distribütörleri Araştıralım",
      en: "We Research the Right Buyers and Distributors for Your Product",
    },
    {
      tr: "GENCO, hedef pazardaki potansiyel iş ortaklarını ürününüz, fiyat segmentiniz ve satış kanalınız üzerinden araştırır. Firma listesi hazırlamanın yanında ilk temas, ilgi değerlendirmesi ve görüşme takibi de çalışma kapsamına alınabilir.",
      en: "GENCO researches potential partners in the target market based on your product, price segment and sales channel. Alongside compiling a list of companies, first contact, interest assessment and meeting follow-up can also be included in the scope.",
    }
  ),

  feature(
    "tpl_dd_profile",
    { tr: "ADAY PROFİLİ", en: "CANDIDATE PROFILE" },
    { tr: "Önce Doğru Aday Profilini Belirleriz", en: "We Define the Right Candidate Profile First" },
    {
      tr: "Aradığınız iş ortağı bir ithalatçı, distribütör, bayi, üretici veya kurumsal alıcı olabilir.",
      en: "The partner you are looking for may be an importer, a distributor, a dealer, a manufacturer or a corporate buyer.",
    },
    [
      { tr: "Ürününüzün teknik satış, yerel stok, eğitim veya servis ihtiyacı", en: "Your product's need for technical selling, local stock, training or service" },
      { tr: "Hedef müşteri grubu", en: "The target customer group" },
      { tr: "Aranan kanallar", en: "The channels sought" },
      { tr: "Bölgesel faaliyet beklentisi", en: "Expected regional coverage" },
    ],
    {
      tr: "Adayları hangi bilgilerle değerlendiririz?",
      en: "What Information Do We Assess Candidates On?",
    },
    {
      tr: "Faaliyet alanı ve ürün portföyü · Hedef müşteri grubu · Çalıştığı satış kanalları · Bölgesel faaliyet kapsamı · Mevcut markalarla olası uyum · Ulaşılabilir iletişim bilgileri. Araştırma sırasında doğrulanamayan bilgileri açıkça belirtiriz.",
      en: "Field of activity and product portfolio · Target customer group · Sales channels used · Regional coverage · Potential fit with existing brands · Reachable contact details. We state clearly any information that cannot be verified during the research.",
    }
  ),

  feature(
    "tpl_dd_next",
    { tr: "İLK TEMAS", en: "FIRST CONTACT" },
    { tr: "İlk Temastan Sonra Ne Olur?", en: "What Happens After First Contact?" },
    {
      tr: "Gelen cevapları ürün uygunluğu ve ilgi düzeyine göre değerlendiririz.",
      en: "We assess responses according to product suitability and level of interest.",
    },
    [
      { tr: "Gelen cevapların değerlendirilmesi", en: "Assessment of the responses received" },
      { tr: "Görüşme ve ürün sunumu", en: "Meetings and product presentation" },
      { tr: "Numune veya teklif aşaması", en: "The sample or quotation stage" },
      { tr: "Sonraki adımların takibi", en: "Follow-up on next steps" },
    ],
    {
      tr: "Başlamak için gerekli bilgiler",
      en: "What We Need to Start",
    },
    {
      tr: "Ürün kataloğunuz, hedef ülkeleriniz, mevcut satış kanallarınız, temel ticari koşullarınız ve aradığınız iş ortağının özellikleri.",
      en: "Your product catalogue, your target countries, your current sales channels, your main commercial terms and the characteristics of the partner you are seeking.",
    }
  ),

  cta(
    "tpl_dd_cta",
    { tr: "HEDEF PAZAR", en: "TARGET MARKET" },
    { tr: "Hedef Pazarınızı Paylaşın", en: "Share Your Target Market" },
    {
      tr: "Ürününüzü ve aradığınız iş ortağının özelliklerini yazın; aday araştırmasını birlikte planlayalım.",
      en: "Tell us about your product and the partner you are looking for, and let us plan the candidate research together.",
    },
    { tr: "Talebimi Gönder", en: "Send My Request" }
  ),
  footer(),
];

/* ========================================================================== *
 *  Sektör analizleri — /insights/*
 * --------------------------------------------------------------------------
 *  /insights sayfasındaki kısa tanıtımların karşılığı olan tam yazılar.
 *  Her yazı kendi adresinde yayınlanır; indeks sayfası bunlara bağlanır.
 *
 *  Yazar ve tarih: Bu alanlar boş bırakılmıştır. Brief'te "gerçek yazar adı
 *  ve yayın tarihi" isteniyor ancak doğrulanmamış bir isim veya tarih
 *  uydurmak yanıltıcı olur. Yazılar yayımlandıktan sonra panelden
 *  doldurulabilir (articleList blogunda "Yazar / ekip" alanı).
 *
 *  Madde imleri: articleList gövdesi düz metin basar (whitespace-pre-wrap).
 *  Bu yüzden listeler "• " ön ekiyle yazılmıştır; <ul> etiketi üretilmez.
 * ========================================================================== */

/* Yazının yazarı ve tarihi.
   Yazar kurum olarak GENCO kullanılıyor: doğrulanmış bir kişi adı olmadığı
   için isim uydurulmadı; kurum adı hem doğru hem savunulabilir.
   Tarih, yazının ilk yayım tarihidir. Panelden değiştirilebilir. */
const YAZI_YAZARI = bi("GENCO", "GENCO");
const YAZI_TARIHI = bi("11 Ekim 2026", "11 October 2026");

/* Yazı başlığının altında görünen yazar · tarih satırı.
   Article şeması makine içindir; ziyaretçinin de görmesi gerekir.
   Yayın tarihi 11 Ekim 2026'dır (ilk yayım). Panelden güncellenebilir. */
const YAZI_BYLINE = bi(
  "Yazan: GENCO · 11 Ekim 2026 · Sektör Notu",
  "Written by GENCO · 11 October 2026 · Sector Note"
);

const yazi = (id, bolumler) =>
  bolumler.map((b, i) => ({
    id: `${id}_${i + 1}`,
    eyebrow: bi(b.etiket ? b.etiket.tr : "", b.etiket ? b.etiket.en : ""),
    category: bi("", ""),
    date: bi("", ""),
    author: bi("", ""),
    title: bi(b.baslik.tr, b.baslik.en),
    body: bi(b.metin.tr, b.metin.en),
  }));

const yaziCta = (id, baslik, alt) =>
  cta(
    id,
    { tr: "SONRAKİ ADIM", en: "NEXT STEP" },
    baslik,
    alt,
    { tr: "Talebimi Gönder", en: "Send My Request" }
  );

/* --- Yazı 1 — Teklif öncesi teknik şartname ------------------------------ */

const yaziSartname = [
  nav(),
  header(
    { tr: "SEKTÖR NOTU", en: "SECTOR NOTE" },
    {
      tr: "Teklif Öncesi Teknik Şartnameyi Netleştirmek",
      en: "Clarifying the Technical Specification Before Requesting Quotes",
    },
    {
      tr: "Bir satın alma veya ihracat görüşmesinde ürün adı tek başına yeterli değildir. Aynı adla sunulan ürünler malzeme, ölçü, tolerans, yüzey, ambalaj veya belge kapsamı açısından farklı olabilir.\n\nBu nedenle fiyat istemeden önce teklifin hangi özellikleri kapsayacağını tanımlamak gerekir.\n\nYazan: GENCO · 11 Ekim 2026 · Sektör Notu",
      en: "In a purchasing or export discussion, the product name alone is not enough. Products offered under the same name may differ in material, dimension, tolerance, surface, packaging or the scope of documentation.\n\nThis is why the features a quotation is to cover should be defined before a price is requested.\n\nWritten by GENCO · 11 October 2026 · Sector Note",
    }
  ),
  {
    ...ARTICLE_LIST_DEFAULTS,
    id: "tpl_yn1_body",
    heading: bi("", ""),
    articles: yazi("tpl_yn1", [
      {
        baslik: { tr: "Teklif talebinde hangi bilgiler bulunmalı?", en: "What should a request for quotation include?" },
        metin: {
          tr: "• Ürünün adı ve kullanım amacı\n• Malzeme veya kalite tanımı\n• Referans standart ve gerekli teknik özellikler\n• Ölçü, tolerans ve teslim durumu\n• Sipariş miktarı ve ambalaj beklentisi\n• İstenen belgeler ve testler\n• Teslim yeri ve hedef tarih\n\nÜrün grubuna göre çizim, fotoğraf, referans numune veya teknik veri sayfası da gerekebilir.",
          en: "• Product name and intended use\n• Material or quality definition\n• Reference standards and required technical properties\n• Dimensions, tolerances and delivery condition\n• Order quantity and packaging expectations\n• Requested documents and tests\n• Delivery location and target date\n\nDepending on the product group, a drawing, photograph, reference sample or technical datasheet may also be required.",
        },
      },
      {
        baslik: { tr: "Farklılıkları görünür hale getirin", en: "Make the differences visible" },
        metin: {
          tr: "Her tedarikçiden aynı özellikleri sunduğunu varsaymak yerine, teklifindeki farklılıkları belirtmesini isteyin.\n\nAlternatif bir malzeme, farklı teslim süresi veya ek ücretli bir test teklifin değerlendirilmesini değiştirebilir. Bu konuları ayrı satırlarda karşılaştırmak, yalnızca toplam fiyat üzerinden karar vermekten daha sağlıklıdır.",
          en: "Rather than assuming every supplier offers the same features, ask them to state the differences in their quotation.\n\nAn alternative material, a different lead time, or a chargeable additional test can change how a quotation should be assessed. Comparing these on separate lines is sounder than deciding on the total price alone.",
        },
      },
      {
        baslik: { tr: "Sipariş öncesinde açık konuları kapatın", en: "Close open points before ordering" },
        metin: {
          tr: "Teklif aşamasındaki e-posta ve görüşmelerde ortaya çıkan teknik kararların sipariş belgesine aktarılması gerekir.\n\nNumune onayı, çizim revizyonu ve kabul edilen alternatifler kayıt altına alınmalıdır. Teknik bir konu belirsizse, ilgili üretici veya uzmanla netleştirilmeden sipariş verilmemelidir.",
          en: "Technical decisions that emerge in quotations, e-mails and meetings during the quotation stage need to be carried over into the order document.\n\nSample approval, drawing revisions and accepted alternatives should be recorded. Where a technical point is unclear, the order should not be placed until it has been settled with the manufacturer or the relevant specialist.",
        },
      },
      {
        baslik: { tr: "GENCO'nun katkısı", en: "What GENCO adds" },
        metin: {
          tr: "GENCO, teknik ve ticari bilgilerin taraflar arasında toplanmasını, açık konuların takip edilmesini ve tekliflerin karşılaştırılabilir hale getirilmesini destekler.",
          en: "GENCO supports the collection of technical and commercial information between the parties, the follow-up of open points, and the process of making quotations comparable.",
        },
      },
    ]),
  },
  yaziCta(
    "tpl_yn1_cta",
    { tr: "Ürününüz için teknik şartname hazırlayalım", en: "Let's prepare the specification for your product" },
    {
      tr: "Ürün grubunuzu ve hedef pazarınızı paylaşın; teklif toplanacak şartnameyi birlikte oluşturalım.",
      en: "Share your product group and target market, and let us build the specification against which quotes will be collected.",
    }
  ),
  footer(),
];

/* --- Yazı 2 — Üretici seçiminde karşılaştırılacak başlıklar -------------- */

const yaziUretici = [
  nav(),
  header(
    { tr: "SEKTÖR NOTU", en: "SECTOR NOTE" },
    {
      tr: "Üretici Seçiminde Fiyatın Yanında Neye Bakılmalı?",
      en: "What to Look At Beyond Price When Choosing a Manufacturer",
    },
    {
      tr: "Üretici seçiminde düşük fiyat önemli olabilir; ancak satın alma kararını tek başına açıklamaz. Ürünün ihtiyaca uygunluğu, üretim kapasitesi ve siparişin nasıl yönetileceği birlikte değerlendirilmelidir.\n\nYazan: GENCO · 11 Ekim 2026 · Sektör Notu",
      en: "A low price can matter when choosing a manufacturer, but it does not explain the purchasing decision on its own. How well the product fits your requirement, the production capacity, and how the order will be managed all need to be assessed together.\n\nWritten by GENCO · 11 October 2026 · Sector Note",
    }
  ),
  {
    ...ARTICLE_LIST_DEFAULTS,
    id: "tpl_yn2_body",
    heading: bi("", ""),
    articles: yazi("tpl_yn2", [
      {
        baslik: { tr: "Ürün deneyimi", en: "Product experience" },
        metin: {
          tr: "Üreticinin sizin ürün grubunuzda hangi çalışmaları yaptığını öğrenin. Genel bir katalog yerine, talep ettiğiniz özelliklere yakın ürünler hakkında bilgi isteyin.",
          en: "Find out what the manufacturer has produced in your product group. Ask for information about products close to the features you require, rather than reviewing a general catalogue.",
        },
      },
      {
        baslik: { tr: "Kapasite ve teslim süresi", en: "Capacity and lead time" },
        metin: {
          tr: "Teklif edilen teslim süresinin hangi koşullara bağlı olduğunu netleştirin. Hammadde temini, üretim planı, numune onayı ve ambalaj hazırlığı termin üzerinde etkili olabilir.",
          en: "Clarify what the offered lead time depends on. Raw material supply, the production plan, sample approval and packaging preparation can all affect the date.",
        },
      },
      {
        baslik: { tr: "Teknik bilgi ve belgeler", en: "Technical information and documents" },
        metin: {
          tr: "İhtiyaç duyduğunuz teknik veri ve belgelerin ürünle ilişkisini kontrol edin. Bir belgenin bulunması, her ürün veya her kullanım amacı için yeterli olduğunu göstermez.\n\nGerekli değerlendirmeyi ürünün niteliğine göre yetkin kişilerle yapın.",
          en: "Check how the technical data and documents you need relate to the product. The presence of a document does not show that it is sufficient for every product or every intended use.\n\nHave the necessary assessment carried out by people competent for the nature of the product.",
        },
      },
      {
        baslik: { tr: "Numune süreci", en: "The sample process" },
        metin: {
          tr: "Numunenin neyi temsil ettiğini belirleyin. Seri üretim ürünü mü, özel hazırlanmış örnek mi? Numunede kabul edilen özellikler siparişe nasıl aktarılacak?",
          en: "Establish what the sample represents: a series-production item, or a specially prepared example? How will the features accepted on the sample be carried into the order?",
        },
      },
      {
        baslik: { tr: "Ticari koşullar", en: "Commercial terms" },
        metin: {
          tr: "Fiyatla birlikte ödeme planını, teslim kapsamını, ambalajı, teklif geçerlilik süresini ve değişiklik koşullarını karşılaştırın.",
          en: "Alongside price, compare the payment plan, the scope of delivery, packaging, the validity period of the quotation and the conditions for changes.",
        },
      },
      {
        baslik: { tr: "İletişim ve takip", en: "Communication and follow-up" },
        metin: {
          tr: "Teknik sorulara verilen cevapların açıklığı ve hızı, üreticiyle çalışmanın nasıl ilerleyeceği hakkında fikir verir. Belirsiz cevapları sipariş sonrasına bırakmayın.",
          en: "How clearly and quickly technical questions are answered tells you how working with the manufacturer will go. Do not leave unclear answers until after the order.",
        },
      },
      {
        baslik: { tr: "GENCO'nun katkısı", en: "What GENCO adds" },
        metin: {
          tr: "GENCO, üretici seçeneklerini bu başlıklar üzerinden karşılaştırır; karar için gerekli bilgilerin toplanmasını ve açık konuların takibini sağlar.",
          en: "GENCO compares manufacturer options across these headings, and ensures the information needed for a decision is gathered and open points are tracked.",
        },
      },
    ]),
  },
  yaziCta(
    "tpl_yn2_cta",
    { tr: "Üretici adaylarını birlikte değerlendirelim", en: "Let's assess manufacturer candidates together" },
    {
      tr: "Ürün grubunuzu ve teknik beklentilerinizi paylaşın; adayları aynı başlıklar üzerinden karşılaştıralım.",
      en: "Share your product group and technical expectations, and let us compare the candidates across the same headings.",
    }
  ),
  footer(),
];

/* --- Yazı 3 — Distribütör listesinden iş ortağı seçimine ----------------- */

const yaziDistributor = [
  nav(),
  header(
    { tr: "SEKTÖR NOTU", en: "SECTOR NOTE" },
    {
      tr: "Distribütör Listesinden İş Ortağı Seçimine",
      en: "From a Distributor List to Choosing a Business Partner",
    },
    {
      tr: "Bir ülkedeki distribütörlerin listesini çıkarmak araştırmanın başlangıcıdır. Asıl karar, hangi firmanın ürününüzü doğru müşteri grubuna ulaştırabileceğidir.",
      en: "Producing a list of distributors in a country is where research begins. The real decision is which company can get your product to the right customer group.\n\nWritten by GENCO · 11 October 2026 · Sector Note",
    }
  ),
  {
    ...ARTICLE_LIST_DEFAULTS,
    id: "tpl_yn3_body",
    heading: bi("", ""),
    articles: yazi("tpl_yn3", [
      {
        baslik: { tr: "Önce aradığınız iş ortağını tanımlayın", en: "Define the partner you are looking for first" },
        metin: {
          tr: "Ürününüz hangi kanalda satılacak? Teknik satış mı gerektiriyor, perakende dağıtım mı? Yerel stok, servis veya eğitim ihtiyacı var mı?\n\nBu sorular cevaplanmadan oluşturulan geniş listeler, çok sayıda düşük uygunluklu aday içerebilir.",
          en: "Through which channel will your product be sold? Does it require technical selling, or retail distribution? Is local stock, service or training needed?\n\nA long list built before these questions are answered tends to contain a large number of unsuitable candidates.",
        },
      },
      {
        baslik: { tr: "Ürün portföyünü inceleyin", en: "Review the product portfolio" },
        metin: {
          tr: "Adayın mevcut markaları, fiyat segmenti ve ürün grupları sizin teklifinizle uyumlu olmalıdır. Tamamlayıcı ürünler fırsat oluşturabilir; doğrudan rakip ürünler ise firmanın ilgisini veya çalışma koşullarını etkileyebilir.",
          en: "A candidate's existing brands, price segment and product groups need to be compatible with your offer. Complementary products can create an opportunity; direct competing products may affect the firm's interest or the terms on which it would work.",
        },
      },
      {
        baslik: { tr: "Müşteri ve kanal uyumunu değerlendirin", en: "Assess customer and channel fit" },
        metin: {
          tr: "Firmanın yalnızca hangi sektörde çalıştığını değil, kime ve nasıl satış yaptığını araştırın. Kurumsal alıcı, uzman mağaza, bayi ağı ve çevrim içi satış farklı kabiliyetler gerektirir.",
          en: "Research not only which sector a company operates in, but whom it sells to and how. Corporate buyers, specialist retailers, dealer networks and online sales each require different capabilities.",
        },
      },
      {
        baslik: { tr: "İlk görüşmede neyi netleştirin?", en: "What should be settled at the first meeting?" },
        metin: {
          tr: "• Ürüne yönelik ilgi ve değerlendirme süreci\n• Hedeflenen müşteri grubu\n• Beklenen fiyat ve ticari koşullar\n• Numune veya eğitim ihtiyacı\n• Stok ve pazarlama yaklaşımı\n• Sonraki görüşmenin konusu ve tarihi",
          en: "• Interest in the product and the evaluation process\n• The customer group targeted\n• Expected pricing and commercial terms\n• Need for samples or training\n• Stock and marketing approach\n• The subject and date of the next meeting",
        },
      },
      {
        baslik: { tr: "İlk olumlu cevap sonuç değildir", en: "A first positive response is not an outcome" },
        metin: {
          tr: "İlk olumlu cevap, distribütörlük anlaşması anlamına gelmez. Karşılıklı uygunluk değerlendirmesini ve ticari görüşmeleri aşamalı yürütün.",
          en: "A first positive response does not mean a distribution agreement. Carry out the mutual fit assessment and the commercial discussions in stages.",
        },
      },
      {
        baslik: { tr: "GENCO'nun katkısı", en: "What GENCO adds" },
        metin: {
          tr: "GENCO, aday araştırmasını ilk temas ve görüşme takibiyle birleştirerek şirketlerin uygun iş ortaklarını değerlendirmesine destek olur.",
          en: "GENCO combines candidate research with first contact and meeting follow-up, supporting companies in assessing suitable business partners.",
        },
      },
    ]),
  },
  yaziCta(
    "tpl_yn3_cta",
    { tr: "Hedef pazarınızı paylaşın", en: "Share your target market" },
    {
      tr: "Ürününüzü ve aradığınız iş ortağının özelliklerini yazın; aday araştırmasını birlikte planlayalım.",
      en: "Tell us about your product and the partner you are seeking, and let us plan the candidate research together.",
    }
  ),
  footer(),
];

export const PAGE_TEMPLATES = {
  services,
  yaziSartname,
  yaziUretici,
  yaziDistributor,
  outsourcedExport,
  turkeySourcing,
  distributorDevelopment,
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
  // "en" ayrı bir dil ağacıdır; stüdyodan /en slug'ıyla sayfa açılırsa
  // gerçek /en rotasiyla cakisir.
  "en",
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
