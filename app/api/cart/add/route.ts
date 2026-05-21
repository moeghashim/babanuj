import { TAGS } from "lib/constants";
import { addToCart, createCart } from "lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type AddCartBody = {
  merchandiseId?: string;
  quantity?: number;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as AddCartBody;
  const { merchandiseId } = body;

  if (!merchandiseId) {
    return NextResponse.json(
      { error: "Missing merchandiseId" },
      { status: 400 },
    );
  }

  const quantity = Math.max(1, Math.floor(body.quantity ?? 1));
  const lines = [{ merchandiseId, quantity }];

  try {
    const store = await cookies();
    const cartId = store.get("cartId")?.value;
    const cart = cartId
      ? await addToCart(lines, cartId)
      : await createCart(lines);

    revalidateTag(TAGS.cart, "seconds");

    const response = NextResponse.json({ cart });
    if (!cartId && cart.id) {
      response.cookies.set("cartId", cart.id, {
        path: "/",
        sameSite: "lax",
      });
    }
    return response;
  } catch (error) {
    console.error("Error adding item to cart", error);

    try {
      const cart = await createCart(lines);
      revalidateTag(TAGS.cart, "seconds");

      const response = NextResponse.json({ cart });
      if (cart.id) {
        response.cookies.set("cartId", cart.id, {
          path: "/",
          sameSite: "lax",
        });
      }
      return response;
    } catch (retryError) {
      console.error("Error adding item to fresh cart", retryError);
      return NextResponse.json(
        { error: "Error adding item to cart" },
        { status: 500 },
      );
    }
  }
}
