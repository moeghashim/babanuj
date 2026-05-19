"use client";

import { PlusIcon, CartIcon } from "components/babanuj/icons";
import { useCart } from "components/cart/cart-context";
import { addItem } from "components/cart/actions";
import type { BabanujProduct } from "lib/babanuj/data";
import type { Product, ProductVariant } from "lib/shopify/types";
import { startTransition, type CSSProperties } from "react";

type Variant = "icon" | "quick-add" | "full";

type Props = {
  product: BabanujProduct;
  variant?: Variant;
  quantity?: number;
  style?: CSSProperties;
  label?: string;
};

export function AddToBagButton({
  product,
  variant = "quick-add",
  quantity = 1,
  style,
  label,
}: Props) {
  const { addCartItem, openCart } = useCart();

  // Shape a minimal Product/ProductVariant for the optimistic update so the
  // cart reducer has the data it needs. The IDs are the real Shopify GIDs.
  const shopifyVariant: ProductVariant = {
    id: product.variantId,
    title: "Default Title",
    availableForSale: true,
    selectedOptions: [{ name: "Title", value: "Default Title" }],
    price: { amount: product.price.toFixed(2), currencyCode: "USD" },
  };
  const shopifyProduct: Product = {
    id: product.id,
    handle: product.handle,
    availableForSale: true,
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
    startTransition(async () => {
      // Optimistic UI: instant cart badge / drawer update.
      for (let i = 0; i < quantity; i++) {
        addCartItem(shopifyVariant, shopifyProduct);
      }
      openCart();
      // Real Shopify cart line write. Server action invalidates cart cache
      // on success; on failure, the optimistic state rolls back.
      await addItem(null, product.variantId);
    });
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        aria-label="Quick add"
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: "#fff",
          color: "var(--ink)",
          border: 0,
          cursor: "pointer",
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
        style={{
          flex: 1,
          justifyContent: "center",
          padding: "14px 24px",
          fontSize: 14,
          ...style,
        }}
      >
        <CartIcon width={16} height={16} />
        {label ?? `Add to Bag — $${(product.price * quantity).toFixed(2)}`}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Quick add"
      style={{
        padding: "10px 14px",
        background: "#fff",
        color: "var(--ink)",
        border: "1.5px solid var(--ink)",
        fontFamily: "inherit",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        ...style,
      }}
    >
      <PlusIcon width={16} height={16} /> {label ?? "Add to Bag"}
    </button>
  );
}
