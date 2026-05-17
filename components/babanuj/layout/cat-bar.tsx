import Link from "next/link";

const CATS = [
  { label: "Shop All", href: "/search" },
  { label: "Baklava", href: "/collections/baklava" },
  { label: "Cookies & Maamoul", href: "/collections/cookies" },
  { label: "Turkish Delight", href: "/collections/turkish-delight" },
  { label: "Chocolate", href: "/collections/chocolate" },
  { label: "Gift Boxes", href: "/collections/gift-boxes" },
  { label: "Dates", href: "/collections/dates" },
  { label: "Coffee", href: "/collections/coffee" },
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
            color: "var(--ink)",
            whiteSpace: "nowrap",
            padding: "6px 2px",
            borderBottom:
              i === 0 ? "2px solid var(--accent)" : "2px solid transparent",
            marginBottom: -11,
          }}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
