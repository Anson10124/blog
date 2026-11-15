import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/site.config";

/** The size every social network expects for a large link preview. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// The light theme colours from app/globals.css. Link previews have no dark
// mode, so the card is always drawn on paper.
const colors = {
  paper: "#f5f1e8",
  ink: "#1d1a16",
  muted: "#7a7266",
  rule: "#ddd5c5",
  accent: "#cf4526",
};

// Cached so the images can be drawn once at build time instead of on every
// request. Cached values must be plain data, hence base64 and not a Buffer.
async function loadFont(file: string): Promise<string> {
  "use cache";
  const data = await readFile(join(process.cwd(), "app/fonts/ltwave", file));
  return data.toString("base64");
}

type OgCard = {
  /** Large accent text above the title, e.g. the year of a post. */
  eyebrow: string;
  title: string;
  description: string;
  /** Small text in the bottom-left corner, e.g. the date and author. */
  footer: string;
};

/** Draws the link preview card shared by the home page and every post. */
export async function renderOgCard({ eyebrow, title, description, footer }: OgCard) {
  const [regular, bold] = (
    await Promise.all([loadFont("LTWave-Regular.otf"), loadFont("LTWave-Bold.otf")])
  ).map((font) => Buffer.from(font, "base64"));

  // Long titles get a smaller size so they stay within two or three lines.
  const titleSize = title.length > 60 ? 64 : title.length > 36 ? 78 : 96;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px 56px",
          background: colors.paper,
          color: colors.ink,
          fontFamily: "LT Wave",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1,
              color: colors.accent,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: titleSize,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              display: "block",
              lineClamp: 3,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.4,
              color: colors.muted,
              display: "block",
              lineClamp: 2,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${colors.rule}`,
            paddingTop: 24,
            fontSize: 28,
            color: colors.muted,
          }}
        >
          <span>{footer}</span>
          <span style={{ color: colors.ink }}>{new URL(site.url).host}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "LT Wave", data: regular, weight: 400, style: "normal" },
        { name: "LT Wave", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
