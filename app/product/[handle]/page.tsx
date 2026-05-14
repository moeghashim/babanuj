import { MarketPDP } from "components/babanuj/pdp";
import { findProductByHandle } from "lib/babanuj/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = findProductByHandle(params.handle);

  if (!product) return notFound();

  return {
    title: product.name,
    description: `${product.name} — ${product.weight}. Made by ${product.brand}.`,
    openGraph: {
      images: [
        {
          url: product.img,
          width: 900,
          height: 900,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = findProductByHandle(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `${product.name} from ${product.brand}`,
    image: product.img,
    offers: {
      "@type": "AggregateOffer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      highPrice: product.price.toFixed(2),
      lowPrice: product.price.toFixed(2),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <MarketPDP product={product} />
    </>
  );
}
