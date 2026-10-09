import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { hero } from "@/lib/landing-data";

export const alt =
  "growthrush.ai — AI-run Facebook ads that send leads straight to your WhatsApp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const wordmark = await readFile(
    join(process.cwd(), "public/brand/wordmark-light.png"),
  );
  const wordmarkSrc = `data:image/png;base64,${wordmark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 85% 110%, rgba(91,127,255,0.35) 0%, rgba(91,127,255,0.08) 40%, #050814 70%)",
          backgroundColor: "#050814",
          color: "#ffffff",
        }}
      >
        <img src={wordmarkSrc} width={390} height={60} alt="" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>
            {hero.title}
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.08,
              color: "#a8c0ff",
            }}
          >
            {hero.titleAccent}
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 32,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 900,
            }}
          >
            AI-run Facebook ads that send ready-to-buy leads straight to your
            WhatsApp.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
