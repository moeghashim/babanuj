"use client";

import { useState, type CSSProperties } from "react";
import { useMountEffect } from "lib/use-mount-effect";
import { numericProductId } from "lib/babanuj/data";
import { JUDGEME_ENABLED } from "./config";
import { refreshJudgemeWidgets } from "./judgeme-loader";

/**
 * Thin wrappers around Judge.me's platform-independent widget markup. Each
 * renders one of Judge.me's documented `.jdgm-widget` divs, which the preloader
 * (see ./judgeme-loader.tsx) hydrates client-side. They render nothing until
 * Judge.me is configured, so unconfigured environments show no empty shells.
 *
 * On mount each widget re-triggers Judge.me's DOM scan so it renders after an
 * App Router soft-navigation, not just on first load.
 */

function useJudgemeReady() {
  const [ready, setReady] = useState(false);

  useMountEffect(() => {
    setReady(true);
    refreshJudgemeWidgets();
  });

  return JUDGEME_ENABLED && ready;
}

/** Compact star-rating badge for product cards and the PDP header. */
export function JudgemePreviewBadge({
  productId,
  className,
  style,
}: {
  productId: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ready = useJudgemeReady();
  if (!ready) return null;
  return (
    <div
      className={
        "jdgm-widget jdgm-preview-badge" + (className ? ` ${className}` : "")
      }
      data-id={numericProductId(productId)}
      suppressHydrationWarning
      style={style}
    />
  );
}

/** Full product review widget (rating summary, review list, write-a-review,
 *  photos). `id` matches the anchor the preview badge links to. */
export function JudgemeReviewWidget({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  const ready = useJudgemeReady();
  if (!ready) return null;
  // Canonical inline review-widget markup. NOT `jdgm-outside-widget` — that's a
  // relocation placeholder that renders empty without a paired primary widget.
  const id = numericProductId(productId);
  return (
    <div
      id="judgeme_product_reviews"
      className="jdgm-widget jdgm-review-widget"
      data-id={id}
      data-product-id={id}
      data-product-title={productTitle}
      data-widget="review"
      data-auto-install="false"
      suppressHydrationWarning
    />
  );
}

/** Cache-backed shop review carousel for review sections. */
export function JudgemeFeaturedCarousel() {
  const ready = useJudgemeReady();
  if (!ready) return null;
  return <div className="jdgm-carousel-wrapper" suppressHydrationWarning />;
}

/** Cache-backed carousel filtered to Judge.me store/company reviews only. */
export function JudgemeCompanyReviewCarousel() {
  const ready = useJudgemeReady();
  if (!ready) return null;
  return (
    <div
      className="jdgm-carousel-wrapper jdgm-company-review-carousel"
      suppressHydrationWarning
    />
  );
}

/** Shop-wide all-reviews widget. Currently unused because Judge.me's cache
 * omits the `all_reviews` payload for this headless store. */
export function JudgemeAllReviews() {
  const ready = useJudgemeReady();
  if (!ready) return null;
  return (
    <div
      className="jdgm-widget jdgm-all-reviews-widget"
      suppressHydrationWarning
    >
      <div className="jdgm-all-reviews__body" suppressHydrationWarning />
    </div>
  );
}
