import { CartProvider } from "components/cart/cart-context";
import { MarketAnnounce } from "components/babanuj/layout/announce";
import { MarketUtility } from "components/babanuj/layout/utility";
import { MarketNav } from "components/babanuj/layout/nav";
import { MarketCatBar } from "components/babanuj/layout/cat-bar";
import { MarketFooter } from "components/babanuj/layout/footer";
import { MarketNewsletter } from "components/babanuj/layout/newsletter";
import { ThirdPartyScripts } from "components/babanuj/third-party";
import { JudgemeLoader } from "components/babanuj/reviews/judgeme-loader";
import { PostHogProvider } from "components/babanuj/posthog-provider";
import { DeferredToaster } from "components/babanuj/deferred-toaster";
import { getCart } from "lib/shopify";
import { ReactNode } from "react";
import "./globals.css";
import { baseUrl } from "lib/utils";
import { openGraph } from "lib/babanuj/seo";

const SITE_NAME = process.env.SITE_NAME ?? "Babanuj";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_NAME} — Middle Eastern Sweets, Baklava & Maamoul Online`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Shop Middle Eastern sweets online: baklava, maamoul, Turkish delight, Dubai chocolate, dates, honey, coffee, and gift boxes shipped fresh from Houston.",
  openGraph: openGraph({
    title: `${SITE_NAME} — Middle Eastern Sweets, Baklava & Maamoul Online`,
    description:
      "Shop Middle Eastern sweets online: baklava, maamoul, Turkish delight, Dubai chocolate, dates, honey, coffee, and gift boxes shipped fresh from Houston.",
    url: "/",
  }),
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider.
  // If Shopify rejects (stale cart id, schema mismatch, etc.) treat it as
  // an empty cart rather than crashing the whole page.
  const cart = getCart().catch(() => undefined);

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/marketplace/bricolage-grotesque-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/marketplace/dm-sans-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/marketplace/dm-serif-display-latin-italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="market-root">
        <PostHogProvider>
          <CartProvider cartPromise={cart}>
            <MarketAnnounce />
            <MarketUtility />
            <MarketNav />
            <MarketCatBar />
            <main>{children}</main>
            <MarketNewsletter />
            <MarketFooter />
            <DeferredToaster />
            <ThirdPartyScripts />
            <JudgemeLoader />
          </CartProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
