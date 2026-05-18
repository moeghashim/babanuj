import { ImageResponse } from "next/og";
import { join } from "path";
import { readFile } from "fs/promises";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const bricolage = await readFile(
    join(process.cwd(), "./fonts/BricolageGrotesque-Bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3a5c3a",
          color: "#f9f3e6",
          fontFamily: "Bricolage",
          fontWeight: 800,
          fontSize: 56,
          lineHeight: 1,
          letterSpacing: -2,
        }}
      >
        b
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Bricolage",
          data: bricolage,
          style: "normal",
          weight: 800,
        },
      ],
    },
  );
}
