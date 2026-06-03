import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { capturePosthogServer } from "lib/posthog/server";

// Shopify `orders/paid` webhook → PostHog "Order Completed" (revenue + products).
// Closes the funnel: checkout completes off-domain on Shopify, so the browser SDK
// never sees the purchase. We attribute it back to the same PostHog person via the
// `posthog_distinct_id` cart attribute stamped at /api/cart/add.
//
// Register in Shopify (Settings → Notifications → Webhooks, or Admin API):
//   topic: orders/paid   →   https://www.babanuj.com/api/shopify/order
// Put the webhook's signing secret in SHOPIFY_WEBHOOK_SECRET. Inert until then.

type ShopifyLineItem = {
  product_id?: number | string;
  title?: string;
  quantity?: number;
  price?: string;
};

type ShopifyOrder = {
  id?: number | string;
  order_number?: number;
  total_price?: string;
  currency?: string;
  email?: string;
  customer?: { id?: number | string; email?: string };
  note_attributes?: { name?: string; value?: string }[];
  line_items?: ShopifyLineItem[];
  created_at?: string;
};

function verifyHmac(rawBody: string, header: string | null, secret: string) {
  if (!header) return false;
  const digest = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");
  const a = Buffer.from(digest);
  const b = Buffer.from(header);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  // Not configured yet → accept silently so Shopify doesn't retry/disable it.
  if (!secret) return new Response(null, { status: 204 });

  const raw = await request.text();
  if (!verifyHmac(raw, request.headers.get("x-shopify-hmac-sha256"), secret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let order: ShopifyOrder;
  try {
    order = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const orderId = String(order.id ?? order.order_number ?? "");
  const phAttr = (order.note_attributes ?? []).find(
    (a) => a?.name === "posthog_distinct_id",
  )?.value;
  // Prefer the PostHog person from the cart; fall back to email, then order id,
  // so the event always records even when the attribute is absent.
  const distinctId =
    phAttr ||
    (order.customer?.email || order.email || "").toLowerCase() ||
    `shopify_order_${orderId}`;

  const value = Number(order.total_price ?? 0);
  const products = (order.line_items ?? []).map((li) => ({
    product_id: String(li.product_id ?? ""),
    name: li.title,
    price: Number(li.price ?? 0),
    quantity: li.quantity ?? 1,
  }));

  await capturePosthogServer({
    event: "Order Completed",
    distinctId,
    timestamp: order.created_at,
    properties: {
      order_id: orderId,
      value,
      revenue: value,
      currency: order.currency ?? "USD",
      num_items: products.reduce((n, p) => n + (p.quantity ?? 0), 0),
      products,
      // Dedupe Shopify webhook retries so revenue isn't double-counted.
      $insert_id: `shopify_order_${orderId}`,
    },
  });

  // Ack regardless of capture outcome (failures are logged) so Shopify is happy.
  return NextResponse.json({ ok: true });
}
