import { CategoryView } from "components/babanuj/category-view";
import { CATEGORIES } from "lib/babanuj/data";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { getCollection, getCollectionProducts } from "lib/shopify";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const known = CATEGORIES.some((c) => c.id === params.handle);
  const collection = known ? await getCollection(params.handle) : undefined;

  if (!known && !collection) return notFound();

  if (collection) {
    return {
      title: collection.seo?.title || collection.title,
      description: collection.seo?.description || collection.description,
    };
  }

  const cat = CATEGORIES.find((c) => c.id === params.handle)!;
  return { title: cat.name, description: cat.blurb };
}

export default async function CategoryPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const known = CATEGORIES.some((c) => c.id === params.handle);
  if (!known) return notFound();

  const raw = await getCollectionProducts({ collection: params.handle });
  const products = shopifyProductsToBabanuj(raw);

  return <CategoryView categoryId={params.handle} products={products} />;
}
