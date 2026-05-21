"use client";

import Script from "next/script";
import { useState } from "react";
import { useMountEffect } from "lib/use-mount-effect";
import { MetaPixel } from "components/babanuj/meta-pixel";

/**
 * Embed loaders for third-party tools — each renders ONLY when its env
 * var is set, so the bundle stays clean until you actually configure
 * the tool. All values are `NEXT_PUBLIC_` so they're available to the
 * client without round-trips.
 */
export function ThirdPartyScripts() {
  const [canLoad, setCanLoad] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const inboxShopId = process.env.NEXT_PUBLIC_SHOPIFY_INBOX_SHOP_ID;

  useMountEffect(() => {
    const load = () => setCanLoad(true);
    const timeout = window.setTimeout(load, 6500);
    window.addEventListener("pointerdown", load, { once: true, passive: true });
    window.addEventListener("keydown", load, { once: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
    };
  });

  return (
    <>
      {metaPixelId && <MetaPixel pixelId={metaPixelId} />}

      {!canLoad ? null : (
        <>
          {/* Google Analytics 4 (gtag.js) */}
          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="lazyOnload"
              />
              <Script id="ga4-init" strategy="lazyOnload">
                {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
              </Script>
            </>
          )}

          {/* Shopify Inbox chat */}
          {inboxShopId && (
            <Script
              id="shopify-inbox"
              src={`https://cdn.shopify.com/shopifycloud/portable-wallets/latest/portable-wallets.iife.js?shop_id=${inboxShopId}`}
              strategy="lazyOnload"
              defer
            />
          )}
        </>
      )}
    </>
  );
}
