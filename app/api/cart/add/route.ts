import { TAGS } from "lib/constants";
import { addToCart, createCart } from "lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type AddCartBody = {
  merchandiseId?: string;
  quantity?: number;
};

// posthog-js stores the anonymous distinct_id in a first-party cookie
// (`ph_<key>_posthog`). Stamping it onto the Shopify cart as an attribute lets
// the off-domain `orders/paid` webhook (app/api/shopify/order) attribute the
// purchase back to the same PostHog person. Read-only, best-effort.
function posthogCartAttributes(
  store: Awaited<ReturnType<typeof cookies>>,
): { key: string; value: string }[] | undefined {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return undefined;
  const raw = store.get(`ph_${key}_posthog`)?.value;
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    const distinctId = parsed?.distinct_id;
    if (typeof distinctId !== "string" || !distinctId) return undefined;
    return [{ key: "posthog_distinct_id", value: distinctId }];
  } catch {
    return undefined;
  }
}

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
    const attributes = posthogCartAttributes(store);
    const cart = cartId
      ? await addToCart(lines, cartId)
      : await createCart(lines, attributes);

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
      const attributes = posthogCartAttributes(await cookies());
      const cart = await createCart(lines, attributes);
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
