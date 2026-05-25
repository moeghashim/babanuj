import { CategoryView } from "components/babanuj/category-view";
import { CATEGORIES, categoryShopifyQuery } from "lib/babanuj/data";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { getCollection, getCollectionProducts, getProducts } from "lib/shopify";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

function redirectLegacyCollectionHandle(handle: string) {
  if (handle === "all") permanentRedirect("/search");
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  redirectLegacyCollectionHandle(params.handle);

  const known = CATEGORIES.some((c) => c.id === params.handle);
  const collection = await getCollection(params.handle);

  if (!known && !collection) return notFound();

  if (collection) {
    return {
      title: collection.seo?.title || collection.title,
      description: collection.seo?.description || collection.description,
      alternates: {
        canonical: `/collections/${params.handle}`,
      },
    };
  }

  const cat = CATEGORIES.find((c) => c.id === params.handle)!;
  return {
    title: cat.name,
    description: cat.blurb,
    alternates: {
      canonical: `/collections/${params.handle}`,
    },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  redirectLegacyCollectionHandle(params.handle);

  const known = CATEGORIES.some((c) => c.id === params.handle);
  const collection = await getCollection(params.handle);

  if (!known && !collection) return notFound();

  // Primary path: the Shopify Smart collection the user created in admin.
  let raw = await getCollectionProducts({ collection: params.handle });

  // Fallback path: if the collection doesn't exist (or is empty), search the
  // catalog by the category's tag / product type. Keeps the page useful
  // before the user has created the collection in Shopify admin.
  if (raw.length === 0) {
    const q = categoryShopifyQuery(params.handle);
    if (q) {
      raw = await getProducts({ query: q }).catch(() => []);
    }
  }

  const products = shopifyProductsToBabanuj(raw);

  return (
    <CategoryView
      categoryBlurb={!known ? collection?.description : undefined}
      categoryId={params.handle}
      categoryTitle={!known ? collection?.title : undefined}
      products={products}
    />
  );
}
