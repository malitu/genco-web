import { SITE_URL } from "../lib/seo";

/**
 * robots.txt — arama motorlarına yol haritası.
 * ---------------------------------------------------------------------------
 *   • Tüm sayfalar dizinlenir (site tamamen herkese açık)
 *   • /admin stüdyo paneli dizinlenmez
 *   • Sitemap adresi burada bildirilir
 *
 * ---------------------------------------------------------------------------
 * `host` DİREKTİFİ NEDEN YOK
 * ---------------------------------------------------------------------------
 * Ölçülen uyarı (Search Console → Ayarlar → robots.txt):
 *
 *     Uyarı · Kural Googlebot tarafından yok sayıldı (line 6)
 *     6 | Host: https://www.gencotr.com
 *
 * `Host:` yalnızca Yandex, Bing ve Baidu tarafından desteklenir; Google bu
 * satırı tanımaz ve "kurallarım yok sayıldı" diye sarı uyarı bırakır.
 *
 * Zararsız bir yönerge — tarama engellenmez. Ama Google'da sürekli görünür,
 * panel gürültülü olur ve ileride gerçek bir sorun olduğunda bu uyarının
 * arasında kaybolur. Bu yüzden kaldırıldı.
 *
 * Arama adresinin tek doğruluk kaynağı `SITE_URL` (src/lib/seo.js) ve
 * canonical etiketleridir; robots.txt'te ayrıca bildirilmesi gerekmez.
 */

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}