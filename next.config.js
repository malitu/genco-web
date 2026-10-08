/**
 * Next.js yapılandırması.
 * ---------------------------------------------------------------------------
 * Burada güvenlik başlıkları, önerilen yönlendirmeler ve Firebase ortam
 * değişkenlerinin istemciye sızması engellenir.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Görseller bizim kendi optimize edilmiş WebP dosyalarımız olduğu için
  // Next.js'in image optimizer'ı gereksiz bir katman olurdu. SVG'ler de
  // optimize edilemediği için next/image yerine düz <img> kullanılıyor.
  images: {
    unoptimized: true,
  },

  async headers() {
    const guvenlik = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: guvenlik,
      },
      {
        // Statik görseller uzun süre önbelleklenir (dosya adı değişirse yeni
        // istek atılır; WebP dosyalarımız sürümlü isimlendirme kullanmıyor
        // ama değiştirdiğimizde Vercel yeni dağıtımda cache'i düşürür).
        source: "/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // /method sayfası blok sistemine taşınmadan önce elle yazılmış bir
      // kopya olarak duruyordu ve içeriği /about içinde zaten var.
      // Yayına almadan önce tek noktaya yönlendiriyoruz.
      {
        source: "/method",
        destination: "/about",
        permanent: true,
      },

      // Eski WordPress sitesinden kalan, yeni sitede karşılığı olmayan
      // adresler. (Eski site: /hizmetlerimiz/ ve /iletisim/)
      {
        source: "/hizmetlerimiz",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/iletisim",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;