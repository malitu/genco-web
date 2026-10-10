/**
 * Yayın doğrulama betiği — `npm run dogrula`
 * ---------------------------------------------------------------------------
 * Bu betik, "Kaydet & Yayınla" sonrası sessizce bozulan şeyleri yakalar.
 *
 * Neden var: 2026-10-11'de ana sayfadaki içerik güncellendi ama site ESKİ
 * metni göstermeye devam etti. Hata yoktu, konsol temizdi, HTTP 200 geliyordu.
 * Sebep iki katmanlıydı: (1) Firebase API anahtarı ortam değişkeninde yoktu,
 * (2) REST çevirisi yanlış nesneyi çözüyordu. Sonuç: sunucu boş dönüyor,
 * blok motoru kod varsayılanına düşüyor, kimse fark etmiyordu.
 *
 * "Çalışıyor" demek yetmez. Doğrulanması gereken şey içeriğin doğru
 * geldiğidir.
 *
 * KULLANIM
 *   npm run dogrula                       -> yerel sunucu (localhost:3000)
 *   npm run dogrula -- https://site.com   -> canlı adres
 *
 * ÇIKIŞ: hata varsa exit code 1 (CI/CD veya otomasyonda kullanılabilir).
 */

const ARG = process.argv[2];
const KOK = (ARG || "http://localhost:3000").replace(/\/+$/, "");

let hata = 0;
let kontrol = 0;

const basari = (etiket, kosul, ayrinti = "") => {
  kontrol++;
  if (kosul) {
    console.log(`  OK    ${etiket}`);
  } else {
    hata++;
    console.log(`  HATA  ${etiket}${ayrinti ? "  -> " + ayrinti : ""}`);
  }
};

/** HTML entity'lerini çözer; testler ' ve & içeren metinleri doğru arayabilsin. */
function duz(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

const get = async (yol) => {
  const res = await fetch(KOK + yol);
  const html = await res.text();
  return { status: res.status, html, metin: duz(html) };
};

const SAYFALAR = [
  "/", "/services", "/services/outsourced-export", "/services/turkey-sourcing",
  "/services/distributor-development", "/industries", "/case-studies", "/insights",
  "/insights/teknik-sartnameyi-netlestirmek", "/about", "/contact", "/gizlilik",
  "/en", "/en/services", "/en/insights", "/en/privacy-policy",
];

console.log(`\nGENCO yayın doğrulaması — ${KOK}\n`);

/* --- 1) Her sayfa 200 dönmeli, boş h2 olmamalı, footer'ı olmalı ---------- */
console.log("1) Sayfalar");
for (const yol of SAYFALAR) {
  const { status, html } = await get(yol);
  const bosH2 = (html.match(/<h2[^>]*>\s*<\/h2>/g) || []).length;
  const footerVar = (html.match(/<footer/g) || []).length > 0;
  basari(
    `${yol.padEnd(46)} 200`,
    status === 200 && bosH2 === 0 && footerVar,
    `kod=${status} bosH2=${bosH2} footer=${footerVar}`
  );
}

/* --- 2) Ana sayfa GERÇEK içeriği gösteriyor mu (Firestore) --------------
   Ana sayfa en kritik kontrol: içerik kod varsayılanına düşerse site eski
   metni gösterir ama her şey "çalışıyor" görünür. Aşağıdaki metinler
   yalnızca Firestore'da var; kod varsayılanında yok. */
console.log("\n2) Ana sayfa içeriği sunucudan geliyor mu");
{
  const { metin } = await get("/");
  const icerik = [
    ["hero etiketi", "İzmir'den Uluslararası Pazarlara"],
    ["hero alt metni", "üreticilerin yeni pazarlara ulaşmasına"],
    ["hero 2. buton", "Hizmetlerimizi İnceleyin"],
    ["hedefler başlığı", "Hangi Hedef İçin Çalışıyoruz?"],
    ["süreç adımı", "İhtiyacı tanımlarız"],
    ["kapanış CTA'sı", "Ticari Hedefinizi Birlikte Değerlendirelim"],
    ["SSS 5. soru", "Araştırma sonucunu teslim ediyor musunuz"],
    ["stats bandı", "48+"],
  ];
  for (const [ad, x] of icerik) {
    basari(`${ad.padEnd(20)} "${x.slice(0, 38)}"`, metin.includes(x));
  }
}
{
  const { metin } = await get("/en");
  basari("EN hero başlığı", metin.includes("From Izmir to International Markets"));
  basari("EN hedefler", metin.includes("Which Objective Are We Working On?"));
}

/* --- 3) Dil ve dil bağlantıları ---------------------------------------- */
console.log("\n3) Dil yapısı");
for (const [yol, beklenen] of [["/", "tr"], ["/en", "en"]]) {
  const { html } = await get(yol);
  const lang = (html.match(/<html[^>]*\slang="([^"]+)"/) || [])[1];
  basari(`${yol} lang="${beklenen}"`, lang === beklenen, `gelen=${lang}`);
}

/* --- 4) /en/ altında Türkçe'ye sızan bağlantı olmamalı ------------------ */
console.log("\n4) Dil içi bağlantı bütünlüğü");
for (const yol of ["/en", "/en/services", "/en/insights"]) {
  const { html } = await get(yol);
  const nav = (html.match(/<nav[\s\S]*?<\/nav>/) || [""])[0];
  const dilDugmeleri = new Set(["/", "/services", "/industries", "/case-studies",
    "/insights", "/about", "/contact", "/gizlilik"]);
  const sizan = [...nav.matchAll(/href="(\/[^"#]*)"/g)]
    .map((x) => x[1])
    .filter((h) => !h.startsWith("/en") && !dilDugmeleri.has(h));
  basari(`${yol.padEnd(14)} yalnızca /en/ iç bağlantılar`, sizan.length === 0, sizan.join(", "));
}

/* --- 5) Hatalı bağlantı: hedefi 404 olan iç bağlantı olmamalı --------- */
console.log("\n5) Kırık iç bağlantılar");
{
  const { html } = await get("/services");
  const baglantilar = [...html.matchAll(/href="(\/services\/[a-z-]+)"/g)].map((x) => x[1]);
  const benzersiz = [...new Set(baglantilar)];
  for (const b of benzersiz) {
    const { status } = await get(b);
    basari(`${b.padEnd(40)} hedef açılıyor`, status === 200, `kod=${status}`);
  }
}

/* --- 6) Sitemap ---------------------------------------------------------- */
console.log("\n6) Sitemap");
{
  const { html } = await get("/sitemap.xml");
  const adresler = (html.match(/<loc>/g) || []).length;
  basari(`en az 28 adres (bulunan ${adresler})`, adresler >= 28);
  basari("tüm kayıtlar hreflang içeriyor",
    (html.match(/<url>[\s\S]*?<\/url>/g) || []).every((u) => u.includes("xhtml:link")));
}

/* --- 7) Bilinen yazım hatası sızıntısı ---------------------------------- */
console.log("\n7) Metin kalitesi");
for (const yol of SAYFALAR) {
  const { html } = await get(yol);
  basari(`${yol.padEnd(46)} ham ** yok`, !duz(html).includes("**"));
}

console.log(`\n${"-".repeat(60)}`);
console.log(`${kontrol} kontrol · ${hata} hata`);
console.log(hata === 0 ? "SONUÇ: TAMAM\n" : "SONUÇ: HATA VAR — yayın öncesi düzelt\n");
process.exit(hata === 0 ? 0 : 1);