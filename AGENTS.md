# AGENTS.md

Standing playbook for any AI agent (Claude, Codex, Cursor, Hermes…) or human
working on this repository. Read it before making changes.

## Stack

- **Next.js 15** (canary, Turbopack) with App Router and PPR
- **React 19** with Server Components by default
- **TypeScript strict**
- **Tailwind 4** + inline-style CSS
- **pnpm** package manager
- Data: **Shopify Storefront API** — live store `babanuj.myshopify.com`
- Host: **Vercel** — production deploys from `main`

## Repo layout

- `app/` — App Router pages. Each route is a Server Component that fetches
  Shopify data and passes typed props down to client components.
- `components/babanuj/` — Market-direction UI (the v2 design).
  - `home/` — homepage sections
  - `layout/` — chrome (announce, utility, nav, catbar, footer, newsletter)
  - `add-to-bag.tsx`, `product-card.tsx`, `pdp.tsx`, `category-view.tsx`,
    `brand-view.tsx`, `icons.tsx`, `ornaments.tsx`, `photo.tsx`
- `components/cart/` — cart state + drawer. `cart-context.tsx` owns the
  optimistic state at the provider level.
- `lib/babanuj/` — Babanuj-specific data + types + adapters.
  - `data.ts` — brands, categories, seed products
  - `from-shopify.ts` — Shopify `Product` → `BabanujProduct` adapter
  - `shopify-bridge.ts` — reverse adapter for the seed-data fallback path
- `lib/shopify/` — Storefront API client + queries + types

## Data flow

1. Route page (server component) calls `lib/shopify/*`
2. Calls `shopifyProductToBabanuj()` to adapt the response
3. Passes typed `BabanujProduct[]` to client view components
4. Client views consume the `BabanujProduct` shape — they don't know Shopify
   exists

When Shopify env vars are missing, `lib/shopify/index.ts` short-circuits to
seed data from `lib/babanuj/data.ts`. Useful for local dev without creds.

## Cart

`useOptimistic` is instantiated **once**, at the provider level in
`components/cart/cart-context.tsx`. All consumers (`AddToBagButton`,
`CartModal`, etc.) call `useCart()` to read the same shared state.

Do not call `useOptimistic` anywhere else — multiple instances don't sync,
and the cart badge in the nav won't update.

`AddToBagButton` runs the optimistic update + the `addItem` server action
inside one `startTransition`. The server action writes to the real Shopify
cart and invalidates the cache tag.

Each `BabanujProduct` carries a `variantId` field set from the live Shopify
`ProductVariant` GID. This must round-trip to the cart mutation intact — if
it's a synthetic ID, Shopify rejects the cart line.

## Brand & category mapping

When adding a brand:
1. Add to `BRANDS` array in `lib/babanuj/data.ts`
2. Add the Shopify vendor string → brand slug in `VENDOR_TO_BRAND_ID`
3. Add the reverse in `vendorFromBrandId`
4. Add a `BRAND_DETAILS[brandId]` entry for the story/timeline content

When adding a category:
1. Create a Shopify Smart auto-collection (by tag / product type) — the
   collection's handle becomes the category id
2. Add a `BabanujCategory` entry in `lib/babanuj/data.ts`
3. Add the link in `components/babanuj/layout/cat-bar.tsx`
4. (Optional) Add to the `CATEGORY_IDS` list in `app/page.tsx` for the
   home-page category-card image

All three IDs must match.

## Environment

Local: `.env.local` (gitignored). Production: Vercel project settings.
See `.env.example` for the template.

Never commit secrets. The pre-push hook refuses if `.env`, `.env.local`,
or `.env.production` is tracked in git.

## Git workflow

```bash
git switch main && git pull          # 1. sync
git switch -c <type>/<short-desc>    # 2. branch (feat/fix/chore/redesign/docs)
# … edit + commit small commits …
pnpm exec tsc --noEmit && pnpm build # 4. verify (the pre-push hook re-runs these)
git push -u origin <branch>          # 5. push, Vercel auto-builds a preview
# … click through the preview URL …
gh pr create --fill                  # 7. PR
# … self-review on GitHub …
# 9. "Squash and merge" in GitHub UI; branch auto-deletes
```

**Branch names**: `feat/<desc>` `fix/<desc>` `chore/<desc>` `redesign/<theme>`
`docs/<topic>`.

**Commit messages**: imperative subject ≤ 72 chars, blank line, body
explaining *why* (the diff shows *what*). No `feat:` prefix on the
subject — the branch name already carries the type.

```
Wire newsletter form to Shopify Email customer endpoint

POSTs to /contact?form_type=customer with acceptsMarketing=true.
Avoids a Klaviyo dependency for launch.
```

Never force-push `main`. Never commit directly to `main`.

**Commit author**: every commit on this repo must be authored as:

```
Moe Ghashim <mohanadgh@gmail.com>
```

This is the identity tied to the GitHub account that owns the repo and the
Vercel project. Before your first commit in a fresh clone or worktree, verify:

```bash
git config user.name   # → Moe Ghashim
git config user.email  # → mohanadgh@gmail.com
```

If either is wrong, set it locally (`git config user.name "Moe Ghashim"` /
`git config user.email "mohanadgh@gmail.com"`) — do **not** edit the global
git config. Co-author trailers (e.g. `Co-Authored-By: …`) are fine, but the
primary author must always be the identity above.

## Pre-push checks (enforced via husky)

`.husky/pre-push` runs:
- `pnpm exec tsc --noEmit`
- `pnpm build`
- Refuses if any `.env`, `.env.local`, or `.env.production` is tracked

Emergency bypass: `git push --no-verify` (try not to).

## Smoke-test checklist for UI changes

Start dev server (or Preview MCP), walk through:
- `/` — hero carousel auto-rotates, all 6 category cards render, both
  product carousels show real Shopify titles + prices, 4 brand cards
- `/product/<real-handle>` — Add to Bag opens cart drawer, badge shows
  `Bag · 1`, "Checkout →" link points to a real Shopify `/cart/c/…` URL
- `/search` — full 72-product grid, brand filter works
- `/search/<category-handle>` — category-filtered grid (empty until the
  Shopify auto-collection is created)
- `/brand/<brand-slug>` — brand hero, facts strip (Lines count is live),
  story, products grid
- Cart drawer — qty +/- updates, delete removes item, subtotal recomputes

## Operational links

- Storefront API: `https://babanuj.myshopify.com/api/2024-10/graphql.json`
- Shopify Admin: `https://admin.shopify.com/store/babanuj`
- Shopify CLI v3.92.1 (already installed) — for theme/Hydrogen workflows
- GA4: analytics.google.com → property "Babanuj"
- Smile.io: smile.io admin → Babanuj account
- Klaviyo: not used (Shopify Email replaces it)

## Don'ts

- Don't touch `main` directly
- Don't commit `.env.local` or any secret
- Don't bypass the pre-push hook unless the user explicitly says so
- Don't add fake discount, sale, or member chips to product cards
  (misleading — there's no membership program at launch)
- Don't add hardcoded review counts or star ratings; wire to a real reviews
  app or hide
- Don't create a `useOptimistic` cart instance outside `CartProvider`
- Don't bypass the `shopifyProductToBabanuj` adapter when reading live data
- Don't modify Shopify webhooks, store settings, or product data on the
  user's behalf without explicit confirmation
- Don't force-push shared branches without explicit user permission

## When stuck

- **Fixed-position element clipped to nav height?** The nav has
  `backdrop-filter: blur(10px)`, which makes it a containing block for
  any `position: fixed` descendant per spec. `height: 100vh` ends up
  measured against the 62px sticky nav, so the bottom of the element
  gets clipped. Fix: render the overlay via `createPortal(node,
  document.body)` (guarded by a mounted-state effect for SSR). Both
  `<MobileMenu>` and `<CartModal>` use this pattern — copy them.
- Turbopack module-factory errors → stop dev server, `rm -rf .next`, restart
- Stale cart cookie → clear `cartId` cookie in DevTools, reload
- Hot-reload not picking up changes → same as above (`.next` cache)
- Server action returning 500 → check Shopify Storefront API endpoint and
  token scopes (`unauthenticated_read_*`, `unauthenticated_write_checkouts`)
- Build passes locally but fails in Vercel preview → verify all env vars are
  set in the Vercel project dashboard
