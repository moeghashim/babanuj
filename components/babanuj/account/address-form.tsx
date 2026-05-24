"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveAddress, type AccountActionState } from "app/account/actions";
import type { CustomerAddress } from "lib/shopify/customer-account";

export function AddressForm({ address }: { address?: CustomerAddress }) {
  const [state, action] = useActionState<AccountActionState | null, FormData>(
    saveAddress,
    null,
  );

  return (
    <form action={action} style={{ display: "grid", gap: 14 }}>
      {address ? (
        <input type="hidden" name="addressId" value={address.id} />
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
        }}
        className="mk-account-form-grid"
      >
        <Field label="First name" name="firstName" value={address?.firstName} />
        <Field label="Last name" name="lastName" value={address?.lastName} />
        <Field label="Company" name="company" value={address?.company} />
        <Field
          label="Phone"
          name="phoneNumber"
          value={address?.phoneNumber}
          type="tel"
        />
      </div>
      <Field
        label="Address"
        name="address1"
        value={address?.address1}
        required
      />
      <Field
        label="Apartment, suite, etc."
        name="address2"
        value={address?.address2}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.7fr 0.7fr 0.5fr",
          gap: 12,
        }}
        className="mk-account-address-grid"
      >
        <Field label="City" name="city" value={address?.city} required />
        <Field
          label="State"
          name="zoneCode"
          value={address?.zoneCode}
          required
        />
        <Field label="ZIP" name="zip" value={address?.zip} required />
        <Field
          label="Country"
          name="territoryCode"
          value={address?.territoryCode ?? "US"}
          required
        />
      </div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <input type="checkbox" name="defaultAddress" defaultChecked={false} />
        Use as default shipping address
      </label>
      <FormMessage state={state} />
      <SubmitButton label={address ? "Save address" : "Add address"} />
    </form>
  );
}

function Field({
  label,
  name,
  value,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value?: string | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700 }}>
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={value ?? ""}
        style={inputStyle}
      />
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="market-btn"
      disabled={pending}
      style={{
        justifySelf: "start",
        opacity: pending ? 0.6 : 1,
      }}
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function FormMessage({ state }: { state: AccountActionState | null }) {
  if (!state) return null;

  return (
    <p
      role={state.ok ? "status" : "alert"}
      style={{
        margin: 0,
        color: state.ok ? "var(--accent-dark)" : "var(--warn)",
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {state.message}
    </p>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid var(--rule)",
  borderRadius: 12,
  padding: "12px 14px",
  font: "inherit",
  color: "var(--ink)",
  background: "#fff",
};
