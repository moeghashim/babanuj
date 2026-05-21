import Link from "next/link";
import { BRANDS } from "lib/babanuj/data";

const SHOP_LINKS = [
  { label: "All Sweets", href: "/search" },
  { label: "Bestsellers", href: "/search" },
  { label: "Baklava", href: "/collections/baklava" },
  { label: "Chocolate", href: "/collections/chocolate" },
  { label: "Cookies", href: "/collections/cookies" },
  { label: "Gift Boxes", href: "/collections/gift-boxes" },
];

const COLS = [
  {
    h: "Wholesale",
    items: [
      "Request Catalog",
      "Become a Partner",
      "Private Label",
      "Foodservice",
    ],
  },
  {
    h: "Help",
    items: ["Contact", "Shipping", "Returns", "FAQ", "Recipes"],
  },
];

export function MarketFooter() {
  return (
    <footer
      style={{
        background: "var(--accent-dark)",
        color: "#fff",
        padding: "64px 56px 32px",
      }}
    >
      <div
        className="mk-foot"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
          gap: 32,
          paddingBottom: 48,
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
              <span
                className="display-heavy"
                style={{
                  fontFamily:
                    "var(--font-logo), var(--font-bricolage), sans-serif",
                  fontWeight: 700,
                  fontSize: 32,
                  letterSpacing: 0,
                  color: "#fff",
                }}
              >
                babanuj
              </span>
            </Link>
          </div>
          <p
            style={{
              fontSize: 13.5,
              opacity: 0.7,
              lineHeight: 1.65,
              maxWidth: 320,
            }}
          >
            Curated sweets from the Middle East and Türkiye — shipped fresh from
            Houston to your door.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            {["IG", "TT", "PIN", "LI"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div
            className="micro"
            style={{ color: "var(--cream)", marginBottom: 16 }}
          >
            Shop
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SHOP_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                style={{ fontSize: 13.5, opacity: 0.75 }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div
            className="micro"
            style={{ color: "var(--cream)", marginBottom: 16 }}
          >
            Brands
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {BRANDS.map((b) => (
              <Link
                key={b.id}
                href={`/brand/${b.id}`}
                style={{ fontSize: 13.5, opacity: 0.75 }}
              >
                {b.name}
              </Link>
            ))}
            <a href="#" style={{ fontSize: 13.5, opacity: 0.75 }}>
              All 32 brands
            </a>
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.h}>
            <div
              className="micro"
              style={{ color: "var(--cream)", marginBottom: 16 }}
            >
              {col.h}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.items.map((i) => (
                <a key={i} href="#" style={{ fontSize: 13.5, opacity: 0.75 }}>
                  {i}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mk-foot-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 22,
          fontSize: 12,
          opacity: 0.6,
        }}
      >
        <span>© 2026 Babanuj Inc. · 10099 Westpark Dr, Houston TX 77042</span>
        <div style={{ display: "flex", gap: 18 }}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
