"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useMountEffect } from "lib/use-mount-effect";

const LazyToaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

export function DeferredToaster() {
  const [canLoad, setCanLoad] = useState(false);

  useMountEffect(() => {
    const timeout = window.setTimeout(() => setCanLoad(true), 6500);
    return () => window.clearTimeout(timeout);
  });

  return canLoad ? <LazyToaster closeButton /> : null;
}
