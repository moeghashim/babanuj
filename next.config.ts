export default {
  experimental: {
    ppr: true,
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
