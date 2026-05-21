import { Photo } from "components/babanuj/photo";
import { RubElHizb } from "components/babanuj/ornaments";
import { ALL_PRODUCTS } from "lib/babanuj/data";

export function MarketPromo() {
  return (
    <section
      style={{
        padding: "40px 56px",
        contentVisibility: "auto",
        containIntrinsicSize: "360px",
      }}
    >
      <div
        className="mk-promo"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div
          className="mk-promo-card"
          style={{
            background: "var(--cream)",
            borderRadius: 24,
            padding: 36,
            display: "grid",
            gridTemplateColumns: "1fr 200px",
            gap: 24,
            alignItems: "center",
            minHeight: 240,
          }}
        >
          <div>
            <span className="market-chip chip-soft">Build your own</span>
            <h3
              className="display-heavy"
              style={{ fontSize: 30, margin: "12px 0 8px", lineHeight: 1.1 }}
            >
              Build your own gift box
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-2)",
                maxWidth: 340,
                marginBottom: 16,
              }}
            >
              Pick six. We pack, wrap, and ship — anywhere in the U.S. Perfect
              for hosts, teams, and holidays.
            </p>
            <button className="market-btn">Start Building →</button>
          </div>
          <div
            className="mk-promo-img"
            style={{
              borderRadius: 18,
              background: "#e8d7b8",
              height: 180,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Photo
              src={ALL_PRODUCTS[6]!.img}
              alt="Gift box"
              quality={60}
              sizes="(max-width: 900px) 200px, 200px"
              style={{ position: "absolute", inset: 0 }}
            />
          </div>
        </div>

        <div
          className="mk-promo-card"
          style={{
            background: "var(--accent)",
            color: "#fff",
            borderRadius: 24,
            padding: 36,
            display: "grid",
            gridTemplateColumns: "1fr 200px",
            gap: 24,
            alignItems: "center",
            minHeight: 240,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              opacity: 0.15,
            }}
          >
            <RubElHizb size={240} color="#fff" stroke={1.5} />
          </div>
          <div style={{ position: "relative" }}>
            <span
              className="market-chip"
              style={{
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
              }}
            >
              Just dropped · Limited
            </span>
            <h3
              className="display-heavy"
              style={{ fontSize: 30, margin: "12px 0 8px", lineHeight: 1.1 }}
            >
              Crush Dubai Chocolate is back
            </h3>
            <p
              style={{
                fontSize: 14,
                opacity: 0.85,
                maxWidth: 340,
                marginBottom: 16,
              }}
            >
              The viral Dubai bar — kataifi pastry, pistachio cream, layered
              into single-origin chocolate. Limit 4 per order.
            </p>
            <button className="market-btn cream">Shop the Bar →</button>
          </div>
          <div
            className="mk-promo-img"
            style={{
              borderRadius: 18,
              background: "#2a1108",
              height: 180,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Photo
              src={ALL_PRODUCTS[3]!.img}
              alt="Crush Dubai Chocolate"
              quality={60}
              sizes="(max-width: 900px) 200px, 200px"
              style={{ position: "absolute", inset: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
