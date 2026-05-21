"use client";

import { ChevronLeft, ChevronRight } from "components/babanuj/icons";

type Props = {
  trackId: string;
};

export function CarouselControls({ trackId }: Props) {
  const scroll = (dir: -1 | 1) => {
    document
      .getElementById(trackId)
      ?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
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
