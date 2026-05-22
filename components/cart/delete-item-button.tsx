"use client";

import { CloseIcon } from "components/babanuj/icons";
import { removeItem } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import type { CartItem } from "lib/shopify/types";
import { useState, useTransition } from "react";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: (
    merchandiseId: string,
    updateType: "plus" | "minus" | "delete",
  ) => void;
}) {
  const { setCart } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const merchandiseId = item.merchandise.id;

  return (
    <form
      action={() => {
        startTransition(async () => {
          optimisticUpdate(merchandiseId, "delete");
          const result = await removeItem(merchandiseId);

          if (typeof result === "string") {
            setMessage(result);
            return;
          }

          setMessage(null);
          setCart(result);
        });
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        disabled={isPending}
        style={{
          width: 22,
          height: 22,
          background: "rgba(255,255,255,0.9)",
          border: 0,
          borderRadius: 999,
          cursor: isPending ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ink)",
          opacity: isPending ? 0.45 : 1,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        <CloseIcon width={12} height={12} />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
