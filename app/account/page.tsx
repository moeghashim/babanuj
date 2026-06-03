import { AccountOverview } from "components/babanuj/account/overview";
import { AccountSetup } from "components/babanuj/account/setup";
import { PostHogIdentify } from "components/babanuj/posthog-identify";
import {
  getCustomerAccount,
  getCustomerSession,
  isCustomerAccountConfigured,
} from "lib/shopify/customer-account";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your account",
  description: "Manage your Babanuj orders, profile, and saved addresses.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ auth_error?: string }>;
}) {
  const params = await searchParams;

  if (!isCustomerAccountConfigured()) {
    return <AccountSetup authError={params.auth_error} />;
  }

  const session = await getCustomerSession();
  if (!session) redirect("/account/login?redirect=/account");

  try {
    const customer = await getCustomerAccount(session);
    return (
      <>
        <PostHogIdentify
          distinctId={customer.id}
          email={customer.emailAddress?.emailAddress}
          name={customer.displayName}
        />
        <AccountOverview customer={customer} />
      </>
    );
  } catch (err) {
    console.error("Error loading customer account", err);
    redirect("/account/login?redirect=/account");
  }
}
