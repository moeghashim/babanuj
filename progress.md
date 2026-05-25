# Website Progress

Append a short entry here whenever the website changes. Keep entries newest
first, with the date, scope, files touched, verification run, and any follow-up
needed.

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
