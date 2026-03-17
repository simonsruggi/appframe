import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AppFrame — Turn any iOS app into a beautiful showcase image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BASE = "https://appfra.me";

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
        {/* Subtle glow */}
        <div
          style={{
            position: "absolute",
            width: 1000,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,80,180,0.06) 0%, transparent 70%)",
            bottom: -200,
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
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          appfra.me
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            textAlign: "center",
            marginTop: 14,
            marginBottom: 36,
          }}
        >
          Turn Any iOS App Into a Stunning Showcase
        </div>

        {/* Two showcase cards */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 40,
          }}
        >
          {/* Card 1 — Arctic (light) theme with Spotify */}
          <div
            style={{
              width: 440,
              height: 290,
              borderRadius: 22,
              background: "radial-gradient(ellipse at 50% 0%, #ffffff 0%, #f0f4f8 50%, #e8edf3 100%)",
              display: "flex",
              alignItems: "center",
              padding: "24px 28px",
              gap: 20,
              transform: "rotate(-3deg) translateY(6px)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            {/* Left info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, width: 155 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111", opacity: 0.85 }}>Approved! ✅</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/spotify-icon.jpg`}
                width={50}
                height={50}
                style={{ borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
              />
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111", lineHeight: 1.2, marginTop: 4 }}>Spotify</div>
              <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>Spotify AB</div>
              <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#111", fontWeight: 600 }}>4.8</span>
                <span style={{ fontSize: 10, color: "#fbbf24" }}>★★★★★</span>
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.6)" }}>Music</span>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.6)" }}>Free</span>
              </div>
            </div>
            {/* Phone mockup */}
            <div
              style={{
                width: 100,
                height: 204,
                borderRadius: 18,
                background: "#1a1a1a",
                border: "1.5px solid rgba(0,0,0,0.1)",
                padding: 4,
                display: "flex",
                boxShadow: "0 8px 28px rgba(0,0,0,0.15)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/spotify-ss.jpg`}
                width={92}
                height={196}
                style={{ borderRadius: 14, objectFit: "cover" }}
              />
            </div>
            {/* Second phone */}
            <div
              style={{
                width: 100,
                height: 204,
                borderRadius: 18,
                background: "#1a1a1a",
                border: "1.5px solid rgba(0,0,0,0.08)",
                padding: 4,
                opacity: 0.6,
                display: "flex",
                transform: "translateY(14px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/spotify-ss.jpg`}
                width={92}
                height={196}
                style={{ borderRadius: 14, objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Card 2 — Ember (dark warm) theme with Telegram */}
          <div
            style={{
              width: 440,
              height: 290,
              borderRadius: 22,
              background: "linear-gradient(135deg, #120800 0%, #301800 50%, #120800 100%)",
              display: "flex",
              alignItems: "center",
              padding: "24px 28px",
              gap: 20,
              transform: "rotate(3deg) translateY(6px)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* Left info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, width: 155 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "white", opacity: 0.85 }}>Approved! ✅</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/telegram-icon.jpg`}
                width={50}
                height={50}
                style={{ borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
              />
              <div style={{ fontSize: 17, fontWeight: 700, color: "white", lineHeight: 1.2, marginTop: 4 }}>Telegram</div>
              <div style={{ fontSize: 11, color: "rgba(255,200,150,0.5)" }}>Telegram FZ-LLC</div>
              <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "white", fontWeight: 600 }}>4.6</span>
                <span style={{ fontSize: 10, color: "#fbbf24" }}>★★★★★</span>
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "rgba(255,160,80,0.1)", color: "rgba(255,200,150,0.7)" }}>Social</span>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "rgba(255,160,80,0.1)", color: "rgba(255,200,150,0.7)" }}>Free</span>
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
                boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/telegram-ss.jpg`}
                width={92}
                height={196}
                style={{ borderRadius: 14, objectFit: "cover" }}
              />
            </div>
            {/* Second phone */}
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
                transform: "translateY(14px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/telegram-ss.jpg`}
                width={92}
                height={196}
                style={{ borderRadius: 14, objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
