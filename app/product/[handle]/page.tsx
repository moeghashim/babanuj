import { MarketPDP } from "components/babanuj/pdp";
import { MetaProductTracker } from "components/babanuj/meta-product-tracker";
import { categoryFor } from "lib/babanuj/data";
import {
  shopifyProductToBabanuj,
  shopifyProductsToBabanuj,
} from "lib/babanuj/from-shopify";
import { getJudgemeProductRating } from "lib/babanuj/judgeme";
import { STALE_PRODUCT_HANDLE_REDIRECTS } from "lib/babanuj/redirects";
import { openGraph, seoDescription, seoTitle } from "lib/babanuj/seo";
import {
  getProduct,
  getProductRecommendations,
  getProducts,
} from "lib/shopify";
import type { Image } from "lib/shopify/types";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

function redirectStaleProductHandle(handle: string) {
  const target = STALE_PRODUCT_HANDLE_REDIRECTS[handle];
  if (target) permanentRedirect(target);
}

/**
 * Social crawlers want a large og:image; Shopify uploads can be huge, so ask
 * the CDN for a 1200px-wide rendition (it never upscales past the original).
 */
function productOgImage(image: Image | undefined) {
  if (!image?.url) return undefined;
  if (!image.width || !image.height) return image;

  const width = Math.min(image.width, 1200);
  const height = Math.round((width * image.height) / image.width);
  const separator = image.url.includes("?") ? "&" : "?";

  return {
    url: `${image.url}${separator}width=${width}`,
    width,
    height,
    alt: image.altText,
  };
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  redirectStaleProductHandle(params.handle);

  const product = await getProduct(params.handle);

  if (!product) return notFound();
  const title = seoTitle(product.seo?.title || product.title, 46);
  const description = seoDescription(
    product.seo?.description || product.description,
    `${product.title} from Babanuj ships fresh from Houston with curated Middle Eastern sweets, pantry staples, and gift-ready treats for U.S. delivery.`,
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/product/${product.handle}`,
    },
    openGraph: openGraph({
      title: `${title} | Babanuj`,
      description,
      url: `/product/${product.handle}`,
      image: productOgImage(product.featuredImage),
    }),
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  redirectStaleProductHandle(params.handle);

  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const babanujProduct = shopifyProductToBabanuj(product);

  const [recsRaw, sameBrandRaw, judgemeRating] = await Promise.all([
    getProductRecommendations(product.id).catch(() => []),
    product.vendor
      ? getProducts({ query: `vendor:"${product.vendor}"` }).catch(() => [])
      : Promise.resolve([]),
    getJudgemeProductRating(product.handle),
  ]);

  const related = shopifyProductsToBabanuj(
    recsRaw.filter((r) => r.handle !== product.handle),
  )
    .filter((item) => item.availableForSale !== false)
    .slice(0, 6);
  const fromBrand = shopifyProductsToBabanuj(
    sameBrandRaw.filter((r) => r.handle !== product.handle),
  )
    .filter((item) => item.availableForSale !== false)
    .slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    url: `${baseUrl}/product/${product.handle}`,
    sku: product.variants[0]?.sku || undefined,
    brand: product.vendor
      ? { "@type": "Brand", name: product.vendor }
      : undefined,
    // Judge.me reviews render client-side only, so crawlers never see them —
    // surface the aggregate score in structured data instead.
    aggregateRating: judgemeRating
      ? {
          "@type": "AggregateRating",
          ratingValue: judgemeRating.rating,
          reviewCount: judgemeRating.reviewCount,
        }
      : undefined,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
      offerCount: product.variants.length,
      // Mirrors the standard shipping option surfaced in PDPShipping. Google
      // requires shippingDetails for Merchant listing eligibility.
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 4,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
    },
  };

  // Mirrors the visible Home › <category> › <product> breadcrumb in MarketPDP.
  const cat = categoryFor(babanujProduct);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cat.name,
        item: `${baseUrl}${cat.id === "all" ? "/search" : `/collections/${cat.id}`}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd, breadcrumbJsonLd]),
        }}
      />
      <MarketPDP
        product={babanujProduct}
        fromBrand={fromBrand}
        related={related}
      />
      <MetaProductTracker product={babanujProduct} />
    </>
  );
}
