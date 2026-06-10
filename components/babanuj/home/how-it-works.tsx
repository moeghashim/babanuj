import { ArrowRight } from "components/babanuj/icons";
import { FREE_SHIPPING_LABEL } from "lib/babanuj/shipping";

const STEPS = [
  {
    n: "01",
    title: "Browse the pantry",
    sub: "Explore 240+ sweets, chocolates and gift boxes — all curated from 32 heritage brands.",
  },
  {
    n: "02",
    title: "Fill your bag",
    sub: `${FREE_SHIPPING_LABEL} on qualifying orders.`,
  },
  {
    n: "03",
    title: "Eat. Share. Repeat.",
    sub: "We ship from Houston in 48 hours. Re-order with one click — or set & forget.",
  },
];

export function MarketHowItWorks() {
  return (
    <section style={{ padding: "56px 56px", background: "var(--paper)" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <span className="micro" style={{ color: "var(--accent-dark)" }}>
          How it works
        </span>
        <h2
          className="display-heavy"
          style={{ fontSize: 44, margin: "8px 0 0" }}
        >
          Sweet on your schedule.
        </h2>
      </div>
      <div
        className="mk-how"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {STEPS.map((s, i, arr) => (
          <div
            key={s.n}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 32,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  background: "var(--accent-soft)",
                  color: "var(--accent-dark)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {s.n}
              </div>
              <div className="display" style={{ fontSize: 22 }}>
                {s.title}
              </div>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-2)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {s.sub}
            </p>
            {i < arr.length - 1 && (
              <div
                className="mk-arrow-next"
                style={{
                  position: "absolute",
                  right: -14,
                  top: "50%",
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "var(--accent)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <ArrowRight width={14} height={14} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
