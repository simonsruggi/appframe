import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getApp(id: string) {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${id}&country=us`);
  const data = await res.json();
  if (!data.results?.length) return null;
  const app = data.results[0];

  let screenshots: string[] = app.screenshotUrls || [];

  // Fallback: scrape App Store if no screenshots from API
  if (screenshots.length === 0) {
    try {
      const page = await fetch(`https://apps.apple.com/us/app/id${id}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      });
      if (page.ok) {
        const html = await page.text();
        const matches = html.matchAll(/https:\/\/is\d+-ssl\.mzstatic\.com\/image\/thumb\/[^\s"'>]+?screenshot[^\s"'>]*?\/(\d+x\d+)bb[^\s"'>]*/gi);
        const seen = new Set<string>();
        for (const m of matches) {
          const url = m[0].replace(/\);?$/, "");
          const base = url.replace(/\/\d+x\d+bb.*$/, "");
          if (!seen.has(base)) {
            seen.add(base);
            screenshots.push(`${base}/460x996bb.webp`);
          }
        }
      }
    } catch {}
  }

  return {
    name: app.trackName as string,
    developer: app.artistName as string,
    icon: (app.artworkUrl512 || app.artworkUrl100?.replace("100x100", "512x512")) as string,
    rating: (app.averageUserRating as number) || 0,
    ratingCount: (app.userRatingCount as number) || 0,
    genre: app.primaryGenreName as string,
    price: app.formattedPrice as string,
    screenshots,
  };
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await getApp(id);

  if (!app) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#080808", color: "white", fontSize: 32, fontFamily: "system-ui" }}>
          App Not Found
        </div>
      ),
      { ...size }
    );
  }

  const hasScreenshots = app.screenshots.length > 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #001020 0%, #003060 50%, #001830 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle glow */}
        <div
          style={{
            position: "absolute",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,100,200,0.1) 0%, transparent 70%)",
            top: -200,
            right: -200,
          }}
        />

        {/* Grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            background: "repeating-conic-gradient(rgba(255,255,255,0.8) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px",
          }}
        />

        {/* Left side — App info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 56px",
            width: hasScreenshots ? "45%" : "100%",
            gap: 4,
          }}
        >
          {/* Headline */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "white",
              opacity: 0.85,
              marginBottom: 12,
            }}
          >
            Approved! ✅
          </div>

          {/* Icon */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={app.icon}
            width={80}
            height={80}
            style={{
              borderRadius: 18,
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              marginBottom: 16,
            }}
          />

          {/* App name */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {app.name.length > 30 ? app.name.slice(0, 30) + "..." : app.name}
          </div>

          {/* Developer */}
          <div
            style={{
              fontSize: 16,
              color: "rgba(180,220,255,0.5)",
              marginTop: 4,
            }}
          >
            {app.developer}
          </div>

          {/* Rating */}
          {app.rating > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 12,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{app.rating.toFixed(1)}</span>
              <div style={{ display: "flex", gap: 1 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 14,
                      color: s <= Math.round(app.rating) ? "#fbbf24" : "rgba(255,255,255,0.15)",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 13, color: "rgba(180,220,255,0.4)" }}>({formatCount(app.ratingCount)})</span>
            </div>
          )}

          {/* Pills */}
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 20, background: "rgba(0,180,255,0.1)", color: "rgba(180,220,255,0.7)" }}>{app.genre}</span>
            <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 20, background: "rgba(0,180,255,0.1)", color: "rgba(180,220,255,0.7)" }}>{app.price}</span>
          </div>
        </div>

        {/* Right side — Phone mockups */}
        {hasScreenshots && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "55%",
              gap: 14,
              padding: "40px 40px 40px 0",
            }}
          >
            {/* Phone 1 */}
            <div
              style={{
                width: 160,
                height: 326,
                borderRadius: 30,
                background: "#1a1a1a",
                border: "2px solid rgba(255,255,255,0.1)",
                padding: 5,
                display: "flex",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={app.screenshots[0]}
                width={150}
                height={316}
                style={{ borderRadius: 25, objectFit: "cover" }}
              />
            </div>

            {/* Phone 2 */}
            {app.screenshots.length > 1 && (
              <div
                style={{
                  width: 160,
                  height: 326,
                  borderRadius: 30,
                  background: "#1a1a1a",
                  border: "2px solid rgba(255,255,255,0.08)",
                  padding: 5,
                  opacity: 0.7,
                  display: "flex",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                  transform: "translateY(16px)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={app.screenshots[1]}
                  width={150}
                  height={316}
                  style={{ borderRadius: 25, objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            Made with AppFrame — appfra.me
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
