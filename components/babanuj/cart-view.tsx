"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { redirectToCheckout } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { DeleteItemButton } from "components/cart/delete-item-button";
import { EditItemQuantityButton } from "components/cart/edit-item-quantity-button";
import { ArrowRight, ShieldIcon, TruckIcon } from "components/babanuj/icons";
import { MarketProductCard } from "components/babanuj/product-card";
import type { BabanujProduct } from "lib/babanuj/data";
import { trackInitiateCheckout } from "lib/meta/events";

const FREE_SHIP_THRESHOLD = 70;

type Props = {
  recommended: BabanujProduct[];
};

export function CartView({ recommended }: Props) {
  const { cart, updateCartItem } = useCart();
  const lines = cart?.lines ?? [];
  const count = cart?.totalQuantity ?? 0;
  const subtotal = Number(cart?.cost.totalAmount.amount ?? 0);

  if (count === 0) {
    return <EmptyState />;
  }

  const freeShipRemaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const freeShipPct = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);

  return (
    <div>
      {/* Breadcrumb */}
      <nav
        className="mk-bread"
        style={{
          padding: "20px 56px 0",
          fontSize: 13,
          color: "var(--ink-2)",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ color: "var(--ink-2)" }}>
          Home
        </Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: "var(--ink)" }}>Bag</span>
      </nav>

      {/* Header */}
      <section style={{ padding: "24px 56px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <span className="micro" style={{ color: "var(--accent-dark)" }}>
              {count} item{count === 1 ? "" : "s"} · ships from Houston
            </span>
            <h1
              className="display-heavy"
              style={{
                fontSize: 56,
                margin: "8px 0 0",
                lineHeight: 1.0,
              }}
            >
              Your bag.
              <span
                className="editorial"
                style={{ color: "var(--accent-dark)" }}
              >
                {" "}
                Sweet things inside.
              </span>
            </h1>
          </div>
          <Link
            href="/search"
            className="market-btn outline"
            style={{ padding: "10px 18px", fontSize: 13 }}
          >
            <ArrowRight
              width={14}
              height={14}
              style={{ transform: "rotate(180deg)" }}
            />{" "}
            Continue shopping
          </Link>
        </div>
      </section>

      {/* Main grid */}
      <section style={{ padding: "0 56px 56px" }}>
        <div
          className="mk-cart-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* LEFT — items */}
          <div>
            {/* Free shipping progress */}
            <div
              style={{
                background: "var(--accent-soft)",
                border: "1px solid var(--rule)",
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <TruckIcon width={18} height={18} />
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {freeShipRemaining <= 0 ? (
                    <>
                      You unlocked{" "}
                      <span style={{ color: "var(--accent-dark)" }}>
                        free standard shipping
                      </span>{" "}
                      🎉
                    </>
                  ) : (
                    <>
                      You&apos;re{" "}
                      <span
                        className="num"
                        style={{ color: "var(--accent-dark)" }}
                      >
                        ${freeShipRemaining.toFixed(2)}
                      </span>{" "}
                      away from free shipping.
                    </>
                  )}
                </div>
              </div>
              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.6)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${freeShipPct}%`,
                    height: "100%",
                    background: "var(--accent)",
                    borderRadius: 999,
                    transition: "width .4s ease",
                  }}
                />
              </div>
            </div>

            {/* Items table */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--rule)",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <div
                className="mk-cart-header-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 140px 110px 40px",
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--rule)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ink-2)",
                  background: "var(--paper)",
                }}
              >
                <span>Item</span>
                <span style={{ textAlign: "center" }}>Quantity</span>
                <span style={{ textAlign: "right" }}>Total</span>
                <span></span>
              </div>
              {lines.map((item, i) => (
                <CartRow
                  key={item.merchandise.id}
                  item={item}
                  last={i === lines.length - 1}
                  updateCartItem={updateCartItem}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — summary */}
          <aside className="mk-cart-summary">
            <div style={{ position: "sticky", top: 140 }}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--rule)",
                  borderRadius: 20,
                  padding: 24,
                }}
              >
                <div
                  className="display"
                  style={{ fontSize: 22, marginBottom: 16 }}
                >
                  Order summary
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    fontSize: 14,
                  }}
                >
                  <Line
                    label={`Subtotal · ${count} item${count === 1 ? "" : "s"}`}
                    value={`$${subtotal.toFixed(2)}`}
                  />
                  <Line
                    label="Shipping & taxes"
                    value="Calculated at checkout"
                    subtle
                  />
                </div>

                {/* Promo code note */}
                <div
                  style={{
                    marginTop: 16,
                    padding: "14px 0 0",
                    borderTop: "1px dashed var(--rule)",
                    fontSize: 12,
                    color: "var(--ink-2)",
                  }}
                >
                  Have a discount code? Enter it at checkout.
                </div>

                {/* Estimated total */}
                <div
                  style={{
                    marginTop: 18,
                    padding: "18px 0 0",
                    borderTop: "1px solid var(--rule)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      Estimated total
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "var(--ink-2)",
                        marginTop: 2,
                      }}
                    >
                      Shipping & taxes at checkout
                    </div>
                  </div>
                  <span
                    className="display-heavy num"
                    style={{ fontSize: 32, color: "var(--ink)" }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <form
                  action={redirectToCheckout}
                  onSubmit={() => trackInitiateCheckout(cart)}
                >
                  <CheckoutButton />
                </form>

                <div
                  style={{
                    marginTop: 18,
                    padding: "14px 0 0",
                    borderTop: "1px solid var(--rule)",
                    display: "grid",
                    gap: 8,
                    fontSize: 11.5,
                    color: "var(--ink-2)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <TruckIcon width={14} height={14} /> Free standard shipping
                    over $70
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <ShieldIcon width={14} height={14} /> 30-day freshness
                    guarantee
                  </div>
                </div>
              </div>

              {/* Help card */}
              <div
                style={{
                  marginTop: 14,
                  background: "var(--paper)",
                  borderRadius: 16,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: "#fff",
                    color: "var(--accent-dark)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div style={{ lineHeight: 1.3 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    Need a hand?
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-2)" }}>
                    Chat with us Mon–Fri, 9–6 CT.
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* You might also like */}
      {recommended.length > 0 && (
        <section
          style={{
            padding: "32px 56px 64px",
            background: "var(--paper)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 20,
            }}
          >
            <div>
              <span className="micro" style={{ color: "var(--accent-dark)" }}>
                Pairs well with
              </span>
              <h2
                className="display-heavy"
                style={{ fontSize: 32, margin: "6px 0 0" }}
              >
                Add one more.
              </h2>
            </div>
            <Link
              href="/search"
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Shop everything →
            </Link>
          </div>
          <div
            className="mk-cart-related"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            {recommended.slice(0, 4).map((p, i) => (
              <MarketProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CartRow({
  item,
  last,
  updateCartItem,
}: {
  item: import("lib/shopify/types").CartItem;
  last: boolean;
  updateCartItem: (
    merchandiseId: string,
    updateType: "plus" | "minus" | "delete",
  ) => void;
}) {
  const product = item.merchandise.product;
  const lineTotal = Number(item.cost.totalAmount.amount);
  const unitPrice = item.quantity > 0 ? lineTotal / item.quantity : 0;
  return (
    <div
      className="mk-cart-row"
      style={{
        display: "grid",
        gridTemplateColumns: "1.8fr 140px 110px 40px",
        gap: 16,
        padding: "20px 20px",
        alignItems: "center",
        borderBottom: last ? 0 : "1px solid var(--rule)",
      }}
    >
      {/* Product */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <Link
          href={`/product/${product.handle}`}
          style={{
            width: 96,
            height: 96,
            background: "var(--paper)",
            borderRadius: 14,
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
            display: "block",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.featuredImage.url}
            alt={product.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Link>
        <div style={{ minWidth: 0 }}>
          <Link
            href={`/product/${product.handle}`}
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginTop: 4,
              lineHeight: 1.3,
              display: "block",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {product.title}
          </Link>
        </div>
      </div>

      {/* Qty stepper */}
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="mk-cart-qty"
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            border: "1.5px solid var(--ink)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <EditItemQuantityButton
            item={item}
            type="minus"
            optimisticUpdate={updateCartItem}
          />
          <span
            className="num"
            style={{
              minWidth: 28,
              textAlign: "center",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {item.quantity}
          </span>
          <EditItemQuantityButton
            item={item}
            type="plus"
            optimisticUpdate={updateCartItem}
          />
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right" }} className="mk-cart-price">
        <div className="display-heavy num" style={{ fontSize: 18 }}>
          ${lineTotal.toFixed(2)}
        </div>
        {item.quantity > 1 && (
          <div
            className="num"
            style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 2 }}
          >
            ${unitPrice.toFixed(2)} ea.
          </div>
        )}
      </div>

      {/* Remove */}
      <div style={{ justifySelf: "end" }}>
        <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div>
      <nav
        className="mk-bread"
        style={{
          padding: "20px 56px 0",
          fontSize: 13,
          color: "var(--ink-2)",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ color: "var(--ink-2)" }}>
          Home
        </Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: "var(--ink)" }}>Bag</span>
      </nav>
      <section style={{ padding: "60px 56px 80px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            width: 88,
            height: 88,
            borderRadius: 999,
            background: "var(--accent-soft)",
            color: "var(--accent-dark)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="20" r="1.2" />
            <circle cx="18" cy="20" r="1.2" />
            <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.5L21 8H6" />
          </svg>
        </div>
        <h1
          className="display-heavy"
          style={{ fontSize: 48, margin: "0 0 10px" }}
        >
          Your bag is empty.
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--ink-2)",
            maxWidth: 440,
            margin: "0 auto 24px",
          }}
        >
          Start with our most-loved sweets, or build your own gift box and
          we&apos;ll wrap it up.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/search" className="market-btn">
            Shop the pantry →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Line({
  label,
  value,
  accent,
  subtle,
}: {
  label: string;
  value: string;
  accent?: boolean;
  subtle?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <span style={{ color: "var(--ink-2)", fontSize: 13.5 }}>{label}</span>
      <span
        className="num"
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: accent
            ? "var(--accent-dark)"
            : subtle
              ? "var(--ink-2)"
              : "var(--ink)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="market-btn warn"
      style={{
        width: "100%",
        justifyContent: "center",
        padding: "16px",
        fontSize: 14,
        marginTop: 18,
        opacity: pending ? 0.5 : 1,
      }}
    >
      {pending ? "Loading…" : "Checkout →"}
    </button>
  );
}
