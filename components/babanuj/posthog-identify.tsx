"use client";

import posthog from "posthog-js";
import { useMountEffect } from "lib/use-mount-effect";

const isLoaded = () =>
  Boolean((posthog as unknown as { __loaded?: boolean }).__loaded);

/**
 * Promotes the current anonymous PostHog person to an identified customer once
 * they're signed in — so replays, the funnel, and (via the order webhook)
 * revenue all tie to one stable customer profile across sessions.
 *
 * Rendered on the account page from customer data. Inert until PostHog is
 * configured. Polls briefly because the SDK may still be initializing (the
 * provider's mount effect runs after this leaf's).
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

    let tries = 0;
    let timer = 0;
    const attempt = () => {
      if (isLoaded()) {
        posthog.identify(distinctId, {
          ...(email ? { email } : {}),
          ...(name ? { name } : {}),
        });
      } else if (++tries < 20) {
        timer = window.setTimeout(attempt, 150);
      }
    };
    attempt();

    return () => window.clearTimeout(timer);
  });

  return null;
}
