"use client";

import { useMountEffect } from "lib/use-mount-effect";
import { trackViewContent } from "lib/meta/events";

type Props = {
  product: {
    handle: string;
    name: string;
    brand?: string;
    price: number;
  };
};

export function MetaProductTracker({ product }: Props) {
  useMountEffect(() => {
    trackViewContent({
      id: product.handle,
      name: product.name,
      brand: product.brand,
      price: product.price,
    });
  });

  return null;
}
