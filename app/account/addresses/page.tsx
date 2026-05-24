import { AccountAddresses } from "components/babanuj/account/addresses";
import {
  getCustomerAddresses,
  getCustomerSession,
  isCustomerAccountConfigured,
} from "lib/shopify/customer-account";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Saved addresses",
  description: "Manage Babanuj account shipping addresses.",
};

export default async function AccountAddressesPage() {
  if (!isCustomerAccountConfigured()) redirect("/account");

  const session = await getCustomerSession();
  if (!session) redirect("/account/login?redirect=/account/addresses");

  try {
    const customer = await getCustomerAddresses(session);
    return (
      <AccountAddresses
        displayName={customer.displayName}
        defaultAddress={customer.defaultAddress}
        addresses={customer.addresses.nodes}
      />
    );
  } catch (err) {
    console.error("Error loading customer addresses", err);
    redirect("/account/login?redirect=/account/addresses");
  }
}
