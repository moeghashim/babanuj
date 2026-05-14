type RubProps = {
  size?: number;
  color?: string;
  fill?: string;
  stroke?: number;
};

// Rub el Hizb — eight-point star formed by two overlapping squares.
export function RubElHizb({
  size = 80,
  color = "currentColor",
  fill = "none",
  stroke = 1.4,
}: RubProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <g
        fill={fill}
        stroke={color}
        strokeWidth={stroke}
        strokeLinejoin="round"
      >
        <rect x="22" y="22" width="56" height="56" />
        <rect
          x="22"
          y="22"
          width="56"
          height="56"
          transform="rotate(45 50 50)"
        />
      </g>
    </svg>
  );
}
