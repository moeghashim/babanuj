"use client";

import { useEffect } from "react";

// The single allowed mount-only escape hatch. See AGENTS.md "React App Rules".
// Use only when synchronizing with an external system (DOM portal target,
// document.body, window event listener, etc.) at mount time.
export function useMountEffect(effect: () => void | (() => void)) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}
