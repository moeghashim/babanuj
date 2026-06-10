import Link from "next/link";
import { supportMailto, wholesaleMailto } from "lib/babanuj/contact";
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
      { label: "Request Catalog", href: wholesaleMailto() },
      { label: "Become a Partner", href: "/#wholesale" },
      {
        label: "Private Label",
        href: wholesaleMailto("Private label inquiry"),
      },
      { label: "Foodservice", href: wholesaleMailto("Foodservice inquiry") },
    ],
  },
  {
    h: "Help",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/policies/refund-policy" },
      { label: "Support", href: supportMailto() },
    ],
  },
];

export function MarketFooter() {
  const currentYear = new Date().getFullYear();

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
                    "var(--font-bricolage, ui-sans-serif), sans-serif",
                  fontWeight: 800,
                  fontSize: 32,
                  letterSpacing: "-0.02em",
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
              <span
                key={s}
                aria-label={`${s} social profile not linked yet`}
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
                  opacity: 0.65,
                }}
              >
                {s}
              </span>
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
            <Link href="/search" style={{ fontSize: 13.5, opacity: 0.75 }}>
              Shop all brands
            </Link>
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
              {col.items.map((item) => (
                <FooterLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                />
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
        <span>
          © {currentYear} Babanuj Inc. · 10099 Westpark Dr, Houston TX 77042
        </span>
        <div style={{ display: "flex", gap: 18 }}>
          <Link href="/reviews">Reviews</Link>
          <Link href="/policies/privacy-policy">Privacy</Link>
          <Link href="/policies/terms-of-service">Terms</Link>
          <a href={supportMailto("Accessibility support")}>Accessibility</a>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const style = { fontSize: 13.5, opacity: 0.75 };
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} style={style}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} style={style}>
      {label}
    </Link>
  );
}
