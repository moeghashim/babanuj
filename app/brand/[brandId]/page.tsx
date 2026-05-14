import { BrandView } from "components/babanuj/brand-view";
import { BRANDS, findBrand } from "lib/babanuj/data";
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

  return {
    title: `${brand.name} — ${brand.tag}`,
    description: brand.blurb,
    openGraph: {
      images: [
        {
          url: brand.img,
          width: 1600,
          height: 1600,
          alt: brand.name,
        },
      ],
    },
  };
}

export default async function BrandPage(props: {
  params: Promise<{ brandId: string }>;
}) {
  const params = await props.params;
  const brand = findBrand(params.brandId);
  if (!brand) return notFound();

  return <BrandView brand={brand} />;
}
