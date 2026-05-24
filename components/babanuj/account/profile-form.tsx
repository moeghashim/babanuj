"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveProfile, type AccountActionState } from "app/account/actions";

export function ProfileForm({
  firstName,
  lastName,
}: {
  firstName?: string | null;
  lastName?: string | null;
}) {
  const [state, action] = useActionState<AccountActionState | null, FormData>(
    saveProfile,
    null,
  );

  return (
    <form action={action} style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
        }}
        className="mk-account-form-grid"
      >
        <Field label="First name" name="firstName" defaultValue={firstName} />
        <Field label="Last name" name="lastName" defaultValue={lastName} />
      </div>
      <FormMessage state={state} />
      <SubmitButton label="Save profile" />
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700 }}>
      {label}
      <input name={name} defaultValue={defaultValue ?? ""} style={inputStyle} />
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
