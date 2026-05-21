"use client";

import Script from "next/script";
import { useMountEffect } from "lib/use-mount-effect";

export function MetaPixel({ pixelId }: { pixelId: string }) {
  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
        `}
      </Script>
      <MetaPageViewTracker />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

function MetaPageViewTracker() {
  useMountEffect(() => {
    let previousUrl = window.location.href;

    const firePageView = () => {
      let tries = 0;
      const interval = window.setInterval(() => {
        if (window.fbq) {
          window.fbq("track", "PageView");
          window.clearInterval(interval);
        } else if (++tries > 30) {
          window.clearInterval(interval);
        }
      }, 100);
    };

    const fireIfUrlChanged = () => {
      window.setTimeout(() => {
        if (window.location.href === previousUrl) return;
        previousUrl = window.location.href;
        firePageView();
      }, 0);
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function patchedPushState(...args) {
      const result = originalPushState.apply(this, args);
      fireIfUrlChanged();
      return result;
    };

    window.history.replaceState = function patchedReplaceState(...args) {
      const result = originalReplaceState.apply(this, args);
      fireIfUrlChanged();
      return result;
    };

    firePageView();
    window.addEventListener("popstate", fireIfUrlChanged);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", fireIfUrlChanged);
    };
  });

  return null;
}
