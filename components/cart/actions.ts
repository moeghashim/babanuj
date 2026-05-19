"use server";

import { TAGS } from "lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    await ensureCart();
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
  } catch (e) {
    // If the existing cart was stale (Shopify dropped it after checkout),
    // recreate and retry once. addToCart with no cart returns a non-200 or
    // throws; either way we want a fresh cart rather than a silent failure
    // that would revert the optimistic UI to 0.
    try {
      const fresh = await createCart();
      (await cookies()).set("cartId", fresh.id!);
      await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
      updateTag(TAGS.cart);
    } catch {
      return "Error adding item to cart";
    }
  }
}

async function ensureCart() {
  const store = await cookies();
  if (store.get("cartId")?.value) return;
  const fresh = await createCart();
  store.set("cartId", fresh.id!);
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    updateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  const url = cart?.checkoutUrl;
  // When Shopify isn't wired, fall back to the home page rather than 404.
  if (!url || url === "/checkout") {
    redirect("/");
  }
  redirect(url);
}

