import { JudgemeAllReviews } from "components/babanuj/reviews/judgeme-widgets";
import { openGraph } from "lib/babanuj/seo";

const title = "Customer Reviews | Babanuj";
const description =
  "Read verified customer reviews of Babanuj — Middle Eastern and Turkish sweets shipped fresh from Houston.";

export const metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/reviews",
  },
  openGraph: openGraph({
    title,
    description,
    url: "/reviews",
  }),
};

export default function ReviewsPage() {
  return (
    <section style={{ padding: "56px 56px" }}>
      <div style={{ marginBottom: 24 }}>
        <span className="micro" style={{ color: "var(--accent-dark)" }}>
          Verified customer reviews
        </span>
        <h1
          className="display-heavy"
          style={{ fontSize: 38, margin: "6px 0 0" }}
        >
          What customers are saying
        </h1>
      </div>
      <JudgemeAllReviews />
    </section>
  );
}
