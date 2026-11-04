import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "PinkSurfing — Chat, Shop & Sell";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  let logoSrc: string | null = null;
  try {
    const bytes = await readFile(join(process.cwd(), "public", "logo.jpeg"));
    logoSrc = `data:image/jpeg;base64,${bytes.toString("base64")}`;
  } catch {
    logoSrc = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#0e0f13",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              width={72}
              height={72}
              alt=""
              style={{ borderRadius: 18 }}
            />
          ) : (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                backgroundColor: "#1a1025",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                fontWeight: 800,
                color: "#f472b6",
              }}
            >
              P
            </div>
          )}
          PinkSurfing
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 940,
            }}
          >
            Chat, shop, and sell — without switching worlds.
          </div>
          <div style={{ fontSize: 26, color: "#b4b4b4", maxWidth: 860 }}>
            App · Shop · Vendors · Payments powered by Square
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
