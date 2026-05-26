import { BrandView } from "components/babanuj/brand-view";
import { BRANDS, findBrand, vendorFromBrandId } from "lib/babanuj/data";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { openGraph, seoDescription } from "lib/babanuj/seo";
import { getProducts } from "lib/shopify";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return BRANDS.map((b) => ({ brandId: b.id }));
}

export async function generateMetadata(props: {
  params: Promise<{ brandId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const brand = findBrand(params.brandId);
  if (!brand) return notFound();
  const title = `${brand.name} — ${brand.tag}`;
  const description = seoDescription(brand.blurb, brand.long);

  return {
    title,
    description,
    alternates: {
      canonical: `/brand/${brand.id}`,
    },
    openGraph: openGraph({
      title: `${title} | Babanuj`,
      description,
      url: `/brand/${brand.id}`,
      image: {
        url: brand.img,
        width: 1600,
        height: 1600,
        alt: brand.name,
      },
    }),
  };
}

export default async function BrandPage(props: {
  params: Promise<{ brandId: string }>;
}) {
  const params = await props.params;
  const brand = findBrand(params.brandId);
  if (!brand) return notFound();

  const vendor = vendorFromBrandId(brand.id);
  const raw = vendor
    ? await getProducts({ query: `vendor:"${vendor}"` }).catch(() => [])
    : [];
  const products = shopifyProductsToBabanuj(raw);

  return <BrandView brand={brand} products={products} />;
}
