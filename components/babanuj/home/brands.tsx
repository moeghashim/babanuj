import Link from "next/link";
import { ArrowRight } from "components/babanuj/icons";
import { Photo } from "components/babanuj/photo";
import { BRANDS } from "lib/babanuj/data";

export function MarketBrands() {
  return (
    <section
      style={{
        padding: "40px 56px",
        contentVisibility: "auto",
        containIntrinsicSize: "420px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 20,
        }}
      >
        <div>
          <span className="micro" style={{ color: "var(--accent-dark)" }}>
            The Houses
          </span>
          <h2
            className="display-heavy"
            style={{ fontSize: 38, margin: "6px 0 0" }}
          >
            Shop by brand
          </h2>
        </div>
        <Link
          href="/brand/zaitoune"
          style={{ color: "var(--accent)", fontWeight: 600, fontSize: 14 }}
        >
          All 32 brands →
        </Link>
      </div>
      <div
        className="mk-brands"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BRANDS.length}, 1fr)`,
          gap: 16,
        }}
      >
        {BRANDS.map((b) => (
          <Link
            key={b.id}
            href={`/brand/${b.id}`}
            className="market-card"
            style={{
              cursor: "pointer",
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              overflow: "hidden",
              color: "inherit",
            }}
          >
            <div style={{ background: b.accent, position: "relative" }}>
              <Photo
                src={b.img}
                alt={b.name}
                quality={60}
                sizes="(max-width: 900px) 96px, 140px"
                style={{ position: "absolute", inset: 0 }}
              />
            </div>
            <div style={{ padding: 18 }}>
              <div
                className="micro"
                style={{ fontSize: 10, color: "var(--ink-2)" }}
              >
                {b.origin} · est. {b.est}
              </div>
              <div
                className="display-heavy"
                style={{ fontSize: 22, marginTop: 4 }}
              >
                {b.name}
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: "var(--ink-2)",
                  marginTop: 6,
                  marginBottom: 12,
                }}
              >
                {b.tag}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  className="market-chip chip-soft"
                  style={{ fontSize: 11 }}
                >
                  {b.products.length} products
                </span>
                <span
                  style={{
                    color: "var(--accent)",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  Visit <ArrowRight width={12} height={12} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
