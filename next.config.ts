export default {
  experimental: {
    ppr: "incremental",
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "babanuj.myshopify.com",
      },
    ],
  },
  async redirects() {
    // Old category URL pattern moved from /search/<handle> → /collections/<handle>
    // to match Shopify's native convention. 301 so any cached/external links
    // still resolve.
    return [
      // Apex → www. Permanent (308) so Google consolidates ranking signals
      // onto www.babanuj.com. Requires the apex domain to be configured as
      // an alias in Vercel (not an auto-redirect), otherwise Vercel's edge
      // 307 fires first and this rule never runs.
      {
        source: "/:path*",
        has: [{ type: "host", value: "babanuj.com" }],
        destination: "https://www.babanuj.com/:path*",
        permanent: true,
      },
      {
        source: "/products/:handle",
        destination: "/product/:handle",
        permanent: true,
      },
      {
        source: "/collections/:collection/products/:handle",
        destination: "/product/:handle",
        permanent: true,
      },
      {
        source: "/pages/:page",
        destination: "/:page",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/policies/privacy-policy",
        permanent: true,
      },
      {
        source: "/refund-policy",
        destination: "/policies/refund-policy",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/policies/terms-of-service",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wholesale",
        destination: "/#wholesale",
        permanent: true,
      },
      {
        source: "/blogs/news",
        destination: "/",
        permanent: true,
      },
      {
        source: "/sitemap_products_1.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/collections/cookiesa",
        destination: "/collections/cookies",
        permanent: true,
      },
      {
        source: "/product/zaitoune-baklava-100g",
        destination: "/product/zaitoune-mix-baklava-100g",
        permanent: true,
      },
      {
        source: "/collections/zaitoune",
        destination: "/brand/zaitoune",
        permanent: true,
      },
      {
        source: "/search/:handle",
        destination: "/collections/:handle",
        permanent: true,
      },
    ];
  },
};
