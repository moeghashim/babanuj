import { removeAddress, setDefaultAddress } from "app/account/actions";
import type { CustomerAddress } from "lib/shopify/customer-account";
import { AddressForm } from "./address-form";
import { formatAddress } from "./format";
import { AccountCard, AccountEmpty, AccountShell } from "./shell";

export function AccountAddresses({
  displayName,
  defaultAddress,
  addresses,
}: {
  displayName: string;
  defaultAddress?: CustomerAddress | null;
  addresses: CustomerAddress[];
}) {
  return (
    <AccountShell
      title="Saved addresses."
      subtitle={`Shipping addresses for ${displayName}.`}
    >
      <div style={{ display: "grid", gap: 18 }}>
        <AccountCard title="Add address">
          <AddressForm />
        </AccountCard>

        <AccountCard title="Address book">
          {addresses.length ? (
            <div style={{ display: "grid", gap: 14 }}>
              {addresses.map((address) => (
                <AddressItem
                  key={address.id}
                  address={address}
                  isDefault={address.id === defaultAddress?.id}
                />
              ))}
            </div>
          ) : (
            <AccountEmpty title="No saved addresses">
              Add a shipping address above to save it to your account.
            </AccountEmpty>
          )}
        </AccountCard>
      </div>
    </AccountShell>
  );
}

function AddressItem({
  address,
  isDefault,
}: {
  address: CustomerAddress;
  isDefault: boolean;
}) {
  return (
    <section
      style={{
        border: "1px solid var(--rule)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 16,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16,
        }}
        className="mk-account-address-item"
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            <strong>{address.name || "Saved address"}</strong>
            {isDefault ? <Badge>Default</Badge> : null}
          </div>
          <div style={{ display: "grid", gap: 3, color: "var(--ink-2)" }}>
            {formatAddress(address).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
          {!isDefault ? (
            <form action={setDefaultAddress}>
              <input type="hidden" name="addressId" value={address.id} />
              <button type="submit" style={textButtonStyle}>
                Make default
              </button>
            </form>
          ) : null}
          <form action={removeAddress}>
            <input type="hidden" name="addressId" value={address.id} />
            <button type="submit" style={textButtonStyle}>
              Delete
            </button>
          </form>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid var(--rule)",
          background: "var(--paper)",
          padding: 16,
        }}
      >
        <AddressForm address={address} />
      </div>
    </section>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span
      className="micro"
      style={{
        color: "#fff",
        background: "var(--accent)",
        borderRadius: 999,
        padding: "5px 8px",
        fontSize: 9,
      }}
    >
      {children}
    </span>
  );
}

const textButtonStyle = {
  border: 0,
  background: "transparent",
  cursor: "pointer",
  color: "var(--accent-dark)",
  fontWeight: 800,
  fontSize: 12,
  padding: 0,
};
