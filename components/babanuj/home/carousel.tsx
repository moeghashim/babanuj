import { CarouselControls } from "components/babanuj/home/carousel-controls";
import { MarketProductCard } from "components/babanuj/product-card";
import type { BabanujProduct } from "lib/babanuj/data";

type Props = {
  title: string;
  tag: string;
  reverse?: boolean;
  products: BabanujProduct[];
};

export function MarketCarousel({ title, tag, reverse, products }: Props) {
  const trackId = `mk-carousel-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section
      style={{
        padding: "32px 56px",
        background: reverse ? "var(--paper)" : "transparent",
        contentVisibility: "auto",
        containIntrinsicSize: "520px",
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
        <CarouselControls trackId={trackId} />
      </div>
      <div
        id={trackId}
        className="mk-carousel-track"
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 8,
        }}
      >
        {products.map((p, i) => (
          <MarketProductCard key={p.id} product={p} index={i} carouselCard />
        ))}
      </div>
    </section>
  );
}
