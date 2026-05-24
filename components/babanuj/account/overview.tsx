import Link from "next/link";
import { AccountCard, AccountEmpty, AccountShell } from "./shell";
import {
  formatAddress,
  formatCustomerDate,
  formatCustomerMoney,
  titleCaseStatus,
} from "./format";
import type { CustomerAccount } from "lib/shopify/customer-account";

export function AccountOverview({ customer }: { customer: CustomerAccount }) {
  const orders = customer.orders.nodes;
  const defaultAddress = customer.defaultAddress;

  return (
    <AccountShell
      title={`Hi, ${customer.firstName || customer.displayName}.`}
      subtitle="Track orders, manage saved shipping details, and keep your Babanuj profile current."
    >
      <div style={{ display: "grid", gap: 18 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
          }}
          className="mk-account-stats"
        >
          <Stat label="Orders" value={String(orders.length)} />
          <Stat
            label="Saved addresses"
            value={String(customer.addresses.nodes.length)}
          />
          <Stat
            label="Email"
            value={customer.emailAddress?.emailAddress ?? "Not set"}
          />
        </div>

        <AccountCard
          title="Recent orders"
          action={
            <Link href="/account/orders" style={smallLinkStyle}>
              View all
            </Link>
          }
        >
          {orders.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {orders.slice(0, 3).map((order) => (
                <Link
                  href={`/account/orders/${encodeURIComponent(order.id)}`}
                  key={order.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 14,
                    alignItems: "center",
                    padding: 14,
                    border: "1px solid var(--rule)",
                    borderRadius: 14,
                  }}
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
                      {formatCustomerDate(order.processedAt)} ·{" "}
                      {titleCaseStatus(order.fulfillmentStatus)}
                    </span>
                  </span>
                  <span className="num" style={{ fontWeight: 800 }}>
                    {formatCustomerMoney(order.totalPrice)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <AccountEmpty title="No orders yet">
              Your order history will appear here after checkout.
            </AccountEmpty>
          )}
        </AccountCard>

        <AccountCard
          title="Default address"
          action={
            <Link href="/account/addresses" style={smallLinkStyle}>
              Manage
            </Link>
          }
        >
          {defaultAddress ? (
            <AddressLines lines={formatAddress(defaultAddress)} />
          ) : (
            <AccountEmpty title="No default address">
              Add a saved address to make future checkouts faster.
            </AccountEmpty>
          )}
        </AccountCard>
      </div>
    </AccountShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid var(--rule)",
        borderRadius: 18,
        padding: 18,
        background: "var(--paper)",
        minHeight: 104,
      }}
    >
      <div className="micro" style={{ color: "var(--accent-dark)" }}>
        {label}
      </div>
      <div
        className="display"
        style={{
          fontSize: value.includes("@") ? 20 : 34,
          marginTop: 10,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function AddressLines({ lines }: { lines: string[] }) {
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
