import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base: P = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function ArrowRight(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...base} {...p}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
export function CartIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base} {...p}>
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="18" cy="20" r="1.2" />
      <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.5L21 8H6" />
    </svg>
  );
}
export function SearchIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
export function MenuIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base} {...p}>
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}
export function CloseIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base} {...p}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
export function PlusIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...base} {...p}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
export function MinusIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...base} {...p}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
export function GlobeIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
export function TruckIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base} {...p}>
      <rect x="2" y="7" width="13" height="10" />
      <path d="M15 10h4l3 3v4h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
  );
}
export function ShieldIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base} {...p}>
      <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
export function HandshakeIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base} {...p}>
      <path d="M3 13l4-4 3 3 4-4 4 4 3-3M12 14l2 2M8 18l3-3" />
    </svg>
  );
}
export function HeartIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base} {...p}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
export function ChevronLeft(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...p}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
export function ChevronRight(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...p}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
export function UserIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base} {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
export function FilterIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...p}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}
export function QuoteIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M9.5 6c-2 0-3 1.5-3 3v9h6V9h-3c0-1.5 1-2 2-2V5c-.7 0-2 .3-2 1zm9 0c-2 0-3 1.5-3 3v9h6V9h-3c0-1.5 1-2 2-2V5c-.7 0-2 .3-2 1z" />
    </svg>
  );
}
