"use client";

import Link from "next/link";
import { RubElHizb } from "components/babanuj/ornaments";

export default function Error({ reset }: { reset: () => void }) {
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
          maxWidth: 640,
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
            STOREFRONT HICCUP
          </span>
        </div>

        <div
          aria-hidden
          style={{
            display: "flex",
            justifyContent: "center",
            color: "var(--warn)",
            marginBottom: 8,
          }}
        >
          <RubElHizb size={120} stroke={2} />
        </div>

        <h1
          className="display-heavy"
          style={{
            fontSize: 56,
            margin: "24px 0 0",
            color: "var(--ink)",
          }}
        >
          Something{" "}
          <span className="editorial" style={{ color: "var(--warn)" }}>
            went sideways.
          </span>
        </h1>

        <p
          style={{
            fontSize: 17,
            lineHeight: 1.6,
            color: "var(--ink-2)",
            maxWidth: 480,
            margin: "18px auto 0",
          }}
        >
          Our storefront tripped on something — usually a temporary hiccup. Give
          it another go, or head back to the pantry.
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
          <button
            type="button"
            onClick={() => reset()}
            className="market-btn warn"
          >
            Try again →
          </button>
          <Link href="/" className="market-btn cream">
            Back to the pantry
          </Link>
        </div>
      </div>
    </section>
  );
}
