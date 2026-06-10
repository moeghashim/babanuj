"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useFormStatus } from "react-dom";
import { useMountEffect } from "lib/use-mount-effect";
import { trackInitiateCheckout } from "lib/meta/events";
import { FREE_SHIPPING_THRESHOLD } from "lib/babanuj/shipping";
import {
  CartIcon,
  CloseIcon,
  ShieldIcon,
  TruckIcon,
} from "components/babanuj/icons";
import { redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";

export default function CartModal() {
  const {
    cart,
    updateCartItem,
    isCartOpen: isOpen,
    openCart,
    closeCart,
  } = useCart();
  const [mounted, setMounted] = useState(false);

  // Only render the portal client-side.
  useMountEffect(() => {
    setMounted(true);
  });

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const count = cart?.totalQuantity ?? 0;
  const visibleCount = mounted ? count : 0;
  const lines = cart?.lines ?? [];
  const subtotal = Number(cart?.cost.totalAmount.amount ?? 0);
  const freeShipRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShipPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const drawer = (
    <>
      {/* Scrim */}
      <div
        onClick={closeCart}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20,16,12,0.45)",
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity .25s ease",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer */}
      <aside
        className="mk-cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-100%",
          height: "100dvh",
          maxHeight: "100dvh",
          width: 460,
          maxWidth: "92vw",
          background: "#fff",
          color: "var(--ink)",
          zIndex: 201,
          transition: "right 320ms cubic-bezier(.2,.7,.3,1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-24px 0 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "22px 24px",
            borderBottom: "1px solid var(--rule)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <span className="micro" style={{ color: "var(--accent-dark)" }}>
              Your bag
            </span>
            <div
              className="display-heavy"
              style={{ fontSize: 26, marginTop: 2, lineHeight: 1 }}
            >
              {count === 0 ? "Empty" : `${count} item${count === 1 ? "" : "s"}`}
            </div>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: "var(--paper)",
              border: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink)",
            }}
          >
            <CloseIcon width={18} height={18} />
          </button>
        </header>

        {/* Free shipping progress */}
        {count > 0 && (
          <div
            style={{
              padding: "14px 24px 16px",
              borderBottom: "1px solid var(--rule)",
              background: "var(--accent-soft)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              <TruckIcon width={16} height={16} />
              {freeShipRemaining <= 0 ? (
                <span>
                  You unlocked{" "}
                  <strong style={{ color: "var(--accent-dark)" }}>
                    free shipping
                  </strong>{" "}
                  🎉
                </span>
              ) : (
                <span>
                  <span
                    className="num"
                    style={{
                      color: "var(--accent-dark)",
                      fontWeight: 700,
                    }}
                  >
                    ${freeShipRemaining.toFixed(2)}
                  </span>{" "}
                  away from free shipping
                </span>
              )}
            </div>
            <div
              style={{
                height: 5,
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
        )}

        {/* Items list */}
        <div
          className="mk-cart-drawer-items"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: count === 0 ? 0 : "8px 24px",
          }}
        >
          {count === 0 ? (
            <EmptyState onClose={closeCart} />
          ) : (
            lines
              .slice()
              .sort((a, b) =>
                a.merchandise.product.title.localeCompare(
                  b.merchandise.product.title,
                ),
              )
              .map((item, i, arr) => (
                <div
                  key={item.merchandise.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr auto",
                    gap: 14,
                    padding: "16px 0",
                    borderBottom:
                      i === arr.length - 1 ? 0 : "1px solid var(--rule)",
                    alignItems: "center",
                  }}
                >
                  <Link
                    href={`/product/${item.merchandise.product.handle}`}
                    onClick={closeCart}
                    aria-label={`View ${item.merchandise.product.title}`}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 12,
                      overflow: "hidden",
                      position: "relative",
                      background: "var(--paper)",
                      display: "block",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.merchandise.product.featuredImage.url}
                      alt={item.merchandise.product.title}
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
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1.25,
                      }}
                    >
                      {item.merchandise.product.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid var(--rule)",
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
                            minWidth: 22,
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: 13,
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
                      <DeleteItemButton
                        item={item}
                        optimisticUpdate={updateCartItem}
                      />
                    </div>
                  </div>
                  <div
                    className="display-heavy num"
                    style={{
                      fontSize: 16,
                      alignSelf: "start",
                      paddingTop: 4,
                    }}
                  >
                    ${Number(item.cost.totalAmount.amount).toFixed(2)}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <footer
            className="mk-cart-drawer-footer"
            style={{
              borderTop: "1px solid var(--rule)",
              padding: "16px 24px calc(22px + env(safe-area-inset-bottom))",
              background: "#fff",
              flexShrink: 0,
            }}
          >
            <div
              className="mk-cart-drawer-total-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
                Subtotal
              </span>
              <span className="num" style={{ fontSize: 14, fontWeight: 700 }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginTop: 10,
                paddingTop: 10,
                borderTop: "1px dashed var(--rule)",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                Estimated total
              </span>
              <span className="display-heavy num" style={{ fontSize: 22 }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: "var(--ink-2)",
                marginTop: 2,
                textAlign: "right",
              }}
            >
              Shipping & taxes at checkout
            </div>

            <div
              className="mk-cart-drawer-actions"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.4fr",
                gap: 8,
                marginTop: 14,
              }}
            >
              <Link
                href="/cart"
                onClick={closeCart}
                className="market-btn outline"
                style={{
                  justifyContent: "center",
                  padding: "13px",
                  fontSize: 13,
                }}
              >
                View bag
              </Link>
              <form
                action={redirectToCheckout}
                onSubmit={() => trackInitiateCheckout(cart)}
              >
                <CheckoutButton />
              </form>
            </div>

            <div
              className="mk-cart-drawer-trust"
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                marginTop: 12,
                fontSize: 10.5,
                color: "var(--ink-2)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <ShieldIcon width={12} height={12} /> Secure checkout
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <TruckIcon width={12} height={12} /> Ships in 48h
              </span>
            </div>
          </footer>
        )}
      </aside>
    </>
  );

  return (
    <>
      <button
        aria-label="Open cart"
        onClick={openCart}
        className="mk-bag"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          background: "var(--accent)",
          color: "#fff",
          border: 0,
          borderRadius: 999,
          cursor: "pointer",
          fontFamily: "inherit",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        <CartIcon width={18} height={18} /> Bag · {visibleCount}
      </button>
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          width: 72,
          height: 72,
          borderRadius: 999,
          background: "var(--accent-soft)",
          color: "var(--accent-dark)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <CartIcon width={32} height={32} />
      </div>
      <div className="display" style={{ fontSize: 22 }}>
        Your bag is empty
      </div>
      <p
        style={{
          fontSize: 13.5,
          color: "var(--ink-2)",
          marginTop: 6,
          marginBottom: 18,
        }}
      >
        Start with our bestsellers — or build a gift box.
      </p>
      <Link
        href="/search"
        onClick={onClose}
        className="market-btn"
        style={{ padding: "12px 20px", fontSize: 13 }}
      >
        Shop the pantry →
      </Link>
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
        padding: "13px",
        fontSize: 13,
        opacity: pending ? 0.5 : 1,
      }}
    >
      {pending ? "Loading…" : "Checkout →"}
    </button>
  );
}
