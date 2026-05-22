import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const GRAPH_VERSION = "v23.0";

type CapiRequest = {
  eventId?: string;
  eventName?: string;
  eventSourceUrl?: string;
  payload?: Record<string, unknown>;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
};

const allowedEvents = new Set([
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "AddPaymentInfo",
  "Purchase",
]);

function cookieValue(request: NextRequest, name: string) {
  return request.cookies.get(name)?.value;
}

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase();
}

function normalizePhone(value: string | undefined) {
  return value?.replace(/\D/g, "");
}

function hash(value: string | undefined) {
  const normalized = normalize(value);
  if (!normalized) return undefined;
  return createHash("sha256").update(normalized).digest("hex");
}

function hashPhone(value: string | undefined) {
  const normalized = normalizePhone(value);
  if (!normalized) return undefined;
  return createHash("sha256").update(normalized).digest("hex");
}

function hashedUserData(userData: CapiRequest["userData"]) {
  if (!userData) return {};

  return withoutUndefined({
    em: hash(userData.email),
    ph: hashPhone(userData.phone),
    fn: hash(userData.firstName),
    ln: hash(userData.lastName),
    ct: hash(userData.city),
    st: hash(userData.state),
    zp: hash(userData.zip),
    country: hash(userData.country),
  });
}

function withoutUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as Partial<T>;
}

export async function POST(request: NextRequest) {
  const pixelId =
    process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return new Response(null, { status: 204 });
  }

  const body = (await request.json().catch(() => null)) as CapiRequest | null;
  if (!body?.eventName || !body.eventId || !allowedEvents.has(body.eventName)) {
    return NextResponse.json(
      { ok: false, error: "Invalid Meta CAPI event" },
      { status: 400 },
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIpAddress = forwardedFor?.split(",")[0]?.trim();
  const clientUserAgent = request.headers.get("user-agent") ?? undefined;

  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            action_source: "website",
            event_id: body.eventId,
            event_name: body.eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: body.eventSourceUrl,
            custom_data: body.payload ?? {},
            user_data: withoutUndefined({
              client_ip_address: clientIpAddress,
              client_user_agent: clientUserAgent,
              fbc: cookieValue(request, "_fbc"),
              fbp: cookieValue(request, "_fbp"),
              ...hashedUserData(body.userData),
            }),
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Meta CAPI request failed", {
      status: response.status,
      error,
    });
    return new Response(null, { status: 204 });
  }

  return NextResponse.json({ ok: true });
}
