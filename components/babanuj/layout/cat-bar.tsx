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
    <nav className="mk-catbar" aria-label="Product categories">
      {CATS.map((c, i) => (
        <Link
          key={c.label}
          href={c.href}
          className={
            i === 0 ? "mk-catbar-link mk-catbar-link-active" : "mk-catbar-link"
          }
        >
          {c.label}
        </Link>
      ))}
    </nav>
  );
}
