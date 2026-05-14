"use client";

import { MinusIcon, PlusIcon } from "components/babanuj/icons";
import { updateItemQuantity } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { useActionState } from "react";

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: (merchandiseId: string, updateType: "plus" | "minus" | "delete") => void;
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        updateItemQuantityAction();
      }}
    >
      <button
        type="submit"
        aria-label={
          type === "plus" ? "Increase quantity" : "Reduce quantity"
        }
        style={{
          width: 28,
          height: 28,
          background: "transparent",
          border: 0,
          color: "var(--ink)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
