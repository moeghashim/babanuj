// Bridges Babanuj static data into the Shopify-shaped types that the
// commerce app's existing components expect. Used by lib/shopify when no
// Shopify endpoint is configured.

import type {
  Cart,
  Collection,
  Menu,
  Product,
  ProductVariant,
} from "lib/shopify/types";
import {
  ALL_PRODUCTS,
  BRANDS,
  CATEGORIES,
  type BabanujCategory,
  type BabanujProduct,
} from "./data";

const CURRENCY = "USD";

function variantFromProduct(p: BabanujProduct): ProductVariant {
  return {
    id: `gid://babanuj/Variant/${p.id}`,
    title: "Default Title",
    availableForSale: true,
    selectedOptions: [{ name: "Title", value: "Default Title" }],
    price: { amount: p.price.toFixed(2), currencyCode: CURRENCY },
  };
}

export function toShopifyProduct(p: BabanujProduct): Product {
  const variant = variantFromProduct(p);
  const image = {
    url: p.img,
    altText: p.name,
    width: 900,
    height: 900,
  };
  return {
    id: `gid://babanuj/Product/${p.id}`,
    handle: p.handle,
    availableForSale: true,
    title: p.name,
    description: `${p.name} — ${p.weight}. Made by ${p.brand}.`,
    descriptionHtml: `<p>${p.name} — ${p.weight}. Made by ${p.brand}.</p>`,
    options: [
      { id: "default", name: "Title", values: ["Default Title"] },
    ],
    priceRange: {
      minVariantPrice: { amount: p.price.toFixed(2), currencyCode: CURRENCY },
      maxVariantPrice: { amount: p.price.toFixed(2), currencyCode: CURRENCY },
    },
    variants: [variant],
    featuredImage: image,
    images: [image],
    seo: { title: p.name, description: `${p.name} from ${p.brand}` },
    tags: [p.brand, p.tag],
    updatedAt: new Date().toISOString(),
  };
}

export function toShopifyProducts(): Product[] {
  return ALL_PRODUCTS.map(toShopifyProduct);
}

export function toShopifyCollection(c: BabanujCategory): Collection {
  return {
    handle: c.id,
    title: c.name,
    description: c.blurb,
    seo: { title: c.name, description: c.blurb },
    path: `/search/${c.id}`,
    updatedAt: new Date().toISOString(),
  };
}

export function toShopifyCollections(): Collection[] {
  return [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: { title: "All", description: "All products" },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    ...CATEGORIES.filter((c) => c.id !== "all" && c.id !== "pantry").map(
      toShopifyCollection,
    ),
  ];
}

export function productsInCollection(handle: string): Product[] {
  if (!handle) return toShopifyProducts();
  const cat = CATEGORIES.find((c) => c.id === handle);
  if (!cat) return [];
  return ALL_PRODUCTS.filter(cat.filter).map(toShopifyProduct);
}

export function searchProducts(query?: string, sortKey?: string, reverse?: boolean): Product[] {
  let r = [...ALL_PRODUCTS];
  if (query) {
    const q = query.toLowerCase();
    r = r.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q),
    );
  }
  if (sortKey === "PRICE") {
    r.sort((a, b) => (reverse ? b.price - a.price : a.price - b.price));
  } else if (sortKey === "CREATED_AT") {
    if (reverse) r.reverse();
  }
  return r.map(toShopifyProduct);
}

export function productRecommendations(productId: string): Product[] {
  const idOnly = productId.replace("gid://babanuj/Product/", "");
  const found = ALL_PRODUCTS.find((p) => p.id === idOnly);
  const pool = ALL_PRODUCTS.filter((p) => p.id !== idOnly);
  if (!found) return pool.slice(0, 6).map(toShopifyProduct);
  // Prefer same-brand neighbors first.
  const sameBrand = pool.filter((p) => p.brand === found.brand);
  const otherBrand = pool.filter((p) => p.brand !== found.brand);
  return [...sameBrand, ...otherBrand].slice(0, 6).map(toShopifyProduct);
}

export function emptyCart(): Cart {
  return {
    id: "local-cart",
    checkoutUrl: "/checkout",
    cost: {
      subtotalAmount: { amount: "0.00", currencyCode: CURRENCY },
      totalAmount: { amount: "0.00", currencyCode: CURRENCY },
      totalTaxAmount: { amount: "0.00", currencyCode: CURRENCY },
    },
    lines: [],
    totalQuantity: 0,
  };
}

export function brandMenu(): Menu[] {
  return [
    { title: "Shop All", path: "/search" },
    ...CATEGORIES.filter((c) => c.id !== "all" && c.id !== "pantry").map(
      (c) => ({ title: c.name, path: `/search/${c.id}` }),
    ),
    ...BRANDS.map((b) => ({ title: b.name, path: `/brand/${b.id}` })),
  ];
}
