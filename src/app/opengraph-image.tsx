import { ImageResponse } from "next/og";
import { APPROVED_HERO } from "@/lib/approved-public-content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DEPTH X LTD.";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0A1220",
          color: "#E8EDF4",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 4,
            color: "#E8A33D",
            marginBottom: 28,
          }}
        >
          {APPROVED_HERO.stage}
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.15 }}>
          DEPTH&nbsp;<span style={{ color: "#E8A33D" }}>X</span>
          <span
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginLeft: 14,
              paddingBottom: 10,
              fontSize: 24,
              letterSpacing: 5,
              color: "#8CA0B8",
            }}
          >
            LTD.
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#8CA0B8", marginTop: 24, maxWidth: 900 }}>
          {APPROVED_HERO.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
