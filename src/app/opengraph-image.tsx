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
            background: "radial-gradient(ellipse, rgba(0,80,180,0.08) 0%, transparent 70%)",
            bottom: -200,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />

        {/* Domain */}
        <div
          style={{
            marginTop: 36,
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
            fontSize: 46,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            textAlign: "center",
            marginTop: 12,
            marginBottom: 32,
          }}
        >
          Turn Any iOS App Into a Stunning Showcase
        </div>

        {/* Three showcase cards */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 24,
            position: "relative",
            width: "100%",
          }}
        >
          {/* Card 1 — Ocean theme with Spotify */}
          <div
            style={{
              width: 360,
              height: 240,
              borderRadius: 20,
              background: "linear-gradient(135deg, #001020 0%, #003060 50%, #001830 100%)",
              display: "flex",
              alignItems: "center",
              padding: "20px 24px",
              gap: 16,
              transform: "rotate(-4deg) translateY(8px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* Left info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 130 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/spotify-icon.jpg`}
                width={44}
                height={44}
                style={{ borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
              />
              <div style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.2, marginTop: 4 }}>Spotify</div>
              <div style={{ fontSize: 10, color: "rgba(180,220,255,0.5)" }}>Spotify AB</div>
              <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "white", fontWeight: 600 }}>4.8</span>
                <span style={{ fontSize: 9, color: "#fbbf24" }}>★★★★★</span>
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 20, background: "rgba(0,180,255,0.1)", color: "rgba(180,220,255,0.7)" }}>Music</span>
                <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 20, background: "rgba(0,180,255,0.1)", color: "rgba(180,220,255,0.7)" }}>Free</span>
              </div>
            </div>
            {/* Phone mockup with real screenshot */}
            <div
              style={{
                width: 88,
                height: 180,
                borderRadius: 16,
                background: "#1a1a1a",
                border: "1.5px solid rgba(255,255,255,0.1)",
                padding: 3,
                display: "flex",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/spotify-ss.jpg`}
                width={82}
                height={174}
                style={{ borderRadius: 13, objectFit: "cover" }}
              />
            </div>
            {/* Second phone */}
            <div
              style={{
                width: 88,
                height: 180,
                borderRadius: 16,
                background: "#1a1a1a",
                border: "1.5px solid rgba(255,255,255,0.08)",
                padding: 3,
                opacity: 0.6,
                display: "flex",
                transform: "translateY(12px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/spotify-ss.jpg`}
                width={82}
                height={174}
                style={{ borderRadius: 13, objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Card 2 — Noir theme with WhatsApp (center, bigger) */}
          <div
            style={{
              width: 380,
              height: 250,
              borderRadius: 20,
              background: "radial-gradient(ellipse at 30% 20%, #1a1a2e 0%, #0d0d0d 40%, #080808 100%)",
              display: "flex",
              alignItems: "center",
              padding: "20px 24px",
              gap: 16,
              transform: "translateY(-4px)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
              zIndex: 2,
            }}
          >
            {/* Left info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 140 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/whatsapp-icon.jpg`}
                width={48}
                height={48}
                style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
              />
              <div style={{ fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.2, marginTop: 4 }}>WhatsApp</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Meta Platforms</div>
              <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "white", fontWeight: 600 }}>4.7</span>
                <span style={{ fontSize: 10, color: "#fbbf24" }}>★★★★★</span>
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 20, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>Social</span>
                <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 20, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>Free</span>
              </div>
            </div>
            {/* Phone mockup with real screenshot */}
            <div
              style={{
                width: 92,
                height: 188,
                borderRadius: 17,
                background: "#1a1a1a",
                border: "1.5px solid rgba(255,255,255,0.1)",
                padding: 3,
                display: "flex",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/whatsapp-ss.jpg`}
                width={86}
                height={182}
                style={{ borderRadius: 14, objectFit: "cover" }}
              />
            </div>
            {/* Second phone */}
            <div
              style={{
                width: 92,
                height: 188,
                borderRadius: 17,
                background: "#1a1a1a",
                border: "1.5px solid rgba(255,255,255,0.08)",
                padding: 3,
                opacity: 0.6,
                display: "flex",
                transform: "translateY(12px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/whatsapp-ss.jpg`}
                width={86}
                height={182}
                style={{ borderRadius: 14, objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Card 3 — Ember theme with Telegram */}
          <div
            style={{
              width: 360,
              height: 240,
              borderRadius: 20,
              background: "linear-gradient(135deg, #120800 0%, #301800 50%, #120800 100%)",
              display: "flex",
              alignItems: "center",
              padding: "20px 24px",
              gap: 16,
              transform: "rotate(4deg) translateY(8px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* Left info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 130 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/telegram-icon.jpg`}
                width={44}
                height={44}
                style={{ borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
              />
              <div style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.2, marginTop: 4 }}>Telegram</div>
              <div style={{ fontSize: 10, color: "rgba(255,200,150,0.5)" }}>Telegram FZ-LLC</div>
              <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "white", fontWeight: 600 }}>4.6</span>
                <span style={{ fontSize: 9, color: "#fbbf24" }}>★★★★★</span>
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 20, background: "rgba(255,160,80,0.1)", color: "rgba(255,200,150,0.7)" }}>Social</span>
                <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 20, background: "rgba(255,160,80,0.1)", color: "rgba(255,200,150,0.7)" }}>Free</span>
              </div>
            </div>
            {/* Phone mockup with real screenshot */}
            <div
              style={{
                width: 88,
                height: 180,
                borderRadius: 16,
                background: "#1a1a1a",
                border: "1.5px solid rgba(255,255,255,0.1)",
                padding: 3,
                display: "flex",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/telegram-ss.jpg`}
                width={82}
                height={174}
                style={{ borderRadius: 13, objectFit: "cover" }}
              />
            </div>
            {/* Second phone */}
            <div
              style={{
                width: 88,
                height: 180,
                borderRadius: 16,
                background: "#1a1a1a",
                border: "1.5px solid rgba(255,255,255,0.08)",
                padding: 3,
                opacity: 0.6,
                display: "flex",
                transform: "translateY(12px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/examples/telegram-ss.jpg`}
                width={82}
                height={174}
                style={{ borderRadius: 13, objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
