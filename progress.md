# Website Progress

Append a short entry here whenever the website changes. Keep entries newest
first, with the date, scope, files touched, verification run, and any follow-up
needed.

## 2026-06-02

- PostHog enhancements (3 of 5 follow-ups from the setup review; the other two —
  the internal/test-user filter and pinning the Store Performance dashboard —
  were PostHog project-side settings, not code):
  - **Order revenue (server-side):** new `app/api/shopify/order/route.ts`
    receives the Shopify `orders/paid` webhook, verifies the HMAC, and captures
    an `Order Completed` event (value, currency, products) to PostHog via a new
    `lib/posthog/server.ts` helper. Closes the funnel — checkout completes
    off-domain on Shopify so the browser SDK never sees the purchase. Attributed
    to the same PostHog person via a `posthog_distinct_id` cart attribute: the
    `/api/cart/add` route reads posthog-js's first-party cookie server-side and
    stamps it onto the cart at creation (`createCart` now takes `attributes`),
    which rides through to the order's `note_attributes`. No change to the
    optimistic add-to-cart client path. Inert until `SHOPIFY_WEBHOOK_SECRET` is
    set and the webhook is registered.
  - **Customer identify:** `components/babanuj/posthog-identify.tsx` (rendered on
    the account page) promotes the anonymous person to an identified customer on
    sign-in, tying replays/funnel/revenue to one profile across sessions.
  - **SDK bump:** posthog-js 1.378.1 → 1.379.0.
- Files: `app/api/shopify/order/route.ts` (new), `lib/posthog/server.ts` (new),
  `components/babanuj/posthog-identify.tsx` (new), `app/api/cart/add/route.ts`,
  `app/account/page.tsx`, `lib/shopify/index.ts`, `lib/shopify/mutations/cart.ts`,
  `lib/shopify/types.ts`, `.env.example`, `package.json`, `pnpm-lock.yaml`.
- Verification: `pnpm exec tsc --noEmit` clean, `pnpm build` clean (the new
  `/api/shopify/order` route is in the route table), prettier clean.
- Follow-up: register the Shopify `orders/paid` webhook → `/api/shopify/order`
  and set `SHOPIFY_WEBHOOK_SECRET` (in `.env.local` + Vercel). Optionally add an
  `Order Completed` / revenue tile to the Store Performance dashboard and extend
  the funnel to a 4th step once orders start flowing.

## 2026-06-01

- Added PostHog product analytics to the headless storefront, slotted into the
  existing analytics layer (GA4 + Meta) rather than bolted on. A new
  `PostHogProvider` initializes the browser SDK once on mount (env-gated on
  `NEXT_PUBLIC_POSTHOG_KEY`, so it stays inert until the key is set) with
  `capture_pageview: "history_change"` (auto-captures the initial load + every
  App Router client navigation, no per-route effect), `capture_pageleave`, and
  `person_profiles: "identified_only"` (no person profile minted per anonymous
  shopper — checkout is off-domain on checkout.babanuj.com, so we never
  identify here).
- Wired the three ecommerce funnel events into the shared
  `lib/meta/events.ts` so PostHog fires alongside GA4/Meta from one call site:
  `Product Viewed` (PDP), `Product Added to Cart` (add-to-bag), `Checkout
  Started` (cart → checkout).
- Added a first-party reverse proxy (`/ingest/*` → us-assets / us.i.posthog.com
  via `next.config.ts` rewrites + `skipTrailingSlashRedirect`) so ad/tracker
  blockers don't drop events. Switch the two rewrite hosts to the EU cloud if
  the PostHog project is EU-region.
- Files touched: `package.json`, `pnpm-lock.yaml`,
  `components/babanuj/posthog-provider.tsx` (new), `app/layout.tsx`,
  `lib/meta/events.ts`, `next.config.ts`, `.env.example`, `progress.md`.
- Verification: `pnpm exec tsc --noEmit` clean, `pnpm build` clean (24/24
  pages). Local dev smoke test: homepage renders with the provider mounted,
  zero console errors, PostHog stays inert with no key set, and the `/ingest`
  reverse proxy returns 200 with the real PostHog `array.js` bundle (confirms
  the proxy chain end-to-end).
- Follow-up: create the PostHog project, add `NEXT_PUBLIC_POSTHOG_KEY` (phc_…)
  to `.env.local` and the Vercel project env, then redeploy. Enable session
  replay + heatmaps in the PostHog project settings if wanted. Optional later:
  server-side capture of the Shopify `orders/paid` webhook for true
  `Order Completed` revenue (the storefront can only see Checkout Started since
  payment happens on Shopify's domain).

## 2026-05-31

- Fixed the failed Google Search Console "Not found (404)" fix validation
  (`sc-domain:babanuj.com`, item `CAMYDSAC`, failed 2026-05-29). 7 of the 17
  tracked legacy `/products/...` URLs still 404'd because they fell through the
  generic `/products/:handle → /product/:handle` redirect onto a product handle
  that no longer exists; added explicit redirects for them.
- Mapped the stale Amazon/TikTok channel SKUs and discontinued `bab-sharqi`
  items to their closest live collection/product, and the orphaned
  `lacto-microbiome…exosome` product (no live equivalent) to home — matching the
  existing `frontpage`/`about-us` → `/` convention. Both `next.config.ts` and
  the PDP runtime safety net share the same `STALE_PRODUCT_HANDLE_REDIRECTS`
  map, so the single edit covers both layers.
- Files touched: `lib/babanuj/redirects.ts`, `progress.md`.
- Verification: `pnpm exec tsc --noEmit`, `pnpm build`, and local
  production-server `curl` confirming all 7 handles now return 308 to a live 200
  destination (both `/products/` and `/product/` forms), with genuinely unknown
  handles still falling through unchanged.
- Follow-up: merge + deploy, then click "Start new validation" on the Not found
  (404) issue in Search Console; a recrawl of all 17 URLs should then pass.

## 2026-05-26

- Fixed Ahrefs audit errors after the Shopify theme to Next.js migration:
  completed Open Graph metadata, shortened titles/descriptions, removed
  redirecting collection URLs from sitemap, redirected legacy orphan
  collections, removed internal links to redirect targets, and reduced the
  homepage carousel to one real H1.
- Files touched: `lib/babanuj/seo.ts`, `lib/babanuj/redirects.ts`,
  `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/search/page.tsx`,
  `app/product/[handle]/page.tsx`, `app/collections/[handle]/page.tsx`,
  `app/brand/[brandId]/page.tsx`, `app/[page]/page.tsx`,
  `app/policies/[policy]/page.tsx`, `app/sitemap.ts`,
  `app/account/sign-in/page.tsx`, `components/babanuj/home/hero.tsx`,
  `components/babanuj/layout/nav.tsx`,
  `components/babanuj/layout/mobile-menu.tsx`, `components/babanuj/pdp.tsx`,
  `progress.md`.
- Verification: Chrome/Ahrefs review of the 2026-05-26 Site Audit, Prettier on
  touched files, `pnpm exec tsc --noEmit`, `pnpm build`, local
  production-server targeted checks, and a local sitemap crawl covering 78 URLs
  with zero remaining metadata/H1/redirect-link findings.
- Follow-up: deploy and rerun the Ahrefs crawl; historical change alerts,
  IndexNow submission prompts, and expected old-URL redirects were left alone.

## 2026-05-26

- Tightened the mobile homepage hero image candidate size and disabled the
  desktop zoom transition on mobile to clear the PR Lighthouse LCP threshold.
- Files touched: `components/babanuj/home/hero.tsx`, `progress.md`.
- Verification: `pnpm exec prettier --write` on touched files, `pnpm exec tsc
--noEmit`, `pnpm build`, and local Lighthouse CI.
- Follow-up: confirm GitHub Actions reruns cleanly on the amended PR branch.

## 2026-05-25

- Checked Google Search Console Page indexing for `sc-domain:babanuj.com`:
  82 indexed pages, 128 not indexed as of the 2026-05-21 report update.
- Added explicit canonical metadata to public indexable routes and redirected
  legacy duplicate URLs (`/collections/all`, collection `.atom` feeds, old
  `/v1/produce`, and stale Shopify product handles) to current pages.
- Files touched: `next.config.ts`, `lib/babanuj/redirects.ts`, `app/page.tsx`,
  `app/search/page.tsx`, `app/product/[handle]/page.tsx`,
  `app/collections/[handle]/page.tsx`, `app/brand/[brandId]/page.tsx`,
  `app/[page]/page.tsx`, `app/policies/[policy]/page.tsx`, `progress.md`.
- Verification: `pnpm exec tsc --noEmit`, `pnpm build`, targeted Prettier
  check, and local production-server `curl` checks for canonical tags plus 308
  redirects.
- Follow-up: deploy, then use Search Console's Validate Fix for the website
  owned buckets after Google sees the new production responses.

## 2026-05-24

- Fixed production customer account setup by adding the Shopify Customer Account
  API env vars in Vercel and aligning Shopify's OAuth application setup with
  the live `www.babanuj.com` domain.
- Redeployed production so `/account` uses the new env vars and no longer shows
  the setup fallback page.
- Files touched: `progress.md` only; Vercel and Shopify Admin configuration
  changed outside git.
- Verification: production deploy completed and `https://www.babanuj.com/account`
  redirects to Shopify customer sign-in with the
  `https://www.babanuj.com/account/authorize` callback; no browser console
  errors on the verified auth page.
- Follow-up: complete a real customer login e2e when credentials/test customer
  access is available.

## 2026-05-24

- Added the in-app customer account foundation using Shopify Customer Account
  API auth, encrypted customer session cookies, account overview, order,
  address, and profile routes.
- Wired desktop and mobile navigation to the new account entrypoint and added
  Customer Account API environment variables to the template.
- Files touched: `lib/shopify/customer-account.ts`, `app/account/**`,
  `components/babanuj/account/**`, `components/babanuj/layout/nav.tsx`,
  `components/babanuj/layout/mobile-menu.tsx`, `.env.example`,
  `app/globals.css`.
- Verification: `pnpm exec tsc --noEmit`, `pnpm build`, Chrome e2e against
  local `/account`; `pnpm test` still reports pre-existing Prettier warnings in
  unrelated files.
- Follow-up: add real `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID`,
  `SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI`, and `SESSION_SECRET` in Vercel and
  local env; full Shopify login e2e requires a public HTTPS callback URL, not
  localhost.

## 2026-05-24

- Fixed product discovery so default catalog ordering follows Shopify's
  returned featured/best-selling order without a hidden price cap.
- Hid sold-out products from default catalog, homepage carousel, and PDP
  recommendation surfaces while keeping direct PDP links accessible.
- Added app-side GA4 ecommerce pushes for `view_item`, `add_to_cart`, and
  `begin_checkout` alongside the existing Meta tracking.
- Files touched: `components/babanuj/category-view.tsx`, `app/page.tsx`,
  `app/product/[handle]/page.tsx`, `lib/meta/events.ts`.
- Verification: `pnpm exec tsc --noEmit`, Chrome e2e, and `pnpm build`.
- Follow-up: Chrome confirmed Google Ads did not expose old `/products/...`
  URLs in visible Babanuj ads; Meta Ads Manager opened to an account/date view
  with no ads to update.

## 2026-05-24

- Added this progress log for website change tracking.
- Added an AGENTS.md rule requiring future website changes to append entries here.
- Verification: documentation-only change; no build run.
