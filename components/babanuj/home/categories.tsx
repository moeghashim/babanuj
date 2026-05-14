import Link from "next/link";
import { ArrowRight } from "components/babanuj/icons";
import { Photo } from "components/babanuj/photo";
import { ALL_PRODUCTS } from "lib/babanuj/data";

const CATS = [
  {
    name: "Baklava",
    id: "baklava",
    count: 14,
    hue: "#caa55a",
    img: ALL_PRODUCTS[0]!.img,
  },
  {
    name: "Chocolate",
    id: "chocolate",
    count: 9,
    hue: "#7a4a2e",
    img: ALL_PRODUCTS[3]!.img,
  },
  {
    name: "Cookies",
    id: "cookies",
    count: 22,
    hue: "#d6a06e",
    img: ALL_PRODUCTS[7]!.img,
  },
  {
    name: "Turkish Delight",
    id: "turkish-delight",
    count: 11,
    hue: "#e8b0a8",
    img: ALL_PRODUCTS[1]!.img,
  },
  {
    name: "Gift Boxes",
    id: "gift-boxes",
    count: 18,
    hue: "#3a5c3a",
    img: ALL_PRODUCTS[6]!.img,
  },
  {
    name: "Pantry",
    id: "pantry",
    count: 26,
    hue: "#b4441f",
    img: ALL_PRODUCTS[4]!.img,
  },
];

export function MarketCategories() {
  return (
    <section style={{ padding: "56px 56px 32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 24,
        }}
      >
        <h2 className="display-heavy" style={{ fontSize: 38, margin: 0 }}>
          Shop by category
        </h2>
        <Link
          href="/search"
          style={{
            color: "var(--accent)",
            fontWeight: 600,
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          View all <ArrowRight width={14} height={14} />
        </Link>
      </div>
      <div
        className="mk-cats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 16,
        }}
      >
        {CATS.map((c) => (
          <Link
            key={c.name}
            href={`/search/${c.id}`}
            className="market-card"
            style={{
              display: "block",
              position: "relative",
              borderRadius: 18,
            }}
          >
            <div
              style={{
                aspectRatio: "1",
                background: c.hue,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Photo
                src={c.img}
                alt={c.name}
                style={{ position: "absolute", inset: 0 }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  right: 12,
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {c.name}
                </div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>
                  {c.count} items
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
