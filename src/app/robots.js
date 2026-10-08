import { SITE_URL } from "../lib/seo";

/**
 * robots.txt — arama motorlarına yol haritası.
 * ---------------------------------------------------------------------------
 *   • Tüm sayfalar dizinlenir (site tamamen herkese açık)
 *   • /admin stüdyo paneli dizinlenmez
 *   • Sitemap adresi burada bildirilir
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
    host: SITE_URL,
  };
}