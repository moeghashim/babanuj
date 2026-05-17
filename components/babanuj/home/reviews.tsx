const REVIEWS = [
  {
    name: "Layla A.",
    city: "Brooklyn, NY",
    stars: 5,
    q: "Tastes exactly like the box my mom used to bring back from Antep. I cried a little.",
    tag: "Pistachio Baklava",
  },
  {
    name: "Marcus W.",
    city: "Austin, TX",
    stars: 5,
    q: "I run a coffee shop and our maamoul are flying off the shelf. Babanuj never lets us down on lead times.",
    tag: "Wholesale partner",
  },
  {
    name: "Priya R.",
    city: "Chicago, IL",
    stars: 5,
    q: "The Dubai chocolate is unreal — better than anything I tried in the airport. Sent four boxes as gifts.",
    tag: "Crush Dubai Bar",
  },
  {
    name: "Ahmed S.",
    city: "San Jose, CA",
    stars: 5,
    q: "Shipping from Houston was fast and everything arrived intact. The packaging is gorgeous — I've reordered four times.",
    tag: "Repeat customer · 2 years",
  },
];

export function MarketReviews() {
  return (
    <section style={{ padding: "56px 56px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 24,
        }}
      >
        <div>
          <span className="micro" style={{ color: "var(--accent-dark)" }}>
            ★ 4.9 from 2,400+ reviews
          </span>
          <h2 className="display-heavy" style={{ fontSize: 38, margin: "6px 0 0" }}>
            What customers are saying
          </h2>
        </div>
        <a
          href="#"
          style={{ color: "var(--accent)", fontWeight: 600, fontSize: 14 }}
        >
          Read all reviews →
        </a>
      </div>
      <div
        className="mk-reviews"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        {REVIEWS.map((r, i) => (
          <div key={i} className="market-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", gap: 2, color: "#d4a843", fontSize: 16 }}>
              {"★".repeat(r.stars)}
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                marginTop: 12,
                marginBottom: 16,
                color: "var(--ink)",
              }}
            >
              &ldquo;{r.q}&rdquo;
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingTop: 12,
                borderTop: "1px solid var(--rule)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  background: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-dark)",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {r.name[0]}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-2)" }}>{r.city}</div>
              </div>
              <span
                className="market-chip chip-soft"
                style={{ marginLeft: "auto", fontSize: 10 }}
              >
                {r.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
