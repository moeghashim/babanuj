// Adapts Shopify Storefront API types into the BabanujProduct shape that
// the design's UI components consume. Used by every page that fetches
// live product data.

import type { Product, Collection } from "lib/shopify/types";
import type { BabanujProduct, BabanujCategory } from "./data";
import {
  CATEGORIES,
  VENDOR_TO_BRAND_ID,
  findCategory,
} from "./data";

// Background swatch shown under product images while they load. Map by
// brand for visual coherence; fall back to a sage neutral.
const HUE_BY_BRAND: Record<string, string> = {
  zaitoune: "#bfa86a",
  babanuj: "#3a5c3a",
  leen: "#5e3a1e",
  crush: "#7a4a2e",
};

const HUE_FALLBACK = "#caa55a";

// Strip the "Sweets" / "Sweet" trailing suffix from a vendor string so the
// display matches the design's compact brand naming.
function displayBrand(vendor: string): string {
  return vendor
    .replace(/\s+Sweets?$/i, "")
    .replace(/\s+Coffee$/i, " Coffee")
    .trim();
}

// Pull a weight string ("450g", "1kg") out of a product title.
const WEIGHT_RE = /(\d+(?:\.\d+)?)\s*(g|kg|oz|lb|ml|l)\b/i;

function parseWeight(title: string): string {
  const m = title.match(WEIGHT_RE);
  if (!m || !m[1] || !m[2]) return "";
  return `${m[1]}${m[2].toLowerCase()}`;
}

// First marketing-friendly tag becomes the small chip on the product card.
const TAG_PRIORITY = [
  "Bestseller",
  "New",
  "Lightning Deals",
  "Featured On TikTok",
  "Tiktok Trends",
  "Gift Boxes",
  "Eid desserts",
  "Cultural",
];

function pickTag(tags: string[]): string {
  for (const t of TAG_PRIORITY) {
    if (tags.includes(t)) return t;
  }
  return tags[0] ?? "";
}

export function shopifyProductToBabanuj(p: Product): BabanujProduct {
  const vendor = p.vendor ?? "";
  const brandId = VENDOR_TO_BRAND_ID[vendor] ?? null;
  const hue = (brandId && HUE_BY_BRAND[brandId]) ?? HUE_FALLBACK;
  const price = Number.parseFloat(p.priceRange.minVariantPrice.amount);
  const firstVariantId = p.variants[0]?.id ?? p.id;

  return {
    id: p.id,
    variantId: firstVariantId,
    handle: p.handle,
    name: p.title,
    brand: displayBrand(vendor || "Babanuj"),
    price: Number.isFinite(price) ? price : 0,
    weight: parseWeight(p.title),
    tag: pickTag(p.tags ?? []),
    hue,
    img: p.featuredImage?.url ?? "",
  };
}

export function shopifyProductsToBabanuj(ps: Product[]): BabanujProduct[] {
  return ps.map(shopifyProductToBabanuj);
}

// For pages that take a category ID (`/search/[collection]`): if the
// handle matches a known design category, return that; otherwise build a
// minimal one from the Shopify collection itself.
export function categoryFromShopifyCollection(
  c: Collection | undefined,
  id: string,
): BabanujCategory {
  const known = CATEGORIES.find((cat) => cat.id === id);
  if (known) return known;
  if (!c) return findCategory("all");
  return {
    id,
    name: c.title,
    hue: HUE_FALLBACK,
    blurb: c.description ?? "",
    filter: () => true,
  };
}
