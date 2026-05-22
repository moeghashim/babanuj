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
  selectedVariantId: string | undefined,
  quantity: number = 1,
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  const lineQuantity = Math.max(1, Math.floor(quantity));
  const lines = [{ merchandiseId: selectedVariantId, quantity: lineQuantity }];

  try {
    const store = await cookies();
    const cartId = store.get("cartId")?.value;
    const cart = cartId
      ? await addToCart(lines, cartId)
      : await createCart(lines);

    if (!cartId) {
      store.set("cartId", cart.id!);
    }

    updateTag(TAGS.cart);
    return cart;
  } catch (e) {
    console.error("Error adding item to cart", e);
    // If the existing cart was stale (Shopify dropped it after checkout),
    // recreate and retry once. addToCart with no cart returns a non-200 or
    // throws; either way we want a fresh cart rather than a silent failure
    // that would revert the optimistic UI to 0.
    try {
      const fresh = await createCart(lines);
      (await cookies()).set("cartId", fresh.id!);
      updateTag(TAGS.cart);
      return fresh;
    } catch (retryError) {
      console.error("Error adding item to fresh cart", retryError);
      return "Error adding item to cart";
    }
  }
}

export async function removeItem(merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      const updatedCart = await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
      return updatedCart;
    } else {
      return cart;
    }
  } catch (e) {
    console.error("Error removing item from cart", e);
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      let updatedCart;
      if (quantity === 0) {
        updatedCart = await removeFromCart([lineItem.id]);
      } else {
        updatedCart = await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }

      updateTag(TAGS.cart);
      return updatedCart;
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      const updatedCart = await addToCart([{ merchandiseId, quantity }]);
      updateTag(TAGS.cart);
      return updatedCart;
    }

    updateTag(TAGS.cart);
    return cart;
  } catch (e) {
    console.error("Error updating item quantity", e);
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
