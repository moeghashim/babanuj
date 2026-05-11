# Babanuj Commerce

Babanuj storefront built on top of Vercel Commerce, with a Babanuj-first
landing experience, dummy brand/catalog data, Shopify retail commerce support,
and wholesale lead capture.

## Local Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The UI renders without Shopify credentials. Retail product/search/cart flows use
Shopify when these variables are configured:

```bash
SHOPIFY_STORE_DOMAIN=""
SHOPIFY_STOREFRONT_ACCESS_TOKEN=""
SHOPIFY_REVALIDATION_SECRET=""
```

Wholesale request emails use Resend when configured:

```bash
RESEND_API_KEY=""
WHOLESALE_REQUEST_TO="info@babanuj.com"
WHOLESALE_REQUEST_FROM="Babanuj <onboarding@resend.dev>"
```

Without `RESEND_API_KEY`, wholesale requests are validated and logged by the API
route for local development.

## Checks

```bash
pnpm prettier:check
pnpm build
```
