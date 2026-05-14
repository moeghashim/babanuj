import { CategoryView } from "components/babanuj/category-view";
import { findCategory, CATEGORIES } from "lib/babanuj/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const cat = findCategory(params.collection);
  if (cat.id === "all" && params.collection !== "all") return notFound();

  return {
    title: cat.name,
    description: cat.blurb,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
}) {
  const params = await props.params;
  const known = CATEGORIES.some((c) => c.id === params.collection);
  if (!known) return notFound();

  return <CategoryView categoryId={params.collection} />;
}
