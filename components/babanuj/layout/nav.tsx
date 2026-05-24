import CartModal from "components/cart/modal";
import { HeartIcon, UserIcon } from "components/babanuj/icons";
import { MobileMenu } from "components/babanuj/layout/mobile-menu";
import { SearchBar } from "components/babanuj/layout/search-bar";
import {
  getCustomerSession,
  isCustomerAccountConfigured,
} from "lib/shopify/customer-account";
import Link from "next/link";

export async function MarketNav() {
  const configured = isCustomerAccountConfigured();
  const session = await getCustomerSession();
  const accountHref = session
    ? "/account"
    : configured
      ? "/account/login"
      : "/account";
  const accountLabel = session ? "Account" : "Sign in";

  return (
    <div
      className="mk-nav-wrap"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr 280px",
          alignItems: "center",
          gap: 24,
          padding: "18px 56px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <span
            className="display-heavy"
            style={{
              fontSize: 30,
              fontFamily: "var(--font-bricolage, ui-sans-serif), sans-serif",
              letterSpacing: "-0.02em",
              fontWeight: 800,
              color: "#000",
            }}
          >
            babanuj
          </span>
        </Link>

        <SearchBar />

        <div
          className="mk-nav-actions"
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <MobileMenu accountHref={accountHref} accountLabel={accountLabel} />
          <a
            aria-label={
              session ? "Open your account" : "Sign in to your account"
            }
            href={accountHref}
            style={navIconBtn as React.CSSProperties}
          >
            <UserIcon width={22} height={22} />
            {accountLabel}
          </a>
          <button
            type="button"
            aria-label="Wishlist (coming soon)"
            title="Wishlist — coming soon"
            disabled
            style={{
              ...navIconBtn,
              cursor: "not-allowed",
              opacity: 0.55,
            }}
          >
            <HeartIcon width={22} height={22} />
            Wishlist
          </button>
          <CartModal />
        </div>
      </div>
    </div>
  );
}

const navIconBtn = {
  background: "transparent",
  border: 0,
  cursor: "pointer",
  display: "inline-flex",
  flexDirection: "column" as const,
  alignItems: "center" as const,
  gap: 2,
  fontFamily: "inherit",
  fontSize: 11,
  color: "var(--ink)",
};
