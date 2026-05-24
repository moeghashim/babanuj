import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Profile", href: "/account/profile" },
];

type ShellProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function AccountShell({
  children,
  eyebrow = "Customer account",
  title,
  subtitle,
}: ShellProps) {
  return (
    <div style={{ background: "#fff" }}>
      <section style={{ padding: "34px 56px 28px" }}>
        <span className="micro" style={{ color: "var(--accent-dark)" }}>
          {eyebrow}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          <div>
            <h1
              className="display-heavy"
              style={{ fontSize: 54, margin: 0, lineHeight: 1 }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p
                style={{
                  color: "var(--ink-2)",
                  fontSize: 15,
                  margin: "12px 0 0",
                  maxWidth: 680,
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
          <form action="/account/logout" method="post">
            <button
              type="submit"
              className="market-btn outline"
              style={{ padding: "10px 16px", fontSize: 13 }}
            >
              Sign out
            </button>
          </form>
        </div>
      </section>

      <section style={{ padding: "0 56px 56px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px minmax(0, 1fr)",
            gap: 28,
            alignItems: "start",
          }}
          className="mk-account-grid"
        >
          <aside
            style={{
              border: "1px solid var(--rule)",
              borderRadius: 18,
              overflow: "hidden",
              background: "var(--paper)",
            }}
          >
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  padding: "14px 16px",
                  borderTop: index === 0 ? 0 : "1px solid var(--rule)",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {item.label}
              </Link>
            ))}
          </aside>
          <div>{children}</div>
        </div>
      </section>
    </div>
  );
}

export function AccountCard({
  children,
  title,
  action,
}: {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <section
      style={{
        border: "1px solid var(--rule)",
        borderRadius: 20,
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {title || action ? (
        <header
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid var(--rule)",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
          }}
        >
          {title ? (
            <h2 className="display" style={{ margin: 0, fontSize: 22 }}>
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </header>
      ) : null}
      <div style={{ padding: 20 }}>{children}</div>
    </section>
  );
}

export function AccountEmpty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px dashed var(--rule)",
        borderRadius: 16,
        padding: 22,
      }}
    >
      <h3 className="display" style={{ margin: "0 0 8px", fontSize: 20 }}>
        {title}
      </h3>
      <div style={{ color: "var(--ink-2)", fontSize: 14 }}>{children}</div>
    </div>
  );
}
