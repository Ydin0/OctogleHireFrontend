import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OctogleHire — Hire Top Global Developer Talent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#a1a1aa",
            }}
          >
            OctogleHire
          </div>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            Hire Top Global Developer Talent
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.5,
            }}
          >
            Pre-vetted engineers from 150+ countries. Build your dream team in
            days, not months.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
