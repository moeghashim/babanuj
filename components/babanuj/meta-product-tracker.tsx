"use client";

import { trackViewContent } from "lib/meta/events";
import { useEffect } from "react";

type Props = {
  product: {
    handle: string;
    name: string;
    brand?: string;
    price: number;
  };
};

export function MetaProductTracker({ product }: Props) {
  useEffect(() => {
    trackViewContent({
      id: product.handle,
      name: product.name,
      brand: product.brand,
      price: product.price,
    });
  }, [product.brand, product.handle, product.name, product.price]);

  return null;
}
