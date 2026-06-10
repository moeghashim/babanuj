"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const CATS = [
  { label: "Shop All", href: "/search" },
  { label: "Baklava", href: "/collections/baklava" },
  { label: "Cookies & Maamoul", href: "/collections/cookies" },
  { label: "Turkish Delight", href: "/collections/turkish-delight" },
  { label: "Chocolate", href: "/collections/chocolate" },
  { label: "Gift Boxes", href: "/collections/gift-boxes" },
  { label: "Dates", href: "/collections/dates" },
  { label: "Coffee", href: "/collections/coffee" },
  { label: "Wholesale", href: "/#wholesale" },
];

// Highlight the item whose route we're on. Hash links (e.g. "#wholesale") have
// no route, so they never match. The path-boundary prefix keeps a collection
// active on any sub-path without a sibling like /collections/dates falsely
// matching /collections/dates-gift.
function isActiveHref(pathname: string, href: string): boolean {
  if (!href.startsWith("/")) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export function MarketCatBar() {
  const pathname = usePathname() || "";
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Center the active item within the horizontally-scrolling bar so its
  // highlight is visible even when it would otherwise sit off-screen on
  // mobile. Touches only the bar's own scrollLeft — never the page scroll.
  useEffect(() => {
    const nav = navRef.current;
    const active = activeRef.current;
    if (!nav || !active) return;
    const offsetWithinNav =
      active.getBoundingClientRect().left -
      nav.getBoundingClientRect().left +
      nav.scrollLeft;
    const target = offsetWithinNav - (nav.clientWidth - active.clientWidth) / 2;
    nav.scrollTo({ left: Math.max(0, target), behavior: "auto" });
  }, [pathname]);

  return (
    <nav ref={navRef} className="mk-catbar" aria-label="Product categories">
      {CATS.map((c) => {
        const active = isActiveHref(pathname, c.href);
        return (
          <Link
            key={c.label}
            ref={active ? activeRef : undefined}
            href={c.href}
            aria-current={active ? "page" : undefined}
            className={
              active ? "mk-catbar-link mk-catbar-link-active" : "mk-catbar-link"
            }
          >
            {c.label}
          </Link>
        );
      })}
    </nav>
  );
}
