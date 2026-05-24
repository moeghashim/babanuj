import { AccountProfile } from "components/babanuj/account/profile";
import {
  getCustomerProfile,
  getCustomerSession,
  isCustomerAccountConfigured,
} from "lib/shopify/customer-account";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your profile",
  description: "Manage your Babanuj customer profile.",
};

export default async function AccountProfilePage() {
  if (!isCustomerAccountConfigured()) redirect("/account");

  const session = await getCustomerSession();
  if (!session) redirect("/account/login?redirect=/account/profile");

  try {
    const customer = await getCustomerProfile(session);
    return (
      <AccountProfile
        displayName={customer.displayName}
        firstName={customer.firstName}
        lastName={customer.lastName}
        email={customer.emailAddress?.emailAddress}
      />
    );
  } catch (err) {
    console.error("Error loading customer profile", err);
    redirect("/account/login?redirect=/account/profile");
  }
}
