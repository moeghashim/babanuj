import { ImageResponse } from "next/og";
import { join } from "path";
import { readFile } from "fs/promises";

export type Props = {
  title?: string;
  subtitle?: string;
};

const PALETTE = {
  bg: "#f6f1e7",
  ink: "#1f2a1c",
  accent: "#3a5c3a",
  cream: "#f9f3e6",
  rule: "rgba(31,42,28,0.18)",
};

export default async function OpengraphImage(
  props?: Props,
): Promise<ImageResponse> {
  const title =
    props?.title ??
    process.env.SITE_NAME ??
    "Babanuj";
  const subtitle =
    props?.subtitle ??
    "Heirloom sweets, shipped fresh from Houston.";

  const [bricolage, crimson] = await Promise.all([
    readFile(join(process.cwd(), "./fonts/BricolageGrotesque-Bold.ttf")),
    readFile(join(process.cwd(), "./fonts/CrimsonPro-Italic.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: PALETTE.bg,
          padding: "80px 96px",
          fontFamily: "Bricolage",
          color: PALETTE.ink,
          position: "relative",
        }}
      >
        {/* Half-cropped 8-point Rub el Hizb top-right (corner motif) */}
        <svg
          viewBox="0 0 100 100"
          width={520}
          height={520}
          style={{
            position: "absolute",
            top: -180,
            right: -160,
            opacity: 0.10,
          }}
        >
          <g
            fill="none"
            stroke={PALETTE.accent}
            strokeWidth={1.2}
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

        {/* Top eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
            color: PALETTE.accent,
            textTransform: "uppercase",
          }}
        >
          <span>BABANUJ</span>
          <span
            style={{
              width: 60,
              height: 1.5,
              background: PALETTE.accent,
              display: "block",
            }}
          />
          <span style={{ fontSize: 16, letterSpacing: 3 }}>HOUSTON · TX</span>
        </div>

        {/* Title + italic line + rule */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 130,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -3,
              fontFamily: "Bricolage",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 38,
              fontFamily: "Crimson",
              fontStyle: "italic",
              color: PALETTE.ink,
              opacity: 0.78,
              marginTop: 28,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Footer strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            fontSize: 18,
            color: PALETTE.ink,
            opacity: 0.75,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>Türkish · Levantine · Gulf</span>
          <span>babanuj.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Bricolage",
          data: bricolage,
          style: "normal",
          weight: 800,
        },
        {
          name: "Crimson",
          data: crimson,
          style: "italic",
          weight: 400,
        },
      ],
    },
  );
}
