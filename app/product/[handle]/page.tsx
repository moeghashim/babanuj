import { MarketPDP } from "components/babanuj/pdp";
import { MetaProductTracker } from "components/babanuj/meta-product-tracker";
import {
  shopifyProductToBabanuj,
  shopifyProductsToBabanuj,
} from "lib/babanuj/from-shopify";
import { STALE_PRODUCT_HANDLE_REDIRECTS } from "lib/babanuj/redirects";
import { openGraph, seoDescription, seoTitle } from "lib/babanuj/seo";
import {
  getProduct,
  getProductRecommendations,
  getProducts,
} from "lib/shopify";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

function redirectStaleProductHandle(handle: string) {
  const target = STALE_PRODUCT_HANDLE_REDIRECTS[handle];
  if (target) permanentRedirect(target);
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
      image: product.featuredImage,
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

  const [recsRaw, sameBrandRaw] = await Promise.all([
    getProductRecommendations(product.id).catch(() => []),
    product.vendor
      ? getProducts({ query: `vendor:"${product.vendor}"` }).catch(() => [])
      : Promise.resolve([]),
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
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
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
