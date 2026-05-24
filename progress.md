# Website Progress

Append a short entry here whenever the website changes. Keep entries newest
first, with the date, scope, files touched, verification run, and any follow-up
needed.

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
