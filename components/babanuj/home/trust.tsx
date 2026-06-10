import {
  GlobeIcon,
  HandshakeIcon,
  ShieldIcon,
  TruckIcon,
} from "components/babanuj/icons";
import { FREE_SHIPPING_SHORT_LABEL } from "lib/babanuj/shipping";

const ITEMS = [
  {
    icon: <TruckIcon width={20} height={20} />,
    title: FREE_SHIPPING_SHORT_LABEL,
    sub: "From Houston, TX",
  },
  {
    icon: <ShieldIcon width={20} height={20} />,
    title: "Freshness guarantee",
    sub: "Or your money back",
  },
  {
    icon: <HandshakeIcon width={20} height={20} />,
    title: "Direct from producers",
    sub: "No middlemen, ever",
  },
  {
    icon: <GlobeIcon width={20} height={20} />,
    title: "32 heritage brands",
    sub: "Türkiye · Levant · Gulf",
  },
];

export function MarketTrust() {
  return (
    <section style={{ padding: "24px 56px 32px" }}>
      <div
        className="mk-trust"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          background: "var(--paper)",
          borderRadius: 20,
          padding: "20px 0",
          overflow: "hidden",
        }}
      >
        {ITEMS.map((t, i, arr) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 10,
              padding: "8px 20px",
              borderRight: i < arr.length - 1 ? "1px solid var(--rule)" : 0,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: "var(--accent-soft)",
                color: "var(--accent-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {t.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                {t.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-2)",
                  marginTop: 3,
                  lineHeight: 1.3,
                }}
              >
                {t.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
