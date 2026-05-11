import { BabanujLogo } from "components/babanuj/brand-logo";
import CartModal from "components/cart/modal";
import { navItems } from "lib/babanuj/data";
import { isShopifyConfigured } from "lib/shopify";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";

export async function Navbar() {
  const commerceEnabled = isShopifyConfigured();

  return (
    <header className="sticky top-0 z-40 border-b border-[#d8d2c6] bg-[#fbfaf6]/95 backdrop-blur">
      <div className="bg-[#294621] px-5 py-2 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-hidden text-[11px] font-semibold md:text-xs">
          <span className="min-w-0 truncate">
            Importing curated Middle Eastern & Turkish food brands into the USA.
          </span>
          <span className="hidden sm:inline">Proudly based in the USA 🇺🇸</span>
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Suspense fallback={null}>
            <MobileMenu menu={navItems} />
          </Suspense>
          <Link
            href="/"
            prefetch={true}
            className="flex min-w-0 items-center"
            aria-label="Babanuj home"
          >
            <BabanujLogo compact />
          </Link>
        </div>
        <ul className="hidden items-center gap-6 text-sm font-bold lg:flex">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.path}
                prefetch={true}
                className="text-[#1e211b] underline-offset-4 hover:text-[#294621] hover:underline"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-end gap-2">
          <Link
            href="/brands"
            className="hidden h-11 items-center justify-center rounded-md border border-[#a9a291] bg-white px-5 text-sm font-bold text-[#1d2419] transition hover:border-[#294621] md:inline-flex"
          >
            Browse Brands
          </Link>
          <Link
            href="/wholesale-catalog"
            className="hidden h-11 items-center justify-center rounded-md bg-[#294621] px-5 text-sm font-bold text-white transition hover:bg-[#203719] md:inline-flex"
          >
            Request Wholesale Catalog
          </Link>
          {commerceEnabled ? <CartModal enabled={commerceEnabled} /> : null}
        </div>
      </nav>
    </header>
  );
}
