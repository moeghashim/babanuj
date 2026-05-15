import CartModal from "components/cart/modal";
import {
  HeartIcon,
  SearchIcon,
  UserIcon,
} from "components/babanuj/icons";
import { MobileMenu } from "components/babanuj/layout/mobile-menu";
import Link from "next/link";

export function MarketNav() {
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
              letterSpacing: "-0.02em",
              color: "#000",
            }}
          >
            babanuj
          </span>
        </Link>

        <form
          className="mk-nav-search"
          action="/search"
          style={{
            flex: 1,
            display: "flex",
            maxWidth: 640,
            margin: "0 auto",
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "var(--paper)",
              borderRadius: 999,
              padding: "12px 20px",
              gap: 10,
            }}
          >
            <SearchIcon width={18} height={18} />
            <input
              name="q"
              placeholder="Search 240+ sweets, brands, gifts…"
              style={{
                flex: 1,
                background: "transparent",
                border: 0,
                outline: "none",
                fontFamily: "inherit",
                fontSize: 14,
              }}
            />
            <span
              className="micro"
              style={{
                fontSize: 10,
                opacity: 0.5,
                padding: "4px 8px",
                border: "1px solid var(--rule)",
                borderRadius: 6,
              }}
            >
              ⌘K
            </span>
          </div>
        </form>

        <div
          className="mk-nav-actions"
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <MobileMenu />
          <a
            aria-label="Sign in to your account"
            href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "babanuj.myshopify.com"}/account/login`}
            style={navIconBtn as React.CSSProperties}
          >
            <UserIcon width={22} height={22} />
            Sign in
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
