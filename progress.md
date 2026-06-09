# Website Progress

Append a short entry here whenever the website changes. Keep entries newest
first, with the date, scope, files touched, verification run, and any follow-up
needed.

## 2026-06-09

- **Phase 2 of the PDP "wrong product info" fix — brand mapping.** The 6
  products from vendors that weren't in `VENDOR_TO_BRAND_ID` (Bal Coffee ×3,
  Milaf, VAL, Reeq Alnahel) had no brand page; Phase 1 stopped mislabeling
  them but left their chip non-linking. Mapped all four as real brands so they
  get correct chips, brand pages, search, sitemap, and footer entries. Brand
  facts were researched and kept truthful (Milaf — Saudi Arabia, est. 2024,
  world's first date cola by Al Madinah Heritage Co.; VAL & Reeq Alnahel —
  Saudi; Bal Coffee — date-seed coffee, country/year not publicly stated, so
  left blank rather than invented). Crucially, did **not** fabricate the
  founder quotes / year-by-year timelines / output stats the existing four
  brands carry — instead made `BrandView` degrade gracefully: it no longer
  falls back to Zaitoune's story when `BRAND_DETAILS` is missing, omits the
  quote and timeline sections for brands without sourced editorial content,
  derives an honest facts strip (Origin/Category/Founded/Lines/Note) from live
  data, and guards the `Est.`/origin labels. Added a `featured` flag so the
  image-heavy homepage "Shop by brand" grid and the brand-page "Other houses"
  cross-sell stay at the 4 curated houses. Softened the wholesale CTA's
  unverifiable "exclusive U.S. distributor" line. Fixed "1 products" → "1
  product".
- Files: `lib/babanuj/data.ts`, `lib/babanuj/from-shopify.ts`,
  `components/babanuj/brand-view.tsx`, `components/babanuj/home/brands.tsx`,
  `components/babanuj/layout/mobile-menu.tsx`.
- Verification: `tsc --noEmit` + `pnpm build` clean. Preview MCP — `/brand/
  bal-coffee` renders a lean honest page (3 real products, derived facts, no
  Est. badge, no fabricated quote/timeline); `/brand/milaf` shows "Saudi
  Arabia · Est. 2024", "From Saudi Arabia, with care.", "1 product"; homepage
  still shows exactly 4 brand cards; footer lists all 8 brands. No console
  errors.
- Follow-up: Phase 3 — replace the fabricated stats/timelines/quotes on the
  original four brands and the dead `PDPReviews`/seed "Bab Sharqi" data; source
  weight from the variant instead of the title regex.

- **Phase 1 of the PDP "wrong product info" fix.** The PDP was fabricating
  product content instead of showing the real Shopify data: every product's
  Description tab was templated brand copy ("…hand-rolled, slow-baked… Crisp
  top crust… pistachio, cardamom…"), the Ingredients & nutrition tab was a
  fixed wheat-flour/142-kcal block, and the spec grid invented allergens and
  shelf life — even though all 63 products carry real `description`/
  `descriptionHtml` from Shopify (the adapter just dropped them). Brand also
  silently fell back to the first curated house, so the 6 products from
  unmapped vendors (Bal Coffee ×3, Reeq Alnahel, Milaf, VAL) rendered as
  "Zaitoune · Gaziantep" with Zaitoune's story.
  Fixes: carry `brandId`/`description`/`descriptionHtml` on `BabanujProduct`
  and populate them in the adapter; render the real `descriptionHtml` on the
  PDP; add `resolveProductBrand()` (resolve by id, then name, then a minimal
  synthetic brand from the real vendor — no more Zaitoune default); guard the
  brand chip + "Visit brand" link so unmapped vendors don't link to a missing
  `/brand/` page; drop the fabricated Ingredients & nutrition tab and the
  invented Allergens/Shelf-life spec cells.
- Files: `lib/babanuj/data.ts`, `lib/babanuj/from-shopify.ts`,
  `components/babanuj/pdp.tsx`.
- Verification: `pnpm exec tsc --noEmit` and `pnpm build` clean. Preview MCP —
  the BAL Coffee PDP now shows brand "BAL COFFEE", a Coffee breadcrumb, the
  real "…roasted date seeds…" description, real sibling Bal Coffee products,
  and no Origin/Allergens/Shelf-life invented fields; the Zaitoune baklava PDP
  shows its real Shopify description plus the correct Maker card. No console
  errors.
- Follow-up: Phase 2 — add the 4 unmapped vendors as real curated brands
  (BRANDS / VENDOR_TO_BRAND_ID / vendorFromBrandId / BRAND_DETAILS) so they get
  correct chips + brand pages; optionally wire real ingredient/nutrition
  metafields. Phase 3 — replace fabricated brand-page stats/timelines and the
  dead `PDPReviews`/seed "Bab Sharqi" data; source weight from the variant.

## 2026-06-06

- Fixed the PDP tab strip on mobile. The three tab labels ("Description",
  "Ingredients & nutrition", "Shipping & returns") don't fit on one row on
  phones, so the flex items shrank below their content and the text wrapped
  into ragged 2–3-line tabs of uneven height jammed against the right edge.
  Made the strip scroll horizontally instead — each label stays on a single
  line (`white-space: nowrap` + `flex: 0 0 auto`) inside an `overflow-x: auto`
  track with the scrollbar hidden, mirroring the existing `.mk-catbar` pattern.
  Tightened tab padding at `≤480px` so the next tab peeks in as a scroll
  affordance. Scoped to `≤900px`; desktop renders the static row unchanged.
  (Note: this is separate from the earlier horizontal-overflow fix — no PDP
  content clips at 360–375px; this was the remaining ragged-tab defect.)
- Files: `components/babanuj/pdp.tsx`, `app/globals.css`.
- Verification: `pnpm exec tsc --noEmit` clean. Preview MCP at 375/360px — all
  three tabs render on one line at equal height, the strip scrolls to reveal
  "Shipping & returns" which is tappable and switches the panel, and a clip
  scan found zero PDP content past the viewport edge. At ~956px the tab row is
  unchanged (static, original 22px padding, no scroll).
- Follow-up: none.

## 2026-06-06

- Moved the mobile search from the slide-in menu to a persistent bar at the top of
  the page. The previous fix put search only inside the hamburger drawer; this
  surfaces it as a full-width row directly under the logo on mobile (`≤900px`),
  always visible in the sticky header. Implemented by relaying out the existing nav
  grid on mobile — logo + actions on row 1, the single existing `<SearchBar>` (full
  typeahead) spanning row 2 via `grid-column: 1 / -1; grid-row: 2` — rather than
  rendering a second `<SearchBar>` instance (which would duplicate the ⌘K key
  listener and the debounced fetch). Hid the ⌘K hint on touch (`.mk-search-kbd`),
  and removed the now-redundant search field from the drawer so the menu is
  navigation-only. Desktop nav is unchanged (single row, search in the middle).
- Files: `app/globals.css`, `components/babanuj/layout/nav.tsx`,
  `components/babanuj/layout/search-bar.tsx`,
  `components/babanuj/layout/mobile-menu.tsx`.
- Verification: `pnpm exec tsc --noEmit` clean. Preview MCP at 375px — search is a
  full-width row under the logo; typing "baklava" opens the typeahead (6 products +
  "See all results"); the drawer opens as pure navigation with no search field. At
  ~956px the nav is a single row with search in the middle and the ⌘K hint visible.
- Follow-up: none.

## 2026-06-06

- Restored search on mobile. The nav typeahead (`.mk-nav-search`) is hidden at
  `≤900px` via `display:none` in `globals.css`, and the mobile menu drawer had no
  replacement — so phone/tablet users had no way to search at all. Added a search
  field to the top of the mobile drawer (above the Shop section): a `role="search"`
  form with `action="/search"` (no-JS fallback) whose `onSubmit` pushes to
  `/search?q=…` via the App Router and closes the drawer. Desktop is untouched —
  `.mk-hamburger` is `display:none` above 900px, so the drawer (and this field)
  only ever shows on mobile; no double search on any viewport.
- Files: `components/babanuj/layout/mobile-menu.tsx`.
- Verification: `pnpm exec tsc --noEmit` clean. Preview MCP at 375px — opened the
  drawer, typed "baklava", submitted → landed on `/search?q=baklava` ("Results for
  \"baklava\"", 9 products), drawer auto-closed. Reused the existing, working
  `/search` page + `/api/search` data path; no data-layer changes.
- Follow-up: none required. Optional enhancement — promote to a live typeahead on
  mobile (the drawer field currently goes straight to the results page).

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
- Follow-up: create the PostHog project, add `NEXT_PUBLIC_POSTHOG_KEY` (phc\_…)
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
