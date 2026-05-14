"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "components/babanuj/icons";
import { MarketProductCard } from "components/babanuj/product-card";
import { ALL_PRODUCTS } from "lib/babanuj/data";

type Props = {
  title: string;
  tag: string;
  reverse?: boolean;
};

export function MarketCarousel({ title, tag, reverse }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section
      style={{
        padding: "32px 56px",
        background: reverse ? "var(--paper)" : "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          marginBottom: 20,
        }}
      >
        <div>
          <span className="micro" style={{ color: "var(--accent-dark)" }}>
            {tag}
          </span>
          <h2
            className="display-heavy"
            style={{ fontSize: 38, margin: "6px 0 0" }}
          >
            {title}
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            style={arrowBtn}
          >
            <ChevronLeft width={16} height={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            style={arrowBtn}
          >
            <ChevronRight width={16} height={16} />
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className="mk-carousel-track"
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 8,
        }}
      >
        {ALL_PRODUCTS.map((p, i) => (
          <MarketProductCard key={p.id} product={p} index={i} carouselCard />
        ))}
      </div>
    </section>
  );
}

const arrowBtn: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 999,
  background: "#fff",
  border: "1px solid var(--rule)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--ink)",
};
