/**
 * Ortam değişkenleri doğrulaması — Vercel'e eklenmeden önce yerelde çalıştır.
 *
 * Kullanım:
 *   node scripts/env-kontrol.mjs
 *
 * Vercel'e eklenecek değişkenler bu dosyadan da görülebilir. Site adresi
 * ve GA4 ölçüm kimliği canlı davranışı etkiler; anahtar olmayanlar
 * (Web3Forms, Turnstile, Firebase) yalnızca panelde doğrulanır.
 */

const BEKLENEN = [
  {
    ad: "NEXT_PUBLIC_SITE_URL",
    deger: "https://www.gencotr.com",
    zorunlu: true,
    etki:
      "Metadata, canonical, sitemap, robots.txt, Open Graph, JSON-LD @id adresleri.",
    not: "Sonunda eğik çizgi OLMAMALI (kod kendisi temizliyor).",
  },
  {
    ad: "NEXT_PUBLIC_GA_ID",
    deger: "G-XXXXXXXXXX",
    zorunlu: false,
    etki: "Google Analytics 4 ziyaret ölçümü.",
    not: "Boşsa analiz kodu hiç yüklenmez, site normal çalışır.",
  },
];

const SUNUCUDA_GIZLI = [
  { ad: "WEB3FORMS_KEY", etki: "İletişim formu e-posta gönderimi." },
  { ad: "TURNSTILE_SECRET_KEY", etki: "Captcha doğrulaması (sunucu tarafı)." },
];

console.log("=".repeat(66));
console.log("VERCEL'E EKLENECEK DEĞİŞKENLER");
console.log("=".repeat(66));
console.log("");
console.log("Project → Settings → Environment Variables");
console.log("Production ve Preview için ayrı ayrı ekleyin.");
console.log("");
for (const v of BEKLENEN) {
  console.log(`  ${v.ad}`);
  console.log(`      değer : ${v.deger}`);
  console.log(`      etki  : ${v.etki}`);
  if (v.not) console.log(`      not   : ${v.not}`);
  console.log("");
}

console.log("-".repeat(66));
console.log("SUNUCUDA GİZLİ KALMASI GEREKENLER (istemciye ASLA gönderilmez)");
console.log("-".repeat(66));
for (const v of SUNUCUDA_GIZLI) {
  console.log(`  ${v.ad}`);
  console.log(`      etki  : ${v.etki}`);
}
console.log("");

console.log("-".repeat(66));
console.log("YEREL .env.local İÇERİĞİ (değerler gösterilmiyor)");
console.log("-".repeat(66));
try {
  const fs = await import("node:fs");
  const ic = fs.readFileSync(".env.local", "utf8");
  const anahtarlar = ic
    .split("\n")
    .map((l) => l.match(/^\s*([^#=\s]+)\s*=/))
    .filter(Boolean)
    .map((m) => m[1]);

  for (const v of BEKLENEN) {
    const tanimli = anahtarlar.includes(v.ad);
    console.log(`  ${tanimli ? "[var]" : "[yok]"}  ${v.ad}`);
  }
  for (const v of SUNUCUDA_GIZLI) {
    const tanimli = anahtarlar.includes(v.ad);
    console.log(`  ${tanimli ? "[var]" : "[yok]"}  ${v.ad}`);
  }
} catch {
  console.log("  .env.local okunamadı (bulunamadı)");
}

console.log("");
console.log("=".repeat(66));
console.log("NOT: NEXT_PUBLIC_ ile başlayan değişkenler tarayıcıya GÖNDERİLİR.");
console.log("Bu yüzden yalnızca gizli olmayanlar için kullanılır (GA kimliği,");
console.log("site adresi, Firebase proje kimliği).");
console.log("=" .repeat(66));