import { AccountOrderDetail } from "components/babanuj/account/orders";
import {
  getCustomerOrder,
  getCustomerSession,
  isCustomerAccountConfigured,
} from "lib/shopify/customer-account";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Order details",
  description: "Review a Babanuj order.",
};

export default async function AccountOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  if (!isCustomerAccountConfigured()) redirect("/account");

  const session = await getCustomerSession();
  if (!session) redirect("/account/login?redirect=/account/orders");

  const { orderId } = await params;

  try {
    const order = await getCustomerOrder(session, decodeURIComponent(orderId));
    if (!order) notFound();

    return <AccountOrderDetail order={order} />;
  } catch (err) {
    console.error("Error loading customer order", err);
    redirect("/account/login?redirect=/account/orders");
  }
}
