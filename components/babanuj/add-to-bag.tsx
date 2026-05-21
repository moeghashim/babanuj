"use client";

import { PlusIcon, CartIcon } from "components/babanuj/icons";
import { useCart } from "components/cart/cart-context";
import type { BabanujProduct } from "lib/babanuj/data";
import { trackAddToCart } from "lib/meta/events";
import type { Cart, Product, ProductVariant } from "lib/shopify/types";
import { startTransition, type CSSProperties } from "react";

type Variant = "icon" | "quick-add" | "full";

type Props = {
  product: BabanujProduct;
  variant?: Variant;
  quantity?: number;
  style?: CSSProperties;
  label?: string;
};

async function addItemToCart(merchandiseId: string, quantity: number) {
  const response = await fetch("/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ merchandiseId, quantity }),
  });

  if (!response.ok) {
    return "Error adding item to cart";
  }

  const data = (await response.json()) as { cart?: Cart };
  return data.cart ?? "Error adding item to cart";
}

export function AddToBagButton({
  product,
  variant = "quick-add",
  quantity = 1,
  style,
  label,
}: Props) {
  const { addCartItem, openCart, setCart } = useCart();
  const isAvailable = product.availableForSale !== false;

  // Shape a minimal Product/ProductVariant for the optimistic update so the
  // cart reducer has the data it needs. The IDs are the real Shopify GIDs.
  const shopifyVariant: ProductVariant = {
    id: product.variantId,
    title: "Default Title",
    availableForSale: isAvailable,
    selectedOptions: [{ name: "Title", value: "Default Title" }],
    price: { amount: product.price.toFixed(2), currencyCode: "USD" },
  };
  const shopifyProduct: Product = {
    id: product.id,
    handle: product.handle,
    availableForSale: isAvailable,
    title: product.name,
    description: "",
    descriptionHtml: "",
    options: [],
    priceRange: {
      minVariantPrice: shopifyVariant.price,
      maxVariantPrice: shopifyVariant.price,
    },
    variants: [shopifyVariant],
    featuredImage: {
      url: product.img,
      altText: product.name,
      width: 900,
      height: 900,
    },
    images: [],
    seo: { title: product.name, description: "" },
    tags: [product.tag].filter(Boolean),
    vendor: product.brand,
    productType: "",
    updatedAt: new Date().toISOString(),
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;
    startTransition(async () => {
      // Optimistic UI: instant cart badge / drawer update.
      for (let i = 0; i < quantity; i++) {
        addCartItem(shopifyVariant, shopifyProduct);
      }
      openCart();
      // Real Shopify cart line write. The API route returns the confirmed
      // cart so the optimistic state can be committed without a refresh race.
      const result = await addItemToCart(product.variantId, quantity);
      if (typeof result !== "string") {
        setCart(result);
        trackAddToCart({
          id: product.handle,
          name: product.name,
          brand: product.brand,
          price: product.price,
          quantity,
        });
      }
    });
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        aria-label="Quick add"
        disabled={!isAvailable}
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: "#fff",
          color: "var(--ink)",
          border: 0,
          cursor: isAvailable ? "pointer" : "not-allowed",
          opacity: isAvailable ? 1 : 0.55,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          ...style,
        }}
      >
        <PlusIcon width={16} height={16} />
      </button>
    );
  }

  if (variant === "full") {
    return (
      <button
        onClick={handleClick}
        className="market-btn"
        disabled={!isAvailable}
        style={{
          flex: 1,
          justifyContent: "center",
          padding: "14px 24px",
          fontSize: 14,
          ...style,
        }}
      >
        <CartIcon width={16} height={16} />
        {isAvailable
          ? (label ?? `Add to Bag — $${(product.price * quantity).toFixed(2)}`)
          : "Sold out"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isAvailable ? "Quick add" : "Sold out"}
      disabled={!isAvailable}
      style={{
        padding: "10px 14px",
        background: "#fff",
        color: "var(--ink)",
        border: "1.5px solid var(--ink)",
        fontFamily: "inherit",
        fontWeight: 700,
        fontSize: 13,
        cursor: isAvailable ? "pointer" : "not-allowed",
        opacity: isAvailable ? 1 : 0.55,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        ...style,
      }}
    >
      <PlusIcon width={16} height={16} />{" "}
      {isAvailable ? (label ?? "Add to Bag") : "Sold out"}
    </button>
  );
}
