import { ImageResponse } from "next/og";

export const alt = "Ghana Salary Calculator — Estimate Take-Home Pay after PAYE & SSNIT";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #093b2a 0%, #031e15 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#10b981",
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 800,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ₵
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#a7f3d0" }}>
            Ghana Salary Calculator
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.15, color: "#ffffff" }}>
            Estimate Take-Home Pay after PAYE & SSNIT
          </div>
          <div style={{ fontSize: 26, color: "#d1fae5", fontWeight: 400 }}>
            Up-to-date with current GRA tax bands & 5.5% SSNIT deductions
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 24 }}>
          <div style={{ fontSize: 20, color: "#6ee7b7", fontWeight: 600 }}>
            Gross-to-Net · Net-to-Gross · Salary Comparison · GRA Bands
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
