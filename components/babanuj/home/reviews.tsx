import Link from "next/link";
import { JUDGEME_ENABLED } from "components/babanuj/reviews/config";
import { JudgemeAllReviews } from "components/babanuj/reviews/judgeme-widgets";

export function MarketReviews() {
  // Hidden until Judge.me is configured — no hardcoded ratings (AGENTS.md).
  if (!JUDGEME_ENABLED) return null;

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
            Verified customer reviews
          </span>
          <h2 className="display-heavy" style={{ fontSize: 38, margin: "6px 0 0" }}>
            What customers are saying
          </h2>
        </div>
        <Link
          href="/reviews"
          style={{ color: "var(--accent)", fontWeight: 600, fontSize: 14 }}
        >
          Read all reviews →
        </Link>
      </div>
      <JudgemeAllReviews />
    </section>
  );
}
