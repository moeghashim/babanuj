import { MarketBrands } from "components/babanuj/home/brands";
import { MarketCarousel } from "components/babanuj/home/carousel";
import { MarketCatalog } from "components/babanuj/home/catalog";
import { MarketCategories } from "components/babanuj/home/categories";
import { MarketHero } from "components/babanuj/home/hero";
import { MarketHowItWorks } from "components/babanuj/home/how-it-works";
import { MarketPromo } from "components/babanuj/home/promo";
import { MarketReviews } from "components/babanuj/home/reviews";
import { MarketTrust } from "components/babanuj/home/trust";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { getCollectionProducts, getProducts } from "lib/shopify";

export const metadata = {
  title: "Babanuj — Heirloom sweets, delivered weekly",
  description:
    "Curated Türkish, Syrian and Gulf sweet houses — shipped fresh from Houston.",
  openGraph: { type: "website" },
};

const CATEGORY_IDS = [
  "baklava",
  "cookies",
  "turkish-delight",
  "chocolate",
  "gift-boxes",
  "dates",
];

export default async function HomePage() {
  const [bestsellersRaw, newRaw, ...categoryProducts] = await Promise.all([
    getProducts({ sortKey: "BEST_SELLING" }).catch(() => []),
    getProducts({ sortKey: "CREATED_AT", reverse: true }).catch(() => []),
    ...CATEGORY_IDS.map((id) =>
      getCollectionProducts({ collection: id }).catch(() => []),
    ),
  ]);

  const bestsellers = shopifyProductsToBabanuj(bestsellersRaw).slice(0, 12);
  const newArrivals = shopifyProductsToBabanuj(newRaw).slice(0, 12);

  const imageByCategoryId: Record<string, string | undefined> = {};
  CATEGORY_IDS.forEach((id, i) => {
    const first = categoryProducts[i]?.[0];
    imageByCategoryId[id] = first?.featuredImage?.url;
  });

  return (
    <>
      <MarketHero />
      <MarketTrust />
      <MarketCategories imageByCategoryId={imageByCategoryId} />
      <MarketCarousel
        title="Bestsellers"
        tag="Loved by Babanuj customers"
        products={bestsellers}
      />
      <MarketPromo />
      <MarketBrands />
      <MarketCarousel
        title="New This Week"
        tag="Just landed in Houston"
        products={newArrivals}
        reverse
      />
      <MarketHowItWorks />
      <MarketReviews />
      <MarketCatalog />
    </>
  );
}
