import Link from "next/link";

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
        <Link href="/collections/gift-boxes">Gift Boxes</Link>
        <Link href="/#wholesale">Become a Partner</Link>
        <Link href="/reviews">Reviews</Link>
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        <Link href="/account/orders">Track Order</Link>
        <Link href="/shipping">Help</Link>
        <span aria-label="Store currency and language">USD · EN</span>
      </div>
    </div>
  );
}
