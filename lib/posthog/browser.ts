"use client";

type PostHogClient = typeof import("posthog-js").default;

let initPromise: Promise<PostHogClient | null> | null = null;

export function initPostHogBrowser(): Promise<PostHogClient | null> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return Promise.resolve(null);

  if (!initPromise) {
    initPromise = import("posthog-js").then(({ default: posthog }) => {
      const loaded = Boolean(
        (posthog as unknown as { __loaded?: boolean }).__loaded,
      );
      if (!loaded) {
        posthog.init(key, {
          api_host: "/ingest",
          ui_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com",
          capture_pageview: "history_change",
          capture_pageleave: true,
          person_profiles: "identified_only",
        });
      }
      return posthog;
    });
  }

  return initPromise;
}

export async function capturePostHog(
  eventName: string,
  payload: Record<string, unknown>,
) {
  const posthog = await initPostHogBrowser();
  posthog?.capture(eventName, payload);
}

export async function identifyPostHog(
  distinctId: string,
  properties: Record<string, unknown>,
) {
  const posthog = await initPostHogBrowser();
  posthog?.identify(distinctId, properties);
}
