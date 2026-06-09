"use client";

import Link from "next/link";
import { ArrowRight, QuoteIcon } from "components/babanuj/icons";
import { Photo } from "components/babanuj/photo";
import { RubElHizb } from "components/babanuj/ornaments";
import { MarketProductCard } from "components/babanuj/product-card";
import {
  BRANDS,
  BRAND_DETAILS,
  type BabanujBrand,
  type BabanujBrandDetail,
  type BabanujProduct,
} from "lib/babanuj/data";

type Props = {
  brand: BabanujBrand;
  products?: BabanujProduct[];
};

export function BrandView({ brand, products = [] }: Props) {
  // Editorial detail (quote, timeline, multi-paragraph story) only exists for
  // the curated houses. Secondary houses render a lean, factual page instead —
  // never the old behavior of borrowing Zaitoune's story as a fallback.
  const detail: BabanujBrandDetail | undefined = BRAND_DETAILS[brand.id];
  const lineCount = `${products.length} ${
    products.length === 1 ? "product" : "products"
  }`;
  // Facts: use the curated set (with a live "Lines" count) when present;
  // otherwise derive an honest set from the brand fields + live catalog.
  const facts: { k: string; v: string }[] = detail
    ? detail.facts.map((f) =>
        f.k === "Lines" ? { k: "Lines", v: lineCount } : f,
      )
    : (
        [
          brand.origin ? { k: "Origin", v: brand.origin } : null,
          brand.sub ? { k: "Category", v: brand.sub } : null,
          brand.est > 0 ? { k: "Founded", v: String(brand.est) } : null,
          { k: "Lines", v: lineCount },
          brand.note ? { k: "Note", v: brand.note } : null,
        ].filter(Boolean) as { k: string; v: string }[]
      );
  const story: string[] =
    detail?.longStory ?? (brand.long ? [brand.long] : []);
  const storyRegion = (detail?.region ?? brand.origin ?? "").split(",")[0];
  const brandProducts = products;
  // Cross-sell only the curated houses, keeping this grid at a fixed width.
  const otherBrands = BRANDS.filter((b) => b.id !== brand.id && b.featured);

  return (
    <div>
      {/* Breadcrumb */}
      <nav
        className="mk-bread"
        style={{
          padding: "20px 56px 0",
          fontSize: 13,
          color: "var(--ink-2)",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ color: "var(--ink-2)" }}>
          Home
        </Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: "var(--ink-2)" }}>Brands</span>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: "var(--ink)" }}>{brand.name}</span>
      </nav>

      {/* Product grid */}
      <section
        id="brand-products"
        style={{ padding: "32px 56px 56px", background: "var(--paper)" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 28,
          }}
        >
          <div>
            <span className="micro" style={{ color: "var(--accent-dark)" }}>
              The Collection · {lineCount}
            </span>
            <h2 className="display-heavy" style={{ fontSize: 44, margin: "8px 0 0" }}>
              Everything from {brand.name}
            </h2>
          </div>
          <Link
            href="/search"
            className="market-btn outline"
            style={{ padding: "10px 20px", fontSize: 13 }}
          >
            See all sweets →
          </Link>
        </div>
        {brandProducts.length > 0 ? (
          <div
            className="mk-brand-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            {brandProducts.map((p, i) => (
              <MarketProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              background: "#fff",
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              New products coming soon from {brand.name}.
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-2)",
                marginTop: 8,
              }}
            >
              This house is currently in production. Subscribe and we&apos;ll
              let you know the moment they land.
            </p>
          </div>
        )}
      </section>

      {/* Hero */}
      <section
        className="mk-brand-hero-section"
        style={{ padding: "56px 56px 0" }}
      >
        <div
          className="mk-brand-hero"
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            height: 540,
            background: brand.accent,
          }}
        >
          <Photo
            src={brand.img}
            alt={brand.name}
            style={{ position: "absolute", inset: 0 }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${brand.accent}cc 0%, rgba(0,0,0,0.25) 60%, transparent 100%)`,
            }}
          />
          {(brand.origin || brand.est > 0) && (
            <div
              style={{
                position: "absolute",
                top: 28,
                right: 28,
                background: "rgba(255,255,255,0.92)",
                color: "var(--ink)",
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "var(--accent-dark)",
                }}
              />
              {[brand.origin, brand.est > 0 ? `Est. ${brand.est}` : ""]
                .filter(Boolean)
                .join(" · ")}
            </div>
          )}
          <div
            className="mk-brand-hero-copy"
            style={{
              position: "absolute",
              left: 56,
              bottom: 56,
              right: 56,
              color: "#fff",
              maxWidth: 640,
            }}
          >
            <span
              className="micro"
              style={{
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: 999,
                backdropFilter: "blur(4px)",
              }}
            >
              {brand.tag}
            </span>
            <h1
              className="display-heavy"
              style={{
                fontSize: 96,
                margin: "20px 0 12px",
                lineHeight: 0.95,
                color: "#fff",
                letterSpacing: "-0.025em",
              }}
            >
              {brand.name}
            </h1>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.5,
                opacity: 0.9,
                maxWidth: 520,
              }}
            >
              {brand.long}
            </p>
            <div
              className="mk-brand-hero-ctas"
              style={{ display: "flex", gap: 12, marginTop: 28 }}
            >
              <a
                href="#brand-products"
                className="market-btn"
                style={{ background: "#fff", color: "var(--ink)" }}
              >
                Back to collection
              </a>
              <a
                href={`mailto:wholesale@babanuj.com?subject=${encodeURIComponent(
                  `Wholesale inquiry — ${brand.name}`,
                )}`}
                className="market-btn"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  backdropFilter: "blur(4px)",
                }}
              >
                Wholesale inquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Facts strip */}
      <section style={{ padding: "32px 56px 0" }}>
        <div
          className="mk-brand-facts"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${facts.length}, 1fr)`,
            background: "var(--paper)",
            borderRadius: 20,
            padding: "24px 0",
          }}
        >
          {facts.map((f, i, arr) => (
            <div
              key={f.k}
              style={{
                padding: "4px 20px",
                borderRight:
                  i < arr.length - 1 ? "1px solid var(--rule)" : 0,
                minWidth: 0,
              }}
            >
              <div
                className="micro"
                style={{ fontSize: 10, color: "var(--ink-2)", marginBottom: 6 }}
              >
                {f.k}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "-0.005em",
                }}
              >
                {f.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: "64px 56px" }}>
        <div
          className="mk-brand-story"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: 56,
          }}
        >
          <div>
            <span className="micro" style={{ color: "var(--accent-dark)" }}>
              The Story
            </span>
            <h2
              className="display-heavy"
              style={{ fontSize: 48, margin: "12px 0 0", lineHeight: 1 }}
            >
              {storyRegion ? (
                <>
                  From{" "}
                  <span
                    className="editorial"
                    style={{ color: "var(--accent-dark)" }}
                  >
                    {storyRegion}
                  </span>
                  , with care.
                </>
              ) : (
                <>
                  Made{" "}
                  <span
                    className="editorial"
                    style={{ color: "var(--accent-dark)" }}
                  >
                    with care.
                  </span>
                </>
              )}
            </h2>
            {detail?.quote && (
              <div
                style={{
                  marginTop: 28,
                  padding: 24,
                  background: "var(--paper)",
                  borderRadius: 18,
                }}
              >
                <QuoteIcon
                  width={22}
                  height={22}
                  style={{ color: "var(--accent-dark)", opacity: 0.4 }}
                />
                <p
                  className="editorial"
                  style={{
                    fontSize: 19,
                    lineHeight: 1.4,
                    color: "var(--ink)",
                    marginTop: 8,
                  }}
                >
                  {detail.quote}
                </p>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-2)",
                    marginTop: 12,
                    fontWeight: 600,
                  }}
                >
                  — {detail.quoteBy}
                </div>
              </div>
            )}
          </div>
          <div>
            {story.map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: 16.5,
                  lineHeight: 1.75,
                  color: i === 0 ? "var(--ink)" : "var(--ink-2)",
                  marginTop: i === 0 ? 0 : 18,
                  fontWeight: i === 0 ? 500 : 400,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline — only for curated houses with a real, sourced history */}
      {detail?.timeline && detail.timeline.length > 0 && (
      <section style={{ padding: "64px 56px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="micro" style={{ color: "var(--accent-dark)" }}>
            {detail.yearLabel}
          </span>
          <h2 className="display-heavy" style={{ fontSize: 44, margin: "8px 0 0" }}>
            A few moments in the history
          </h2>
        </div>
        <div
          className="mk-brand-timeline"
          style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}
        >
          <div
            className="mk-timeline-line"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 2,
              background: "var(--rule)",
              transform: "translateX(-50%)",
            }}
          />
          {detail.timeline.map((m, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={i}
                className="mk-timeline-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 1fr",
                  gap: 16,
                  padding: "24px 0",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <div
                  className="mk-timeline-content"
                  style={{
                    textAlign: isLeft ? "right" : "left",
                    gridColumn: isLeft ? 1 : 3,
                    paddingRight: isLeft ? 12 : 0,
                    paddingLeft: isLeft ? 0 : 12,
                  }}
                >
                  <div
                    className="display-heavy num"
                    style={{ fontSize: 36, color: "var(--accent-dark)" }}
                  >
                    {m.year}
                  </div>
                  <p
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.55,
                      color: "var(--ink-2)",
                      margin: "4px 0 0",
                      maxWidth: 360,
                      marginLeft: isLeft ? "auto" : 0,
                    }}
                  >
                    {m.t}
                  </p>
                </div>
                <div
                  className="mk-timeline-dot"
                  style={{
                    gridColumn: 2,
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      background: "#fff",
                      border: "3px solid var(--accent-dark)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* CTA strip */}
      <section style={{ padding: "32px 56px" }}>
        <div
          className="mk-brand-cta"
          style={{
            background: brand.accent,
            color: "#fff",
            borderRadius: 24,
            padding: 40,
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 32,
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              color: brand.color2,
              opacity: 0.18,
            }}
          >
            <RubElHizb size={240} color={brand.color2} stroke={1.5} />
          </div>
          <div style={{ position: "relative" }}>
            <span className="micro" style={{ color: brand.color2 }}>
              For Retailers · Foodservice · Gift
            </span>
            <h3
              className="display-heavy"
              style={{
                fontSize: 36,
                margin: "10px 0 12px",
                color: "#fff",
                lineHeight: 1.05,
              }}
            >
              Carry {brand.name} in your store
            </h3>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                opacity: 0.85,
                maxWidth: 480,
              }}
            >
              Babanuj imports and ships these from our Houston, TX warehouse.
              Flexible MOQs, label-ready packaging, U.S.-warehoused inventory.
              Most accounts go live within two weeks.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              position: "relative",
            }}
          >
            <button
              className="market-btn warn"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Request wholesale catalog
            </button>
            <button
              className="market-btn"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                width: "100%",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
            >
              Brand fact-sheet
            </button>
          </div>
        </div>
      </section>

      {/* Other houses */}
      <section style={{ padding: "64px 56px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <div>
            <span className="micro" style={{ color: "var(--accent-dark)" }}>
              The Babanuj Pantry
            </span>
            <h2 className="display-heavy" style={{ fontSize: 36, margin: "8px 0 0" }}>
              Other houses
            </h2>
          </div>
        </div>
        <div
          className="mk-brand-other"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${otherBrands.length}, 1fr)`,
            gap: 20,
          }}
        >
          {otherBrands.map((b) => (
            <Link
              key={b.id}
              href={`/brand/${b.id}`}
              className="market-card"
              style={{
                cursor: "pointer",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                color: "inherit",
              }}
            >
              <div style={{ background: b.accent, position: "relative" }}>
                <Photo
                  src={b.img}
                  alt={b.name}
                  style={{ position: "absolute", inset: 0 }}
                />
              </div>
              <div style={{ padding: 18 }}>
                <div className="micro" style={{ fontSize: 10, color: "var(--ink-2)" }}>
                  {b.origin} · est. {b.est}
                </div>
                <div className="display-heavy" style={{ fontSize: 22, marginTop: 4 }}>
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
                    color: "var(--accent)",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  Visit {b.name} <ArrowRight width={12} height={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
