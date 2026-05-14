"use client";

import { PlusIcon, CartIcon } from "components/babanuj/icons";
import { useCart } from "components/cart/cart-context";
import { addItem } from "components/cart/actions";
import type { BabanujProduct } from "lib/babanuj/data";
import { toShopifyProduct } from "lib/babanuj/shopify-bridge";
import { useActionState, type CSSProperties } from "react";

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
  const { addCartItem } = useCart();
  const shopifyProduct = toShopifyProduct(product);
  const firstVariant = shopifyProduct.variants[0]!;
  const [, formAction] = useActionState(addItem, null);
  const submit = formAction.bind(null, firstVariant.id);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    for (let i = 0; i < quantity; i++) {
      addCartItem(firstVariant, shopifyProduct);
      await submit();
    }
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
