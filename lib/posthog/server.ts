// Server-side PostHog capture — for events the browser SDK can't see, like the
// Shopify `orders/paid` webhook (checkout completes off-domain on Shopify).
// Reuses the public project key (write-only ingest key). Inert until configured.

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Ingestion host (NOT the dashboard `ui_host`). US cloud by default; override
// with POSTHOG_HOST=https://eu.i.posthog.com for an EU project.
const HOST = process.env.POSTHOG_HOST ?? "https://us.i.posthog.com";

type CaptureParams = {
  event: string;
  distinctId: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
};

/** Send a single event to PostHog from the server. Returns false on no-op/failure. */
export async function capturePosthogServer(
  params: CaptureParams,
): Promise<boolean> {
  if (!KEY || !params.distinctId) return false;

  try {
    const res = await fetch(`${HOST}/capture/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        api_key: KEY,
        event: params.event,
        distinct_id: params.distinctId,
        properties: params.properties ?? {},
        timestamp: params.timestamp ?? new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      console.error(
        "PostHog server capture failed",
        res.status,
        await res.text().catch(() => ""),
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("PostHog server capture error", err);
    return false;
  }
}
