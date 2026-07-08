import { MarketProductCard } from "components/babanuj/product-card";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { openGraph } from "lib/babanuj/seo";
import { getProducts } from "lib/shopify";
import Link from "next/link";

const title = "Milaf Cola in the USA — Buy Saudi Date Cola Online | Babanuj";
const description =
  "Where to buy Milaf Cola in the USA: the world's first cola made from real Ajwa and Sukkari dates, no added sugar. In stock at Babanuj — ships from Houston to all 50 states.";

export const metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/milaf-cola",
  },
  openGraph: openGraph({
    title,
    description,
    url: "/milaf-cola",
  }),
};

const FAQS = [
  {
    q: "Where can I buy Milaf Cola in the USA?",
    a: "Babanuj stocks Milaf Cola in Houston, Texas and ships nationwide — typically arriving in 2–4 business days with free shipping on qualifying orders. It is one of the few places carrying Milaf in the United States.",
  },
  {
    q: "What is Milaf Cola made of?",
    a: "Milaf Cola is the world's first cola made entirely from date extract — brewed from Ajwa and Sukkari dates by the Al Madinah Heritage Company in Saudi Arabia. No added sugar and no artificial sweeteners.",
  },
  {
    q: "Does Milaf Cola have added sugar or caffeine?",
    a: "No added sugar and no sweeteners — the sweetness comes entirely from dates. It's a caffeine-conscious alternative to conventional colas with a caramel-like date depth.",
  },
  {
    q: "What does date cola taste like?",
    a: "Expect classic cola carbonation with a rounder, caramel-toffee sweetness from the dates — less sharp than conventional cola, with a clean finish.",
  },
];

export default async function MilafColaPage() {
  const raw = await getProducts({ query: 'vendor:"Milaf"' }).catch(() => []);
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
          The world&apos;s first date cola, in stock stateside
        </span>
        <h1
          className="display-heavy"
          style={{ fontSize: 38, margin: "6px 0 12px" }}
        >
          Milaf Cola in the USA
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>
          Milaf Cola is the world&apos;s first cola made from real dates — Ajwa
          and Sukkari, brewed by the Al Madinah Heritage Company in Saudi
          Arabia with no added sugar or sweeteners. Finding it in the United
          States is hard; we keep it in stock in Houston and ship to all 50
          states. Explore the <Link href="/brand/milaf">Milaf brand page</Link>{" "}
          or grab a pack below.
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
          Milaf Cola questions, answered
        </h2>
        {FAQS.map((f) => (
          <details
            key={f.q}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid var(--line, #e5e0d8)",
            }}
          >
            <summary
              style={{ fontWeight: 700, fontSize: 15, cursor: "pointer" }}
            >
              {f.q}
            </summary>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--ink-2)",
                margin: "8px 0 0",
              }}
            >
              {f.a}
            </p>
          </details>
        ))}
        <p style={{ fontSize: 14, marginTop: 24, color: "var(--ink-2)" }}>
          Pairs well with everything sweet — browse{" "}
          <Link href="/collections/dates">Saudi dates</Link> and{" "}
          <Link href="/collections/baklava">fresh baklava</Link> to complete
          the order.
        </p>
      </div>
    </section>
  );
}
