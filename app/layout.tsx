import { CartProvider } from "components/cart/cart-context";
import { MarketAnnounce } from "components/babanuj/layout/announce";
import { MarketUtility } from "components/babanuj/layout/utility";
import { MarketNav } from "components/babanuj/layout/nav";
import { MarketCatBar } from "components/babanuj/layout/cat-bar";
import { MarketFooter } from "components/babanuj/layout/footer";
import { MarketNewsletter } from "components/babanuj/layout/newsletter";
import { ThirdPartyScripts } from "components/babanuj/third-party";
import { getCart } from "lib/shopify";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

const SITE_NAME = process.env.SITE_NAME ?? "Babanuj";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap"
        />
      </head>
      <body className="market-root">
        <CartProvider cartPromise={cart}>
          <MarketAnnounce />
          <MarketUtility />
          <MarketNav />
          <MarketCatBar />
          <main>{children}</main>
          <MarketNewsletter />
          <MarketFooter />
          <Toaster closeButton />
          <ThirdPartyScripts />
        </CartProvider>
      </body>
    </html>
  );
}
