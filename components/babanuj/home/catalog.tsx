import { CATALOG } from "lib/babanuj/data";

export function MarketCatalog() {
  return (
    <section id="wholesale" style={{ padding: "56px 56px" }}>
      <div
        style={{
          background: "var(--paper)",
          borderRadius: 24,
          padding: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 28,
          }}
        >
          <div>
            <span className="micro" style={{ color: "var(--accent-dark)" }}>
              For Retailers & Foodservice
            </span>
            <h2 className="display-heavy" style={{ fontSize: 38, margin: "6px 0 0" }}>
              Wholesale catalog
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-2)",
                marginTop: 8,
                maxWidth: 520,
              }}
            >
              Flexible MOQs, U.S.-warehoused inventory, label-ready packaging.
              Most accounts go live within two weeks.
            </p>
          </div>
          <button className="market-btn">Request Full Catalog →</button>
        </div>

        <div className="mk-catalog-scroll">
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid var(--rule)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1.5fr 1.5fr 120px",
                padding: "14px 20px",
                borderBottom: "1px solid var(--rule)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
                background: "var(--paper)",
              }}
            >
              <span>Brand</span>
              <span>Line</span>
              <span>Formats</span>
              <span>Channels</span>
              <span style={{ textAlign: "right" }}>Inquire</span>
            </div>
            {CATALOG.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1.5fr 1.5fr 120px",
                  padding: "16px 20px",
                  alignItems: "center",
                  gap: 12,
                  borderBottom:
                    i < CATALOG.length - 1
                      ? "1px solid var(--rule)"
                      : 0,
                  fontSize: 13.5,
                }}
              >
                <span style={{ fontWeight: 700 }}>{c.brand}</span>
                <span>{c.line}</span>
                <span
                  style={{
                    color: "var(--ink-2)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {c.formats}
                </span>
                <span style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {c.channels.map((ch) => (
                    <span
                      key={ch}
                      className="market-chip chip-soft"
                      style={{ fontSize: 10, padding: "2px 8px" }}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
                <button
                  style={{
                    justifySelf: "end",
                    padding: "6px 14px",
                    background: "#fff",
                    color: "var(--accent)",
                    border: "1.5px solid var(--accent)",
                    cursor: "pointer",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Inquire
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
