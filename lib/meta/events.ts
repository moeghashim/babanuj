"use client";

import type { Cart } from "lib/shopify/types";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type MetaProductEvent = {
  id: string;
  name: string;
  brand?: string;
  price: number;
  quantity?: number;
};

type MetaEventPayload = {
  content_ids?: string[];
  content_name?: string;
  content_type?: "product" | "product_group";
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  currency?: string;
  num_items?: number;
  value?: number;
};

function eventId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}.${crypto.randomUUID()}`;
  }

  return `${prefix}.${Date.now()}.${Math.random().toString(16).slice(2)}`;
}

function contentId(id: string) {
  if (id.length <= 100) return id;

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }

  return `${id.slice(0, 87)}-${hash.toString(16)}`;
}

function browserTrack(
  eventName: string,
  payload: MetaEventPayload,
  dedupeId: string,
) {
  window.fbq?.("track", eventName, payload, { eventID: dedupeId });
}

function serverTrack(
  eventName: string,
  payload: MetaEventPayload,
  dedupeId: string,
) {
  const body = JSON.stringify({
    eventId: dedupeId,
    eventName,
    eventSourceUrl: window.location.href,
    payload,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/meta/capi", blob)) return;
  }

  void fetch("/api/meta/capi", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  });
}

function track(eventName: string, payload: MetaEventPayload, prefix: string) {
  if (!process.env.NEXT_PUBLIC_META_PIXEL_ID) return;

  const dedupeId = eventId(prefix);
  browserTrack(eventName, payload, dedupeId);
  serverTrack(eventName, payload, dedupeId);
}

export function trackViewContent(product: MetaProductEvent) {
  const id = contentId(product.id);

  track(
    "ViewContent",
    {
      content_ids: [id],
      content_name: product.name,
      content_type: "product",
      contents: [{ id, quantity: 1, item_price: product.price }],
      currency: "USD",
      value: product.price,
    },
    "vc",
  );
}

export function trackAddToCart(product: MetaProductEvent) {
  const id = contentId(product.id);
  const quantity = product.quantity ?? 1;

  track(
    "AddToCart",
    {
      content_ids: [id],
      content_name: product.name,
      content_type: "product",
      contents: [{ id, quantity, item_price: product.price }],
      currency: "USD",
      num_items: quantity,
      value: product.price * quantity,
    },
    "atc",
  );
}

export function trackInitiateCheckout(cart: Cart | undefined) {
  const lines = cart?.lines ?? [];
  const subtotal = Number(cart?.cost.totalAmount.amount ?? 0);

  track(
    "InitiateCheckout",
    {
      content_ids: lines.map((line) =>
        contentId(line.merchandise.product.handle),
      ),
      content_type: "product",
      contents: lines.map((line) => ({
        id: contentId(line.merchandise.product.handle),
        quantity: line.quantity,
        item_price:
          Number(line.cost.totalAmount.amount) / Math.max(line.quantity, 1),
      })),
      currency: cart?.cost.totalAmount.currencyCode ?? "USD",
      num_items: cart?.totalQuantity ?? 0,
      value: subtotal,
    },
    "ic",
  );
}
