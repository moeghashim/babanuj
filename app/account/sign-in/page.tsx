import {
  getCustomerSession,
  isCustomerAccountConfigured,
  sanitizeReturnPath,
} from "lib/shopify/customer-account";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in",
  description:
    "Sign in to your Babanuj account to view orders, manage addresses, and update your profile.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function AccountSignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) {
  if (!isCustomerAccountConfigured()) redirect("/account");

  const session = await getCustomerSession();
  if (session) redirect("/account");

  const params = (await searchParams) ?? {};
  const returnTo = sanitizeReturnPath(params.redirect);

  return (
    <section style={{ padding: "54px 56px 64px" }}>
      <div style={{ maxWidth: 620 }}>
        <span className="micro" style={{ color: "var(--accent-dark)" }}>
          Customer account
        </span>
        <h1
          className="display-heavy"
          style={{ fontSize: 54, margin: "10px 0 12px", lineHeight: 1 }}
        >
          Sign in to Babanuj.
        </h1>
        <p style={{ color: "var(--ink-2)", fontSize: 15, maxWidth: 520 }}>
          Continue to your account to view orders, saved addresses, profile
          details, and checkout information.
        </p>

        <form action="/account/login" method="get" style={{ marginTop: 26 }}>
          <input type="hidden" name="redirect" value={returnTo} />
          <button type="submit" className="market-btn">
            Continue to sign in
          </button>
        </form>
      </div>
    </section>
  );
}
