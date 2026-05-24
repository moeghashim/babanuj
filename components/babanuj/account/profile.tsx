import { ProfileForm } from "./profile-form";
import { AccountCard, AccountShell } from "./shell";

export function AccountProfile({
  displayName,
  firstName,
  lastName,
  email,
}: {
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}) {
  return (
    <AccountShell
      title="Your profile."
      subtitle={`Personal details for ${displayName}.`}
    >
      <div style={{ display: "grid", gap: 18 }}>
        <AccountCard title="Contact">
          <div style={{ display: "grid", gap: 6 }}>
            <span className="micro" style={{ color: "var(--accent-dark)" }}>
              Login email
            </span>
            <strong style={{ overflowWrap: "anywhere" }}>
              {email ?? "Not provided"}
            </strong>
            <p
              style={{ margin: "8px 0 0", color: "var(--ink-2)", fontSize: 13 }}
            >
              Email sign-in is managed by Shopify Customer Accounts.
            </p>
          </div>
        </AccountCard>

        <AccountCard title="Name">
          <ProfileForm firstName={firstName} lastName={lastName} />
        </AccountCard>
      </div>
    </AccountShell>
  );
}
