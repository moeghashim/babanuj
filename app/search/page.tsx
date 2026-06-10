import { CategoryView } from "components/babanuj/category-view";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { openGraph } from "lib/babanuj/seo";
import { getProducts } from "lib/shopify";

const title = "Shop All Middle Eastern Sweets & Pantry";
const description =
  "Browse baklava, maamoul, Turkish delight, Dubai chocolate, dates, honey, coffee, bread, and gift boxes from every brand in the Babanuj pantry.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "/search",
  },
  // /search is the canonical all-products landing page (legacy
  // /collections/all 301s here), not a private results page — keep it
  // explicitly indexable.
  robots: {
    index: true,
    follow: true,
  },
  openGraph: openGraph({
    title: `${title} | Babanuj`,
    description,
    url: "/search",
  }),
};

export const experimental_ppr = true;

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = (await props.searchParams) ?? {};
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;

  const raw = await getProducts({ query: q });
  const products = shopifyProductsToBabanuj(raw);

  return <CategoryView categoryId="all" products={products} searchValue={q} />;
}
