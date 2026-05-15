"use client";

import Link from "next/link";
import { useState } from "react";
import { AddToBagButton } from "components/babanuj/add-to-bag";
import { HeartIcon } from "components/babanuj/icons";
import { Photo } from "components/babanuj/photo";
import { fmtPrice, type BabanujProduct } from "lib/babanuj/data";

type Props = {
  product: BabanujProduct;
  index?: number;
  carouselCard?: boolean;
  showAddOnHover?: boolean;
};

export function MarketProductCard({
  product: p,
  index = 0,
  carouselCard = false,
  showAddOnHover = true,
}: Props) {
  const [hover, setHover] = useState(false);
  const onSale = index % 2 === 0;
  const isNew = index % 3 === 1;
  const listPrice = p.price * 1.25;

  return (
    <Link
      href={`/product/${p.handle}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={"market-card" + (carouselCard ? " mk-carousel-card" : "")}
      style={{
        position: "relative",
        cursor: "pointer",
        display: "block",
        color: "inherit",
      }}
    >
      <div
        style={{
          aspectRatio: "1",
          background: p.hue,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Photo
          src={p.img}
          alt={p.name}
          style={{ position: "absolute", inset: 0 }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {onSale && (
            <span className="market-chip chip-save">-25% Member</span>
          )}
          {isNew && <span className="market-chip chip-new">New</span>}
        </div>
        <button
          aria-label="Wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "#fff",
            border: 0,
            width: 34,
            height: 34,
            borderRadius: 999,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink-2)",
          }}
        >
          <HeartIcon width={16} height={16} />
        </button>
        <div
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 12,
            opacity: showAddOnHover ? (hover ? 1 : 0) : 1,
            transform:
              showAddOnHover && !hover ? "translateY(8px)" : "translateY(0)",
            transition: "opacity .2s, transform .2s",
          }}
        >
          <AddToBagButton product={p} variant="quick-add" style={{ width: "100%" }} />
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div className="micro" style={{ fontSize: 10, color: "var(--ink-2)" }}>
          {p.brand}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginTop: 4,
            lineHeight: 1.3,
          }}
        >
          {p.name}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 4 }}>
          {p.weight}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginTop: 12,
          }}
        >
          <span
            className="num"
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: onSale ? "var(--warn)" : "var(--ink)",
            }}
          >
            {fmtPrice(p.price)}
          </span>
          {onSale && (
            <span
              className="num"
              style={{
                fontSize: 13,
                color: "var(--ink-2)",
                textDecoration: "line-through",
              }}
            >
              {fmtPrice(listPrice)}
            </span>
          )}
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              color: "var(--accent-dark)",
              fontWeight: 600,
            }}
          >
            Member {fmtPrice(p.price * 0.75)}
          </span>
        </div>
      </div>
    </Link>
  );
}
