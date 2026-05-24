"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MarketProductCard } from "components/babanuj/product-card";
import { FilterIcon } from "components/babanuj/icons";
import {
  CATEGORIES,
  findCategory,
  type BabanujProduct,
} from "lib/babanuj/data";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

type Props = {
  categoryId: string;
  categoryTitle?: string;
  categoryBlurb?: string;
  products: BabanujProduct[];
  searchValue?: string;
};

export function CategoryView({
  categoryBlurb,
  categoryId,
  categoryTitle,
  products,
  searchValue,
}: Props) {
  const cat = findCategory(categoryId);
  const baseItems = useMemo(
    () => products.filter((p) => p.availableForSale !== false),
    [products],
  );
  const maxPrice = useMemo(() => {
    const highestPrice = Math.max(...baseItems.map((p) => p.price), 0);
    return Math.max(5, Math.ceil(highestPrice));
  }, [baseItems]);

  const brands = useMemo(
    () => ["All", ...Array.from(new Set(baseItems.map((p) => p.brand)))],
    [baseItems],
  );

  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const effectivePriceMax = priceMax ?? maxPrice;

  const items = useMemo(() => {
    let r = baseItems.filter(
      (p) =>
        (brand === "All" || p.brand === brand) && p.price <= effectivePriceMax,
    );
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "name")
      r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [baseItems, brand, sort, effectivePriceMax]);

  const title = searchValue
    ? `Results for "${searchValue}"`
    : (categoryTitle ?? cat.name);
  const blurb = searchValue
    ? `Matching products across all brands.`
    : (categoryBlurb ?? cat.blurb);

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
        <span style={{ color: "var(--ink-2)" }}>Shop</span>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: "var(--ink)" }}>{title}</span>
      </nav>

      {/* Category header */}
      <section style={{ padding: "24px 56px 32px" }}>
        <div
          className="mk-cat-header"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 32,
            alignItems: "end",
          }}
        >
          <div>
            <span className="micro" style={{ color: "var(--accent-dark)" }}>
              {baseItems.length} products · {brands.length - 1} brands
            </span>
            <h1
              className="display-heavy"
              style={{
                fontSize: 64,
                margin: "10px 0 12px",
                lineHeight: 1,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.55,
                color: "var(--ink-2)",
                maxWidth: 520,
                margin: 0,
              }}
            >
              {blurb}
            </p>
          </div>
          <div
            className="mk-cat-chips"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            {CATEGORIES.filter((c) => c.id !== "pantry").map((c) => (
              <Link
                key={c.id}
                href={c.id === "all" ? "/search" : `/collections/${c.id}`}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border:
                    c.id === cat.id
                      ? "1.5px solid var(--ink)"
                      : "1px solid var(--rule)",
                  background: c.id === cat.id ? "var(--ink)" : "#fff",
                  color: c.id === cat.id ? "#fff" : "var(--ink)",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all .15s",
                  textDecoration: "none",
                }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section
        style={{
          padding: "0 56px",
          position: "sticky",
          top: 64,
          zIndex: 10,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="mk-cat-toolbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            borderTop: "1px solid var(--rule)",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <button
              onClick={() => setShowFilters((v) => !v)}
              style={toolbarBtn}
            >
              <FilterIcon width={14} height={14} />
              Filters
              {(brand !== "All" || priceMax !== null) && (
                <span
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "1px 7px",
                    fontSize: 10,
                  }}
                >
                  1
                </span>
              )}
            </button>
            <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
              {items.length} of {baseItems.length} products
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--ink-2)" }}>Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              style={selectBox}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price · low → high</option>
              <option value="price-desc">Price · high → low</option>
              <option value="name">Name · A → Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section style={{ padding: "32px 56px 56px" }}>
        <div
          className="mk-cat-main"
          style={{
            display: "grid",
            gridTemplateColumns: showFilters ? "240px 1fr" : "1fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          {showFilters && (
            <aside className="mk-cat-filters" style={{ position: "sticky", top: 140 }}>
              <FilterGroup title="Brand">
                {brands.map((b) => (
                  <label key={b} style={radioRow}>
                    <input
                      type="radio"
                      name="brand"
                      checked={brand === b}
                      onChange={() => setBrand(b)}
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <span>{b}</span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 11,
                        color: "var(--ink-2)",
                      }}
                    >
                      {b === "All"
                        ? baseItems.length
                        : baseItems.filter((p) => p.brand === b).length}
                    </span>
                  </label>
                ))}
              </FilterGroup>
              <FilterGroup title={`Price · up to $${effectivePriceMax}`}>
                <input
                  type="range"
                  min={5}
                  max={maxPrice}
                  step={1}
                  value={effectivePriceMax}
                  onChange={(e) => setPriceMax(+e.target.value)}
                  style={{ width: "100%", accentColor: "var(--accent)" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "var(--ink-2)",
                    marginTop: 4,
                  }}
                >
                  <span>$5</span>
                  <span>${effectivePriceMax}</span>
                  <span>${maxPrice}</span>
                </div>
              </FilterGroup>
              <FilterGroup title="Features">
                {[
                  "Ships in 48hr",
                  "Vegan-friendly",
                  "Gift wrapped",
                  "Best seller",
                ].map((f) => (
                  <label key={f} style={radioRow}>
                    <input
                      type="checkbox"
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </FilterGroup>
              <button
                onClick={() => {
                  setBrand("All");
                  setPriceMax(null);
                }}
                style={{
                  marginTop: 8,
                  padding: "10px 14px",
                  background: "transparent",
                  color: "var(--accent)",
                  border: "1px solid var(--accent)",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 12,
                  width: "100%",
                }}
              >
                Reset filters
              </button>
            </aside>
          )}

          <div>
            {items.length === 0 ? (
              <div
                style={{
                  padding: "80px 20px",
                  textAlign: "center",
                  background: "var(--paper)",
                  borderRadius: 20,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  No matches in that range.
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink-2)",
                    marginTop: 8,
                  }}
                >
                  Try raising the price slider or clearing brand filters.
                </p>
              </div>
            ) : (
              <div
                className="mk-cat-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: showFilters
                    ? "repeat(3, 1fr)"
                    : "repeat(4, 1fr)",
                  gap: 20,
                }}
              >
                {items.map((p: BabanujProduct, i) => (
                  <MarketProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const toolbarBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 14px",
  background: "#fff",
  color: "var(--ink)",
  border: "1px solid var(--rule)",
  borderRadius: 999,
  cursor: "pointer",
  fontFamily: "inherit",
  fontWeight: 600,
  fontSize: 13,
};
const selectBox: React.CSSProperties = {
  background: "#fff",
  border: "1px solid var(--rule)",
  borderRadius: 999,
  padding: "8px 14px",
  fontFamily: "inherit",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--ink)",
  cursor: "pointer",
};
const radioRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "7px 0",
  fontSize: 13.5,
  cursor: "pointer",
};

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        paddingBottom: 24,
        marginBottom: 24,
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div
        className="micro"
        style={{ fontSize: 11, marginBottom: 12, color: "var(--ink)" }}
      >
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}
