export default {
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "babanuj.com",
      },
    ],
  },
  async redirects() {
    // Old category URL pattern moved from /search/<handle> → /collections/<handle>
    // to match Shopify's native convention. 301 so any cached/external links
    // still resolve.
    return [
      {
        source: "/search/:handle",
        destination: "/collections/:handle",
        permanent: true,
      },
    ];
  },
};
