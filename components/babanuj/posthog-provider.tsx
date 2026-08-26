"use client";

import { ReactNode } from "react";
import { initPostHogBrowser } from "lib/posthog/browser";
import { useMountEffect } from "lib/use-mount-effect";

/**
 * Initializes the PostHog browser SDK after interaction or a short delay.
 *
 * Renders inertly until `NEXT_PUBLIC_POSTHOG_KEY` is set — same env-gated
 * pattern as the other third-party tools.
 *
 * Traffic is sent through the `/ingest` reverse proxy (see `next.config.ts`)
 * so ad/tracker blockers don't drop events on the storefront.
 */
export function PostHogProvider({ children }: { children: ReactNode }) {
  useMountEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    const load = () => {
      void initPostHogBrowser();
    };
    const timeout = window.setTimeout(load, 6500);
    window.addEventListener("pointerdown", load, { once: true, passive: true });
    window.addEventListener("keydown", load, { once: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
    };
  });

  return <>{children}</>;
}
