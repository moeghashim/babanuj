"use client";

import type { CSSProperties } from "react";
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

function useJudgemeRefresh() {
  useMountEffect(() => {
    refreshJudgemeWidgets();
  });
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
  useJudgemeRefresh();
  if (!JUDGEME_ENABLED) return null;
  return (
    <div
      className={"jdgm-widget jdgm-preview-badge" + (className ? ` ${className}` : "")}
      data-id={numericProductId(productId)}
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
  useJudgemeRefresh();
  if (!JUDGEME_ENABLED) return null;
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
    />
  );
}

/** Shop-wide / company reviews widget (all reviews across products). */
export function JudgemeAllReviews() {
  useJudgemeRefresh();
  if (!JUDGEME_ENABLED) return null;
  return (
    <div className="jdgm-widget jdgm-all-reviews-widget">
      <div className="jdgm-all-reviews__body" />
    </div>
  );
}
