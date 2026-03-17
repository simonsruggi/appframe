import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AppFrame — Create stunning App Store showcase images in seconds";
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
          background: "#080808",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />

        {/* Left side — text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 70px",
            width: "55%",
            gap: 24,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 22,
                  borderRadius: 4,
                  border: "3px solid #080808",
                  display: "flex",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              AppFrame
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Create stunning App Store showcases
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.5,
            }}
          >
            Search any iOS app, pick a theme, and download a ready-to-share promotional image. Free.
          </div>

          {/* CTA pill */}
          <div
            style={{
              display: "flex",
              marginTop: 8,
            }}
          >
            <div
              style={{
                background: "white",
                color: "#080808",
                fontSize: 16,
                fontWeight: 700,
                padding: "12px 28px",
                borderRadius: 50,
                letterSpacing: "-0.01em",
              }}
            >
              Try it free — appfra.me
            </div>
          </div>
        </div>

        {/* Right side — showcase card mockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "45%",
            padding: "40px 40px 40px 0",
          }}
        >
          {/* Card */}
          <div
            style={{
              width: 440,
              height: 500,
              borderRadius: 24,
              background: "linear-gradient(135deg, #001020 0%, #003060 50%, #001830 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: 32,
              boxShadow: "0 25px 80px rgba(0,80,180,0.15), 0 0 0 1px rgba(255,255,255,0.06)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Inner glow */}
            <div
              style={{
                position: "absolute",
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,100,200,0.15) 0%, transparent 70%)",
                top: -50,
                right: -50,
              }}
            />

            {/* App icon */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, #4a90d9 0%, #2060a0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  display: "flex",
                }}
              >
                📱
              </div>
            </div>

            {/* App name */}
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "white",
                textAlign: "center",
              }}
            >
              Your App Name
            </div>

            {/* Stars */}
            <div
              style={{
                display: "flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 14, color: "white", fontWeight: 600 }}>4.8</div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ fontSize: 12, color: "#fbbf24" }}>★</div>
              ))}
            </div>

            {/* Phone mockups */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 12,
                marginTop: 8,
              }}
            >
              {/* Phone left */}
              <div
                style={{
                  width: 90,
                  height: 184,
                  borderRadius: 16,
                  background: "#1a1a1a",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  padding: 4,
                  opacity: 0.7,
                  transform: "translateY(10px)",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 12,
                    background: "linear-gradient(180deg, #1a3a5c 0%, #0a2040 100%)",
                    display: "flex",
                  }}
                />
              </div>

              {/* Phone center */}
              <div
                style={{
                  width: 110,
                  height: 224,
                  borderRadius: 20,
                  background: "#1a1a1a",
                  border: "1.5px solid rgba(255,255,255,0.12)",
                  padding: 4,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 16,
                    background: "linear-gradient(180deg, #2060a0 0%, #0a3060 100%)",
                    display: "flex",
                  }}
                />
              </div>

              {/* Phone right */}
              <div
                style={{
                  width: 90,
                  height: 184,
                  borderRadius: 16,
                  background: "#1a1a1a",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  padding: 4,
                  opacity: 0.7,
                  transform: "translateY(10px)",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 12,
                    background: "linear-gradient(180deg, #1a3a5c 0%, #0a2040 100%)",
                    display: "flex",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
