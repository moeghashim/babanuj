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
  categoryFor,
  fmtPrice,
  resolveProductBrand,
  type BabanujBrand,
  type BabanujProduct,
  type BabanujProductVariant,
} from "lib/babanuj/data";

type TabId = "description" | "shipping";

type Props = {
  product: BabanujProduct;
  fromBrand?: BabanujProduct[];
  related?: BabanujProduct[];
};

export function MarketPDP({ product: p, fromBrand = [], related = [] }: Props) {
  const brand = resolveProductBrand(p);
  const brandLabel = brand.origin ? `${brand.name} · ${brand.origin}` : brand.name;
  const cat = categoryFor(p);
  const productOptions = (p.options ?? []).filter(
    (option) => option.values.length > 1,
  );
  const productVariants = p.variants ?? [];
  const hasVariantOptions =
    productOptions.length > 0 && productVariants.length > 0;
  const initialVariant =
    productVariants.find((variant) => variant.id === p.variantId) ??
    productVariants.find((variant) => variant.availableForSale) ??
    productVariants[0];
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabId>("description");
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => optionsFromVariant(initialVariant));

  const selectedVariant = useMemo(
    () =>
      findVariantForOptions(productVariants, selectedOptions) ?? initialVariant,
    [productVariants, selectedOptions, initialVariant],
  );
  const selectedProduct = useMemo(
    () => productForVariant(p, selectedVariant),
    [p, selectedVariant],
  );

  const gallery = useMemo(
    () =>
      uniqueImages([
        selectedVariant?.image,
        selectedProduct.img,
        ...(selectedProduct.images ?? []),
      ]),
    [selectedProduct, selectedVariant],
  );
  const activeGalleryImage = gallery[activeImg] ?? gallery[0] ?? p.img;

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          {
            label: cat.name,
            href: cat.id === "all" ? "/search" : `/collections/${cat.id}`,
          },
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
                src={activeGalleryImage}
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
              className="mk-pdp-trust"
              style={{
                marginTop: 24,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {[
                {
                  icon: <TruckIcon width={18} height={18} />,
                  t: "Free over $70",
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
                    <div
                      style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}
                    >
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
            {brand.id ? (
              <Link href={`/brand/${brand.id}`} style={brandChipStyle}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: brand.accent,
                  }}
                />
                <span className="micro" style={{ color: "var(--accent-dark)" }}>
                  {brandLabel}
                </span>
              </Link>
            ) : (
              <span style={brandChipStyle}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: brand.accent,
                  }}
                />
                <span className="micro" style={{ color: "var(--accent-dark)" }}>
                  {brandLabel}
                </span>
              </span>
            )}
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
                {selectedProduct.availableForSale
                  ? "● In stock · ships in 48h"
                  : "Sold out"}
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
                  {fmtPrice(selectedProduct.price)}
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

            {hasVariantOptions && (
              <div style={{ marginBottom: 20 }}>
                {productOptions.map((option) => (
                  <div key={option.name} style={{ marginBottom: 14 }}>
                    <div
                      className="micro"
                      style={{
                        color: "var(--ink-2)",
                        fontSize: 10,
                        marginBottom: 8,
                      }}
                    >
                      {option.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      {option.values.map((value) => {
                        const disabled = !isOptionValueAvailable(
                          productVariants,
                          selectedOptions,
                          option.name,
                          value,
                        );
                        const selected = selectedOptions[option.name] === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              if (disabled) return;
                              setSelectedOptions((current) =>
                                nextSelectedOptions(
                                  productVariants,
                                  current,
                                  option.name,
                                  value,
                                ),
                              );
                            }}
                            disabled={disabled}
                            aria-pressed={selected}
                            style={{
                              minWidth: 46,
                              padding: "10px 14px",
                              borderRadius: 999,
                              border: selected
                                ? "1.5px solid var(--ink)"
                                : "1px solid var(--rule)",
                              background: selected ? "var(--ink)" : "#fff",
                              color: selected ? "#fff" : "var(--ink)",
                              fontFamily: "inherit",
                              fontWeight: 700,
                              fontSize: 13,
                              cursor: disabled ? "not-allowed" : "pointer",
                              opacity: disabled ? 0.4 : 1,
                            }}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                product={selectedProduct}
                quantity={qty}
                variant="full"
                label={`Add to Bag — ${fmtPrice(selectedProduct.price * qty)}`}
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
              {(
                [
                  brand.origin ? { k: "Origin", v: brand.origin } : null,
                  {
                    k: "Maker",
                    v: brand.est
                      ? `${brand.name} · est. ${brand.est}`
                      : brand.name,
                  },
                  p.weight ? { k: "Format", v: p.weight } : null,
                  { k: "Ships from", v: "Houston, TX" },
                ].filter(Boolean) as { k: string; v: string }[]
              ).map((f, i, arr) => (
                <div
                  key={f.k}
                  style={{
                    padding: 14,
                    borderRight: i % 2 === 0 ? "1px solid var(--rule)" : 0,
                    borderBottom:
                      i < arr.length - (arr.length % 2 || 2)
                        ? "1px solid var(--rule)"
                        : 0,
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
          <div
            className="mk-pdp-tabs"
            style={{ display: "flex", gap: 0, marginTop: -1 }}
            role="tablist"
          >
            {(
              [
                { id: "description", label: "Description" },
                { id: "shipping", label: "Shipping & returns" },
              ] as { id: TabId; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                className="mk-pdp-tab-btn"
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
          <div
            style={{ padding: "32px 0", borderTop: "1px solid var(--rule)" }}
          >
            {tab === "description" && (
              <PDPDescription product={p} brand={brand} />
            )}
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
              <h2
                className="display-heavy"
                style={{ fontSize: 32, margin: "6px 0 0" }}
              >
                From the same house
              </h2>
            </div>
            {brand.id && (
              <Link
                href={`/brand/${brand.id}`}
                className="market-btn outline"
                style={{ padding: "10px 18px", fontSize: 13 }}
              >
                Visit {brand.name} →
              </Link>
            )}
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
            <h2
              className="display-heavy"
              style={{ fontSize: 32, margin: "6px 0 0" }}
            >
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

const brandChipStyle: React.CSSProperties = {
  background: "transparent",
  border: 0,
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  color: "var(--accent-dark)",
  textDecoration: "none",
};

function optionsFromVariant(
  variant: BabanujProductVariant | undefined,
): Record<string, string> {
  return Object.fromEntries(
    variant?.selectedOptions.map((option) => [option.name, option.value]) ?? [],
  );
}

function findVariantForOptions(
  variants: BabanujProductVariant[],
  selectedOptions: Record<string, string>,
) {
  return variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => selectedOptions[option.name] === option.value,
    ),
  );
}

function variantMatchesOtherOptions(
  variant: BabanujProductVariant,
  selectedOptions: Record<string, string>,
  optionName: string,
) {
  return variant.selectedOptions.every((option) => {
    if (option.name === optionName) return true;
    const selectedValue = selectedOptions[option.name];
    return !selectedValue || selectedValue === option.value;
  });
}

function isOptionValueAvailable(
  variants: BabanujProductVariant[],
  selectedOptions: Record<string, string>,
  optionName: string,
  value: string,
) {
  return variants.some(
    (variant) =>
      variant.availableForSale &&
      variantMatchesOtherOptions(variant, selectedOptions, optionName) &&
      variant.selectedOptions.some(
        (option) => option.name === optionName && option.value === value,
      ),
  );
}

function nextSelectedOptions(
  variants: BabanujProductVariant[],
  current: Record<string, string>,
  optionName: string,
  value: string,
) {
  const next = { ...current, [optionName]: value };
  const exactAvailable = variants.find(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.every(
        (option) => next[option.name] === option.value,
      ),
  );

  if (exactAvailable) return optionsFromVariant(exactAvailable);

  const fallback = variants.find(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.some(
        (option) => option.name === optionName && option.value === value,
      ),
  );

  return fallback ? optionsFromVariant(fallback) : next;
}

function productForVariant(
  product: BabanujProduct,
  variant: BabanujProductVariant | undefined,
): BabanujProduct {
  if (!variant) return product;
  return {
    ...product,
    variantId: variant.id,
    availableForSale: variant.availableForSale,
    img: variant.image ?? product.img,
    price: Number.isFinite(variant.price) ? variant.price : product.price,
  };
}

function uniqueImages(images: (string | undefined)[]) {
  return [
    ...new Set(images.filter((image): image is string => Boolean(image))),
  ];
}

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
  brand: BabanujBrand;
}) {
  const html = p.descriptionHtml?.trim();
  const showMaker = Boolean(brand.id && (brand.blurb || brand.origin));
  return (
    <div
      className="mk-pdp-tab"
      style={{
        display: "grid",
        gridTemplateColumns: showMaker ? "1.4fr 1fr" : "1fr",
        gap: 48,
      }}
    >
      <div
        className="mk-pdp-desc"
        style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)" }}
      >
        {html ? (
          // Shopify product descriptionHtml — authored in the store admin.
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p style={{ marginTop: 0 }}>
            {p.description ||
              `${p.name}${brand.name ? ` by ${brand.name}` : ""}.`}
          </p>
        )}
      </div>
      {showMaker && (
        <div
          style={{ background: "var(--paper)", borderRadius: 18, padding: 24 }}
        >
          <div
            className="micro"
            style={{ color: "var(--accent-dark)", marginBottom: 10 }}
          >
            The Maker
          </div>
          <div className="display" style={{ fontSize: 22, marginBottom: 6 }}>
            {brand.name}
          </div>
          {(brand.origin || brand.est > 0) && (
            <div
              style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 14 }}
            >
              {[brand.origin, brand.est > 0 ? `est. ${brand.est}` : ""]
                .filter(Boolean)
                .join(" · ")}
            </div>
          )}
          {brand.blurb && (
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
          )}
        </div>
      )}
    </div>
  );
}

function PDPShipping() {
  const items = [
    {
      t: "Standard · Free over $70",
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
