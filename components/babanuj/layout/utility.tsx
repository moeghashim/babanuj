export function MarketUtility() {
  return (
    <div
      className="mk-utility"
      style={{
        background: "var(--paper)",
        padding: "8px 56px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: 12,
        color: "var(--ink-2)",
      }}
    >
      <div style={{ display: "flex", gap: 18 }}>
        <a href="#">Gift Cards</a>
        <a href="#">Become a Partner</a>
        <a href="#">Refer a Friend · Get $20</a>
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        <a href="#">Track Order</a>
        <a href="#">Help</a>
        <a href="#">USD · EN</a>
      </div>
    </div>
  );
}
