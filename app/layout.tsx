import { CartProvider } from "components/cart/cart-context";
import { MarketAnnounce } from "components/babanuj/layout/announce";
import { MarketUtility } from "components/babanuj/layout/utility";
import { MarketNav } from "components/babanuj/layout/nav";
import { MarketCatBar } from "components/babanuj/layout/cat-bar";
import { MarketFooter } from "components/babanuj/layout/footer";
import { MarketNewsletter } from "components/babanuj/layout/newsletter";
import { ThirdPartyScripts } from "components/babanuj/third-party";
import { DeferredToaster } from "components/babanuj/deferred-toaster";
import { getCart } from "lib/shopify";
import localFont from "next/font/local";
import { ReactNode } from "react";
import "./globals.css";
import { baseUrl } from "lib/utils";

const SITE_NAME = process.env.SITE_NAME ?? "Babanuj";
const logoFont = localFont({
  src: "../fonts/Inter-Bold.ttf",
  variable: "--font-logo",
  weight: "700",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_NAME} — Middle Eastern Sweets, Baklava & Maamoul Online`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Shop authentic Middle Eastern sweets online — baklava, maamoul, Turkish delight and Dubai chocolate from Türkish, Syrian and Gulf bakers. Shipped fresh from Houston. Free U.S. shipping over $70.",
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
      <body className={`market-root ${logoFont.variable}`}>
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
        </CartProvider>
      </body>
    </html>
  );
}
