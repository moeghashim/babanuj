import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Babanuj, including how customer and website data is collected, used, and protected.",
};

const updatedAt = "May 18, 2026";

export default function PrivacyPolicyPage() {
  return (
    <section
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: "72px 24px 96px",
        color: "var(--ink)",
      }}
    >
      <p className="micro" style={{ color: "var(--accent)", marginBottom: 16 }}>
        Legal
      </p>
      <h1
        className="display-heavy"
        style={{ fontSize: 54, lineHeight: 1, marginBottom: 18 }}
      >
        Privacy Policy
      </h1>
      <p style={{ color: "var(--ink-2)", marginBottom: 42 }}>
        Last updated: {updatedAt}
      </p>

      <div
        style={{
          display: "grid",
          gap: 28,
          fontSize: 16,
          lineHeight: 1.75,
        }}
      >
        <PolicySection title="Overview">
          <p>
            Babanuj Inc. operates babanuj.com and sells specialty sweets and
            related products online. This Privacy Policy explains how we
            collect, use, disclose, and protect information when you visit our
            website, place an order, contact us, or interact with our
            advertising.
          </p>
        </PolicySection>

        <PolicySection title="Information We Collect">
          <p>
            We may collect information you provide directly, including your
            name, email address, phone number, billing and shipping address,
            order details, customer service messages, and marketing preferences.
          </p>
          <p>
            We also collect website and device information such as pages viewed,
            products viewed, cart activity, checkout activity, browser type,
            approximate location, referral source, and cookie or pixel
            identifiers.
          </p>
        </PolicySection>

        <PolicySection title="How We Use Information">
          <p>
            We use information to process orders, arrange shipping, provide
            customer support, prevent fraud, improve the website, personalize
            shopping experiences, measure marketing performance, and send
            transactional or marketing communications where permitted.
          </p>
        </PolicySection>

        <PolicySection title="Advertising And Analytics">
          <p>
            We may use analytics and advertising tools, including Meta and
            Google services, to understand website performance, measure ad
            results, and show relevant ads. These tools may use cookies, pixels,
            tags, and similar technologies to collect information about your
            activity on our site and other websites.
          </p>
        </PolicySection>

        <PolicySection title="Sharing Information">
          <p>
            We share information with service providers that help operate our
            business, including ecommerce, payment processing, shipping,
            analytics, advertising, email, fraud prevention, and customer
            support providers. We may also disclose information if required by
            law or to protect our rights, customers, and business.
          </p>
        </PolicySection>

        <PolicySection title="Cookies">
          <p>
            Babanuj and its service providers use cookies and similar
            technologies to keep the site working, remember preferences, analyze
            traffic, and support advertising. You can control cookies through
            your browser settings, but some site features may not work correctly
            if cookies are disabled.
          </p>
        </PolicySection>

        <PolicySection title="Your Choices">
          <p>
            You may unsubscribe from marketing emails using the link in those
            emails. You may also contact us to request access, correction, or
            deletion of personal information, subject to legal and operational
            requirements.
          </p>
        </PolicySection>

        <PolicySection title="Data Retention And Security">
          <p>
            We retain information for as long as needed to provide services,
            comply with legal obligations, resolve disputes, and maintain
            business records. We use reasonable safeguards to protect
            information, but no method of transmission or storage is completely
            secure.
          </p>
        </PolicySection>

        <PolicySection title="Contact">
          <p>
            For privacy questions or data requests, contact Babanuj at{" "}
            <a href="mailto:mohanadgh@gmail.com">mohanadgh@gmail.com</a>.
          </p>
          <p>Babanuj Inc., 10099 Westpark Dr, Houston, TX 77042.</p>
        </PolicySection>
      </div>
    </section>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        {title}
      </h2>
      <div style={{ display: "grid", gap: 12 }}>{children}</div>
    </section>
  );
}
