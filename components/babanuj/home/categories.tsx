import Link from "next/link";
import { ArrowRight } from "components/babanuj/icons";
import {
  CategoryArt,
  type CategoryKind,
} from "components/babanuj/category-art";

// Card labels intentionally short for grid legibility. The category page itself
// uses the longer display name from CATEGORIES in lib/babanuj/data.ts.
const CATS: { name: string; id: string; kind: CategoryKind }[] = [
  { name: "Baklava", id: "baklava", kind: "baklava" },
  { name: "Cookies", id: "cookies", kind: "cookies" },
  { name: "Turkish Delight", id: "turkish-delight", kind: "turkish-delight" },
  { name: "Chocolate", id: "chocolate", kind: "chocolate" },
  { name: "Gift Boxes", id: "gift-boxes", kind: "gift-boxes" },
  { name: "Dates", id: "dates", kind: "dates" },
];

export function MarketCategories() {
  return (
    <section style={{ padding: "56px 56px 32px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            className="micro"
            style={{ color: "var(--accent)", fontWeight: 700 }}
          >
            THE PANTRY
          </span>
          <span
            style={{
              flex: "0 0 20px",
              height: 1,
              background: "var(--accent)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <h2
            className="display-heavy"
            style={{ fontSize: 38, margin: 0 }}
          >
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
              borderBottom: "1px solid var(--accent)",
              paddingBottom: 2,
            }}
          >
            View all <ArrowRight width={14} height={14} />
          </Link>
        </div>
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
            key={c.id}
            href={`/search/${c.id}`}
            className="market-card"
            style={{
              display: "block",
              position: "relative",
              borderRadius: 18,
              color: "inherit",
            }}
          >
            <div
              style={{
                aspectRatio: "1",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CategoryArt kind={c.kind} />
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 14,
                  right: 14,
                  color: "#fff",
                  pointerEvents: "none",
                }}
              >
                <div
                  className="display-heavy"
                  style={{
                    fontSize: 13.5,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                  }}
                >
                  {c.name}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
