import { CategoryView } from "components/babanuj/category-view";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Search the pantry",
  description: "Browse every brand and line in the Babanuj pantry.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = (await props.searchParams) ?? {};
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;

  const raw = await getProducts({ query: q });
  const products = shopifyProductsToBabanuj(raw);

  return (
    <CategoryView categoryId="all" products={products} searchValue={q} />
  );
}
