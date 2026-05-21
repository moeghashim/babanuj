import Link from "next/link";
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
  return (
    <Link
      href={`/product/${p.handle}`}
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
          quality={carouselCard ? 60 : 75}
          sizes={
            carouselCard
              ? "(max-width: 900px) 64px, 280px"
              : "(max-width: 900px) 50vw, 25vw"
          }
          style={{ position: "absolute", inset: 0 }}
        />
        {p.tag && (
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
            <span className="market-chip chip-soft">{p.tag}</span>
          </div>
        )}
        <span
          aria-hidden="true"
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
        </span>
        {!carouselCard && (
          <div
            className={
              "mk-quick-add" + (showAddOnHover ? "" : " mk-quick-add-visible")
            }
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: 12,
            }}
          >
            <AddToBagButton
              product={p}
              variant="quick-add"
              style={{ width: "100%" }}
            />
          </div>
        )}
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
              color: "var(--ink)",
            }}
          >
            {fmtPrice(p.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
