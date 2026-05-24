import Link from "next/link";
import { AccountCard, AccountEmpty, AccountShell } from "./shell";
import {
  formatAddress,
  formatCustomerDate,
  formatCustomerMoney,
  titleCaseStatus,
} from "./format";
import type {
  CustomerAddress,
  CustomerOrder,
} from "lib/shopify/customer-account";

export function AccountOrders({
  displayName,
  orders,
}: {
  displayName: string;
  orders: CustomerOrder[];
}) {
  return (
    <AccountShell
      title="Your orders."
      subtitle={`Order history for ${displayName}.`}
    >
      <AccountCard title="Order history">
        {orders.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${encodeURIComponent(order.id)}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr auto",
                  gap: 16,
                  alignItems: "center",
                  padding: 16,
                  border: "1px solid var(--rule)",
                  borderRadius: 14,
                }}
                className="mk-account-order-row"
              >
                <span>
                  <strong>{order.name}</strong>
                  <span
                    style={{
                      display: "block",
                      color: "var(--ink-2)",
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    {formatCustomerDate(order.processedAt)}
                  </span>
                </span>
                <span style={{ color: "var(--ink-2)", fontSize: 13 }}>
                  {titleCaseStatus(order.financialStatus)} ·{" "}
                  {titleCaseStatus(order.fulfillmentStatus)}
                </span>
                <strong className="num">
                  {formatCustomerMoney(order.totalPrice)}
                </strong>
              </Link>
            ))}
          </div>
        ) : (
          <AccountEmpty title="No orders yet">
            Your completed orders will appear here.
          </AccountEmpty>
        )}
      </AccountCard>
    </AccountShell>
  );
}

export function AccountOrderDetail({ order }: { order: CustomerOrder }) {
  return (
    <AccountShell
      title={order.name}
      subtitle={`${formatCustomerDate(order.processedAt)} · ${titleCaseStatus(
        order.financialStatus,
      )} · ${titleCaseStatus(order.fulfillmentStatus)}`}
    >
      <div style={{ display: "grid", gap: 18 }}>
        <AccountCard
          title="Items"
          action={
            order.statusPageUrl ? (
              <a href={order.statusPageUrl} style={smallLinkStyle}>
                Shopify status
              </a>
            ) : null
          }
        >
          <div style={{ display: "grid", gap: 10 }}>
            {order.lineItems.nodes.map((item) => (
              <div
                key={`${item.title}-${item.quantity}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 14,
                  padding: "12px 0",
                  borderBottom: "1px solid var(--rule)",
                }}
              >
                <span>
                  <strong>{item.title}</strong>
                  <span
                    style={{
                      display: "block",
                      color: "var(--ink-2)",
                      fontSize: 13,
                    }}
                  >
                    Qty {item.quantity}
                  </span>
                </span>
                <strong className="num">
                  {formatCustomerMoney(item.totalPrice)}
                </strong>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 10,
                fontWeight: 800,
              }}
            >
              <span>Total</span>
              <span className="num">
                {formatCustomerMoney(order.totalPrice)}
              </span>
            </div>
          </div>
        </AccountCard>

        <AccountCard title="Shipping address">
          <AddressBlock address={order.shippingAddress} />
        </AccountCard>
      </div>
    </AccountShell>
  );
}

function AddressBlock({ address }: { address?: CustomerAddress | null }) {
  const lines = formatAddress(address);

  if (!lines.length) {
    return (
      <AccountEmpty title="No shipping address">
        This order does not include a shipping address.
      </AccountEmpty>
    );
  }

  return (
    <div style={{ display: "grid", gap: 4, color: "var(--ink-2)" }}>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  );
}

const smallLinkStyle = {
  fontSize: 13,
  fontWeight: 800,
  color: "var(--accent-dark)",
};
