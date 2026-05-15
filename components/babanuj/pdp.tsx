"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HandshakeIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShieldIcon,
  TruckIcon,
} from "components/babanuj/icons";
import { Photo } from "components/babanuj/photo";
import { MarketProductCard } from "components/babanuj/product-card";
import { AddToBagButton } from "components/babanuj/add-to-bag";
import {
  BRANDS,
  categoryFor,
  findBrand,
  fmtPrice,
  type BabanujProduct,
} from "lib/babanuj/data";

type TabId = "description" | "ingredients" | "shipping";

type Props = {
  product: BabanujProduct;
  fromBrand?: BabanujProduct[];
  related?: BabanujProduct[];
  galleryExtras?: string[];
};

export function MarketPDP({
  product: p,
  fromBrand = [],
  related = [],
  galleryExtras = [],
}: Props) {
  const brand = findBrand(BRANDS.find((b) => b.name === p.brand)?.id ?? "") ?? BRANDS[0]!;
  const cat = categoryFor(p);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabId>("description");
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);

  const gallery = useMemo(
    () => [p.img, ...galleryExtras, brand.img].filter(Boolean),
    [p, brand, galleryExtras],
  );

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: cat.name, href: `/search/${cat.id}` },
          { label: p.name },
        ]}
      />

      <section style={{ padding: "24px 56px 56px" }}>
        <div
          className="mk-pdp-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 48,
          }}
        >
          {/* Gallery */}
          <div>
            <div
              style={{
                aspectRatio: "1",
                background: p.hue,
                borderRadius: 24,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Photo
                src={gallery[activeImg]!}
                alt={p.name}
                style={{ position: "absolute", inset: 0 }}
              />
              <button
                onClick={() => setWished((w) => !w)}
                aria-label="Wishlist"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 44,
                  height: 44,
                  background: "#fff",
                  border: 0,
                  borderRadius: 999,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: wished ? "var(--warn)" : "var(--ink-2)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                }}
              >
                <HeartIcon
                  width={20}
                  height={20}
                  fill={wished ? "currentColor" : "none"}
                />
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gallery.length}, 1fr)`,
                gap: 10,
                marginTop: 12,
              }}
            >
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View ${i + 1}`}
                  style={{
                    aspectRatio: "1",
                    background: p.hue,
                    borderRadius: 12,
                    overflow: "hidden",
                    position: "relative",
                    border:
                      i === activeImg
                        ? "2px solid var(--ink)"
                        : "2px solid transparent",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <Photo
                    src={g}
                    alt=""
                    style={{ position: "absolute", inset: 0 }}
                  />
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: 24,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              {[
                {
                  icon: <TruckIcon width={18} height={18} />,
                  t: "Free over $59",
                  s: "Houston, TX",
                },
                {
                  icon: <ShieldIcon width={18} height={18} />,
                  t: "Fresh guaranteed",
                  s: "Or refund",
                },
                {
                  icon: <HandshakeIcon width={18} height={18} />,
                  t: "Direct from maker",
                  s: "No middlemen",
                },
              ].map((x, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 12,
                    background: "var(--paper)",
                    borderRadius: 14,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      background: "var(--accent-soft)",
                      color: "var(--accent-dark)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {x.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>
                      {x.t}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-2)",
                        marginTop: 2,
                      }}
                    >
                      {x.s}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="mk-pdp-info">
            <Link
              href={`/brand/${brand.id}`}
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--accent-dark)",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: brand.accent,
                }}
              />
              <span className="micro" style={{ color: "var(--accent-dark)" }}>
                {brand.name} · {brand.origin}
              </span>
            </Link>
            <h1
              className="display-heavy"
              style={{ fontSize: 48, margin: "12px 0 8px", lineHeight: 1.05 }}
            >
              {p.name}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--accent-dark)",
                  fontWeight: 600,
                }}
              >
                ● In stock · ships in 48h
              </span>
            </div>

            <div
              style={{
                background: "var(--paper)",
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span
                  className="display-heavy num"
                  style={{ fontSize: 38, color: "var(--ink)" }}
                >
                  {fmtPrice(p.price)}
                </span>
              </div>
              {p.weight && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-2)",
                    marginTop: 8,
                  }}
                >
                  {p.weight}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "stretch",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1.5px solid var(--ink)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={qtyBtn}
                  aria-label="Decrease quantity"
                >
                  <MinusIcon width={14} height={14} />
                </button>
                <span
                  style={{
                    minWidth: 32,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={qtyBtn}
                  aria-label="Increase quantity"
                >
                  <PlusIcon width={14} height={14} />
                </button>
              </div>
              <AddToBagButton
                product={p}
                quantity={qty}
                variant="full"
                label={`Add to Bag — ${fmtPrice(p.price * qty)}`}
              />
            </div>
            <div style={{ marginBottom: 22 }} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
                border: "1px solid var(--rule)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              {[
                { k: "Origin", v: brand.origin },
                { k: "Maker", v: `${brand.name} · est. ${brand.est}` },
                { k: "Format", v: p.weight },
                { k: "Ships from", v: "Houston, TX" },
                { k: "Shelf life", v: "6–12 months · ambient" },
                { k: "Allergens", v: "Tree nuts · gluten · dairy" },
              ].map((f, i, arr) => (
                <div
                  key={i}
                  style={{
                    padding: 14,
                    borderRight:
                      i % 2 === 0 ? "1px solid var(--rule)" : 0,
                    borderBottom:
                      i < arr.length - 2 ? "1px solid var(--rule)" : 0,
                  }}
                >
                  <div
                    className="micro"
                    style={{
                      fontSize: 10,
                      color: "var(--ink-2)",
                      marginBottom: 4,
                    }}
                  >
                    {f.k}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ padding: "24px 56px 0" }}>
        <div style={{ borderTop: "1px solid var(--rule)" }}>
          <div style={{ display: "flex", gap: 0, marginTop: -1 }} role="tablist">
            {(
              [
                { id: "description", label: "Description" },
                { id: "ingredients", label: "Ingredients & nutrition" },
                { id: "shipping", label: "Shipping & returns" },
              ] as { id: TabId; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "18px 22px",
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  borderTop:
                    tab === t.id
                      ? "2px solid var(--ink)"
                      : "2px solid transparent",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: tab === t.id ? "var(--ink)" : "var(--ink-2)",
                  marginTop: -1,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ padding: "32px 0", borderTop: "1px solid var(--rule)" }}>
            {tab === "description" && (
              <PDPDescription product={p} brand={brand} />
            )}
            {tab === "ingredients" && <PDPIngredients />}
            {tab === "shipping" && <PDPShipping />}
          </div>
        </div>
      </section>

      {fromBrand.length > 0 && (
        <section style={{ padding: "32px 56px" }}>
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
                More from {brand.name}
              </span>
              <h2 className="display-heavy" style={{ fontSize: 32, margin: "6px 0 0" }}>
                From the same house
              </h2>
            </div>
            <Link
              href={`/brand/${brand.id}`}
              className="market-btn outline"
              style={{ padding: "10px 18px", fontSize: 13 }}
            >
              Visit {brand.name} →
            </Link>
          </div>
          <div
            className="mk-pdp-related"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${fromBrand.length}, 1fr)`,
              gap: 16,
            }}
          >
            {fromBrand.map((rp, i) => (
              <MarketProductCard key={rp.id} product={rp} index={i} />
            ))}
          </div>
        </section>
      )}

      <section style={{ padding: "32px 56px 56px" }}>
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
              Pairs well with
            </span>
            <h2 className="display-heavy" style={{ fontSize: 32, margin: "6px 0 0" }}>
              You might also like
            </h2>
          </div>
        </div>
        <div
          className="mk-pdp-related"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 16,
          }}
        >
          {related.map((rp, i) => (
            <MarketProductCard key={rp.id} product={rp} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 44,
  height: 44,
  background: "transparent",
  border: 0,
  cursor: "pointer",
  color: "var(--ink)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
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
      {items.map((it, i) => (
        <span
          key={i}
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          {it.href ? (
            <Link href={it.href} style={{ color: "var(--ink-2)" }}>
              {it.label}
            </Link>
          ) : (
            <span style={{ color: "var(--ink)" }}>{it.label}</span>
          )}
          {i < items.length - 1 && <span style={{ opacity: 0.4 }}>›</span>}
        </span>
      ))}
    </nav>
  );
}

function PDPDescription({
  product: p,
  brand,
}: {
  product: BabanujProduct;
  brand: (typeof BRANDS)[number];
}) {
  return (
    <div
      className="mk-pdp-tab"
      style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48 }}
    >
      <div>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--ink)",
            marginTop: 0,
          }}
        >
          {p.name} is made by {brand.name} in {brand.origin}, working from
          recipes refined over {2026 - brand.est} years. Every batch is
          hand-rolled, slow-baked, and shipped within 48 hours of leaving the
          kitchen.
        </p>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--ink-2)",
          }}
        >
          {brand.long}
        </p>
        <h3 className="display" style={{ fontSize: 18, marginTop: 28, marginBottom: 12 }}>
          Tasting notes
        </h3>
        <ul
          style={{
            paddingLeft: 18,
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--ink-2)",
            margin: 0,
          }}
        >
          <li>
            Crisp top crust giving way to a yielding, syrup-soaked middle.
          </li>
          <li>Deep pistachio, soft cardamom, a finish of orange-blossom honey.</li>
          <li>
            Best with strong unsweetened tea or a small cup of Turkish coffee.
          </li>
        </ul>
      </div>
      <div style={{ background: "var(--paper)", borderRadius: 18, padding: 24 }}>
        <div className="micro" style={{ color: "var(--accent-dark)", marginBottom: 10 }}>
          The Maker
        </div>
        <div className="display" style={{ fontSize: 22, marginBottom: 6 }}>
          {brand.name}
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 14 }}>
          {brand.origin} · est. {brand.est}
        </div>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--ink-2)",
            margin: 0,
          }}
        >
          {brand.blurb}
        </p>
      </div>
    </div>
  );
}

function PDPIngredients() {
  const rows: [string, string][] = [
    ["Calories", "142 kcal"],
    ["Fat", "7.8 g"],
    ["Sugars", "11.4 g"],
    ["Protein", "2.1 g"],
    ["Sodium", "38 mg"],
  ];
  return (
    <div
      className="mk-pdp-tab"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}
    >
      <div>
        <h3 className="display" style={{ fontSize: 18, marginTop: 0, marginBottom: 12 }}>
          Ingredients
        </h3>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--ink-2)",
          }}
        >
          Unbleached wheat flour, butter, sugar, pistachios, walnuts, lemon,
          salt. Contains: tree nuts, gluten, dairy. May contain traces of
          sesame.
        </p>
        <h3 className="display" style={{ fontSize: 18, marginTop: 24, marginBottom: 12 }}>
          Storage
        </h3>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--ink-2)",
          }}
        >
          Store in a cool dry place. Best within 6 months of receipt.
          Refrigerate after opening for extended freshness.
        </p>
      </div>
      <div>
        <h3 className="display" style={{ fontSize: 18, marginTop: 0, marginBottom: 12 }}>
          Nutrition · per 30g serving
        </h3>
        <div style={{ border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
          {rows.map(([k, v], i) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom:
                  i < rows.length - 1 ? "1px solid var(--rule)" : 0,
                fontSize: 14,
              }}
            >
              <span style={{ color: "var(--ink-2)" }}>{k}</span>
              <span
                style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PDPShipping() {
  const items = [
    {
      t: "Standard · Free over $59",
      s: "2–4 business days. Ships from our Houston, TX warehouse via UPS Ground.",
    },
    {
      t: "Express · From $14.99",
      s: "Order by 12pm CT for next-business-day delivery anywhere in the continental U.S.",
    },
    {
      t: "Returns · 30 days",
      s: "Not as expected? Send it back within 30 days for a full refund. We pay return shipping on damaged items.",
    },
  ];
  return (
    <div
      className="mk-pdp-tab"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}
    >
      {items.map((x) => (
        <div key={x.t}>
          <h3
            className="display"
            style={{ fontSize: 18, marginTop: 0, marginBottom: 10 }}
          >
            {x.t}
          </h3>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.65,
              color: "var(--ink-2)",
            }}
          >
            {x.s}
          </p>
        </div>
      ))}
    </div>
  );
}

function PDPReviews() {
  const summary: [number, number][] = [
    [5, 92],
    [4, 6],
    [3, 1],
    [2, 0.5],
    [1, 0.5],
  ];
  const reviews = [
    {
      name: "Layla A.",
      city: "Brooklyn, NY",
      stars: 5,
      when: "2 weeks ago",
      verified: true,
      q: "Tastes exactly like the box my mom used to bring back from Antep. I cried a little. Will reorder for every family gathering.",
    },
    {
      name: "Marcus W.",
      city: "Austin, TX",
      stars: 5,
      when: "1 month ago",
      verified: true,
      q: "I run a coffee shop and these are flying off the counter. Lead times are reliable; packaging holds up to shipping.",
    },
    {
      name: "Priya R.",
      city: "Chicago, IL",
      stars: 4,
      when: "6 weeks ago",
      verified: true,
      q: "Excellent flavor, slightly drier than I remember from a Damascus trip but the closest I've found stateside.",
    },
  ];
  return (
    <div
      className="mk-pdp-tab"
      style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40 }}
    >
      <div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            fontFamily: "Bricolage Grotesque, sans-serif",
            color: "var(--ink)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          4.9
        </div>
        <div style={{ display: "flex", gap: 2, color: "#d4a843", fontSize: 20, marginTop: 4 }}>
          ★★★★★
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 6 }}>
          Based on 248 verified reviews
        </div>
        <div style={{ marginTop: 18 }}>
          {summary.map(([s, pct]) => (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "4px 0",
                fontSize: 12,
              }}
            >
              <span style={{ width: 18 }}>{s}★</span>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  background: "var(--paper)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: "var(--accent)",
                  }}
                />
              </div>
              <span
                style={{
                  width: 36,
                  textAlign: "right",
                  color: "var(--ink-2)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pct}%
              </span>
            </div>
          ))}
        </div>
        <button
          className="market-btn outline"
          style={{ marginTop: 22, width: "100%", justifyContent: "center", padding: 12, fontSize: 13 }}
        >
          Write a review
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {reviews.map((r, i) => (
          <div
            key={i}
            style={{ padding: 20, background: "var(--paper)", borderRadius: 14 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: "var(--accent-soft)",
                    color: "var(--accent-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {r.name[0]}
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-2)" }}>
                    {r.city} · {r.when}
                  </div>
                </div>
                {r.verified && (
                  <span
                    className="market-chip chip-soft"
                    style={{ fontSize: 10 }}
                  >
                    ✓ Verified buyer
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 2, color: "#d4a843", fontSize: 14 }}>
                {"★".repeat(r.stars)}
                <span style={{ color: "var(--rule)" }}>
                  {"★".repeat(5 - r.stars)}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{r.q}</p>
          </div>
        ))}
        <button
          className="market-btn cream"
          style={{ alignSelf: "flex-start", padding: "10px 18px", fontSize: 13 }}
        >
          Load 12 more
        </button>
      </div>
    </div>
  );
}
