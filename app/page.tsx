import { MarketBrands } from "components/babanuj/home/brands";
import { MarketCarousel } from "components/babanuj/home/carousel";
import { MarketCatalog } from "components/babanuj/home/catalog";
import { MarketCategories } from "components/babanuj/home/categories";
import { MarketHero } from "components/babanuj/home/hero";
import { MarketHowItWorks } from "components/babanuj/home/how-it-works";
import { MarketMember } from "components/babanuj/home/member";
import { MarketPromo } from "components/babanuj/home/promo";
import { MarketReviews } from "components/babanuj/home/reviews";
import { MarketTrust } from "components/babanuj/home/trust";

export const metadata = {
  title: "Babanuj — Heirloom sweets, delivered weekly",
  description:
    "Curated Türkish, Syrian and Gulf sweet houses — shipped fresh from Houston. Members save 25% on every order.",
  openGraph: { type: "website" },
};

export default function HomePage() {
  return (
    <>
      <MarketHero />
      <MarketTrust />
      <MarketCategories />
      <MarketCarousel title="Bestsellers" tag="Loved by 12,400 members" />
      <MarketPromo />
      <MarketBrands />
      <MarketCarousel
        title="New This Week"
        tag="Just landed in Houston"
        reverse
      />
      <MarketMember />
      <MarketHowItWorks />
      <MarketReviews />
      <MarketCatalog />
    </>
  );
}
