import { TruckIcon } from "components/babanuj/icons";
import { FREE_SHIPPING_LABEL } from "lib/babanuj/shipping";

export function MarketAnnounce() {
  return (
    <div
      className="mk-announce"
      style={{
        background: "var(--accent-dark)",
        color: "#fff",
        padding: "10px 56px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 18,
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <TruckIcon width={16} height={16} /> {FREE_SHIPPING_LABEL}
      </span>
    </div>
  );
}
