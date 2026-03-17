import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AppFrame — Beautiful App Store Showcases";
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
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #001020 0%, #003060 40%, #001830 70%, #000a18 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle glow effects */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,100,200,0.15) 0%, transparent 70%)",
            top: -100,
            right: -100,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,60,150,0.12) 0%, transparent 70%)",
            bottom: -100,
            left: -50,
          }}
        />

        {/* Phone mockups preview */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 48,
          }}
        >
          {/* Phone 1 */}
          <div
            style={{
              width: 120,
              height: 245,
              borderRadius: 22,
              background: "linear-gradient(180deg, #1a3a5c 0%, #0a2040 100%)",
              border: "2px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
              transform: "translateY(16px)",
            }}
          >
            <div
              style={{
                width: 108,
                height: 233,
                borderRadius: 18,
                background: "linear-gradient(180deg, #004080 0%, #002040 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </div>
          </div>

          {/* Phone 2 (main) */}
          <div
            style={{
              width: 160,
              height: 326,
              borderRadius: 30,
              background: "linear-gradient(180deg, #1a3a5c 0%, #0a2040 100%)",
              border: "2px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                width: 146,
                height: 312,
                borderRadius: 24,
                background: "linear-gradient(180deg, #0060b0 0%, #003060 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              <div style={{ display: "flex", gap: 4 }}>
                <div style={{ width: 24, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.3)" }} />
                <div style={{ width: 16, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
              </div>
            </div>
          </div>

          {/* Phone 3 */}
          <div
            style={{
              width: 120,
              height: 245,
              borderRadius: 22,
              background: "linear-gradient(180deg, #1a3a5c 0%, #0a2040 100%)",
              border: "2px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
              transform: "translateY(16px)",
            }}
          >
            <div
              style={{
                width: 108,
                height: 233,
                borderRadius: 18,
                background: "linear-gradient(180deg, #004080 0%, #002040 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Logo + Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            AppFrame
          </div>
          <div
            style={{
              fontSize: 22,
              color: "rgba(180,210,240,0.7)",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            Beautiful App Store Showcases
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            fontSize: 16,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          appfra.me
        </div>
      </div>
    ),
    { ...size }
  );
}
