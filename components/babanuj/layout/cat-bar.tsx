import Link from "next/link";

const CATS = [
  { label: "Shop All", href: "/search" },
  { label: "Baklava", href: "/search/baklava" },
  { label: "Chocolate", href: "/search/chocolate" },
  { label: "Cookies", href: "/search/cookies" },
  { label: "Turkish Delight", href: "/search/turkish-delight" },
  { label: "Gift Boxes", href: "/search/gift-boxes" },
  { label: "Pantry", href: "/search" },
  { label: "New Arrivals", href: "/search", badge: "HOT" as const },
  { label: "Sale", href: "/search", danger: true as const },
  { label: "Wholesale", href: "#wholesale" },
];

export function MarketCatBar() {
  return (
    <div
      className="mk-catbar"
      style={{
        borderBottom: "1px solid var(--rule)",
        padding: "10px 56px",
        display: "flex",
        gap: 24,
        alignItems: "center",
        background: "#fff",
        overflowX: "auto",
      }}
    >
      {CATS.map((c, i) => (
        <Link
          key={c.label}
          href={c.href}
          style={{
            fontSize: 13.5,
            fontWeight: i === 0 ? 700 : 500,
            color: c.danger ? "var(--warn)" : "var(--ink)",
            whiteSpace: "nowrap",
            padding: "6px 2px",
            borderBottom:
              i === 0
                ? "2px solid var(--accent)"
                : "2px solid transparent",
            marginBottom: -11,
          }}
        >
          {c.label}
          {c.badge && (
            <span
              style={{
                marginLeft: 6,
                padding: "1px 6px",
                background: "var(--accent-soft)",
                color: "var(--accent-dark)",
                borderRadius: 4,
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              {c.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
