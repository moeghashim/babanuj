import { CategoryView } from "components/babanuj/category-view";
import { CATEGORIES } from "lib/babanuj/data";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { getCollection, getCollectionProducts } from "lib/shopify";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const known = CATEGORIES.some((c) => c.id === params.collection);
  const collection = known ? await getCollection(params.collection) : undefined;

  if (!known && !collection) return notFound();

  if (collection) {
    return {
      title: collection.seo?.title || collection.title,
      description: collection.seo?.description || collection.description,
    };
  }

  const cat = CATEGORIES.find((c) => c.id === params.collection)!;
  return { title: cat.name, description: cat.blurb };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const known = CATEGORIES.some((c) => c.id === params.collection);
  if (!known) return notFound();

  const raw = await getCollectionProducts({ collection: params.collection });
  const products = shopifyProductsToBabanuj(raw);

  return <CategoryView categoryId={params.collection} products={products} />;
}
