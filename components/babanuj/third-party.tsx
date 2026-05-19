import Script from "next/script";

/**
 * Embed loaders for third-party tools — each renders ONLY when its env
 * var is set, so the bundle stays clean until you actually configure
 * the tool. All values are `NEXT_PUBLIC_` so they're available to the
 * client without round-trips.
 */
export function ThirdPartyScripts() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const smileShopId = process.env.NEXT_PUBLIC_SMILE_SHOP_ID;
  const inboxShopId = process.env.NEXT_PUBLIC_SHOPIFY_INBOX_SHOP_ID;

  return (
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

      {/* Smile.io loyalty + referrals. The loader exposes the
          `window.SmileUI` singleton; we call `initialize()` with the
          publishable key once it's available (the event may fire either
          before or after our listener registers). */}
      {smileShopId && (
        <>
          <Script id="smile-init" strategy="lazyOnload">
            {`
              (function () {
                var tries = 0;
                var iv = setInterval(function () {
                  if (window.SmileUI && typeof window.SmileUI.initialize === 'function') {
                    window.SmileUI.initialize({ publishableKey: '${smileShopId}' });
                    clearInterval(iv);
                  } else if (++tries > 100) {
                    clearInterval(iv);
                  }
                }, 100);
              })();
            `}
          </Script>
          <Script
            id="smile-loader"
            src="https://js.smile.io/v1/smile-ui.js"
            strategy="lazyOnload"
            defer
          />
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
  );
}
