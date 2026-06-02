"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { ReactNode } from "react";
import { useMountEffect } from "lib/use-mount-effect";

// Guards against a second init from React StrictMode double-invoking the
// mount effect in dev. The layout never remounts in prod, so this fires once.
let initialized = false;

/**
 * Initializes the PostHog browser SDK and exposes it to the tree via context
 * (so client components can read `usePostHog()` / feature-flag hooks).
 *
 * Renders inertly until `NEXT_PUBLIC_POSTHOG_KEY` is set — same env-gated
 * pattern as the other third-party tools, so the SDK only phones home once
 * the project is actually configured.
 *
 * Traffic is sent through the `/ingest` reverse proxy (see `next.config.ts`)
 * so ad/tracker blockers don't drop events on the storefront.
 */
export function PostHogProvider({ children }: { children: ReactNode }) {
  useMountEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || initialized) return;
    initialized = true;

    posthog.init(key, {
      // First-party proxy — keeps events off the easily-blocked *.posthog.com
      // hosts. `ui_host` is only used to build links back to the dashboard.
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com",
      // Auto-capture the initial load and every App Router client navigation
      // via the History API — no per-route effect needed.
      capture_pageview: "history_change",
      capture_pageleave: true,
      // Don't mint a person profile for every anonymous shopper (checkout is
      // off-domain, so we never identify here). Events still record + funnel.
      person_profiles: "identified_only",
    });
  });

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
