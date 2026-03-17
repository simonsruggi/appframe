import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AppFrame — Turn any iOS app into a beautiful showcase image";
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
          alignItems: "center",
          background: "#080808",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle glow behind cards */}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,80,160,0.12) 0%, transparent 70%)",
            bottom: -100,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />

        {/* Domain */}
        <div
          style={{
            marginTop: 40,
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          appfra.me
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            textAlign: "center",
            marginTop: 16,
            padding: "0 80px",
          }}
        >
          Turn Any iOS App Into a
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            textAlign: "center",
          }}
        >
          Stunning Showcase
        </div>

        {/* Two showcase cards */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 32,
            gap: 0,
            position: "relative",
            width: "100%",
            height: 340,
          }}
        >
          {/* Card 1 — Ocean theme, tilted left */}
          <div
            style={{
              position: "absolute",
              left: 160,
              top: 10,
              width: 420,
              height: 280,
              borderRadius: 20,
              background: "linear-gradient(135deg, #001020 0%, #003060 50%, #001830 100%)",
              display: "flex",
              alignItems: "center",
              padding: "24px 28px",
              gap: 24,
              transform: "rotate(-6deg)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* App info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 160 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                <div style={{ fontSize: 24, display: "flex" }}>💰</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "white", lineHeight: 1.2 }}>Budget App</div>
              <div style={{ fontSize: 11, color: "rgba(180,220,255,0.5)" }}>Finance Studio</div>
              <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "white", fontWeight: 600 }}>4.9</span>
                <span style={{ fontSize: 10, color: "#fbbf24" }}>★★★★★</span>
              </div>
            </div>
            {/* Phone mockup */}
            <div
              style={{
                width: 100,
                height: 204,
                borderRadius: 18,
                background: "#1a1a1a",
                border: "1.5px solid rgba(255,255,255,0.1)",
                padding: 4,
                display: "flex",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 14,
                  background: "linear-gradient(180deg, #059669 0%, #047857 50%, #065f46 100%)",
                  display: "flex",
                }}
              />
            </div>
            {/* Phone mockup 2 */}
            <div
              style={{
                width: 100,
                height: 204,
                borderRadius: 18,
                background: "#1a1a1a",
                border: "1.5px solid rgba(255,255,255,0.08)",
                padding: 4,
                opacity: 0.6,
                display: "flex",
                transform: "translateY(12px)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 14,
                  background: "linear-gradient(180deg, #047857 0%, #065f46 100%)",
                  display: "flex",
                }}
              />
            </div>
          </div>

          {/* Card 2 — Ember theme, tilted right */}
          <div
            style={{
              position: "absolute",
              right: 140,
              top: 30,
              width: 420,
              height: 280,
              borderRadius: 20,
              background: "linear-gradient(135deg, #120800 0%, #301800 50%, #120800 100%)",
              display: "flex",
              alignItems: "center",
              padding: "24px 28px",
              gap: 24,
              transform: "rotate(4deg)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* App info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 160 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                <div style={{ fontSize: 24, display: "flex" }}>🎵</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "white", lineHeight: 1.2 }}>Music Player</div>
              <div style={{ fontSize: 11, color: "rgba(255,200,150,0.5)" }}>Sound Labs</div>
              <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "white", fontWeight: 600 }}>4.7</span>
                <span style={{ fontSize: 10, color: "#fbbf24" }}>★★★★★</span>
              </div>
            </div>
            {/* Phone mockup */}
            <div
              style={{
                width: 100,
                height: 204,
                borderRadius: 18,
                background: "#1a1a1a",
                border: "1.5px solid rgba(255,255,255,0.1)",
                padding: 4,
                display: "flex",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 14,
                  background: "linear-gradient(180deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
                  display: "flex",
                }}
              />
            </div>
            {/* Phone mockup 2 */}
            <div
              style={{
                width: 100,
                height: 204,
                borderRadius: 18,
                background: "#1a1a1a",
                border: "1.5px solid rgba(255,255,255,0.08)",
                padding: 4,
                opacity: 0.6,
                display: "flex",
                transform: "translateY(12px)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 14,
                  background: "linear-gradient(180deg, #ea580c 0%, #c2410c 100%)",
                  display: "flex",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
