import { RetailShopPage } from "components/babanuj/retail-shop-page";
import Footer from "components/layout/footer";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Shop Retail",
  description:
    "Shop Babanuj's curated retail selection of imported Middle Eastern and Turkish sweets, cookies, and chocolates.",
};

export default async function ShopRetailPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const selectedBrand =
    typeof params?.brand === "string" ? params.brand : undefined;
  const selectedCategory =
    typeof params?.category === "string" ? params.category : undefined;
  const products = await getProducts({});

  return (
    <>
      <RetailShopPage
        products={products}
        selectedBrand={selectedBrand}
        selectedCategory={selectedCategory}
      />
      <Footer />
    </>
  );
}
