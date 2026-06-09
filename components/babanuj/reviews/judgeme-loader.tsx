"use client";

import Script from "next/script";
import {
  JUDGEME_ENABLED,
  JUDGEME_PUBLIC_TOKEN,
  JUDGEME_SHOP_DOMAIN,
  JUDGEME_WIDGET_URL,
} from "./config";

/**
 * Judge.me platform-independent widget loader.
 *
 * We deliberately do NOT use `@judgeme/shopify-hydrogen` — it hard-depends on
 * `@shopify/hydrogen` and targets React 18, neither of which fits this Next.js
 * 15 / React 19 app. Instead we use Judge.me's documented "platform-independent
 * widgets" path: set the `window.jdgm` settings, load the widget preloader, and
 * sprinkle `.jdgm-widget` divs (see ./judgeme-widgets.tsx) which the preloader
 * hydrates client-side. This keeps the full Judge.me feature set — review
 * display, write-a-review, photo uploads, verified-buyer badges, moderation,
 * and review-request emails — without us rebuilding any of it.
 *
 * Requires the Judge.me **Awesome** plan with products synced from Shopify.
 *
 * SETUP: paste the exact snippet from Judge.me Admin → Settings → Advanced →
 * "Platform-independent Review Widget" and confirm it matches the globals +
 * script src below. The values are driven by env vars so nothing is hardcoded:
 *   NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN   e.g. babanuj.myshopify.com
 *   NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN  public token (safe in the browser)
 *   NEXT_PUBLIC_JUDGEME_WIDGET_URL    optional override for the preloader src
 *
 * Like the other third-party loaders, this renders nothing until configured,
 * so local dev without Judge.me creds stays clean.
 */

/**
 * Re-run Judge.me's DOM scan. The preloader scans for `.jdgm-widget` elements
 * once on load; App Router soft-navigation doesn't re-trigger that, so widget
 * wrappers call this on mount. No-op before the script has loaded (the
 * preloader's own onload scan covers the first paint) and if the global name
 * differs in your account's snippet — confirm it in the Preview smoke test.
 */
export function refreshJudgemeWidgets() {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    jdgmSetup?: () => void;
    jdgm?: { batchSetup?: () => void };
  };
  if (typeof w.jdgmSetup === "function") w.jdgmSetup();
  else if (typeof w.jdgm?.batchSetup === "function") w.jdgm.batchSetup();
}

export function JudgemeLoader() {
  if (!JUDGEME_ENABLED) return null;

  return (
    <>
      <Script id="judgeme-settings" strategy="afterInteractive">
        {`window.jdgm = window.jdgm || {};
jdgm.SHOP_DOMAIN = ${JSON.stringify(JUDGEME_SHOP_DOMAIN)};
jdgm.PLATFORM = 'shopify';
jdgm.PUBLIC_TOKEN = ${JSON.stringify(JUDGEME_PUBLIC_TOKEN)};`}
      </Script>
      <Script
        id="judgeme-widgets"
        src={JUDGEME_WIDGET_URL}
        data-id={JUDGEME_PUBLIC_TOKEN}
        strategy="afterInteractive"
      />
    </>
  );
}
