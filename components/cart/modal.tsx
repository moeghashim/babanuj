"use client";

import { CartIcon, CloseIcon, MinusIcon, PlusIcon } from "components/babanuj/icons";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import { DeleteItemButton } from "./delete-item-button";

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const count = cart?.totalQuantity ?? 0;
  const subtotal = cart?.cost.totalAmount.amount ?? "0.00";
  const lines = cart?.lines ?? [];

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
        <CartIcon width={18} height={18} /> Bag · {count}
      </button>

      {/* Scrim */}
      <div
        onClick={closeCart}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20,16,12,0.55)",
          zIndex: 100,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity .2s ease",
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: 440,
          maxWidth: "100vw",
          background: "#fff",
          color: "var(--ink)",
          zIndex: 101,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .35s cubic-bezier(.2,.7,.3,1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-20px 0 50px rgba(0,0,0,0.15)",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 28px",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          <div>
            <div className="micro">Your Bag</div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginTop: 4,
                fontFamily: "Bricolage Grotesque, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {count} item{count === 1 ? "" : "s"}
            </div>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              background: "transparent",
              border: 0,
              color: "var(--ink)",
              cursor: "pointer",
              padding: 8,
            }}
          >
            <CloseIcon width={22} height={22} />
          </button>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 28px" }}>
          {lines.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "var(--ink-2)",
              }}
            >
              <CartIcon width={40} height={40} />
              <div style={{ marginTop: 16, fontSize: 14 }}>
                Your bag is empty.
              </div>
              <p style={{ fontSize: 12.5, marginTop: 8, color: "var(--ink-2)" }}>
                Browse the pantry and add a few sweets to get started.
              </p>
            </div>
          ) : (
            lines
              .slice()
              .sort((a, b) =>
                a.merchandise.product.title.localeCompare(
                  b.merchandise.product.title,
                ),
              )
              .map((item) => (
                <div
                  key={item.merchandise.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "64px 1fr auto",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom: "1px dashed var(--rule)",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      overflow: "hidden",
                      position: "relative",
                      background: "var(--paper)",
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
                    <div
                      style={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                      }}
                    >
                      <DeleteItemButton
                        item={item}
                        optimisticUpdate={updateCartItem}
                      />
                    </div>
                  </div>
                  <div>
                    <div
                      className="micro"
                      style={{ fontSize: 10, color: "var(--ink-2)" }}
                    >
                      {item.merchandise.product.title}
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        marginTop: 2,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.merchandise.product.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid var(--rule)",
                          borderRadius: 999,
                        }}
                      >
                        <EditItemQuantityButton
                          item={item}
                          type="minus"
                          optimisticUpdate={updateCartItem}
                        />
                        <span
                          style={{
                            minWidth: 24,
                            textAlign: "center",
                            fontWeight: 600,
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
                    </div>
                  </div>
                  <div
                    className="num"
                    style={{
                      fontWeight: 800,
                      fontVariantNumeric: "tabular-nums",
                      fontFamily: "Bricolage Grotesque, sans-serif",
                    }}
                  >
                    $
                    {Number(item.cost.totalAmount.amount).toFixed(2)}
                  </div>
                </div>
              ))
          )}
        </div>

        <footer
          style={{
            padding: "20px 28px 28px",
            borderTop: "1px solid var(--rule)",
            background: "var(--paper)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              marginBottom: 14,
            }}
          >
            <span style={{ color: "var(--ink-2)" }}>Subtotal</span>
            <span
              className="num"
              style={{
                fontWeight: 800,
                fontFamily: "Bricolage Grotesque, sans-serif",
              }}
            >
              ${Number(subtotal).toFixed(2)}
            </span>
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: "var(--ink-2)",
              marginBottom: 14,
            }}
          >
            Shipping calculated at checkout. Free over $59.
          </div>
          <form action={redirectToCheckout}>
            <CheckoutButton disabled={lines.length === 0} />
          </form>
        </footer>
      </aside>
    </>
  );
}

function CheckoutButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="market-btn"
      style={{
        width: "100%",
        justifyContent: "center",
        padding: "14px",
        fontSize: 14,
        opacity: disabled || pending ? 0.5 : 1,
      }}
    >
      {pending ? "Loading…" : "Checkout →"}
    </button>
  );
}
