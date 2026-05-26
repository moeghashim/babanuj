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
import { openGraph } from "lib/babanuj/seo";
import { getProducts } from "lib/shopify";

const title = "Buy Baklava, Maamoul & Turkish Delight Online | Babanuj";
const description =
  "Shop Middle Eastern sweets online: baklava, maamoul, Turkish delight, Dubai chocolate, dates, honey, coffee, and gift boxes shipped fresh from Houston.";

export const metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: openGraph({
    title,
    description,
    url: "/",
  }),
};

export const experimental_ppr = true;

export default async function HomePage() {
  const [bestsellersRaw, newRaw] = await Promise.all([
    getProducts({ sortKey: "BEST_SELLING" }).catch(() => []),
    getProducts({ sortKey: "CREATED_AT", reverse: true }).catch(() => []),
  ]);

  const bestsellers = shopifyProductsToBabanuj(bestsellersRaw)
    .filter((product) => product.availableForSale !== false)
    .slice(0, 12);
  const newArrivals = shopifyProductsToBabanuj(newRaw)
    .filter((product) => product.availableForSale !== false)
    .slice(0, 12);

  return (
    <>
      <MarketHero />
      <MarketTrust />
      <MarketCategories />
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
