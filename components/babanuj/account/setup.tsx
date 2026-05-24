import Link from "next/link";

const requiredVars = [
  "SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID",
  "SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI",
  "SESSION_SECRET",
];

export function AccountSetup({ authError }: { authError?: string }) {
  return (
    <section style={{ padding: "54px 56px 64px" }}>
      <div style={{ maxWidth: 820 }}>
        <span className="micro" style={{ color: "var(--accent-dark)" }}>
          Customer account
        </span>
        <h1
          className="display-heavy"
          style={{ fontSize: 54, margin: "10px 0 12px", lineHeight: 1 }}
        >
          Account setup is almost ready.
        </h1>
        <p style={{ color: "var(--ink-2)", fontSize: 15, maxWidth: 680 }}>
          Babanuj can now host the customer account area in-app. Add the Shopify
          Customer Account API settings below, then register
          <code style={codeStyle}>/account/authorize</code> as the callback URI
          in Shopify.
        </p>
      </div>

      {authError ? (
        <div
          role="alert"
          style={{
            marginTop: 22,
            padding: 16,
            border: "1px solid rgba(176,77,26,0.25)",
            borderRadius: 14,
            color: "var(--warn)",
            background: "rgba(176,77,26,0.06)",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Login did not complete: {authError.replace(/_/g, " ")}.
        </div>
      ) : null}

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 18,
        }}
        className="mk-account-setup-grid"
      >
        <section
          style={{
            border: "1px solid var(--rule)",
            borderRadius: 20,
            padding: 22,
            background: "#fff",
          }}
        >
          <h2 className="display" style={{ margin: "0 0 12px", fontSize: 24 }}>
            Environment
          </h2>
          <div style={{ display: "grid", gap: 10 }}>
            {requiredVars.map((name) => (
              <code key={name} style={envStyle}>
                {name}
              </code>
            ))}
          </div>
        </section>

        <section
          style={{
            border: "1px solid var(--rule)",
            borderRadius: 20,
            padding: 22,
            background: "var(--paper)",
          }}
        >
          <h2 className="display" style={{ margin: "0 0 12px", fontSize: 24 }}>
            Shopify settings
          </h2>
          <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14 }}>
            In the Headless or Hydrogen sales channel, enable Customer Account
            API, add the production callback URL, add the logout URL, and add
            the JavaScript origin. For local login testing, use a public HTTPS
            tunnel instead of localhost.
          </p>
        </section>
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
        <Link href="/search" className="market-btn">
          Continue shopping
        </Link>
        <Link href="/" className="market-btn outline">
          Back home
        </Link>
      </div>
    </section>
  );
}

const codeStyle = {
  margin: "0 4px",
  padding: "2px 6px",
  borderRadius: 6,
  background: "var(--paper)",
  fontSize: 13,
};

const envStyle = {
  display: "block",
  padding: "12px 14px",
  borderRadius: 12,
  background: "var(--paper)",
  border: "1px solid var(--rule)",
  fontSize: 12,
  overflowWrap: "anywhere" as const,
};
