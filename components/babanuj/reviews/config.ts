/**
 * Judge.me configuration, in a plain (non-"use client") module so both Server
 * Components (to hide review sections when unconfigured) and Client Components
 * (the loader + widget wrappers) can read the same values. A boolean exported
 * from a "use client" module would become a client reference and lose its real
 * value when imported on the server — hence this shared module.
 */

export const JUDGEME_SHOP_DOMAIN = process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN;
export const JUDGEME_PUBLIC_TOKEN = process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN;
export const JUDGEME_WIDGET_URL =
  process.env.NEXT_PUBLIC_JUDGEME_WIDGET_URL ??
  // Canonical cache-server host (Awesome plan). `cdn.judge.me/widget_preloader.js`
  // 308-redirects here, so we point straight at it to skip the hop.
  "https://cdnwidget.judge.me/widget_preloader.js";

/** True only when the public token + shop domain are configured. */
export const JUDGEME_ENABLED = Boolean(
  JUDGEME_SHOP_DOMAIN && JUDGEME_PUBLIC_TOKEN,
);
