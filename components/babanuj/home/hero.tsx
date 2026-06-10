"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, TruckIcon } from "components/babanuj/icons";
import { Photo } from "components/babanuj/photo";
import { ALL_PRODUCTS, BRANDS, HERO_IMG } from "lib/babanuj/data";
import { FREE_SHIPPING_SHORT_LABEL } from "lib/babanuj/shipping";
import { useMountEffect } from "lib/use-mount-effect";

type Slide = {
  img: string;
  chip: string;
  titleParts: Array<string | { italic: string }>;
  sub: string;
  cta: { label: string; href: string; variant: "warn" | "cream" };
  align: "left" | "right";
};

const SLIDES: Slide[] = [
  {
    img: HERO_IMG,
    chip: "HEIRLOOM SWEETS · SHIPPED FRESH",
    titleParts: ["Heirloom sweets,", { italic: "delivered weekly." }],
    sub: "Curated Türkish, Syrian and Gulf sweet houses — shipped fresh from Houston.",
    cta: { label: "Shop the Pantry", href: "/search", variant: "warn" },
    align: "left",
  },
  {
    img: "https://cdn.shopify.com/s/files/1/0673/0216/2690/files/41gllxLXI7L._SX679.jpg?v=1757873500",
    chip: "JUST DROPPED · LIMITED RUN",
    titleParts: ["Milaf Date Cola", { italic: "is here." }],
    sub: "A crisp Saudi date cola made with real date sweetness. Serve chilled with maamoul, baklava, or your next pantry box.",
    cta: {
      label: "Shop Milaf Cola",
      href: "/product/milaf-date-cola-240ml-8-1-fl-oz",
      variant: "warn",
    },
    align: "right",
  },
  {
    img: ALL_PRODUCTS[2]!.img,
    chip: "SMALL-BATCH MAAMOUL · BAB SHARQI",
    titleParts: ["Maamoul,", { italic: "baked this morning." }],
    sub: "Damascus date cookies baked close to ship day. Keep a tin ready for coffee, guests, and weekend dessert trays.",
    cta: {
      label: "Order Maamoul",
      href: "/product/zaitoune-maamoul-date-250g",
      variant: "warn",
    },
    align: "left",
  },
  {
    img: BRANDS[0]!.img,
    chip: "BUILD YOUR OWN GIFT BOX",
    titleParts: ["Pick six.", { italic: "We pack, wrap, ship." }],
    sub: "Mix any six pieces from our pantry — we pack it, wrap it, ship it.",
    cta: {
      label: "Build a Box",
      href: "/collections/gift-boxes",
      variant: "warn",
    },
    align: "right",
  },
];

export function MarketHero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  // On mobile we hide slides 2-4 (LCP win) so the carousel has nothing to
  // rotate to — track that here and skip the interval entirely.
  const [isMobile, setIsMobile] = useState(true);
  const len = SLIDES.length;

  useMountEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => {
      setIsMobile(mq.matches);
      if (mq.matches) setIdx(0);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  });

  React.useEffect(() => {
    if (isMobile) return;
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % len), 5500);
    return () => clearInterval(t);
  }, [paused, len, isMobile]);

  const go = (n: number) => setIdx(((n % len) + len) % len);

  return (
    <section style={{ padding: "0 0 32px" }}>
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="mk-hero-box"
        style={{
          position: "relative",
          overflow: "hidden",
          height: 560,
          background: "var(--accent-dark)",
        }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={
              i === 0 ? "mk-hero-slide" : "mk-hero-slide mk-hero-slide-rest"
            }
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === idx ? 1 : 0,
              transition: "opacity .9s ease",
              pointerEvents: i === idx ? "auto" : "none",
            }}
          >
            {(!isMobile || i === 0) && (
              <Photo
                src={s.img}
                alt=""
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : "auto"}
                quality={i === 0 ? 60 : 75}
                fallbackWidth={i === 0 ? 1920 : 1200}
                sizes="(max-width: 768px) 50vw, 100vw"
                style={{
                  position: "absolute",
                  inset: 0,
                  transform:
                    !isMobile && i === idx ? "scale(1.06)" : "scale(1)",
                  transformOrigin:
                    s.align === "left" ? "right center" : "left center",
                  transition: isMobile ? "none" : "transform 6.5s ease",
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  s.align === "left"
                    ? "linear-gradient(to right, rgba(13,20,8,0.78) 0%, rgba(13,20,8,0.55) 40%, transparent 75%)"
                    : "linear-gradient(to left, rgba(13,20,8,0.78) 0%, rgba(13,20,8,0.55) 40%, transparent 75%)",
              }}
            />
            <div
              className="mk-hero-copy"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: s.align === "left" ? 0 : "auto",
                right: s.align === "right" ? 0 : "auto",
                width: "58%",
                padding: "48px 56px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: "#fff",
                transform: i === idx ? "translateY(0)" : "translateY(20px)",
                opacity: i === idx ? 1 : 0,
                transition: "opacity .7s ease .15s, transform .7s ease .15s",
              }}
            >
              <span
                className="micro"
                style={{
                  background: "rgba(255,255,255,0.16)",
                  color: "#fff",
                  padding: "7px 14px",
                  borderRadius: 999,
                  alignSelf: "flex-start",
                  backdropFilter: "blur(4px)",
                }}
              >
                {s.chip}
              </span>
              {i === 0 ? (
                <h1
                  className="display-heavy"
                  style={{
                    fontSize: 68,
                    margin: "20px 0 0",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  <HeroTitleParts parts={s.titleParts} />
                </h1>
              ) : (
                <div
                  className="display-heavy"
                  role="heading"
                  aria-level={2}
                  style={{
                    fontSize: 68,
                    margin: "20px 0 0",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  <HeroTitleParts parts={s.titleParts} />
                </div>
              )}
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.55,
                  marginTop: 18,
                  maxWidth: 520,
                  opacity: 0.85,
                }}
              >
                {s.sub}
              </p>
              <div
                className="mk-hero-ctas"
                style={{ display: "flex", gap: 12, marginTop: 28 }}
              >
                <Link
                  href={s.cta.href}
                  className={`market-btn ${s.cta.variant}`}
                  tabIndex={i === idx ? 0 : -1}
                >
                  {s.cta.label} →
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div
          className="mk-free-chip"
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            background: "rgba(255,255,255,0.92)",
            color: "var(--ink)",
            borderRadius: 999,
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            backdropFilter: "blur(4px)",
            zIndex: 4,
          }}
        >
          <TruckIcon width={14} height={14} /> {FREE_SHIPPING_SHORT_LABEL}
        </div>

        <div
          className="mk-hero-controls"
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            zIndex: 5,
          }}
        >
          <button
            onClick={() => go(idx - 1)}
            aria-label="Previous slide"
            style={arrowBtn}
          >
            <ChevronLeft width={14} height={14} />
          </button>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === idx ? 26 : 8,
                height: 8,
                borderRadius: 99,
                border: 0,
                background:
                  i === idx ? "var(--cream)" : "rgba(255,255,255,0.5)",
                transition: "all .25s",
                cursor: "pointer",
              }}
            />
          ))}
          <button
            onClick={() => go(idx + 1)}
            aria-label="Next slide"
            style={arrowBtn}
          >
            <ChevronRight width={14} height={14} />
          </button>
        </div>

        <div
          className="mk-counter"
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.18em",
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 4,
          }}
        >
          <span
            className="num"
            style={{
              background: "rgba(0,0,0,0.35)",
              padding: "6px 12px",
              borderRadius: 999,
              backdropFilter: "blur(4px)",
            }}
          >
            0{idx + 1} / 0{isMobile ? 1 : len}
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "rgba(255,255,255,0.15)",
            zIndex: 3,
          }}
        >
          <div
            key={`bar-${idx}-${paused}`}
            style={{
              height: "100%",
              background: "#fff",
              width: "0%",
              animation: paused ? "none" : "mhProg 5.5s linear forwards",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function HeroTitleParts({ parts }: { parts: Slide["titleParts"] }) {
  return (
    <>
      {parts.map((p, j) =>
        typeof p === "string" ? (
          <span key={j}>
            {p}
            <br />
          </span>
        ) : (
          <span key={j} className="editorial" style={{ color: "var(--cream)" }}>
            {p.italic}
          </span>
        ),
      )}
    </>
  );
}

const arrowBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 999,
  background: "rgba(255,255,255,0.18)",
  color: "#fff",
  border: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(4px)",
};
