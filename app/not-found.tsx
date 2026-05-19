import Link from "next/link";
import { RubElHizb } from "components/babanuj/ornaments";
import { CATEGORIES } from "lib/babanuj/data";

export const metadata = {
  title: "Lost in the souk · Page not found",
  description:
    "The page you were looking for has wandered off the tray. Find your way back to Babanuj's pantry of Middle Eastern sweets.",
  robots: { index: false, follow: true },
};

const QUICK_LINKS: Array<{ id: string; label?: string }> = [
  { id: "baklava" },
  { id: "cookies", label: "Maamoul & Cookies" },
  { id: "chocolate", label: "Dubai Chocolate" },
  { id: "turkish-delight" },
  { id: "gift-boxes" },
  { id: "dates" },
];

export default function NotFound() {
  const links = QUICK_LINKS.map((q) => {
    const cat = CATEGORIES.find((c) => c.id === q.id);
    return {
      id: q.id,
      label: q.label ?? cat?.name ?? q.id,
      hue: cat?.hue ?? "var(--accent-soft)",
    };
  });

  return (
    <section
      style={{
        position: "relative",
        minHeight: "calc(100vh - 220px)",
        padding: "72px 56px 96px",
        background:
          "radial-gradient(1100px 600px at 50% -10%, var(--accent-soft) 0%, transparent 60%), var(--bg)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 48,
          left: -40,
          opacity: 0.08,
          color: "var(--ink)",
          transform: "rotate(-12deg)",
          pointerEvents: "none",
        }}
      >
        <RubElHizb size={220} stroke={1.2} />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -60,
          right: -40,
          opacity: 0.07,
          color: "var(--ink)",
          transform: "rotate(8deg)",
          pointerEvents: "none",
        }}
      >
        <RubElHizb size={280} stroke={1.2} />
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: 880,
          margin: "0 auto",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <span
            className="micro"
            style={{
              display: "inline-block",
              padding: "7px 14px",
              background: "var(--accent-soft)",
              color: "var(--accent-dark)",
              borderRadius: 999,
            }}
          >
            ERROR · 404
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "var(--ink)",
            lineHeight: 0.9,
          }}
        >
          <span className="display-heavy mk-404-digit">4</span>
          <span
            aria-hidden
            className="mk-spin-slow mk-404-star"
            style={{
              display: "inline-flex",
              color: "var(--warn)",
              margin: "0 -8px",
            }}
          >
            <RubElHizb size={160} stroke={2} />
          </span>
          <span className="display-heavy mk-404-digit">4</span>
        </div>

        <h1
          className="display-heavy"
          style={{
            fontSize: 56,
            margin: "32px 0 0",
            color: "var(--ink)",
          }}
        >
          This aisle is{" "}
          <span className="editorial" style={{ color: "var(--warn)" }}>
            empty.
          </span>
        </h1>

        <p
          style={{
            fontSize: 17,
            lineHeight: 1.6,
            color: "var(--ink-2)",
            maxWidth: 520,
            margin: "18px auto 0",
          }}
        >
          The page you were looking for has wandered off the tray. The good
          news: the pantry is just around the corner.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 32,
          }}
        >
          <Link href="/" className="market-btn warn">
            Back to the pantry →
          </Link>
          <Link href="/search" className="market-btn cream">
            Browse all sweets
          </Link>
        </div>

        <div style={{ marginTop: 64 }}>
          <span
            className="micro"
            style={{ color: "var(--ink-2)", display: "block", marginBottom: 16 }}
          >
            OR FOLLOW YOUR NOSE
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
            }}
          >
            {links.map((l) => (
              <Link
                key={l.id}
                href={`/collections/${l.id}`}
                className="market-chip"
                style={{
                  background: "#fff",
                  color: "var(--ink)",
                  border: "1px solid var(--rule)",
                  padding: "10px 16px",
                  fontSize: 13,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: l.hue,
                    display: "inline-block",
                  }}
                />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
