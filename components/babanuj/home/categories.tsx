import Link from "next/link";
import { ArrowRight } from "components/babanuj/icons";
import { Photo } from "components/babanuj/photo";

type Props = {
  // Image URLs sourced server-side (first product of each collection).
  imageByCategoryId?: Record<string, string | undefined>;
};

const CATS = [
  { name: "Baklava", id: "baklava", hue: "#bfa86a" },
  { name: "Cookies & Maamoul", id: "cookies", hue: "#d6a06e" },
  { name: "Turkish Delight", id: "turkish-delight", hue: "#e8b0a8" },
  { name: "Chocolate", id: "chocolate", hue: "#7a4a2e" },
  { name: "Gift Boxes", id: "gift-boxes", hue: "#3a5c3a" },
  { name: "Dates", id: "dates", hue: "#5e3a1e" },
];

export function MarketCategories({ imageByCategoryId = {} }: Props) {
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
        {CATS.map((c) => {
          const img = imageByCategoryId[c.id];
          return (
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
                {img && (
                  <Photo
                    src={img}
                    alt={c.name}
                    style={{ position: "absolute", inset: 0 }}
                  />
                )}
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
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
