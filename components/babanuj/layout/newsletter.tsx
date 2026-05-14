export function MarketNewsletter() {
  return (
    <section style={{ padding: "32px 56px 56px" }}>
      <div
        className="mk-news"
        style={{
          background: "var(--cream)",
          borderRadius: 24,
          padding: "48px 56px",
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 32,
          alignItems: "center",
        }}
      >
        <div>
          <span className="micro" style={{ color: "var(--accent-dark)" }}>
            $10 off your first order
          </span>
          <h3
            className="display-heavy"
            style={{ fontSize: 36, margin: "10px 0 6px" }}
          >
            Get $10 off when you join
          </h3>
          <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
            One email a month. New brands, member drops, recipes. No spam, no
            nonsense.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "#fff",
            borderRadius: 999,
            padding: 6,
          }}
        >
          <input
            placeholder="your@email"
            style={{
              flex: 1,
              background: "transparent",
              border: 0,
              padding: "12px 18px",
              fontFamily: "inherit",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button className="market-btn">Get $10 Off</button>
        </div>
      </div>
    </section>
  );
}
