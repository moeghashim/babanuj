import {
  JUDGEME_ENABLED,
  JUDGEME_PUBLIC_TOKEN,
  JUDGEME_SHOP_DOMAIN,
} from "components/babanuj/reviews/config";

export type JudgemeProductRating = {
  rating: number;
  reviewCount: number;
};

/**
 * Fetch a product's Judge.me review rating server-side so it can be embedded
 * in Product JSON-LD as aggregateRating. The client-side widgets only render
 * after hydration, which Google's crawler doesn't reliably wait for.
 *
 * Judge.me's public widget endpoint returns the review-widget HTML with the
 * aggregate stats as data attributes — the same approach Shopify's Hydrogen
 * Judge.me integration uses. Cached for an hour; returns undefined on any
 * failure so the PDP never breaks because of reviews.
 */
export async function getJudgemeProductRating(
  handle: string,
): Promise<JudgemeProductRating | undefined> {
  if (!JUDGEME_ENABLED) return undefined;

  try {
    const params = new URLSearchParams({
      api_token: JUDGEME_PUBLIC_TOKEN!,
      shop_domain: JUDGEME_SHOP_DOMAIN!,
      handle,
    });
    const res = await fetch(
      `https://judge.me/api/v1/widgets/product_review?${params}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return undefined;

    const { widget } = (await res.json()) as { widget?: string };
    if (!widget) return undefined;

    const rating = Number(
      widget.match(/data-average-rating=["']([\d.]+)["']/)?.[1],
    );
    const reviewCount = Number(
      widget.match(/data-number-of-reviews=["'](\d+)["']/)?.[1],
    );

    if (!(rating > 0) || !(reviewCount > 0)) return undefined;

    return { rating, reviewCount };
  } catch {
    return undefined;
  }
}
