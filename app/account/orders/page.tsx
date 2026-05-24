import { AccountOrders } from "components/babanuj/account/orders";
import {
  getCustomerOrders,
  getCustomerSession,
  isCustomerAccountConfigured,
} from "lib/shopify/customer-account";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your orders",
  description: "Review your Babanuj order history.",
};

export default async function AccountOrdersPage() {
  if (!isCustomerAccountConfigured()) redirect("/account");

  const session = await getCustomerSession();
  if (!session) redirect("/account/login?redirect=/account/orders");

  try {
    const customer = await getCustomerOrders(session);
    return (
      <AccountOrders
        displayName={customer.displayName}
        orders={customer.orders.nodes}
      />
    );
  } catch (err) {
    console.error("Error loading customer orders", err);
    redirect("/account/login?redirect=/account/orders");
  }
}
