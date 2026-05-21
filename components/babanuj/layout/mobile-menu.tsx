"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, MenuIcon } from "components/babanuj/icons";
import { BRANDS } from "lib/babanuj/data";
import { useMountEffect } from "lib/use-mount-effect";

const CATEGORIES = [
  { label: "Shop All", href: "/search" },
  { label: "Baklava", href: "/collections/baklava" },
  { label: "Cookies & Maamoul", href: "/collections/cookies" },
  { label: "Turkish Delight", href: "/collections/turkish-delight" },
  { label: "Chocolate", href: "/collections/chocolate" },
  { label: "Gift Boxes", href: "/collections/gift-boxes" },
  { label: "Dates", href: "/collections/dates" },
  { label: "Coffee", href: "/collections/coffee" },
];

const UTILITY = [
  { label: "Gift Cards", href: "#" },
  { label: "Become a Partner", href: "#wholesale" },
  { label: "Refer a Friend · Get $20", href: "#" },
  { label: "Track Order", href: "#" },
  { label: "Help", href: "#" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render the portal client-side.
  useMountEffect(() => {
    setMounted(true);
  });

  // Lock body scroll when open.
  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  const drawer = (
    <>
      {/* Scrim */}
      <div
        onClick={close}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20,16,12,0.55)",
          zIndex: 100,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .2s ease",
        }}
      />

      {/* Drawer (slides from left) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : "-100%",
          height: "100vh",
          width: 360,
          maxWidth: "92vw",
          background: "#fff",
          color: "var(--ink)",
          zIndex: 101,
          transition: "left 320ms cubic-bezier(.2,.7,.3,1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "20px 0 50px rgba(0,0,0,0.15)",
          overflowY: "auto",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          <Link
            href="/"
            onClick={close}
            style={{
              fontFamily: "var(--font-logo), var(--font-bricolage), sans-serif",
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 0,
              color: "#000",
              textDecoration: "none",
            }}
          >
            babanuj
          </Link>
          <button
            onClick={close}
            aria-label="Close menu"
            style={{
              background: "transparent",
              border: 0,
              cursor: "pointer",
              color: "var(--ink)",
              padding: 8,
            }}
          >
            <CloseIcon width={22} height={22} />
          </button>
        </header>

        <nav style={{ padding: "8px 12px 24px", flex: 1 }}>
          <Section label="Shop">
            {CATEGORIES.map((c) => (
              <DrawerLink key={c.label} href={c.href} onSelect={close}>
                {c.label}
              </DrawerLink>
            ))}
          </Section>

          <Section label="Brands">
            {BRANDS.map((b) => (
              <DrawerLink key={b.id} href={`/brand/${b.id}`} onSelect={close}>
                {b.name}
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 11,
                    color: "var(--ink-2)",
                    fontWeight: 400,
                  }}
                >
                  · {b.origin}
                </span>
              </DrawerLink>
            ))}
          </Section>

          <Section label="More">
            {UTILITY.map((u) => (
              <DrawerLink key={u.label} href={u.href} onSelect={close}>
                {u.label}
              </DrawerLink>
            ))}
          </Section>
        </nav>

        <footer
          style={{
            padding: "18px 24px",
            borderTop: "1px solid var(--rule)",
            display: "flex",
            gap: 10,
          }}
        >
          <a
            href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "babanuj.myshopify.com"}/account/login`}
            onClick={close}
            className="market-btn"
            style={{
              flex: 1,
              justifyContent: "center",
              padding: "12px",
              fontSize: 13,
            }}
          >
            Sign in
          </a>
        </footer>
      </aside>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mk-hamburger"
        aria-label="Open menu"
        aria-expanded={open}
        style={{
          background: "transparent",
          border: 0,
          cursor: "pointer",
          color: "#000",
          padding: 6,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MenuIcon width={22} height={22} />
      </button>
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 14 }}>
      <div
        className="micro"
        style={{
          padding: "10px 12px 6px",
          color: "var(--ink-2)",
          fontSize: 10.5,
        }}
      >
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function DrawerLink({
  href,
  onSelect,
  children,
}: {
  href: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      style={{
        display: "block",
        padding: "11px 12px",
        fontSize: 15,
        fontWeight: 600,
        color: "var(--ink)",
        textDecoration: "none",
        borderRadius: 10,
      }}
    >
      {children}
    </Link>
  );
}
