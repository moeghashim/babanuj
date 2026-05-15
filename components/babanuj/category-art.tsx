// Geometric illustrations for the "Shop by category" cards. One <CategoryArt />
// per card, sized to fill its parent (the parent must define width + height).
//
// Each illustration is a 100×100 SVG using preserveAspectRatio="xMidYMid slice"
// so it scales to any square container. Layout:
//   1. Solid hue background
//   2. Half-cropped Rub el Hizb at top-right (subtle motif at low opacity)
//   3. Hero geometric illustration centered
//   4. Bottom gradient scrim for text legibility

export type CategoryKind =
  | "baklava"
  | "cookies"
  | "turkish-delight"
  | "chocolate"
  | "gift-boxes"
  | "dates";

type Palette = {
  hue: string;
  deep: string;
  accent: string;
  cream: string;
};

const PALETTES: Record<CategoryKind, Palette> = {
  baklava: {
    hue: "#bfa86a",
    deep: "#5a4419",
    accent: "#5a6a3a",
    cream: "#f4ede0",
  },
  cookies: {
    hue: "#d6a06e",
    deep: "#5e3a1e",
    accent: "#3a2618",
    cream: "#f4ede0",
  },
  "turkish-delight": {
    hue: "#e8b0a8",
    deep: "#7a3a32",
    accent: "#5a6a3a",
    cream: "#ffffff",
  },
  chocolate: {
    hue: "#7a4a2e",
    deep: "#2a1108",
    accent: "#caa55a",
    cream: "#f4ede0",
  },
  "gift-boxes": {
    hue: "#3a5c3a",
    deep: "#1f2a1c",
    accent: "#caa55a",
    cream: "#f9f3e6",
  },
  dates: {
    hue: "#5e3a1e",
    deep: "#2a1808",
    accent: "#5a6a3a",
    cream: "#caa55a",
  },
};

// Two overlapping squares (one rotated 45°) — the Rub el Hizb. Drawn as one
// path so a single stroke applies uniformly.
function RubElHizbCorner({ stroke }: { stroke: string }) {
  // Star center at (88, 12), radius ~38 — half-cropped into the top-right corner
  return (
    <g
      transform="translate(88 12) rotate(0)"
      stroke={stroke}
      strokeWidth="0.6"
      fill="none"
      opacity={0.5}
    >
      <rect x="-27" y="-27" width="54" height="54" />
      <rect
        x="-27"
        y="-27"
        width="54"
        height="54"
        transform="rotate(45)"
      />
    </g>
  );
}

function Baklava({ p }: { p: Palette }) {
  // Layered diamond — alternating cream and dark amber phyllo strata
  return (
    <g transform="translate(50 50)">
      {Array.from({ length: 9 }).map((_, i) => {
        const layer = 9 - i; // outermost first
        const scale = layer / 9;
        const k = 36 * scale;
        const fill = layer % 2 === 0 ? p.cream : p.deep;
        const opacity = layer % 2 === 0 ? 0.62 : 0.3;
        return (
          <polygon
            key={i}
            points={`0,-${k} ${k},0 0,${k} -${k},0`}
            fill={fill}
            opacity={opacity}
          />
        );
      })}
      {/* Pistachio at center */}
      <circle cx="0" cy="0" r="4.5" fill={p.accent} />
    </g>
  );
}

function Maamoul({ p }: { p: Palette }) {
  // Cookie disc + embossed 8-point star
  return (
    <g transform="translate(50 50)">
      <circle cx="0" cy="0" r="32" fill={p.cream} opacity={0.92} />
      <circle
        cx="0"
        cy="0"
        r="27"
        fill="none"
        stroke={p.deep}
        strokeOpacity={0.35}
        strokeWidth="0.7"
      />
      {/* Embossed Rub el Hizb */}
      <g
        fill="none"
        stroke={p.deep}
        strokeOpacity={0.65}
        strokeWidth="0.9"
        strokeLinejoin="round"
      >
        <rect x="-14" y="-14" width="28" height="28" />
        <rect
          x="-14"
          y="-14"
          width="28"
          height="28"
          transform="rotate(45)"
        />
      </g>
      <circle cx="0" cy="0" r="2.2" fill={p.deep} opacity={0.85} />
    </g>
  );
}

function TurkishDelight({ p }: { p: Palette }) {
  // Three rounded-square lokum cubes + powdered sugar dots
  const cube = (cx: number, cy: number, bright: boolean) => (
    <g transform={`translate(${cx} ${cy})`}>
      {/* Shadow */}
      <rect
        x="-10.5"
        y="-9"
        width="21"
        height="21"
        rx="4.5"
        fill={p.deep}
        opacity={0.18}
      />
      {/* Body */}
      <rect
        x="-11"
        y="-11"
        width="22"
        height="22"
        rx="4.5"
        fill={bright ? "#f8d6cf" : "#f0c5bc"}
        opacity={0.95}
      />
      {/* Inner highlight */}
      <rect
        x="-8"
        y="-8"
        width="9"
        height="6"
        rx="2"
        fill="#ffffff"
        opacity={0.22}
      />
      {/* Pistachio fleck */}
      <circle cx="0" cy="0" r="3.5" fill={p.accent} opacity={0.85} />
    </g>
  );
  return (
    <g>
      {cube(30, 47, false)}
      {cube(50, 53, true)}
      {cube(70, 47, false)}
      {/* Powdered sugar dust */}
      {[
        [18, 32, 0.6],
        [25, 25, 0.5],
        [36, 28, 0.4],
        [44, 22, 0.5],
        [58, 24, 0.4],
        [70, 28, 0.5],
        [78, 35, 0.6],
        [82, 42, 0.5],
        [22, 70, 0.5],
        [42, 75, 0.4],
        [60, 72, 0.5],
        [78, 70, 0.6],
        [14, 50, 0.4],
      ].map(([cx, cy, op], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.7" fill="#ffffff" opacity={op as number} />
      ))}
    </g>
  );
}

function Chocolate({ p }: { p: Palette }) {
  // Chocolate bar with kataifi strands above
  return (
    <g>
      {/* Kataifi strands — fine threads */}
      <g stroke={p.accent} strokeWidth="0.6" strokeLinecap="round" opacity={0.85}>
        <line x1="32" y1="20" x2="36" y2="32" />
        <line x1="38" y1="14" x2="42" y2="30" />
        <line x1="46" y1="16" x2="48" y2="32" />
        <line x1="54" y1="13" x2="52" y2="31" />
        <line x1="60" y1="17" x2="58" y2="31" />
        <line x1="66" y1="20" x2="64" y2="31" />
      </g>
      {/* Bar shadow */}
      <rect
        x="22.5"
        y="35"
        width="55"
        height="38"
        rx="4"
        fill="#000000"
        opacity={0.25}
      />
      {/* Bar body */}
      <rect
        x="21"
        y="32"
        width="55"
        height="38"
        rx="4"
        fill={p.deep}
        opacity={0.95}
      />
      {/* Segment lines */}
      <g stroke="#000000" strokeOpacity={0.35} strokeWidth="0.5">
        <line x1="39" y1="35" x2="39" y2="67" />
        <line x1="57" y1="35" x2="57" y2="67" />
        <line x1="24" y1="51" x2="73" y2="51" />
      </g>
      {/* Top highlight */}
      <rect
        x="22"
        y="33.5"
        width="53"
        height="3"
        rx="1.5"
        fill="#ffffff"
        opacity={0.1}
      />
    </g>
  );
}

function GiftBox({ p }: { p: Palette }) {
  // Cube with crossing ribbon + simple bow
  const box = { x: 30, y: 32, w: 40, h: 36 };
  const ribbon = 6.5;
  return (
    <g>
      {/* Box body */}
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx="2.5"
        fill={p.cream}
        opacity={0.95}
        stroke={p.deep}
        strokeOpacity={0.35}
        strokeWidth="0.5"
      />
      {/* Vertical ribbon */}
      <rect
        x={50 - ribbon / 2}
        y={box.y}
        width={ribbon}
        height={box.h}
        fill={p.accent}
      />
      {/* Horizontal ribbon */}
      <rect
        x={box.x}
        y={50 - ribbon / 2}
        width={box.w}
        height={ribbon}
        fill={p.accent}
      />
      {/* Bow loops (two ellipses) */}
      <ellipse cx="44" cy="26" rx="6" ry="3.6" fill={p.accent} />
      <ellipse cx="56" cy="26" rx="6" ry="3.6" fill={p.accent} />
      {/* Bow knot */}
      <rect x="48" y="22.5" width="4" height="7" rx="1" fill={p.deep} />
    </g>
  );
}

function Dates({ p }: { p: Palette }) {
  // Three oval dates in a row + pistachio peek
  const date = (cx: number, cy: number) => (
    <g transform={`translate(${cx} ${cy})`}>
      {/* Shadow */}
      <ellipse cx="0.7" cy="3" rx="6.5" ry="9.5" fill="#000000" opacity={0.3} />
      {/* Body — concentric ovals for shading */}
      <ellipse cx="0" cy="0" rx="7" ry="11" fill="#5e3a1e" />
      <ellipse cx="0" cy="0" rx="5.5" ry="9" fill="#7a4a2e" />
      <ellipse cx="0" cy="0" rx="3.5" ry="6" fill="#8a5a30" />
      {/* Top highlight */}
      <ellipse
        cx="-1.5"
        cy="-4"
        rx="2.4"
        ry="1.6"
        fill="#ffffff"
        opacity={0.16}
      />
      {/* Pistachio peek at top */}
      <ellipse cx="0" cy="-9" rx="2" ry="2.2" fill={p.accent} opacity={0.95} />
    </g>
  );
  return (
    <g>
      {date(28, 50)}
      {date(50, 50)}
      {date(72, 50)}
    </g>
  );
}

const ILLUSTRATIONS: Record<
  CategoryKind,
  (p: Palette) => React.ReactElement
> = {
  baklava: (p) => <Baklava p={p} />,
  cookies: (p) => <Maamoul p={p} />,
  "turkish-delight": (p) => <TurkishDelight p={p} />,
  chocolate: (p) => <Chocolate p={p} />,
  "gift-boxes": (p) => <GiftBox p={p} />,
  dates: (p) => <Dates p={p} />,
};

export function CategoryArt({ kind }: { kind: CategoryKind }) {
  const p = PALETTES[kind];
  const Hero = ILLUSTRATIONS[kind];
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {/* Base hue */}
      <rect width="100" height="100" fill={p.hue} />
      {/* Subtle motif — half-cropped 8-point star top-right */}
      <RubElHizbCorner stroke={p.deep} />
      {/* Hero illustration */}
      {Hero(p)}
      {/* Bottom scrim for label legibility */}
      <defs>
        <linearGradient id={`scrim-${kind}`} x1="0" y1="0.45" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.62" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="45"
        width="100"
        height="55"
        fill={`url(#scrim-${kind})`}
      />
    </svg>
  );
}
