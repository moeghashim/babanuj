import { MarketProductCard } from "components/babanuj/product-card";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { openGraph } from "lib/babanuj/seo";
import { getProducts } from "lib/shopify";
import Link from "next/link";

const title = "HoneyTube — Single-Serve Honey Tubes & Sticks (25g) | Babanuj";
const description =
  "Buy HoneyTube in the USA: single-serve 25g tubes of raw Saudi wild honey by Reeq Alnahel. Squeeze into tea, over bread, or straight from the tube. Ships from Houston.";

export const metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/honeytube",
  },
  openGraph: openGraph({
    title,
    description,
    url: "/honeytube",
  }),
};

const FAQS = [
  {
    q: "What is a HoneyTube?",
    a: "HoneyTube is a single-serve 25g squeeze tube of natural honey made by Reeq Alnahel, a Saudi honey house harvesting wild honey from its own apiaries. Each tube is one portion — no jar, no spoon, no mess.",
  },
  {
    q: "Where can I buy HoneyTube in the USA?",
    a: "Right here. Babanuj stocks HoneyTube packs in Houston, Texas and ships across the United States with free shipping. Orders typically arrive in 2–4 business days.",
  },
  {
    q: "How do you use honey tubes?",
    a: "Tear or twist the tip and squeeze: into hot tea or coffee, over toast, pancakes, yogurt, or oatmeal — or straight into your mouth for quick energy on hikes, workouts, and travel. TSA-friendly portion size.",
  },
  {
    q: "Is HoneyTube real honey?",
    a: "Yes — Reeq Alnahel blends pure wild honey with bee products and natural botanicals. No artificial sweeteners or fillers.",
  },
];

export default async function HoneyTubePage() {
  const raw = await getProducts({
    query: "tag:Honey OR product_type:Honey",
  }).catch(() => []);
  const products = shopifyProductsToBabanuj(raw);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section style={{ padding: "56px 56px" }}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div style={{ maxWidth: 720, marginBottom: 32 }}>
        <span className="micro" style={{ color: "var(--accent-dark)" }}>
          Wild Saudi honey, one squeeze at a time
        </span>
        <h1
          className="display-heavy"
          style={{ fontSize: 38, margin: "6px 0 12px" }}
        >
          HoneyTube — single-serve honey tubes
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>
          HoneyTube is raw Saudi wild honey in a 25g squeeze tube, made by{" "}
          <Link href="/brand/reeq-alnahel">Reeq Alnahel</Link> from their own
          apiaries. One tube is one perfect portion — for tea, toast, lunchboxes,
          gym bags, and travel. No jar, no drips, no sticky spoon. We ship
          HoneyTube packs from Houston to every US state.
        </p>
      </div>

      {products.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 48,
          }}
        >
          {products.map((p, i) => (
            <MarketProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}

      <div style={{ maxWidth: 720 }}>
        <h2 className="display-heavy" style={{ fontSize: 26, marginBottom: 8 }}>
          HoneyTube questions, answered
        </h2>
        {FAQS.map((f) => (
          <details key={f.q} style={{ padding: "12px 0", borderBottom: "1px solid var(--line, #e5e0d8)" }}>
            <summary style={{ fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              {f.q}
            </summary>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-2)", margin: "8px 0 0" }}>
              {f.a}
            </p>
          </details>
        ))}
        <p style={{ fontSize: 14, marginTop: 24, color: "var(--ink-2)" }}>
          Looking for jars instead? Browse all{" "}
          <Link href="/collections/honey">honey at Babanuj</Link> — raw and
          infused honeys from across the region.
        </p>
      </div>
    </section>
  );
}
