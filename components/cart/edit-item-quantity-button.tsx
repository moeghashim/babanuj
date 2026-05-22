"use client";

import { MinusIcon, PlusIcon } from "components/babanuj/icons";
import { updateItemQuantity } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import type { CartItem } from "lib/shopify/types";
import { useState, useTransition } from "react";

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: (
    merchandiseId: string,
    updateType: "plus" | "minus" | "delete",
  ) => void;
}) {
  const { setCart } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };

  return (
    <form
      action={() => {
        startTransition(async () => {
          optimisticUpdate(payload.merchandiseId, type);
          const result = await updateItemQuantity(payload);

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
        aria-label={type === "plus" ? "Increase quantity" : "Reduce quantity"}
        disabled={isPending}
        style={{
          width: 28,
          height: 28,
          background: "transparent",
          border: 0,
          color: "var(--ink)",
          cursor: isPending ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isPending ? 0.45 : 1,
          padding: 0,
        }}
      >
        {type === "plus" ? (
          <PlusIcon width={12} height={12} />
        ) : (
          <MinusIcon width={12} height={12} />
        )}
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
