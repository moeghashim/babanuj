"use client";

import { identifyPostHog } from "lib/posthog/browser";
import { useMountEffect } from "lib/use-mount-effect";

/**
 * Promotes the current anonymous PostHog person to an identified customer once
 * they're signed in — so replays, the funnel, and (via the order webhook)
 * revenue all tie to one stable customer profile across sessions.
 *
 * Rendered on the account page from customer data. Inert until PostHog is set.
 */
export function PostHogIdentify({
  distinctId,
  email,
  name,
}: {
  distinctId: string;
  email?: string | null;
  name?: string | null;
}) {
  useMountEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !distinctId) return;

    void identifyPostHog(distinctId, {
      ...(email ? { email } : {}),
      ...(name ? { name } : {}),
    });
  });

  return null;
}
