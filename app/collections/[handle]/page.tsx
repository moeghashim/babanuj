import { CategoryView } from "components/babanuj/category-view";
import { CATEGORIES, categoryShopifyQuery } from "lib/babanuj/data";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { LEGACY_COLLECTION_REDIRECTS } from "lib/babanuj/redirects";
import { openGraph, seoDescription } from "lib/babanuj/seo";
import { getCollection, getCollectionProducts, getProducts } from "lib/shopify";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

function redirectLegacyCollectionHandle(handle: string) {
  const target = LEGACY_COLLECTION_REDIRECTS[handle];
  if (target) permanentRedirect(target);
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  redirectLegacyCollectionHandle(params.handle);

  const known = CATEGORIES.some((c) => c.id === params.handle);
  const collection = await getCollection(params.handle);

  if (!known && !collection) return notFound();
  const cat = CATEGORIES.find((c) => c.id === params.handle);

  if (collection) {
    const title = collection.seo?.title || collection.title;
    const description = cat
      ? categorySeoDescription(cat)
      : seoDescription(collection.seo?.description || collection.description);

    return {
      title,
      description,
      alternates: {
        canonical: `/collections/${params.handle}`,
      },
      openGraph: openGraph({
        title: `${title} | Babanuj`,
        description,
        url: `/collections/${params.handle}`,
        image: {
          url: `/collections/${params.handle}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${title} at Babanuj`,
        },
      }),
    };
  }

  const fallbackCat = cat!;
  const description = categorySeoDescription(fallbackCat);
  return {
    title: fallbackCat.name,
    description,
    alternates: {
      canonical: `/collections/${params.handle}`,
    },
    openGraph: openGraph({
      title: `${fallbackCat.name} | Babanuj`,
      description,
      url: `/collections/${params.handle}`,
      image: {
        url: `/collections/${params.handle}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${fallbackCat.name} at Babanuj`,
      },
    }),
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

function categorySeoDescription(category: (typeof CATEGORIES)[number]) {
  return seoDescription(
    `${category.blurb} Shop ${category.name.toLowerCase()} at Babanuj with fresh Middle Eastern sweets, pantry staples, and gift-ready favorites shipped from Houston.`,
  );
}
