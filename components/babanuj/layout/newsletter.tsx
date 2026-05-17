"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  subscribeNewsletter,
  type NewsletterState,
} from "app/actions/newsletter";

export function MarketNewsletter() {
  const [state, action] = useActionState<NewsletterState | null, FormData>(
    subscribeNewsletter,
    null,
  );

  return (
    <section style={{ padding: "32px 56px 56px" }}>
      <div
        className="mk-news"
        style={{
          background: "var(--cream)",
          borderRadius: 24,
          padding: "48px 56px",
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 32,
          alignItems: "center",
        }}
      >
        <div>
          <span className="micro" style={{ color: "var(--accent-dark)" }}>
            $10 off your first order
          </span>
          <h3
            className="display-heavy"
            style={{ fontSize: 36, margin: "10px 0 6px" }}
          >
            Get $10 off when you join
          </h3>
          <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
            One email a month. New brands, fresh drops, recipes. No spam, no
            nonsense.
          </p>
        </div>

        <div>
          {state?.ok ? (
            <SubscribedNotice message={state.message} />
          ) : (
            <form
              action={action}
              style={{
                display: "flex",
                gap: 8,
                background: "#fff",
                borderRadius: 999,
                padding: 6,
              }}
            >
              <input
                name="email"
                type="email"
                required
                placeholder="your@email"
                aria-label="Email address"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: 0,
                  padding: "12px 18px",
                  fontFamily: "inherit",
                  fontSize: 14,
                  outline: "none",
                  color: "var(--ink)",
                }}
              />
              <SubmitButton />
            </form>
          )}
          {state && !state.ok && (
            <p
              role="alert"
              style={{
                marginTop: 10,
                fontSize: 12.5,
                color: "var(--warn)",
                fontWeight: 600,
              }}
            >
              {state.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="market-btn"
      disabled={pending}
      style={{ opacity: pending ? 0.6 : 1 }}
    >
      {pending ? "Sending…" : "Get $10 Off"}
    </button>
  );
}

function SubscribedNotice({ message }: { message: string }) {
  return (
    <div
      role="status"
      style={{
        background: "#fff",
        borderRadius: 999,
        padding: "16px 22px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: "var(--accent-dark)",
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 999,
          background: "var(--accent)",
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        ✓
      </span>
      {message}
    </div>
  );
}
