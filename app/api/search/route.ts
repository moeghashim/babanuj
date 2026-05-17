import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "lib/shopify";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";

/**
 * Live search endpoint for the nav typeahead.
 *
 * GET /api/search?q=<query>
 * → { products: BabanujProduct[] } (max 6 results)
 *
 * Returns an empty list for queries shorter than 2 chars. Falls back
 * gracefully if Shopify Storefront API throws.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const raw = await getProducts({ query: q });
    const products = shopifyProductsToBabanuj(raw).slice(0, 6);
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
