# Website Progress

Append a short entry here whenever the website changes. Keep entries newest
first, with the date, scope, files touched, verification run, and any follow-up
needed.

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
