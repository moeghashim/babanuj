import { RubElHizb } from "components/babanuj/ornaments";

const STATS = [
  { k: "25%", l: "off every order" },
  { k: "$340", l: "avg. saved per year" },
  { k: "Free", l: "shipping over $59" },
  { k: "1:1", l: "donated meals" },
];

export function MarketMember() {
  return (
    <section style={{ padding: "48px 56px" }}>
      <div
        className="mk-member"
        style={{
          background: "var(--accent-dark)",
          color: "#fff",
          borderRadius: 28,
          padding: "64px 56px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 40,
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            left: -60,
            opacity: 0.08,
          }}
        >
          <RubElHizb size={320} color="#fff" stroke={1} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -40,
            opacity: 0.08,
          }}
        >
          <RubElHizb size={280} color="var(--cream)" stroke={1} />
        </div>

        <div style={{ position: "relative" }}>
          <span className="micro" style={{ color: "var(--cream)" }}>
            Babanuj Membership
          </span>
          <h2
            className="display-heavy"
            style={{ fontSize: 56, margin: "12px 0 16px", lineHeight: 1 }}
          >
            Save more.
            <br />
            Eat better.
            <br />
            <span className="editorial" style={{ color: "var(--cream)" }}>
              Give back.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              opacity: 0.85,
              maxWidth: 460,
              lineHeight: 1.6,
            }}
          >
            Members save an average of{" "}
            <strong style={{ color: "var(--cream)" }}>$340/year</strong>. Every
            membership underwrites a season of free sweets for a family in
            need.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
            <button className="market-btn warn">Start Free Trial</button>
            <button className="market-btn cream">Compare Plans</button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            position: "relative",
          }}
        >
          {STATS.map((m, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 22,
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                className="display-heavy"
                style={{ fontSize: 36, color: "var(--cream)" }}
              >
                {m.k}
              </div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                {m.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
